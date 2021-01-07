sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/ui/model/json/JSONModel",
   "../model/overview.model",
   "../model/customer.model"
], function (Controller, JSONModel, overview, customer) {
   "use strict";
   return Controller.extend("sap.ui.sap-ui5.controller.overview", {
      onInit: function () {

         //Initialize Charts with Data

         //Deposit-Payout-Chart
         overview.getDPData().then(data => {

            var deposit = 0, payout = 0;

            // Aggregation
            Object.values(data)[0].forEach((element) => {
               if (element["Type"] === "Deposit") {
                  deposit += parseInt(element["Value"]);
               } else {
                  payout += parseInt(element["Value"]);
               }
            });

            var oData = new JSONModel({
               "Deposit-Payout": [{ type: "Deposit", Value: deposit }, { type: "Payout", Value: payout }]
            });

            this.getView().setModel(oData, "dp");

            var vizDonut_dp = this.getView().byId("vizDonut_DP");

            var dataset = new sap.viz.ui5.data.FlattenedDataset({
               dimensions: [{
                  axis: 1,
                  name: "Date",
                  value: "{type}"
               }],
               measures: [{
                  name: "Ratio",
                  value: "{dp>Value}"
               }],
               data: {
                  path: "dp>/Deposit-Payout",
               }
            })

            vizDonut_dp.setDataset(dataset);

            //Sales-Chart
            overview.getSalesData().then(data => {
               var oData = new JSONModel(data);
               this.getView().setModel(oData, "sales");

               var vizBar = this.getView().byId("vizBar");
               var dataset = new sap.viz.ui5.data.FlattenedDataset({
                  dimensions: [{
                     axis: 1,
                     name: "Date",
                     value: "{sales>Date}"
                  }],
                  measures: [{
                     name: "Sales",
                     value: "{sales>Value}"
                  }],
                  data: {
                     path: "sales>/Sales-Data",
                  }
               })

               vizBar.setDataset(dataset);
            });


            var won = 0, lost = 0;

            //Customer-Chart
            overview.getCustomerData().then(data => {

               // Aggregation
               Object.values(data)[0].forEach((element) => {


                  if (element["Type"] === "won") {
                     won += parseInt(element["Value"]);
                  } else {
                     lost += parseInt(element["Value"]);
                  }

               });

               var oData = new JSONModel({
                  "Customer-Transactions": [{ type: "won", Value: won }, { type: "lost", Value: lost }]
               });

               this.getView().setModel(oData, "customer");

               var vizDonut_cust = this.getView().byId("vizDonut_cust");
               var dataset = new sap.viz.ui5.data.FlattenedDataset({
                  dimensions: [{
                     axis: 1,
                     name: "Type",
                     value: "{customer>type}"
                  }],
                  measures: [{
                     name: "Ratio",
                     value: "{customer>Value}"
                  }],
                  data: {
                     path: "customer>/Customer-Transactions",
                  }
               })

               vizDonut_cust.setDataset(dataset);
            });

            //Volume-Data
            overview.getVolumeData().then(data => {

               var volumes = Object.values(data)[0];

               volumes.sort(function (a, b) {
                  // Turn your strings into dates, and then subtract them
                  // to get a value that is either negative, positive, or zero.
                  return new Date(b["Date"]) - new Date(a["Date"]);
               });

               if (volumes.length > 0) {
                  this.getView().byId("numCon1").setText(volumes[0]["Date"] + ": " + volumes[0]["Value"] + "€");
                  this.getView().byId("numCon2").setText(0);
                  this.getView().byId("numCon3").setText(0);
                  if (volumes.length > 1) {
                     this.getView().byId("numCon2").setText(volumes[1]["Date"] + ": " + volumes[1]["Value"] + "€");
                     this.getView().byId("numCon3").setText(0);
                  }
                  if (volumes.length > 2) this.getView().byId("numCon3").setText(volumes[2]["Date"] + ": " + volumes[2]["Value"] + "€");
               } else {
                  this.getView().byId("numCon1").setText(0);
                  this.getView().byId("numCon2").setText(0);
                  this.getView().byId("numCon3").setText(0);
               }
            });
         });

      },
      filter: async function (oEvent) {

         //Variables for new Aggregation and Filter
         var date = "";

         var sQuery = oEvent.getSource().getValue().split(".");

         date = date.concat(sQuery[1], ".", sQuery[0], ".", "20", sQuery[2]);

         if (oEvent.getSource() === this.getView().byId("picker_f")) {
            this.filter_f = date;
         } else {
            this.filter_t = date;
         }

         //Fetch Data again from Data-Model -> Aggregation with Filter -> override old OData Model -> refresh Dataset-Binding for Charts!!!

         //DP-Chart
         overview.getFilteredDPData(this.filter_f, this.filter_t).then(res => {
            var oData_DP = new JSONModel(res);
            this.getView().setModel(oData_DP, "dp");
            var vizDonut_dp = this.getView().byId("vizDonut_DP");
            vizDonut_dp.getDataset("dp").bindData({
               path: "dp>/Deposit-Payout"
            });
         });

         //Sales-Chart
         overview.getFilteredSalesData(this.filter_f, this.filter_t).then(res => {
            var newData = res;
            var oData_sales = new JSONModel({ "Sales-Data": newData });
            this.getView().setModel(oData_sales, "sales");
            var vizBar = this.getView().byId("vizBar");
            vizBar.getDataset("sales").bindData({
               path: "sales>/Sales-Data"
            });
         });

         //Customer-Chart
         overview.getFilteredCustomerData(this.filter_f, this.filter_t).then(res => {
            var oData_cust = new JSONModel(res);
            this.getView().setModel(oData_cust, "customer");
            var vizDonut_cust = this.getView().byId("vizDonut_cust");
            vizDonut_cust.getDataset("customer").bindData({
               path: "customer>/Customer-Transactions"
            });
         });


         //Volume-Data
         overview.getFilteredVolumeData(this.filter_f, this.filter_t).then(res => {
            var newVolumes = res;

            if (newVolumes.length > 0) {
               this.getView().byId("numCon1").setText(newVolumes[0]["Date"] + ": " + newVolumes[0]["Value"] + "€");
               this.getView().byId("numCon2").setText(0);
               this.getView().byId("numCon3").setText(0);
               if (newVolumes.length > 1) {
                  this.getView().byId("numCon2").setText(newVolumes[1]["Date"] + ": " + newVolumes[1]["Value"] + "€");
                  this.getView().byId("numCon3").setText(0);
               }
               if (newVolumes.length > 2) this.getView().byId("numCon3").setText(newVolumes[2]["Date"] + ": " + newVolumes[2]["Value"] + "€");;
            } else {
               this.getView().byId("numCon1").setText(0);
               this.getView().byId("numCon2").setText(0);
               this.getView().byId("numCon3").setText(0);
            }
         });
      },
      filter_f: "01.01.0000",
      filter_t: "01.01.9999"
   });
});