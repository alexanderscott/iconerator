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
        cb();
    });
    afterEach(function(cb){
        cb();
    });
    before(function(cb){
        cp.exec("rm -rf " + outputPath, function(){
            fs.mkdirSync(outputPath);
            cb();
        });
    });
    after(function(cb){
        cp.exec("rm -rf " + outputPath, function(){
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

    it('can create Android output directories', function(cb){
        this.timeout(timeout);
        iconerator.createAndroidIconFolders(outputPath);
        var dirs = ['', '/res', '/res/drawable-ldpi', '/res/drawable-mdpi', '/res/drawable-hdpi', '/res/drawable-xhdpi', '/res/drawable-xxhdpi', '/res/drawable-xxxhdpi'];
        for(var i = 0; i < dirs.length; i++){
            assert(fs.statSync(outputPath + "/android" + dirs[i]).isDirectory());
        }
        cb();
    });

    it('can create Web output directories', function(cb){
        this.timeout(timeout);
        iconerator.createWebIconFolders(outputPath);
        assert(fs.statSync(outputPath + "/web").isDirectory());
        cb();
    });

    it('can create iOS output directories', function(cb){
        this.timeout(timeout);
        iconerator.createIOSIconFolders(outputPath);
        assert(fs.statSync(outputPath + "/ios").isDirectory());
        cb();
    });

    it('can generate iOS images', function(cb){
        this.timeout(timeout);
        iconerator.generateIcons(testImg, outputPath, "ios", null, function(err){
            assert.ifError(err);
            var iconMeta = _.where(config.icons, { platform: 'iOS' });
            for(var i = 0; i < iconMeta.length; i++){
                assert(fs.statSync(outputPath + "/ios/"+iconMeta[i].file_name).isFile());
            }
            cb();
        }); 
    });

    it('can generate Web images', function(cb){
        this.timeout(timeout);
        iconerator.generateIcons(testImg, outputPath, "web", null, function(err){
            assert.ifError(err);
            var iconMeta = _.where(config.icons, { platform: 'Web' });
            for(var i = 0; i < iconMeta.length; i++){
                assert(fs.statSync(outputPath + "/web/"+iconMeta[i].file_name).isFile());
            }
            cb();
        }); 
    });

    it('can generate Android images', function(cb){
        this.timeout(timeout);
        iconerator.generateIcons(testImg, outputPath, "android", null, function(err){
            assert.ifError(err);
            var iconMeta = _.where(config.icons, { platform: 'Android' });
            for(var i = 0; i < iconMeta.length; i++){
                var meta = iconMeta[i];
                var outputFile;
                if(meta.type === 'Launcher Icon') 
                    outputFile = outputPath + "/" + config.output.androidDir + '/res/drawable-' + meta.resolution + '/' + meta.file_name;
                else outputFile = outputPath + "/" + config.output.androidDir + '/' + meta.file_name;
                assert(fs.statSync(outputFile).isFile());
            }
            cb();
        }); 
    });

});
