"use strict";

var assert = require('assert'),
    fs = require('fs'),
    cp = require('child_process'),
    _ = require('underscore'),
    path = require('path'),
    config = require('../lib/config'),
    iconerator = require('../lib/iconerator'),
    testImg = path.resolve(__dirname, "./sliceisright.png"),
    outputPath = path.resolve(__dirname, "./output"),
    timeout = 3000;

describe('iconerator', function(){
    beforeEach(function(cb){
        cp.exec("rm -rf " + outputPath, function() {
            fs.mkdirSync(outputPath);
            cb();
        });
    });
    afterEach(function(cb){
        cb();
    });
    before(function(cb){
        fs.mkdir(outputPath, function() {
            cb();
        });
    });
    after(function(cb){
        cp.exec("rm -rf " + outputPath, function() {
            cb();
        });
    });

    /*
    it('can check dependencies', function(cb){
        this.timeout(timeout);
        iconerator.checkDependencies(function(err){
            assert.ifError(err);
            cb();
        });
    });
    */

    it('can generate all platform images and proper output directories', function(cb){
        this.timeout(timeout);
        iconerator.generateIcons(testImg, outputPath, null, null, function(err){
            assert.ifError(err);

            assert(fs.statSync(path.join(outputPath, config.output.iosDir)).isDirectory());
            assert(fs.statSync(path.join(outputPath, config.output.webDir)).isDirectory());
            assert(fs.statSync(path.join(outputPath, config.output.androidDir)).isDirectory());

            var iosIconMeta = _.where(config.icons, { platform: 'iOS' });
            for(var i = 0; i < iosIconMeta.length; i++){
                assert(fs.statSync(path.join(outputPath, config.output.iosDir, iosIconMeta[i].file_name)).isFile());
            }

            var webIconMeta = _.where(config.icons, { platform: 'Web' });
            for(var i = 0; i < webIconMeta.length; i++){
                assert(fs.statSync(path.join(outputPath, config.output.webDir, webIconMeta[i].file_name)).isFile());
            }

            var androidIconMeta = _.where(config.icons, { platform: 'Android' });
            for(var i = 0; i < androidIconMeta.length; i++){
                var meta = androidIconMeta[i];
                var outputFile;
                if(meta.type === 'Launcher Icon') 
                    outputFile = path.join(outputPath, config.output.androidDir, 'res', 'drawable-' + meta.resolution, meta.file_name);
                else outputFile = path.join(outputPath, config.output.androidDir, meta.file_name);
                assert(fs.statSync(outputFile).isFile());
            }

            cb();
        }); 
    });

    it('can generate only iOS images and proper output directories', function(cb){
        this.timeout(timeout);
        iconerator.generateIcons(testImg, outputPath, "ios", null, function(err){
            assert.ifError(err);

            assert(fs.statSync(path.join(outputPath, config.output.iosDir)).isDirectory());
            assert(!fs.existsSync(path.join(outputPath, config.output.androidDir)));
            assert(!fs.existsSync(path.join(outputPath, config.output.webDir)));

            var iconMeta = _.where(config.icons, { platform: 'iOS' });
            for(var i = 0; i < iconMeta.length; i++){
                assert(fs.statSync(path.join(outputPath, config.output.iosDir, iconMeta[i].file_name)).isFile());
            }
            cb();
        }); 
    });

    it('can generate only Web images and proper output directories', function(cb){
        this.timeout(timeout);
        iconerator.generateIcons(testImg, outputPath, "web", null, function(err){
            assert.ifError(err);

            assert(fs.statSync(path.join(outputPath, config.output.webDir)).isDirectory());
            assert(!fs.existsSync(path.join(outputPath, config.output.androidDir)));
            assert(!fs.existsSync(path.join(outputPath, config.output.iosDir)));

            var iconMeta = _.where(config.icons, { platform: 'Web' });
            for(var i = 0; i < iconMeta.length; i++){
                assert(fs.statSync(path.join(outputPath, config.output.webDir, iconMeta[i].file_name)).isFile());
            }
            cb();
        }); 
    });

    it('can generate only Android images and proper output directories', function(cb){
        this.timeout(timeout);
        iconerator.generateIcons(testImg, outputPath, "android", null, function(err){
            assert.ifError(err);

            assert(!fs.existsSync(path.join(outputPath, config.output.webDir)));
            assert(!fs.existsSync(path.join(outputPath, config.output.iosDir)));

            var androidSubDirs = ['', '/res', '/res/drawable-ldpi', '/res/drawable-mdpi', '/res/drawable-hdpi', '/res/drawable-xhdpi', '/res/drawable-xxhdpi', '/res/drawable-xxxhdpi'];
            for(var i = 0; i < androidSubDirs.length; i++){
                assert(fs.statSync(path.join(outputPath, config.output.androidDir, androidSubDirs[i])).isDirectory());
            }

            var iconMeta = _.where(config.icons, { platform: 'Android' });
            for(var i = 0; i < iconMeta.length; i++){
                var meta = iconMeta[i];
                var outputFile;
                if(meta.type === 'Launcher Icon') 
                    outputFile = path.join(outputPath, config.output.androidDir, 'res', 'drawable-' + meta.resolution, meta.file_name);
                else outputFile = path.join(outputPath, config.output.androidDir, meta.file_name);
                assert(fs.statSync(outputFile).isFile());
            }

            cb();
        }); 
    });

});
