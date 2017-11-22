DriveEnterprise.Properties = {
  
  PRIVATE_KEY     : '-----BEGIN PRIVATE KEY-----\nabcdefghijklmnopqrstuvwxyz123135135\n-----END PRIVATE KEY-----\n',
  CLIENT_EMAIL    : 'drivetransfer-v1@project-id-1234567890.iam.gserviceaccount.com',
  scriptProperties: PropertiesService.getScriptProperties(),
  getPrivateKey: function(){
    return this.PRIVATE_KEY;
  },
  getClientEmail: function(){
    return this.CLIENT_EMAIL;
  },
  getProperty:function(string){
    return this.scriptProperties.getProperty(string);
  },
  setProperty:function(string,iterator){
    return this.scriptProperties.setProperty(string,iterator);
  },
  getActiveAdmin :function(){
    return Session.getActiveUser().getEmail();
  },  
  getCurrentTime: function(){
    return Date.now();
  },
  deleteProperty: function(string){
    this.scriptProperties.deleteProperty(string);
  },
  getFolderIterator: function(folderToken){
    var iterator = (folderToken === null) ? DriveApp.searchFolders("properties has {key='serviceAccountResource' and value='true' and visibility='PUBLIC'} or properties has {key='serviceAccountResource_shared' and value='true' and visibility='PUBLIC'} and trashed=false") : DriveApp.continueFolderIterator(folderToken);
    return iterator;
  },
},
  DriveEnterprise.Util = {
    
    extend: function (dest) {
      var sources = Array.prototype.slice.call(arguments, 1);
      sources.forEach(function (source) {
        Object.keys(source).forEach(function (key) {
          dest[key] = source[key];
        });
      });
      return dest;
    },
    
    getService: function(currentOwner) {
      return OAuth2.createService('GoogleDrive:' + currentOwner)
      // Set the endpoint URL.
      .setTokenUrl('https://accounts.google.com/o/oauth2/token')
      
      // Set the private key and issuer.
      .setPrivateKey(DriveEnterprise.Properties.PRIVATE_KEY)
      .setIssuer(DriveEnterprise.Properties.CLIENT_EMAIL)
      
      // Set the name of the user to impersonate. This will only work for
      // Google Apps for Work/EDU accounts whose admin has setup domain-wide
      // delegation:
      // https://developers.google.com/identity/protocols/OAuth2ServiceAccount#delegatingauthority
      .setSubject(currentOwner)
      
      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getScriptProperties())
      
      // Set the scope. This must match one of the scopes configured during the
      // setup of domain-wide delegation.
      .setScope('https://www.googleapis.com/auth/drive');
    } 
    
  }
  
