# Google Drive Integrity
A Google Apps Script for centrally managing a Google Drive directory structure.  

## What does this do?
Essentially this script can do 2 things:
* 1: Transfer an entire directory (including any and all files and subfolders no matter how deep) to an admin account for safe keeping.  The owners of a resource will still retain edit access, likewise other users with their existing access.
* 2: Every 10 minutes the script will transfer ownership over any new content which users add to the admin managed directory structure.

## Why is this useful?
Team Drive brought a number of improvement to maintaining the integrity of Drive content for small to medium teams, but it falls short for broader enterprise purposes.  Often more fidelity is neded over folder settings, and many organisations depend on large nested folder structures to maintain logical hierarchy of widely used content.  It's been some months since I looked closely at Team Drive, but at the time there were a number of concerns around its suitability for enterprise purposes.  Some included;
* Inability to prevent link-sharing of resources to anyone in the domain.
* Accidentally adding of the wrong content into a Team Drive requires an administrator to resolve.
* Individuals with 'view' access can still make copies and move Team Drive files from within GSuite Apps (right-click from Drive and open in Docs, then make copy from File menu)
* Being added to dozens of Team Drive folders becomes unwieldy

## How does the script work?
Upon first runtime, an administer tags a top-level folder with a [custom property](https://developers.google.com/drive/v3/web/properties)for the script to start tunnelling down through.  Using a [service account](https://developers.google.com/identity/protocols/OAuth2ServiceAccount#creatinganaccount), the script is then able to recursively go down through that directory and transfer all folders/files to an appointed account. As part of this transferring, the script will also remove the ability for editors to share the file/folder with other users, and will turn off link-sharing.

The script will continue to run every 10 minutes and transfer every file and folder which is a descendent of the originally tagged folder.  Once that has finished, the script will then use the [Activity Apps API](https://developers.google.com/google-apps/activity/v1/reference/) every 10 minutes to get a list of any recently uploaded/created content anywhere in the directory structure, and will transfer all new content as well.

Also included in this repo is a little script which creates 60 or so nested folders with some dummy files so you can safely tinker away.

# Setup
1. Create the [service account](https://developers.google.com/identity/protocols/OAuth2ServiceAccount#creatinganaccount).
1. Create a central account that will be own all the Drive content.  It's just a normal GSuite user account (Drive.Admin@YourOrg.com) etc.
1. Have the current owner of the top-level folder you want to manage, transfer ownership of that folder to the central account
1. Log in as the central account and create a Google Apps Script and copy in all the .gs files from this repo into it.
	1. Add [this library](https://github.com/googlesamples/apps-script-oauth2) as well as [this library](https://github.com/simula-innovation/gas-underscore) to the script. Side note: I'm being unjustifiably lazy including Underscore.js here, so I'll likely remove this dependency shortly.
	1. Within Properties.gs add the Private Key from the [Script Project](https://developers.google.com/apps-script/guides/cloud-platform-projects#accessing_an_apps_script_cloud_platform_project) and the Client email of the service account.
	1. (Optional) Use the testFolders.gs to spam up a pseudo-directory structure to test the script with.
	1. Use customProperty.gs to tag the high-level folder you want the script to start tunneling dowm from.
	1. Create a project trigger to run function trigger() every 10 minutes

