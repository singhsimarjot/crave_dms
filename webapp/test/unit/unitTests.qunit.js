/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comns/dms_fiori_app/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
