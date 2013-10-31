var fs = require('fs'),
    commander = require('commander'),
    gm = require('gm'),
    config = require('./config'),
    inputImage, 
    outputPath;

commander
    .version('0.1.0')
    .usage('[options] <file ...> <output directory ...>') 
    .option('--only-ios', 'Only generate iOS icons')
    .option('--only-android', 'Only generate Android icons')
    .option('--only-iphone', 'Only generate iPhone icons')
    .option('--only-ipad', 'Only generate iPad icons')
    .parse(process.argv);


inputImage = commander.args[0] || null;
outputPath = commander.args[1] || './';

// Check input & output file/directory existence
if(!inputImage){
    commander.prompt("Image template (ex/ image.png): ", function(image){
        if(fs.existsSync(image)){
            inputImage = image;
        } else {
            console.log("Cannot find template image");
            process.exit();
        }
    });
}


console.log(inputImage);
