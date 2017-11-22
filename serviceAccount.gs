serviceAccount = {
  
  transferer: function(resource){
    var currentResourceService = DriveEnterprise.Util.getService(resource.Owner);
    if (currentResourceService.hasAccess()) {
      var token = currentResourceService.getAccessToken();
      var currentResource = resource.Resource;
      var admin = DriveEnterprise.activeAdmin;
      var getFullResults = this.getAPIoptions("https://www.googleapis.com/drive/v2/files/"+resource.Id+"/permissions/","GET",DriveEnterprise.activeAdmin,token);
      var result =  JSON.parse(getFullResults.getContentText());
      var serviceAccountPermissionId = _.result(_.find(result.items,{"emailAddress":DriveEnterprise.activeAdmin}),'id');
      var isCurrentUserOnPermissionList = (serviceAccountPermissionId != undefined) ? this.getAPIoptions('https://www.googleapis.com/drive/v2/files/'+resource.Id+'/permissions/'+serviceAccountPermissionId+'?transferOwnership=true',"PUT",DriveEnterprise.activeAdmin,token) : this.getAPIoptions('https://www.googleapis.com/drive/v2/files/'+resource.Id+'/permissions/?sendNotificationEmails=false',"POST",DriveEnterprise.activeAdmin,token);
      currentResource.setShareableByEditors(resource.shareStatus);
      currentResource.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE); 
      this.addCustomProperty(resource);
      this.reset(resource.Owner);
      return;
    }
    else{
      throw "Unable to obtain service account access.  Ensure file is owned by a user within your domain."
    }
  },
  
  getAPIoptions: function(url,method,serviceAccount,token){
    var url = url;
    var payload = {
      role:'owner',
      type:'user',
      value: serviceAccount
    }
    var options = {
      headers: {
        Authorization: 'Bearer ' + token
      },
      muteHttpExceptions: true,
      payload:JSON.stringify(payload),
      method: method,
      contentType: 'application/json'
    }
    return UrlFetchApp.fetch(url, options);
  },
  
  sharePermissionsCheck: function(currentResource){
    var shareStatus = currentResource.isShareableByEditors();
    return shareStatus;
  },
  
  addCustomProperty: function(resource) {
    var currentKey = (resource.shareStatus===true) ? "serviceAccountResource_shared":"serviceAccountResource";
    var property = {
      key: currentKey,
      value: 'true',
      visibility: 'PUBLIC'
    }
    return Drive.Properties.insert(property, resource.Id);
  },
  
  reset: function(resourceOwner) {
    var service = DriveEnterprise.Util.getService(resourceOwner);
    service.reset();
  },
}