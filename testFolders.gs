function createTestFolders() {
  //  initParent just needs to be the id of the folder in which you're going to start making your
  //  test folders.
  var initParent = "1aEhlLqFOhntEeYpJ7123456789";
  Looper(initParent);
}

function Looper(folder){
  for(i=0;i<300;i++){
    var folder = subFolder(folder,i);
  }
};

function subFolder(parentId,i){
  var parentFolder = DriveApp.getFolderById(parentId);
  var folder=parentFolder.createFolder("testFolder_"+i);
  parentFolder.createFile('First Text File', 'Hello, world');
  parentFolder.createFile('Second New Text File', 'Hello, world yet again ');
  folder.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
  folder.setShareableByEditors(false);
  return folder.getId();  
}