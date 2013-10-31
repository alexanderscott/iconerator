#!/usr/bin/env node

var commands = require('commander');

commands
    .version('0.1.0')
    .usage('iconerator [options] <file ...> [output dir]') 
    .option('--only-ios', 'Only generate iOS icons')
    .option('--only-android', 'Only generate Android icons')
    .option('--only-iphone', 'Only generate iPhone icons')
    .option('--only-ipad', 'Only generate iPad icons')
    .parse(process.argv);
