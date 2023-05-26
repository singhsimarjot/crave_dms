sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageBox) {
        "use strict";
  
        return Controller.extend("com.ns.dmsfioriapp.controller.Main", {
            onInit: function () {
                var that=this;
                var sUrl = "SPA_DMS/browser";
                $.ajax({ 
                    url: sUrl,
                    type: "GET",
                    dataType: "json",
                    success: function(res) {
                        console.log(res);
                    var dataModel= new sap.ui.model.json.JSONModel({
                    Array:res
                    });
                    that.getView().setModel(dataModel,"dataModel");
                    
                    }, error: function(oError){
                        console.log(oError);
                    }
                });
            }, 
 
            onSearch:function(oEvent){
                          var aFilters = [];
                          var sQuery = oEvent.getSource().getValue();                   
                        if (sQuery && sQuery.length > 0) {                        
                          var filter1 = new sap.ui.model.Filter("repositoryName", sap.ui.model.FilterOperator.Contains, sQuery);
                          var filter2 = new sap.ui.model.Filter("repositoryCategory", sap.ui.model.FilterOperator.Contains, sQuery);
                          var filter3 = new sap.ui.model.Filter("repositoryDescription", sap.ui.model.FilterOperator.Contains, sQuery);
                          var filter4 = new sap.ui.model.Filter("repositoryId", sap.ui.model.FilterOperator.Contains, sQuery);
                          var filter5 = new sap.ui.model.Filter("vendorName", sap.ui.model.FilterOperator.Contains, sQuery);                    
                            var filterAll = new sap.ui.model.Filter({                  
                            filters: [filter1, filter2, filter3,filter4,filter5],                   
                            and: false                   
                             });                   
                              aFilters.push(filterAll);                    
                             }                   
                              var list = this.getView().byId("idTable");                   
                              var oBinding = list.getBinding("items");                   
                        oBinding.filter(aFilters);                   
            },

                        selectAll:function( oEvent){
                            var otab = this.byId("idTable");                     
                                            var bSelected = oEvent.getParameter('selected');                       
                                            otab.getItems().forEach(function(item) {                
                                                var oCheckBoxCell = item.getCells()[0];                       
                                                oCheckBoxCell.setSelected(bSelected);
                            });                   
                        }, 

                    onClick: function (oEvent) {                               
                        var that = this
                        var index = this.getView().byId("idTable")._oItemNavigation.iFocusedIndex;
                        var reqIndex = index -1;
                        var RepoID = this.getView().byId("idTable").getItems()[reqIndex].mAggregations.cells[4].mProperties.text;
                       //var RepoID = this.getView().byId("idTable").getSelectedItems()[0].mAggregations.cells[4].mProperties.text;
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                        // var Url="SPA_DMS/browser/"+RepoID+"/root/"
                        oRouter.navTo("detail",{ productPath: RepoID });
                            
                    },

                    onSelectionChange: function (oEvent) {    
                        var that = this;
                      },

                      onCreate:function(){
                        if (!this.Dialog1) {
                            this.Dialog1 = sap.ui.xmlfragment(
                                "com.ns.dmsfioriapp.view.Create",
                                this
                            );
                            this.getView().addDependent(this.Dialog1);
                        }
                        var inp1 = sap.ui.getCore().byId("Inp1");
                        inp1.setValue("");
                        this.Dialog1.open();
                    },

                      SaveBtn: function(oEvent) {
                           var that=this;
                        var oModel = this.getView().getModel("dataModel");
                        var inpvalue = sap.ui.getCore().byId("Inp1").getValue();
                        
                            var obj= {
                                "repository": {
                                "displayName": inpvalue,
                                "description": inpvalue,
                                "repositoryType": "internal",
                                "isVersionEnabled":true,
                                "isVirusScanEnabled":false,
                                "skipVirusScanForLargeFile": true,
                                "hashAlgorithms":"None"
                                }
                              };
                        
                        var rUrl = "SPA_DMS/rest/v2/repositories";
                        $.ajax({
                            type: "POST",
                            url: rUrl,
                            data: JSON.stringify(obj),
                            contentType: "application/json",
                            dataType: "json",
                            success: function(res) {
                                console.log(res);
                                sap.m.MessageBox.success("Repository Created Successfully");
                                // that.getView().getModel("dataModel").refresh();
                               that.onRefresh();                               
                            },
                            error: function(oError) {
                                console.log(oError);                              
                            }
                        });
                        this.Dialog1.close();
                    },

                    
                      onClose:function(){
                        this.Dialog1.close();
                      },



                      onRefresh: function(oEvent){
                        var that=this;
                        var sUrl = "SPA_DMS/browser";
                        $.ajax({ 
                            url: sUrl,
                            type: "GET",
                            dataType: "json",
                            success: function(res) {
                                console.log(res);
                            var dataModel= new sap.ui.model.json.JSONModel({
                            Array:res
                            });
                            that.getView().setModel(dataModel,"dataModel");
                            
                            }, error: function(oError){
                                console.log(oError);
                            }
                        });
                      }
 

                
           
        });
    });
