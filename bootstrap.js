var Cc = Components.classes, Ci = Components.interfaces, Cu = Components.utils;
Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/AddonManager.jsm");

var PREF_ROOT = "extensions.cam.";
var PREF_DEFAULTS = {
	camStyling : "camAdaptive",
	useZeroBorderRadius : true,
	showAddonCounts : true,
	adaptiveCategorySize : true,
	loggingEnabled : false
};

function include(src) {
	var o = {};
	Cu.import("resource://gre/modules/Services.jsm", o);
	var uri = o.Services.io.newURI(src, null, o.Services.io.newURI(
			__SCRIPT_URI_SPEC__, null, null));
	o.Services.scriptloader.loadSubScript(uri.spec, this);
}

include("scripts/utils.js");
include("scripts/pref.js");
include("scripts/helpers.js");

initDefaultPrefs(PREF_ROOT, PREF_DEFAULTS, true);

var currentStyling;

function loadAndObserveCAMStyling(prefName) {
	if (currentStyling.indexOf("none") === -1) {
		loadSheet(currentStyling);
	}

	prefObserve([ prefName ], function() {
		var newStyling = "styles/" + prefValue(prefName) + ".css";

		if (newStyling != currentStyling) {
			if (newStyling.indexOf("none") === -1) {
				loadSheet(newStyling);
			}

			if (currentStyling.indexOf("none") === -1) {
				unloadSheet(currentStyling);
			}
			currentStyling = newStyling;
		}
	});

	unload(function() {
		if (currentStyling.indexOf("none") === -1) {
			unloadSheet(currentStyling);
		}
	});
}

function startup(data, reason) {
	initAddonNameAsync(data);
	printToLog("startup(camStyling = " + prefValue("camStyling")
			+ ", useZeroBorderRadius = " + prefValue("useZeroBorderRadius")
			+ ", showAddonCounts = " + prefValue("showAddonCounts")
			+ ", adaptiveCategorySize = " + prefValue("adaptiveCategorySize")
			+ ", loggingEnabled = " + prefValue("loggingEnabled") + ")");

	loadSheet("styles/commons.css");
	unload(function() {
		unloadSheet("styles/commons.css");
	});

	currentStyling = "styles/" + prefValue("camStyling") + ".css";
	loadAndObserveCAMStyling("camStyling");

	loadAndObserve("useZeroBorderRadius", "styles/zeroBorderRadius.css");
	loadAndObserve("showAddonCounts", "styles/addonCounts.css");
	loadAndObserve("adaptiveCategorySize", "styles/adaptiveCategorySize.css");
}

function shutdown(data, reason) {
	if (reason == APP_SHUTDOWN)
		return;
	unload();
}

function install() {
}
function uninstall() {
}
