sap.ui.define(["sap/ui/core/mvc/Controller","../model/formatter","sap/m/PDFViewer","sap/ui/core/format/DateFormat","sap/ui/core/Fragment","sap/ui/core/util/File","sap/m/MessageBox","sap/ui/core/routing/History","sap/ui/core/UIComponent"],function(e,t,o,a,s,r,i,n,c){"use strict";return e.extend("com.ns.dmsfioriapp.controller.files",{formatter:t,onInit(){var e=this;var t=sap.ui.core.UIComponent.getRouterFor(this);t.getRoute("files").attachPatternMatched(this._onObjectMatched,this);t.getRoute("files").attachPatternMatched(this.onDownloadFile,this)},_onObjectMatched:function(e){var t=this;this.sRepoPath=e.getParameter("arguments").RepoID;this.folderName=e.getParameter("arguments").folderNm;var o="SPA_DMS/browser/"+this.sRepoPath+"/root/"+this.folderName+"";$.ajax({url:o,type:"GET",dataType:"json",success:function(e){console.log(e);var o=new sap.ui.model.json.JSONModel({Array:e});t.getView().setModel(o,"NewModel");var a=[];for(let t=0;t<e.objects.length;t++){var s={objectTypeId:e.objects[t].object.properties["cmis:objectTypeId"].value,name:e.objects[t].object.properties["cmis:name"].value,createdBy:e.objects[t].object.properties["cmis:createdBy"].value,creationDate1:e.objects[t].object.properties["cmis:creationDate"].value,lastModifiedBy:e.objects[t].object.properties["cmis:lastModifiedBy"].value,owner:e.objects[t].object.properties["sap:owner"].value};a.push(s)}var r=new sap.ui.model.json.JSONModel({dataArray:a});t.getView().setModel(r,"FileModel")},error:function(e){console.log(e)}})},onUplaodfile:function(e){var t=this.getView();if(!this.byId("DialogId3")){s.load({id:t.getId(),name:"com.ns.dmsfioriapp.view.Document",controller:this}).then(function(e){t.addDependent(e);e.open()})}else{this.byId("DialogId3").open()}},onCloseDoc:function(e){this.byId("DialogId3").destroy()},handleUploadComplete:function(e){var t=this.getView().byId("fileUploader").getValue();var o=new FormData;var a=this;o.append("cmisaction","createDocument");o.append("propertyId[0]","cmis:name");o.append("propertyValue[0]",t);o.append("propertyId[1]","cmis:objectTypeId");o.append("propertyValue[1]","cmis:document");o.append("_charset","UTF-8");var s=new XMLHttpRequest;s.withCredentials=false;s.addEventListener("readystatechange",function(){if(this.readyState===this.DONE){console.log(this.responseText);sap.m.MessageBox.success("File Uploaded Successfully");a.onRefresh()}});s.addEventListener("error",function(e){sap.m.MessageBox.error("Error Uploading File: "+e)});s.open("POST","SPA_DMS/browser/"+this.sRepoPath+"/root/"+this.folderName+"");s.setRequestHeader("DataServiceVersion","2.0");s.setRequestHeader("Accept","application/json");s.send(o);this.byId("DialogId3").destroy()},handleUploadPress:function(){var e=this.byId("fileUploader");if(e){e.checkFileReadable().then(function(){e.upload()},function(e){sap.m.MessageToast.show("The file cannot be read. It may have changed.")})}},onRefresh:function(e){var t=this;var o="SPA_DMS/browser/"+this.sRepoPath+"/root/"+this.folderName+"";$.ajax({url:o,type:"GET",dataType:"json",success:function(e){console.log(e);var o=new sap.ui.model.json.JSONModel({Array:e});t.getView().setModel(o,"NewModel");var a=[];for(let t=0;t<e.objects.length;t++){var s={objectTypeId:e.objects[t].object.properties["cmis:objectTypeId"].value,name:e.objects[t].object.properties["cmis:name"].value,createdBy:e.objects[t].object.properties["cmis:createdBy"].value,creationDate1:e.objects[t].object.properties["cmis:creationDate"].value,lastModifiedBy:e.objects[t].object.properties["cmis:lastModifiedBy"].value,owner:e.objects[t].object.properties["sap:owner"].value};a.push(s)}var r=new sap.ui.model.json.JSONModel({dataArray:a});t.getView().setModel(r,"FileModel")},error:function(e){console.log(e)}})},onDownloadFile:function(){var e=this.getView().byId("FilesIdTable")._oItemNavigation.iFocusedIndex;var t=e-1;var o=this.getView().byId("FilesIdTable").getItems()[t].mAggregations.cells[2].mProperties.text;var a=new XMLHttpRequest;a.withCredentials=false;a.addEventListener("readystatechange",function(){if(this.readyState===this.DONE){var e=document.createElement("a");e.href=window.URL.createObjectURL(this.response);e.download=o;e.style.display="none";document.body.appendChild(e);e.click();document.body.removeChild(e)}});var s="SPA_DMS/browser/"+this.sRepoPath+"/root/"+this.folderName+"/"+o;a.open("GET",s);a.responseType="blob";a.send()}})});
//# sourceMappingURL=files.controller.js.map