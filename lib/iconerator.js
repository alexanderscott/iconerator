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
if(outputPath.slice(-1) !== '/') outputPath += '/';

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
//gm( inputImage )
    //.format( function(err, value){
        //console.log(value);
        //if(value !== 'png') gm( inputImg ).write(img + '.png');
    //});

// Populate iconMeta array from any parsed cmd line options
if(commander.onlyIos) {
    //iconMeta = _.map(config.icons, function(iconMeta){ if(iconMeta.platform === 'iOS') return iconMeta; });
    iconMeta = _.where( config.icons, { platform: 'iOS' } );
} else if(commander.onlyIphone) {
    iconMeta = _.where( config.icons, { platform: 'iOS', device: 'phone' } );
} else if(commander.onlyIpad) {
    iconMeta = _.where( config.icons, { platform: 'iOS', device: 'tablet' } );
} else if(commander.onlyAndroid) {
    iconMeta = _.where( config.icons, { platform: 'Android' } );
} else {
    iconMeta = config.icons;
}



// Create output directory structure
if( !commander.onlyIos && !commander.onlyIphone && !commander.onlyIpad) {
    var baseDir = outputPath + config.output.androidDir;
    var dirs = [ '', '/res', '/res/drawable-hdpi', '/res/drawable-ldpi', '/res/drawable-mdpi', '/res/drawable-xhdpi', '/res/drawable-xxhdpi'];
    
    for(var i = 0; i < dirs.length; i++){
        if( ! fs.existsSync( baseDir + dirs[i] ) ) fs.mkdirSync( baseDir + dirs[i] );
    }
}
if( !commander.onlyAndroid) {
    if( ! fs.existsSync( outputPath + config.output.iosDir ) ) {
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
        outputFile = outputPath + config.output.iosDir + '/'+ meta.file_name;
    } else if(meta.platform === 'Android'){
        if(meta.type === 'Launcher Icon') 
            outputFile = outputPath + config.output.androidDir + '/res/drawable-'+meta.resolution+'/'+meta.file_name;
        else outputFile = outputPath + config.output.androidDir + '/' + meta.file_name;
    }

    gm( inputImage )
        .resize( meta.width, meta.height )
        .write( outputFile, function(err){
           if(err) console.log("Error generating icon: ", meta); 
           else console.log("Generated %s (res: %s) icon: %s", meta.platform, (meta.resolution || ''), meta.file_name);
        });

});
