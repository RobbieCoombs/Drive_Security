var _ = Underscore.load();
var DriveEnterprise = {
  
  init: function(){
    this.initTime = this.Properties.getCurrentTime();
    this.activeAdmin = this.Properties.getActiveAdmin();
    this.serviceAccount = Object.create(serviceAccount);
    this.folderToken = this.Properties.getProperty('folderToken');
    var modeChecker = (this.folderToken === "finished") ? this.loadActivityReport() : this.loadDriveTransfer();
  },
  
  loadActivityReport: function(){
    this.activityReport = Object.create(activityReport);
    this.activityReport.init();
  },
  
  loadDriveTransfer: function(){
    var folderIterator = DriveEnterprise.Properties.getFolderIterator(this.folderToken); //return an interator for either first-runtime or a continuation from the previous execution.
    
    while(folderIterator.hasNext()){
      if (Date.now()-this.initTime>350000) {
        break;
      }
      var currentFolder = folderIterator.next();
      //      I considered putting the shareStatus in a higher scope than here but I'd like this one script to be capable
      //      of transferring content from both 'shareable' and 'non-shareable' resources.  Due to this it seems only
      //      possible to lookup the parent folder's share permissions and then hand that down each time.
      var shareStatus = this.serviceAccount.sharePermissionsCheck(currentFolder);
      
      //      I haven't tested, but my thinking here was to call the getFiles using a variable due to hoisting.
      //      We don't actually need a return value, but we want getFiles to be called before getFolders since
      //      getFolders will be recursive and may use up the execution window.  Could be mistaken, but no harm done
      //      using a variable just in case.
      var files = this.getFiles(currentFolder,shareStatus);
      
      //      Using a variable to start transferring all subfolders specifically because we need to return a continuation token.
      var folderProgress = this.getSubFolders(currentFolder, shareStatus);
    }
    
    this.Properties.setProperty("folderToken", folderProgress);   
  },
  
  getFiles: function (currentFolder, boolean){
    var fileIterator = currentFolder.getFiles();
    this.iteratorProcessor(fileIterator,boolean);  
  },
  
  getSubFolders: function(currentFolder,boolean){
    var subFolders = currentFolder.getFolders();
    return this.iteratorProcessor(subFolders, boolean, "folder");
  },
  
  iteratorProcessor : function(iterator,shareStatus,type){
    while (iterator.hasNext()){
      if (Date.now()-this.initTime>350000) {
        return iterator.getContinuationToken();
      }
      var currentResource = iterator.next();
      this.createTransferObject(currentResource,shareStatus);
      if (type === "folder"){
        this.getFiles(currentResource,shareStatus);
        this.getSubFolders(currentResource,shareStatus); 
      }
    }
    return "finished";
  },
  
  createTransferObject : function(currentResource, shareStatus){
    var currentResourceOwner = currentResource.getOwner().getEmail();
    if (currentResourceOwner != this.activeAdmin){
      var currentResourceProperties = {};
      currentResourceProperties.Id = currentResource.getId();
      currentResourceProperties.Resource = currentResource;
      currentResourceProperties.shareStatus =  shareStatus;
      currentResourceProperties.Owner = currentResourceOwner;
      return this.serviceAccount.transferer(currentResourceProperties);
    }
    return
  }
}

function trigger(){
  DriveEnterprise.init();
}
