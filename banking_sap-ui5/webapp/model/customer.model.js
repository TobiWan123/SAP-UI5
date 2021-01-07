sap.ui.define([
    "sap/ui/model/json/JSONModel"
], function (JSONModel) {
	"use strict";
	return {
		getData: async function(){
			var oData = { "Customer-Data": []};

			await fetch("./localService-backend/sap-hana-express.service.php?Sales=&Customer=&DP=&Volume=&Table=100", {
				method: "GET"
			}).then(result => {
				result;
				return result.json()
			}).then(data => {
				oData = data;
			}).catch( err => {
				console.log("Error occured! " + err);
			});

			return oData;
        }
	};
});