var fs = require('fs'),
    commander = require('commander'),
    gm = require('gm'),
    _ = require('underscore'),
    config = require('./config'),

    inputImage, 
    outputPath, iconMeta;

commander
    .version('0.1.0')
    .usage('[options] <file ...> <output directory ...>') 
    .option('--only-ios', 'Only generate iOS icons')
    .option('--only-android', 'Only generate Android icons')
    .option('--only-iphone', 'Only generate iPhone icons')
    .option('--only-ipad', 'Only generate iPad icons')
    .parse(process.argv);


inputImage = (commander.args[0] && fs.statSync( commander.args[0] ).isFile()) ? commander.args[0] : null;
outputPath = (commander.args[1] && fs.statSync( commander.args[1] ).isDirectory()) ? commander.args[1] : './';

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

// Format the tpl image if it is not png
gm( inputImage )
    .format( function(err, value){
        if(value !== 'png') gm( img ).write(img + '.png');
    });

// Populate iconMeta array from any parsed cmd line options
if(commander.onlyIos) {
    //iconMeta = _.map(config.icons, function(iconMeta){ 
        //if(iconMeta.platform === 'iOS') return iconMeta; 
    //});
    iconMeta = _.where( config.icons, { platform: 'iOS' } );
} else if(commander.onlyAndroid) {
    iconMeta = _.where( config.icons, { platform: 'Android' } );
} else {
    iconMeta = config.icons;
}

// Create output directory structure
if( !commander.onlyIos) {
    if( ! fs.statSync( outputPath + config.output.androidDir ).isDirectory() ) {
        fs.mkdirSync( outputPath + config.output.androidDir );
        fs.mkdirSync( outputPath + config.output.androidDir + '/res' );
        fs.mkdirSync( outputPath + config.output.androidDir + '/res/drawable-hdpi' );
        fs.mkdirSync( outputPath + config.output.androidDir + '/res/drawable-ldpi' );
        fs.mkdirSync( outputPath + config.output.androidDir + '/res/drawable-mdpi' );
        fs.mkdirSync( outputPath + config.output.androidDir + '/res/drawable-xhdpi' );
        fs.mkdirSync( outputPath + config.output.androidDir + '/res/drawable-xxhdpi' );
    }
}
if( !commander.onlyAndroid) {
    if( ! fs.statSync( outputPath + config.output.iosDir ).isDirectory() ) {
        fs.mkdirSync( outputPath + config.output.iosDir );
    }
}


//var gmErrors = [];
//var gmSuccesses = [];
//var iconLogger = function(type, msg, i){
    
//};

iconMeta.forEach( function(meta, i, arr){
    var outputFile;
    if(meta.platform === 'iOS'){
        outputFile = outputPath + config.output.iosDir + meta.file_name;
    } else if(meta.platform === 'Android'){
        if(meta.type === 'Launcher Icon') 
            outputFile = outputPath + config.output.androidDir + '/res/drawable-'+meta.resolution+'/'+meta.file_name;
        else outputFile = outputPath + config.output.androidDir + meta.file_name;
    }

    gm( inputImage )
        .resize( meta.width, meta.height )
        .write( outputFile, function(err){
           if(err) console.log("Error generating icon: ", meta); 
           else console.log("Generated %s (%s) icon: %s", meta.platform, (meta.resolution || ''), meta.file_name);
        });

});
