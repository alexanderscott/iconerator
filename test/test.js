var child_process = require('child_process');
    //iconerator = require('../lib/iconerator'); 


var iconerator = child_process.spawn('node', [__dirname+'../lib/iconerator.js', __dirname+'/sliceisright.png', __dirname]);

iconerator.stdout.on('data', function(stdout){
    console.log("stdout: ", stdout);
});

iconerator.stderr.on('data', function(stderr){
    console.log("stderr: ", stderr);
});

iconerator.on('close', function(code){
    console.log("iconerator exited with code "+code);
});
