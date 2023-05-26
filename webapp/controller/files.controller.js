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
  
      return BaseController.extend("com.ns.dmsfioriapp.controller.files", {
         formatter: formatter,
        onInit() {
          var that=this;
          // var sUrl = "SPA_DMS/browser/abc2aa84-8193-48e8-9cea-97d397d39047/root/";         
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.getRoute("files").attachPatternMatched(this._onObjectMatched, this);
          oRouter.getRoute("files").attachPatternMatched(this.onDownloadFile, this);
         
        },

             
        _onObjectMatched: function(oEvent) {
          var that= this;
          this.sRepoPath = oEvent.getParameter("arguments").RepoID;
          this.folderName = oEvent.getParameter("arguments").folderNm;
           var uploadUrl = "SPA_DMS/browser/"+this.sRepoPath+"/root/"+this.folderName+"";
                            


          $.ajax({
            url: uploadUrl,
            type: "GET",
            dataType: "json",
            success: function(res) {
            console.log(res);
            var NewModel= new sap.ui.model.json.JSONModel({
            Array:res
            });
            that.getView().setModel(NewModel,"NewModel");
            var fileData = [];
             for(let i = 0; i < res.objects.length; i++){
              var data = { 
              objectTypeId : res.objects[i].object.properties['cmis:objectTypeId'].value, 
              name : res.objects[i].object.properties['cmis:name'].value,
              createdBy : res.objects[i].object.properties['cmis:createdBy'].value,
              creationDate1 : res.objects[i].object.properties['cmis:creationDate'].value,
              lastModifiedBy : res.objects[i].object.properties['cmis:lastModifiedBy'].value,
              owner : res.objects[i].object.properties['sap:owner'].value
              };
              fileData.push(data);  
             }
            
              var FileModel= new sap.ui.model.json.JSONModel({            
              dataArray:fileData 
               });
              that.getView().setModel(FileModel, "FileModel"); 


            }, error: function(oError){
                console.log(oError);
            }
        });
              
        },



  //..............................upload file.....................................//      
        onUplaodfile:function(oEvent){
            var oView = this.getView();
            if (!this.byId("DialogId3")) {
             Fragment.load({
              id: oView.getId(),
              name: "com.ns.dmsfioriapp.view.Document",
              controller: this
            }).then(function (oDialog) 
                {
                  oView.addDependent(oDialog);
                  oDialog.open();
               });
             } else {
                 this.byId("DialogId3").open();
            }
          },

          onCloseDoc:function(oEvent){
            this.byId("DialogId3").destroy();
           },
  


               handleUploadComplete: function(oEvent){                
                  var file = this.getView().byId("fileUploader").getValue();
                var data = new FormData();
                var that=this;
                data.append("cmisaction", "createDocument");
                data.append("propertyId[0]", "cmis:name");
                data.append("propertyValue[0]", file);
                data.append("propertyId[1]", "cmis:objectTypeId");
                data.append("propertyValue[1]", "cmis:document");
                data.append("_charset", "UTF-8");                
                var xhr = new XMLHttpRequest();
                xhr.withCredentials = false;               
                xhr.addEventListener("readystatechange", function () {
                  if (this.readyState === this.DONE) {
                    console.log(this.responseText);
                       sap.m.MessageBox.success("File Uploaded Successfully");
                       that.onRefresh();
                  } 
                });
                xhr.addEventListener("error", function (error) {
                  sap.m.MessageBox.error("Error Uploading File: " + error);
               }); 
                xhr.open("POST", "SPA_DMS/browser/"+this.sRepoPath+"/root/"+this.folderName+"");
                xhr.setRequestHeader("DataServiceVersion", "2.0");
                xhr.setRequestHeader("Accept", "application/json");
                xhr.send(data);
                this.byId("DialogId3").destroy();
              }, 
        
                           
            
          handleUploadPress: function() {
            var oFileUploader = this.byId("fileUploader");
          
            if (oFileUploader) {
              oFileUploader.checkFileReadable().then(function() {
                oFileUploader.upload();
              }, function(error) {
                sap.m.MessageToast.show("The file cannot be read. It may have changed.");
              });
            }
          },


         onRefresh: function(oEvent){
            var that= this;
            var uploadUrl = "SPA_DMS/browser/"+this.sRepoPath+"/root/"+this.folderName+"";
          $.ajax({
            url: uploadUrl,
            type: "GET",
            dataType: "json",
            success: function(res) {
            console.log(res);
            var NewModel= new sap.ui.model.json.JSONModel({
            Array:res
            });
            that.getView().setModel(NewModel,"NewModel");
            var fileData = [];
             for(let i = 0; i < res.objects.length; i++){
              var data = { 
              objectTypeId : res.objects[i].object.properties['cmis:objectTypeId'].value, 
              name : res.objects[i].object.properties['cmis:name'].value,
              createdBy : res.objects[i].object.properties['cmis:createdBy'].value,
              creationDate1 : res.objects[i].object.properties['cmis:creationDate'].value,
              lastModifiedBy : res.objects[i].object.properties['cmis:lastModifiedBy'].value,
              owner : res.objects[i].object.properties['sap:owner'].value
              };
              fileData.push(data);  
             }           
              var FileModel= new sap.ui.model.json.JSONModel({            
              dataArray:fileData 
               });
              that.getView().setModel(FileModel, "FileModel"); 
            }, error: function(oError){
                console.log(oError);
            }
            });
          },

     //..............................................................................................................................//
     //..............................................................................................................................//                               
          

//      onDownloadFile:function(oEvent){               
//       // var docName = oEvent.getSource().getBindingContexts().getObject().name;
//       var index = this.getView().byId("FilesIdTable")._oItemNavigation.iFocusedIndex;
//       var reqIndex = index -1;
//       var fileName = this.getView().byId("FilesIdTable").getItems()[reqIndex].mAggregations.cells[2].mProperties.text;
//     //  var Url="SPA_DMS/browser/"+this.sRepoPath+"/root/"+""+fileName+"";
//        var Url="SPA_DMS/browser/"+this.sRepoPath+"/root/"+this.folderName+"/"+fileName+"";
                
//     //   $.ajax({
//     //     url: Url,
//     //     type: "GET",
//     //     dataType: "json",
//     //     success: function(res) {
//     //     console.log(res);
//     //       var opdfViewer = new PDFViewer();
//     //     this.getView().addDependent(opdfViewer);
//     //     var sSource = res;
//     //     opdfViewer.setSource(sSource);
//     //     opdfViewer.setTitle( "My PDF");
//     //     opdfViewer.open();
//     //     }, error: function(oError){
//     //         console.log(oError);
//     //     }
//     // });

//         //var Url="SPA_DMS/browser/abc2aa84-8193-48e8-9cea-97d397d39047/root/1";
//         window.open(Url);

//           //   var opdfViewer = new PDFViewer();
//           // this.getView().addDependent(opdfViewer);
//           // // var sServiceURL = this.getView().getModel().sServiceUrl;
//           // var sSource = "SPA_DMS/browser/abc2aa84-8193-48e8-9cea-97d397d39047/root/1";
//           // opdfViewer.setSource(sSource);
//           // opdfViewer.setTitle( "My PDF");
//           // opdfViewer.open();

// },


      onDownloadFile:function() {
            var index = this.getView().byId("FilesIdTable")._oItemNavigation.iFocusedIndex;
            var reqIndex = index -1;
            var fileName = this.getView().byId("FilesIdTable").getItems()[reqIndex].mAggregations.cells[2].mProperties.text;
            var xhr = new XMLHttpRequest();
            xhr.withCredentials = false;

              xhr.addEventListener("readystatechange", function () {
                if (this.readyState === this.DONE) {
                  var downloadLink = document.createElement("a");
                  downloadLink.href = window.URL.createObjectURL(this.response);
                  downloadLink.download = fileName;
                  downloadLink.style.display = "none";
                  document.body.appendChild(downloadLink);
                  downloadLink.click();
                  document.body.removeChild(downloadLink);
                }
              });
              var url = "SPA_DMS/browser/" + this.sRepoPath + "/root/" + this.folderName + "/" + fileName;
              // var url= "SPA_DMS/browser/17e70dca-ff36-4542-9f74-c5a13c2d12c4/root/1/"+ fileName;
              xhr.open("GET", url);
              xhr.responseType = "blob";
              xhr.send();
      },


     











    });
}
);
