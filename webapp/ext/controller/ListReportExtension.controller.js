sap.ui.define(
    ["sap/ui/core/Fragment", "sap/m/MessageToast", "sap/m/MessageBox"],
    function (Fragment, MessageToast, MessageBox) {
        return {
            /**
             * Controller's "init" lifecycle method.
             */
            onInit: function () {
                // Register the view with the message manager
                sap.ui
                    .getCore()
                    .getMessageManager()
                    .registerObject(this.getView(), true);
            },

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
                if (
                    oSmartFilterBar instanceof
                    sap.ui.comp.smartfilterbar.SmartFilterBar
                ) {
                    //Custom rating filter
                    var oCustomControl = oSmartFilterBar.getControlByKey(
                        "CustomFilterRating"
                    );
                    if (oCustomControl instanceof sap.m.ComboBox) {
                        sQueryRating = oCustomControl.getSelectedKey();

                        if (sQueryRating) {
                            oBindingParams.filters.push(
                                new sap.ui.model.Filter(
                                    "Rating",
                                    "GE",
                                    sQueryRating
                                )
                            );
                        }
                    }
                }
            },

            /**
             * @public
             * Show Product Form after press.
             */
            onOpenProductCreationForm: function () {
                var oView = this.getView(),
                    oProductFormDialog = this.byId("ProductCreationForm");

                if (!oProductFormDialog) {
                    // load asynchronous XML fragment
                    Fragment.load({
                        id: oView.getId(),
                        name:
                            "SAPUI5ShopFiori.sapui5shopfiori.ext.fragment.ProductCreationForm",
                        controller: this,
                    }).then(
                        function (oDialog) {
                            // connect dialog to the root view of this component (models, lifecycle)
                            oView.addDependent(oDialog);
                            // show form
                            oDialog.open();
                            this.ProductFormDialog = oDialog;
                        }.bind(this)
                    );
                } else {
                    // show form
                    this.ProductFormDialog.open();
                }
            },

            onCreateProductFormPress: function () {
                var oModel = this.getView().getModel(),
                    oProductModel = this.getView().getModel("ListReport"),
                    nCategoryID = oProductModel.getProperty("/Category"),
                    sCategoryKey = oModel.createKey("Categories", {
                        ID: nCategoryID,
                    }),
                    nProductID = Math.floor(Date.parse(new Date()) * 0.0001),
                    oI18n = this.getView().getModel("i18n").getResourceBundle();

                // create product id
                oProductModel.setProperty("/ProductForm/ID", nProductID);

                oModel.create(
                    "/" + sCategoryKey + "/Products",
                    oProductModel.getProperty("/ProductForm"),
                    {
                        success: function () {
                            MessageToast.show(
                                oI18n.getText("productMessageSuccessful")
                            );
                            // clear form
                            this._clearProductForm();
                        }.bind(this),
                        error: function () {
                            MessageBox.error(
                                oI18n.getText("productMessageError")
                            );
                        },
                        refreshAfterChange: true,
                    }
                );

                this.ProductFormDialog.close();
            },

            onCancelProductFormPress: function () {
                this.ProductFormDialog.close();
                this._clearProductForm();
            },

            onFormValid: function () {
                var oProductModel = this.getView().getModel("ListReport"),
                    oProductForm = oProductModel.getProperty("/ProductForm"),
                    // check invalid value
                    bCheckForm = !sap.ui
                        .getCore()
                        .getMessageManager()
                        .getMessageModel()
                        .getData().length;

                // check empty value
                for (let key in oProductForm) {
                    if (
                        (!oProductForm[key] && key !== "Description" && key !== "DiscontinuedDate"&& key !== "ID")
                    ) {
                        bCheckForm = false;
                    }
                }

                // toggle form button
                oProductModel.setProperty("/bCreateButtonEnabled", bCheckForm);
            },

            _clearProductForm: function () {
                var oProductModel = this.getView().getModel("ListReport"),
                    aFormKeys = Object.keys(
                        oProductModel.getProperty("/ProductForm")
                    );

                aFormKeys.forEach(function (sKey) {
                    oProductModel.setProperty("/ProductForm/" + sKey, null);
                });

                oProductModel.setProperty("/category", null);
                oProductModel.setProperty("/bCreateButtonEnabled", false);
            },
        };
    }
);
