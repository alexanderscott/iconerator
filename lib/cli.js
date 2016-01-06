"use strict";

var iconerator = require('../lib/iconerator'),
    fs = require('fs'),
    commander = require('commander'),
    path = require('path'),
    packageJson = require(path.join(__dirname, '..', 'package.json')),
    platform, device;

commander
    .version(packageJson.version)
    .usage('[options] <file ...> <output directory ...>') 
    .option('--only-ios', 'Only generate iOS icons')
    .option('--only-android', 'Only generate Android icons')
    .option('--only-iphone', 'Only generate iPhone icons')
    .option('--only-ipad', 'Only generate iPad icons')
    .option('--only-web', 'Only generate Web icons')
    .parse(process.argv);

var inputImage = path.resolve(process.cwd(), commander.args[0]);
var outputPath = (commander.args[1] && 
                  fs.statSync(path.resolve(process.cwd(), commander.args[1])).isDirectory()) ? 
                    path.resolve(process.cwd(), commander.args[1]) : 
                      process.cwd();

// Establish and clean input file & output path
if(outputPath.slice(-1) !== '/') outputPath += '/';

// Check input file existence
if(!inputImage || !fs.statSync(inputImage).isFile()){
    console.error("Must reference a valid image in order to generate icons");
    process.exit(1);
}

// Create output directory structure
if(!commander.onlyIos && !commander.onlyIphone && !commander.onlyIpad) {
    iconerator.createAndroidIconFolders(outputPath);
    iconerator.createWebIconFolders(outputPath);
}

if(!commander.onlyAndroid) {
    iconerator.createIOSIconFolders(outputPath);
    iconerator.createWebIconFolders(outputPath);
}

if(!commander.onlyWeb) {
    iconerator.createIOSIconFolders(outputPath);
    iconerator.createAndroidIconFolders(outputPath);
}


// Populate iconMeta array from any parsed cmd line options
if(commander.onlyIos) {
    platform = 'ios';
} else if(commander.onlyIphone) {
    platform = 'ios';
    device = 'phone';
} else if(commander.onlyIpad) {
    platform = 'ios';
    device = 'tablet';
} else if(commander.onlyAndroid) {
    platform = 'android';
} else if(commander.onlyWeb) {
    platform = 'web';
}

iconerator.checkDependencies(function(err){
    if(err){
        console.error(err);
        process.exit(1);
    }
    iconerator.generateIcons(inputImage, outputPath, platform, device, function(err){
        if(err){
            console.error(err);
            process.exit(1);
        }
        console.log("Successfully generated app icon images in ", outputPath);
    }); 
});

