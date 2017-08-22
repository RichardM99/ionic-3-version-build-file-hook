var fs = require('fs'),
    xml2js = require('xml2js'),
    moment = require('moment'),
    parser = new xml2js.Parser();

logMessage('Running scripts/appAfterBuild.js...');
logMessage('Incrementing version number for main.js file...');

// read config.xml file
fs.readFile('./config.xml', 'utf8', function(err, data) {
    
    if (err) return logMessage('Could not read config.xml file. The following error occured:', err);
    
    // store original config.xml file
    var xmlOrig = data;

    // parse config.xml file
    parser.parseString(data, function (err, result) {
        
      if (err) return logMessage('Could not parse config.xml file. The following error occurred:', err);
      
      // get the current <version> value for platform browser from config.xml
      if (!result['widget']['platform'][2]['version']) return logMessage('ERROR:', 'Could not find <version> node for platform browser in config.xml');

      var currentVersion = result['widget']['platform'][2]['version'][0]['$']['value'],
          newVersion;

      if (!currentVersion) return logMessage('ERROR:', 'Could not find value for <version> node for platform browser in config.xml');

      // increment current version to create new version
      newVersion = (parseInt(currentVersion) + 1).toString();
       
      // get our index.html page where main.js is loaded
      var indexOrig = fs.readFileSync('./platforms/browser/www/index.html', 'utf8');
      
      // regex to match main.js with version number e.g. main.js?v=1, main.js?v=2 etc ... 
      var pattern = /(main\.js\?v=)\d+/;

      // regex to match main.js without version number e.g. main.js.
      // will be used on first build as the main.js will not have a version number at this point
      if (!pattern.test(indexOrig)) pattern = /(main\.js)/;
      
      if (!pattern.test(indexOrig)) return logMessage('ERROR:','Regex failed to find main.js file in ../platforms/browser/www/index.html');
      
      // create new index page from the old index page with the new version number added to the main.js file
      var indexNew = indexOrig.replace(pattern, 'main.js?v=' + newVersion);
      
      // replace the original index.html file with our new one
      try {
        fs.writeFileSync('./platforms/browser/www/index.html', indexNew, 'utf8');
        logMessage('main.js file in /platforms/browser/www/index.html is now main.js?v=' + newVersion);
      } catch (err) {
        return logMessage('Could not save new index.html file. The following error occured:', err);
      }
     
      // regex to match <version name="AppVersion" value="5" /> node in config.xml
      pattern = /(<version name="AppVersion" value="\d+")/;

      if (!pattern.test(xmlOrig)) return logMessage('ERROR:','Regex failed to find <version> node in platform browser from config.xml');

      // create new config.xml file from the old config.xml file with the new version number added to the platform browser version node
      var xmlNew = xmlOrig.replace(pattern, '<version name="AppVersion" value="' + newVersion + '"' ); 

      // replace the original config.xml file with our new one
      try {
        fs.writeFileSync('./config.xml', xmlNew, 'utf8');
        logMessage('<version> node value for platform browser in config.xml is now ' + newVersion);
      } catch(err) {
        return logMessage('Could not save new config.xml file. The following error occured:', err);
      }

      logMessage('Complete: scripts/appAfterBuild.js');

    });
});

function logMessage(text,err) {
  console.log(getTime() + ' ' + text);
  if (err) console.log('\n' + err);
}

function getTime() {
  return '[' +  moment().format('h:mm:ss') + ']';
}