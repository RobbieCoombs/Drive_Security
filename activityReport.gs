activityReport = {
  
  init: function(){
    Logger.log("in the init");
    var result = function(previousToken){
      return AppsActivity.Activities.list({
        'source': 'drive.google.com',
        'drive.ancestorId': 'root',
        'fields': 'activities(combinedEvent(primaryEventType,user,eventTimeMillis,target,move))',
        'groupingStrategy': 'none',
        'pageToken':previousToken
      });
    }();
    this.filterActivities(result.activities);
    var token = result.nextPageToken;
    while (token){
      var newResult = result(token);
      var activities = newResult.activities;
      var token = newResult.nextPageToken;
      this.filterActivities(activities);
    }
  },
  
  filterActivities: function(activities){
    //eventTypes are events that we care to track because they signify an addition to the Drive structure.
    var eventTypes = "create upload";
    var cleanArray = activities.filter(function(eventData){
      //      the initTime-600000 will filter based on an automated trigger of 10 minutes.  Change the 600000 number
      //      if you're going to modify the frequency of the trigger.
      return (eventData.combinedEvent.eventTimeMillis > DriveEnterprise.initTime-600000 && (eventTypes.indexOf(eventData.combinedEvent.primaryEventType) >= 0));
    }).forEach(function (value){
      var currentResourceParent = DriveApp.getFolderById(value.combinedEvent.move.addedParents[0].id)
      var currentResourceProperties = {};
      currentResourceProperties.Resource = DriveApp.getFileById(value.combinedEvent.target.id);
      currentResourceProperties.shareStatus = DriveEnterprise.serviceAccount.sharePermissionsCheck(currentResourceParent);
      currentResourceProperties.Id = value.combinedEvent.target.id; 
      currentResourceProperties.Owner = this.getCurrentOwnerEmail(value.combinedEvent);;
      DriveEnterprise.serviceAccount.transferer(currentResourceProperties);
    },this);
    return;
  },
  
  getCurrentOwnerEmail: function(combinedEvent){
    var email = Drive.Permissions.get(combinedEvent.target.id, combinedEvent.user.permissionId);
    return email.emailAddress;
  }
  
}

