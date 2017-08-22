# ionic-3-version-build-file-hook
A Cordova hook to version your *main.js* file post build

## Requirments
* Node Package Manager (NPM)
* Ionic Framework

## Overview
Using the following command to build your Ionic 3 project for production

**ionic cordova build browser --prod**

a *main.js* file is created in your *platforms/browser/www/build/* directory. If a user has already visited/used your application, the browser will not download the newly created file upon subsequent visits as it will have already been cached. As a result, the user will need to clear their browser cache in order to see any changes that have been made. 

In order to ensure the browser downloads each new build file, we can add a version number like so

**main.js?v=1**

The *appAfterBuild.js* script in this repo automatically adds a version number to your *main.js* file after your build completes. It parses *config.xml*, looks for the *version* node in platform browser, increments it's value by one, and tacks it on to your main.js file as the version number ('v').

## How To Use

### In an Ionic Project

**Note:** This is assuming you have added the browser platform to your project. 

* Place the scripts folder in your root directory 
* Make sure your platform browser node in *config.xml* includes the following

```html
 <hook src="scripts/appAfterBuild.js" type="after_build" />
 <version name="AppVersion" value="1" />
```

* After your browser build finishes, the script will run automatically. 
* If you want to test or use without having to wait for a build to finish, you can simply run

**node scripts/appAfterBuild.js**

from the root directory. This is assuming there is already a browser build in your *platforms/* directory.






