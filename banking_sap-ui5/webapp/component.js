sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
	"use strict";
	return UIComponent.extend("sap.ui.sap-ui5.Component", {
		metadata: {
			manifest: "json"
		},
		init: function () {

			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			// could set Global-Data-Models in here

			// create the views based on the url/hash without changing the whole url
			this.getRouter().initialize();
		}
	});
});