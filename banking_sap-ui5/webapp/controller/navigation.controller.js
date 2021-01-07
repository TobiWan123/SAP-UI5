sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/overview.model"
], function (Controller, overview) {
    "use strict";
    return Controller.extend("sap.ui.sap-ui5.controller.navigation", {
        onInit: function () {
        },
        onNavToCustomer: function (oEvent) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);        
            oRouter.navTo("customer");
        },
        onNavToOverview: function (oEvent) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("overview");
        },
        log: function () {
           overview.getVolumeData().then(data => {
              console.log(Object.values(data));
           });
           overview.getSalesData().then(data => {
              console.log(Object.values(data));
           });
           overview.getDPData().then(data => {
              console.log(Object.values(data));
           });
           overview.getCustomerData().then(data => {
              console.log(Object.values(data));
           });
        }
    });
});