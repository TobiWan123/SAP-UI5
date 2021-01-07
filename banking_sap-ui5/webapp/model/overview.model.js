sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function (JSONModel) {
	"use strict";
	return {
		getVolumeData: async function () {

			var oData = { "Volumes": [] };

			await fetch("./localService-backend/sap-hana-express.service.php?Sales=&Customer=&DP=&Volume=100&Table=", {
				method: "GET"
			}).then(result => {
				result;
				return result.json()
			}).then(data => {
				oData = data;
			}).catch(err => {
				console.log("Error occured! " + err);
			});

			return oData;
		},
		getSalesData: async function () {

			var oData = { "Sales-Data": [] };

			await fetch("./localService-backend/sap-hana-express.service.php?Sales=100&Customer=&DP=&Volume=&Table=", {
				method: "GET"
			}).then(result => {
				result;
				return result.json()
			}).then(data => {
				oData = data;
			}).catch(err => {
				console.log("Error occured! " + err);
			});

			return oData;
		},
		getCustomerData: async function () {

			var oData = { "Customer-Transactions": [] };

			await fetch("./localService-backend/sap-hana-express.service.php?Sales=&Customer=100&DP=&Volume=&Table=", {
				method: "GET"
			}).then(result => {
				result;
				return result.json()
			}).then(data => {
				oData = data;
			}).catch(err => {
				console.log("Error occured! " + err);
			});

			return oData;
		},
		getDPData: async function () {

			var oData = { "Deposit-Payout": [] };

			await fetch("./localService-backend/sap-hana-express.service.php?Sales=&Customer=&DP=100&Volume=&Table=", {
				method: "GET"
			}).then(result => {
				result;
				return result.json()
			}).then(data => {
				oData = data;
			}).catch(err => {
				console.log("Error occured! " + err);
			});

			return oData;
		},
		getFilteredDPData: async function (filter_f, filter_t) {

			//Variables for new Aggregation and Filter
			var deposit = 0, payout = 0, oData;

			//Deposit/Payout-Chart
			await this.getDPData().then(data => {
			
				// Aggregation
				Object.values(data)[0].forEach((element, index) => {

					if (Date.parse(element["Date"]) >= Date.parse(filter_f) && Date.parse(element["Date"]) <= Date.parse(filter_t)) {
						if (element["Type"] === "Deposit") {
							deposit += parseInt(element["Value"]);
						} else {
							payout += parseInt(element["Value"]);
						}
					};
				});
			})
			
			oData = { "Deposit-Payout": [{ type: "Deposit", Value: deposit }, { type: "Payout", Value: payout }] };

			return oData;
		},
		getFilteredCustomerData: async function (filter_f, filter_t) {

			//Variables for new Aggregation and Filter
			var won = 0, lost = 0, oData;

			await this.getCustomerData().then(data => {
				// Aggregation
				Object.values(data)[0].forEach((element) => {
					if (Date.parse(element["Date"]) >= Date.parse(filter_f) && Date.parse(element["Date"]) <= Date.parse(filter_t)) {
						if (element["Type"] === "won") {
							won += parseInt(element["Value"]);
						} else {
							lost += parseInt(element["Value"]);
						}
					}
				});
			});

			oData = {
				"Customer-Transactions": [{ type: "won", Value: won }, { type: "lost", Value: lost }]
			};

			return oData;

		},
		getFilteredSalesData: async function (filter_f, filter_t) {

			//Variables for new Aggregation and Filter
			var newData = [];

			await this.getSalesData().then(data => {
				// New Data
				Object.values(data)[0].forEach((element, index) => {
					if (Date.parse(element["Date"]) >= Date.parse(filter_f) && Date.parse(element["Date"]) <= Date.parse(filter_t)) {
						newData.push({ Value: element["Value"], Date: element["Date"] });
					};
				});
			});

			return newData;
		},
		getFilteredVolumeData: async function (filter_f, filter_t) {

			//Variables for new Aggregation and Filter
			var newVolumes = [];

			await this.getVolumeData().then(data => {
				Object.values(data)[0].forEach((element) => {
					if (Date.parse(element["Date"]) >= Date.parse(filter_f) && Date.parse(element["Date"]) <= Date.parse(filter_t)) {
						newVolumes.push(element);
					}
				});
			});

			newVolumes.sort(function (a, b) {
				// Turn your strings into dates, and then subtract them
				// to get a value that is either negative, positive, or zero.
				return new Date(b["Date"]) - new Date(a["Date"]);
			});

			return newVolumes;
		}
	}
});