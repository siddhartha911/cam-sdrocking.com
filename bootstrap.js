var Cc = Components.classes, Ci = Components.interfaces, Cu = Components.utils;
Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/AddonManager.jsm");

var PREF_ROOT = "extensions.cam.";
var PREF_DEFAULTS = {
	camStyling : "camAdaptive",
	showAddonCounts : true,
	showDateUpdated : true,
	useAdaptiveCategorySize : true,
	useZeroBorderRadius : true,
	loggingEnabled : false
};

var CLASSIC_URL = "styles/camClassic.css", ADAPTIVE_URL = "styles/camAdaptive.css", MINIMAL_URL = "styles/camMinimal.css";

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

var currentAdaptive, currentMinimal;

function loadAndObserveCAMStyling(prefName) {
	loadSheet(currentAdaptive ? ADAPTIVE_URL : CLASSIC_URL);
	loadSheet(currentMinimal ? MINIMAL_URL : null);

	prefObserve([ prefName ], function() {
		var newStyling = prefValue(prefName).toLowerCase();
		newAdaptive = newStyling.indexOf("adaptive") !== -1;
		newMinimal = newStyling.indexOf("minimal") !== -1;

		if (newAdaptive != currentAdaptive) {
			loadSheet(newAdaptive ? ADAPTIVE_URL : CLASSIC_URL);
			unloadSheet(currentAdaptive ? ADAPTIVE_URL : CLASSIC_URL);
			currentAdaptive = newAdaptive;
		}

		if (newMinimal != currentMinimal) {
			if (newMinimal) {
				loadSheet(MINIMAL_URL);
			} else {
				unloadSheet(MINIMAL_URL);
			}

			currentMinimal = newMinimal;
		}
	});

	unload(function() {
		unloadSheet(currentAdaptive ? ADAPTIVE_URL : CLASSIC_URL);
		unloadSheet(currentMinimal ? MINIMAL_URL : null);
	});
}

function startup(data, reason) {
	initAddonNameAsync(data);
	printToLog("startup(camStyling = " + prefValue("camStyling")
			+ ", showAddonCounts = " + prefValue("showAddonCounts")
			+ ", showDateUpdated = " + prefValue("showDateUpdated")
			+ ", useAdaptiveCategorySize = "
			+ prefValue("useAdaptiveCategorySize") + ", useZeroBorderRadius = "
			+ prefValue("useZeroBorderRadius") + ", loggingEnabled = "
			+ prefValue("loggingEnabled") + ")");

	loadSheet("styles/commons.css");
	unload(function() {
		unloadSheet("styles/commons.css");
	});

	loadAndObserve("showAddonCounts", "styles/showAddonCounts.css");
	loadAndObserve("showDateUpdated", "styles/showDateUpdated.css");
	loadAndObserve("useAdaptiveCategorySize", "styles/adaptiveCategorySize.css");
	loadAndObserve("useZeroBorderRadius", "styles/zeroBorderRadius.css");

	var currentStyling = prefValue("camStyling").toLowerCase();
	currentAdaptive = currentStyling.indexOf("adaptive") !== -1;
	currentMinimal = currentStyling.indexOf("minimal") !== -1;
	loadAndObserveCAMStyling("camStyling");
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
