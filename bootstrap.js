const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
let sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
let ios = Cc['@mozilla.org/network/io-service;1'].getService(Ci.nsIIOService);

const FILENAME = "cam.css";

function getURIForFile(filepath) {
  return ios.newURI(__SCRIPT_URI_SPEC__.replace("bootstrap.js", filepath), null, null);
}

function startup(data, reason) {
  sss.loadAndRegisterSheet(getURIForFile(FILENAME), sss.USER_SHEET);
}

function shutdown(data, reason) {
  if(reason == APP_SHUTDOWN)  return;

  var uri = getURIForFile(FILENAME);
  if(sss.sheetRegistered(uri, sss.USER_SHEET))
    sss.unregisterSheet(uri, sss.USER_SHEET);
}

function install() {}
function uninstall() {}
