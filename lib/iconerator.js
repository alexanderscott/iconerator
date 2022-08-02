"use strict";

var fs = require('fs'),
    path = require('path'),
    gm = require('gm'),
    im = require('imagemagick'),
    async = require('async'),
    _ = require('underscore'),
    child_process = require('child_process'),
    config = require(__dirname+'/config');


function createWebIconFolders(outputPath) {
    if(!fs.existsSync(path.join(outputPath, config.output.webDir))) {
        fs.mkdirSync(path.join(outputPath, config.output.webDir));
    }
};

function createAndroidIconFolders(outputPath) {
    var baseDir = path.join(outputPath, config.output.androidDir);
    var dirs = [
        '',
        '/res',
        '/res/drawable-ldpi',
        '/res/drawable-mdpi',
        '/res/drawable-hdpi',
        '/res/drawable-xhdpi',
        '/res/drawable-xxhdpi',
        '/res/drawable-xxxhdpi',
        '/res/mipmap-ldpi',
        '/res/mipmap-mdpi',
        '/res/mipmap-hdpi',
        '/res/mipmap-xhdpi',
        '/res/mipmap-xxhdpi',
        '/res/mipmap-xxxhdpi'
    ];

    for(var i = 0; i < dirs.length; i++){
        if(!fs.existsSync(path.join(baseDir, dirs[i]))) fs.mkdirSync(baseDir + dirs[i]);
    }
};

function createIOSIconFolders(outputPath) {
    if(!fs.existsSync(path.join(outputPath, config.output.iosDir))) {
        fs.mkdirSync(path.join(outputPath, config.output.iosDir));
    }
};

exports.checkDependencies = function(cb) {
    child_process.exec("/usr/bin/type convert", function(err, stdout){
        if(err || stdout === "") return cb("ImageMagick binary not found");
        child_process.exec("/usr/bin/type gm", function(err, stdout){
            if(err || stdout === "") return cb("GraphicsMagick binary not found");
            cb(null);
        });
    });
};

exports.generateIcons = function(inputImg, outputPath, platform, device, cb) {
    var iconMeta = config.icons,
    error;

    if(!fs.statSync(inputImg).isFile()){
       error = new Error("Input image not found: " + inputImg);
       if(cb) return cb(error);
       else throw error;
    }

    if(platform === "ios") {
        if(device === "phone") iconMeta = _.where(config.icons, { platform: 'iOS', device: 'phone' });
        else if(device === "tablet") iconMeta = _.where(config.icons, { platform: 'iOS', device: 'tablet' });
        else iconMeta = _.where(config.icons, { platform: 'iOS' });

        createIOSIconFolders(outputPath);
    } else if(platform === "android") {
        iconMeta = _.where(config.icons, { platform: 'Android' });
        createAndroidIconFolders(outputPath);
    } else if(platform === "web") {
        iconMeta = _.where(config.icons, { platform: 'Web' });
        createWebIconFolders(outputPath);
    } else {
        createAndroidIconFolders(outputPath);
        createWebIconFolders(outputPath);
        createIOSIconFolders(outputPath);
    }


    async.each(iconMeta, function(meta, cb){
        var outputFile;
        if(meta.platform === 'iOS'){
            outputFile = path.join(outputPath, config.output.iosDir, meta.file_name);
        } else if(meta.platform === 'Android'){
            if(meta.type === 'Launcher Icon')
                outputFile = path.join(outputPath, config.output.androidDir, 'res', 'drawable-' + meta.resolution, meta.file_name);
            else outputFile = path.join(outputPath, config.output.androidDir, meta.file_name);
        } else if(meta.platform === 'Web'){
            outputFile = path.join(outputPath, config.output.webDir, meta.file_name);
        }

        if(meta.platform == 'Web') {
            im.convert([inputImg, '-bordercolor', 'white', '-border', '0', '-alpha', 'off', '-colors', '256', '-resize', meta.width+'x'+meta.height, outputFile], function(err){
               if(err) {
                   console.error("Error generating %s (res: %s) icon: %s:: %s", meta.platform, (meta.resolution || ''), meta.file_name, err);
                   return cb(error);
               } else {
                    //console.log("Generated %s (res: %s) icon: %s", meta.platform, (meta.resolution || ''), meta.file_name);
                   cb(null);
               }
            });
        } else {
            gm(inputImg)
              .background('none')
              .noProfile()
              .resize(meta.width, meta.height)
              .gravity('Center')
              .extent(meta.width, meta.height)
              .quality(100)
              .write(outputFile, function(err){
                 if(err) {
                     console.error("Error generating %s (res: %s) icon: %s:: %s", meta.platform, (meta.resolution || ''), meta.file_name, err);
                     return cb(error);
                 } else {
                      //console.log("Generated %s (res: %s) icon: %s", meta.platform, (meta.resolution || ''), meta.file_name);

                     // Copy android drawable files to mipmap dirs
                     if(meta.platform === 'Android' && meta.type === 'Launcher Icon'){
                        var drawableOutputFile = path.join(outputPath, config.output.androidDir, 'res', 'drawable-' + meta.resolution, meta.file_name);
                        var mipmapOutputFile = path.join(outputPath, config.output.androidDir, 'res', 'mipmap-' + meta.resolution, meta.file_name);
                        fs.copyFileSync(drawableOutputFile, mipmapOutputFile);
                     }

                     cb(null);
                 }
              });
        }
    }, function(err){
        if(err){
            if(cb) return cb(err);
            else throw err;
        }
        if(cb) cb(null);
    });
};
