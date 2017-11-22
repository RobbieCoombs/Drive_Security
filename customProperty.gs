function getFolder() {
  
  //  folderId is the high-level folder you want to apply settings to.  Can be found in the address bar of the browser 
  //  when the folder is opened. eg: https: drive.google.com/drive/u/1/folders/00-1234567890abcdefg
  var folderId = "1aEhlLqFOhntEeYpJ7lG8a8qX5l60xexw";
  
  //  This can be "serviceAccountResource" or "serviceAccountResource_shared".  You can choose other names, just update the rest
  //  of the script code to reflect any name change you make.  Find and replace will do the trick if you want to change the name,
  //    though the file custom property isn't visible to end-users anyway.  
  var custProp = "serviceAccountResource";
  
  var folder = DriveApp.getFolderById(folderId);
  
  addCustomProperty(folderId,custProp);
  Logger.log(folder.getName() + " now has the custom property of "+custProp);
}

function addCustomProperty(folderId,key) {
  var property = {
    key: key,
    value: 'true',
    visibility: 'PUBLIC'
  }
  Drive.Properties.insert(property, folderId);
}