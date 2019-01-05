sap.ui.define([
	"sap/ui/core/mvc/XMLView"
], function (XMLView) {
	"use strict";

	XMLView.create({
		viewName: "sap.ui.expertsui5.root.view.ToolPage"
	}).then(function (oView) {
		oView.placeAt("content");
	});
});
