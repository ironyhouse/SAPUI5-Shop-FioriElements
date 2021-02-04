sap.ui.define(["sap/m/MessageToast"], function (MessageToast) {
  return {
    // onInit: function() {
    //     var oFilterBar = this.byId("project2::sap.suite.ui.generic.template.ListReport.view.ListReport::Products--listReportFilter");
    //     oFilterBar.setLiveMode(true);
    // },

    /**
     * @public
     * Filter Table by custom rating filter control.
     * @param {sap.ui.base.Event} oEvent - Event object.
     */
    onBeforeRebindTableExtension: function (oEvent) {
	  	var oBindingParams = oEvent.getParameter("bindingParams");
            oBindingParams.parameters = oBindingParams.parameters || {};

		var oSmartTable = oEvent.getSource();
		var oSmartFilterBar = this.byId(oSmartTable.getSmartFilterId());
		var sQueryRating;
		if (oSmartFilterBar instanceof sap.ui.comp.smartfilterbar.SmartFilterBar) {
			//Custom rating filter
			var oCustomControl = oSmartFilterBar.getControlByKey("CustomFilterRating");
			if (oCustomControl instanceof sap.m.ComboBox) {
				sQueryRating = oCustomControl.getSelectedKey();

				console.log(sQueryRating);

				switch (sQueryRating) {
					case "0":
						oBindingParams.filters.push(new sap.ui.model.Filter("Rating", "GE", "0"));
						break;
					case "1":
						oBindingParams.filters.push(new sap.ui.model.Filter("Rating", "GE", "1"));
						break;
					case "2":
						oBindingParams.filters.push(new sap.ui.model.Filter("Rating", "GE", "2"));
						break;
					case "3":
						oBindingParams.filters.push(new sap.ui.model.Filter("Rating", "GE", "3"));
						break;
					case "4":
						oBindingParams.filters.push(new sap.ui.model.Filter("Rating", "GE", "4"));
						break;
					case "5":
						oBindingParams.filters.push(new sap.ui.model.Filter("Rating", "GE", "5"));
						break;
					default:
						break;
				}
			}
		}
    },

    /**
     * @public
     * Show MessageToast after press.
     */
    onCustomTableBtnPress: function () {
      MessageToast.show("CustomTableBtnText");
    },
  };
});
