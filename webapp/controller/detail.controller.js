sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "../model/formatter",
        "sap/m/PDFViewer",
        "sap/ui/core/format/DateFormat",
        "sap/ui/core/Fragment",
        "sap/ui/core/util/File",
        "sap/m/MessageBox" ,
        "sap/ui/core/routing/History",
	      "sap/ui/core/UIComponent"
       
                      

    ],
    function(BaseController,formatter,PDFViewer,DateFormat,Fragment, File, MessageBox,History,UIComponent) {
      "use strict";
  
      return BaseController.extend("com.ns.dmsfioriapp.controller.detail", {
         formatter: formatter,
        onInit() {
          var that=this;
          // var sUrl = "SPA_DMS/browser/abc2aa84-8193-48e8-9cea-97d397d39047/root/";         
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
          // oRouter.getRoute("detail").attachPatternMatched(this.onLinkPress, this);
        },

      
        
        _onObjectMatched: function(oEvent) {
          var that= this;
          this.sRepoPath = oEvent.getParameter("arguments").productPath;
          var Url="SPA_DMS/browser/"+this.sRepoPath+"/root/";
          $.ajax({
            url: Url,
            type: "GET",
            dataType: "json",
            success: function(res) {
            console.log(res);
            var detailModel= new sap.ui.model.json.JSONModel({
            Array:res
            });
            that.getView().setModel(detailModel,"detailModel");

            // var asd=that.getView().getModel("detailModel").getData().Array;
            var tableData = [];
             for(let i = 0; i < res.objects.length; i++){
              var data = {
              // objectTypeId : res.objects[i].object.properties['cmis:baseTypeId'].value, 
              objectTypeId : res.objects[i].object.properties['cmis:objectTypeId'].value, 
              // objectTypeId : res.objects[i].object.properties['cmis:contentStreamId'].value,
              name : res.objects[i].object.properties['cmis:name'].value,
              createdBy : res.objects[i].object.properties['cmis:createdBy'].value,
              creationDate : res.objects[i].object.properties['cmis:creationDate'].value,
              lastModifiedBy : res.objects[i].object.properties['cmis:lastModifiedBy'].value,
              owner : res.objects[i].object.properties['sap:owner'].value
              };
              tableData.push(data);  
             }           
              var tableModel= new sap.ui.model.json.JSONModel({            
              dataArray:tableData 
            });
              that.getView().setModel(tableModel, "tableModel"); 
            }, error: function(oError){
                console.log(oError);
            }
        });
          
        },

                
        onLinkPress:function(oEvent){
                  
                      // var docName = oEvent.getSource().getBindingContexts().getObject().name;
                      var index = this.getView().byId("DetailIdTable")._oItemNavigation.iFocusedIndex;
                      var reqIndex = index -1;
                      var docName = this.getView().byId("DetailIdTable").getItems()[reqIndex].mAggregations.cells[2].mProperties.text;
                    //  var Url="SPA_DMS/browser/"+this.sRepoPath+""+docName+"";
                     var Url="SPA_DMS/browser/"+this.sRepoPath+"/root/"+""+docName+"";
                                
                    //   $.ajax({
                    //     url: Url,
                    //     type: "GET",
                    //     dataType: "json",
                    //     success: function(res) {
                    //     console.log(res);
                    //       var opdfViewer = new PDFViewer();
                    //     this.getView().addDependent(opdfViewer);
                    //     var sSource = res;
                    //     opdfViewer.setSource(sSource);
                    //     opdfViewer.setTitle( "My PDF");
                    //     opdfViewer.open();
                    //     }, error: function(oError){
                    //         console.log(oError);
                    //     }
                    // });

                        //var Url="SPA_DMS/browser/abc2aa84-8193-48e8-9cea-97d397d39047/root/1";
                        window.open(Url);

            //   var opdfViewer = new PDFViewer();
            // this.getView().addDependent(opdfViewer);
            // // var sServiceURL = this.getView().getModel().sServiceUrl;
            // var sSource = "SPA_DMS/browser/abc2aa84-8193-48e8-9cea-97d397d39047/root/1";
            // opdfViewer.setSource(sSource);
            // opdfViewer.setTitle( "My PDF");
            // opdfViewer.open();


        },


//..............................create folder..........................//

             onCreateFolder:function(oEvent){
                  var oView = this.getView();
                  if (!this.byId("DialogId1")) {
                  Fragment.load({
                    id: oView.getId(),
                    name: "com.ns.dmsfioriapp.view.Folder",
                    controller: this
                  }).then(function (oDialog) 
                      {
                        oView.addDependent(oDialog);
                        oDialog.open();
                    });
                  } else {
                      this.byId("DialogId1").open();
                  }
             },

            // onSaveFolder: function(oEvent){ 
            //   var inpvalue = this.getView().byId("Inp2").getValue();
            //   var url="SPA_DMS/browser/"+this.sRepoPath+"/root/";
            //   var xsrf = {
            //     "cmisaction": 'createFolder',
            //     properties: [
                  
            //       {propertyId: "cmis:objectTypeId", propertyValue: "cmis:folder"},
            //       {propertyId: "cmis:name", propertyValue: inpvalue}

            //       // {propertyId: "cmis:createdBy", propertyValue: inpvalue},
            //       // {propertyId: "cmis:creationDate", propertyValue: inpvalue},
            //       // {propertyId: "cmis:lastModifiedBy", propertyValue: inpvalue},
            //       // {propertyId: "sap:owner", propertyValue: inpvalue},
             
            //     ],
            //     succinct: true
            //   };
                         
            //   $.ajax({
            //     type: 'POST',
            //     url: url,
            //     data: $.param(xsrf),
            //     headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            //     success: function () {
            //       sap.m.MessageBox.success("Folder Created Successfully");
            //     },
            //     error: function(xhr, status, error) {
            //       sap.m.MessageBox.error("Error creating folder: " + error);
            //     }
            //   });
            // },



            onSaveFolder: function(oEvent){ 
              var inpvalue = this.getView().byId("Inp2").getValue();
              var url = "SPA_DMS/browser/" + this.sRepoPath + "/root/";             
              var data = new FormData();
               var that=this;
              data.append("cmisaction", "createFolder");
              data.append("propertyId[0]", "cmis:name");
              data.append("propertyValue[0]", inpvalue);
              data.append("propertyId[1]", "cmis:objectTypeId");
              data.append("propertyValue[1]", "cmis:folder");         
              var xhr = new XMLHttpRequest();
              xhr.withCredentials = false;         
             xhr.addEventListener("readystatechange", function () {
                  if (this.readyState === this.DONE) {
                      sap.m.MessageBox.success("Folder Created Successfully");
                       that.onRefresh();
                  }
              });         
              xhr.addEventListener("error", function (error) {
                  sap.m.MessageBox.error("Error creating folder: " + error);
              });              
              xhr.open("POST", url);            
              xhr.setRequestHeader("DataServiceVersion", "2.0");
              xhr.setRequestHeader("Accept", "application/json");
              xhr.send(data);
              this.byId("DialogId1").destroy();
          },
       
                 
            onCloseFolder: function(oEvent){
                this.byId("DialogId1").destroy();
            },
 

//.........................................Delete Folder....................................//

            onDelete:function(oEvent){
          
              var index = this.getView().byId("DetailIdTable")._oItemNavigation.iFocusedIndex;
               var reqIndex = index -1;
               var objectId = this.getView().getModel("detailModel").oData.Array.objects[reqIndex].object.properties['cmis:objectId'].value;
               var repoId = this.sRepoPath;
               var that=this;
               var Url = "SPA_DMS/browser/"+repoId+"/root";
               var xsrf = {
               "cmisaction": 'delete',
               "objectId": objectId,
               "allVersions" : true
               };         
               $.ajax({
               type: 'POST',
               url: Url,
               data: $.param(xsrf),
               headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
               }).success(function (res) {
                console.log(res);
             
               sap.m.MessageBox.success("Deleted successfully");
               // sap.ui.getCore().byId("container-com.ns.dmsfioriapp---detail--DetailIdTable").getModel().refresh(true);
                 that.onRefresh();
               }.bind(that));
    
             },

            onRefresh:function(oEvent){
              var that= this;
              // this.sRepoPath = oEvent.getParameter("arguments").productPath;
               var Url="SPA_DMS/browser/"+this.sRepoPath+"/root/";
               $.ajax({
                 url: Url,
                 type: "GET",
                 dataType: "json",
                 success: function(res) {
                 console.log(res);
                 var detailModel= new sap.ui.model.json.JSONModel({
                 Array:res
                 });
                 that.getView().setModel(detailModel,"detailModel");
     
                 // var asd=that.getView().getModel("detailModel").getData().Array;
                 var tableData = [];
                  for(let i = 0; i < res.objects.length; i++){
                   var data = {
                   // objectTypeId : res.objects[i].object.properties['cmis:baseTypeId'].value, 
                   objectTypeId : res.objects[i].object.properties['cmis:objectTypeId'].value, 
                   // objectTypeId : res.objects[i].object.properties['cmis:contentStreamId'].value,
                   name : res.objects[i].object.properties['cmis:name'].value,
                   createdBy : res.objects[i].object.properties['cmis:createdBy'].value,
                   creationDate : res.objects[i].object.properties['cmis:creationDate'].value,
                   lastModifiedBy : res.objects[i].object.properties['cmis:lastModifiedBy'].value,
                   owner : res.objects[i].object.properties['sap:owner'].value
                   };
                   tableData.push(data);  
                  }
                 
                   var tableModel= new sap.ui.model.json.JSONModel({            
                   dataArray:tableData 
                 });
                   that.getView().setModel(tableModel, "tableModel"); 
     
     
                 }, error: function(oError){
                     console.log(oError);
                 }
             });
             },
  
 



  

          onBack: function () {
            //this.getOwnerComponent().getRouter().navTo("TargetMain");
            // this.getOwnerComponent().getRouter().back();

            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();
      
            if (sPreviousHash !== undefined) {
              window.history.go(-1);
            } else {
              var oRouter = UIComponent.getRouterFor(this);
              oRouter.navTo("detail/{productPath}", true);
            }

           },
               

          //  onClick1: function(oEvent) {                               
          //   var index = this.getView().byId("DetailIdTable")._oItemNavigation.iFocusedIndex;
          //   var reqIndex = index - 1;
          //   var folderNm = this.getView().byId("DetailIdTable").getItems()[reqIndex].mAggregations.cells[2].mProperties.text;
          //   var RepoID = this.sRepoPath;
          //   var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          //   oRouter.navTo("files", { productPath: RepoID });
          // },
            
          onClick1: function(oEvent) {                               
            var index = this.getView().byId("DetailIdTable")._oItemNavigation.iFocusedIndex;
            var reqIndex = index - 1;
            var folderNm = this.getView().byId("DetailIdTable").getItems()[reqIndex].mAggregations.cells[2].mProperties.text;
            var RepoID = this.sRepoPath;
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("files", { RepoID: RepoID, folderNm: folderNm });
          },




















        //    onSelect:function(oEvent){
        //     debugger;
        //     var value = oEvent.getSource().getValue();
        //     if(value == "Folder"){
  
        //     var oView = this.getView();
        //     if (!this.byId("DialogId1")) {
        //      Fragment.load({
        //       id: oView.getId(),
        //       name: "com.ns.dmsfioriapp.view.Folder",
        //       controller: this
        //     }).then(function (oDialog) 
        //         {
        //           oView.addDependent(oDialog);
        //           oDialog.open();
        //        });
        //      } else {
        //          this.byId("DialogId1").open();
        //     }
        // }
        //     else if(value == "Document"){
        //         var oView = this.getView();
        //         if (!this.byId("DialogId3")) {
        //          Fragment.load({
        //           id: oView.getId(),
        //           name: "com.ns.dmsfioriapp.view.Document",
        //           controller: this
        //         }).then(function (oDialog) 
        //             {
        //               oView.addDependent(oDialog);
        //               oDialog.open();
        //            });
        //          } else {
        //              this.byId("DialogId3").open();
        //         }
  
        //     }
        //   },
        




      });
    }
  );