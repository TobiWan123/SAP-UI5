sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"../model/customer.model",
	"sap/ui/core/Fragment",
	"sap/ui/model/Sorter",
], function (Controller, JSONModel, formatter, Filter, FilterOperator, customer, Fragment, Sorter) {
	"use strict";
	return Controller.extend("sap.ui.sap-ui5.controller.customer", {
		formatter: formatter,
		aFilter: [],
		onInit: function () {

			var oViewModel = new JSONModel({
				currency: "EUR",
				order: 0,
				globalFilter: "",
				availabilityFilterOn: false,
				cellFilterOn: false
			});

			this.getView().setModel(oViewModel, "view");

			customer.getData().then(data => {

				var oData = new JSONModel(data);

				this.getView().setModel(oData, "customer-data")

			});
		},
		onPress: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("overview");
		},
		onFilterCustomer: function (oEvent) {

			// build filter array

			var aFilter = [];

			var sQuery = oEvent.getParameter("query");

			if (sQuery && oEvent.getSource() === this.getView().byId("s_1V")) {
				aFilter.push(new Filter("Vorname", FilterOperator.Contains, sQuery));
			}
			else if (sQuery && oEvent.getSource() === this.getView().byId("s_2N")) {
				aFilter.push(new Filter("Nachname", FilterOperator.Contains, sQuery));
			}

			// filter binding
			var oList = this.byId("Kundenliste");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},
		onSort: function () {
			var oView = this.getView();

			//frag controller
			var oFragmentController = {
				onSortDialogConfirm: function (oEvent) {
					var oSortit = oEvent.getParameter("sortItem");
					var sColumnPath = "Nachname";
					var dDesc = oEvent.getParameter("sortDescending");
					var arrSorter = [];
					if (oSortit) {
						sColumnPath = oSortit.getKey(); // selected Column
					}
					arrSorter.push(new Sorter(sColumnPath, dDesc));

					var oTable = oView.byId("Kundenliste");
					var oBinding = oTable.getBinding("items");
					oBinding.sort(arrSorter);

					oView.byId("sortDialog").destroy();
				},
				onExit: function () {
					if (oView.byId("sortDialog")){
						oView.byId("sortDialog").destroy();
					}
				}
			};

			// load frag file
			if (!this.byId("sortDialog")) {
				var pDialog = Fragment.load({
					id: oView.getId(),
					name: "sap.ui.sap-ui5.view.SortDialog",
					controller: oFragmentController
				}).then(function (oDialog) {
					// open Dialog
					oView.addDependent(oDialog);
					oDialog.open();
					return oDialog;
				});
			}

			//open fragment after fragment-promise resolves
			pDialog.then(function (oDialog) {
				oDialog.open();
			});
		},
		onGroup: function () {
			var oView = this.getView();

			//frag controller
			var oFragmentController = {
				onGroupDialogConfirm: function (oEvent) {
					var oSortit = oEvent.getParameter("groupItem");
					var sColumnPath = "ClientName";
					var dDesc = oEvent.getParameter("groupDescending");
					var arrSorter = [];
					var gGroupEnabled = false;

					console.log(oView.byId("groupDialog"))

					if (oSortit) {
						sColumnPath = oSortit.getKey(); // selected Column
						gGroupEnabled = true;
					}
					arrSorter.push(new Sorter(sColumnPath, dDesc, gGroupEnabled));

					var oTable = oView.byId("Kundenliste");
					var oBinding = oTable.getBinding("items");
					oBinding.sort(arrSorter);

					oView.byId("groupDialog").destroy();
				},
				onExit: function () {
					if (oView.byId("groupDialog")){
						oView.byId("groupDialog").destroy();
					}
				}
			};
			// load frag file
			if (!this.byId("groupDialog")) {
				var pDialog = Fragment.load({
					id: oView.getId(),
					name: "sap.ui.sap-ui5.view.GroupDialog",
					controller: oFragmentController
				}).then(function (oDialog) {
					// open Dialog
					oView.addDependent(oDialog);
					oDialog.open();
					return oDialog
				});
			}

			//open fragment after fragment-promise resolves
			pDialog.then(function (oDialog) {
				oDialog.open();
			});

		}
	});
});