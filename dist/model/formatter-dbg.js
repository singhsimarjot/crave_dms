sap.ui.define([
	"sap/ui/core/format/DateFormat"
], function (DateFormat) {
	"use strict";
	return {
		/**
 * Rounds the number unit value to 2 digits
 * @public
 * @param {string} sValue the number string to be rounded
 * @returns {string} sValue with 2 digits rounded
 */
		setDate: function (creationDate) {
			if (creationDate) {
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "yyyy-MM-dd"
				});
				return oDateFormat.format(new Date(creationDate));
			}

		},

		setDate1: function (creationDate1) {
			if (creationDate1) {
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "yyyy-MM-dd"
				});
				return oDateFormat.format(new Date(creationDate1));
			}

		},

	};

});