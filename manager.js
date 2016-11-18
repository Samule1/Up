/*
*This file is under contruction. When in finished it will
*solve the problem of keeping the server alive.
*
*It will restart the application on crash.
*It should mail developer the error message.
*
* - Hamp 
*/

var spawn = require("child_process").spawn;
console.log(process.argv)
if(process.argv[3] === 'local'){
  start('node', process.argv[2])
}
else if (process.argv[3] === 'linux') {
  start('sudo PORT=80 node', process.argv[2])
}
else{
  console.log('<node.js file> <deploy envoirement>')
}



function start(program, sourcepath){
  var script = sourcepath+'.js';
  var process = spawn(program,[script]);

  process.stdout.on('data', function (data){
    console.log("Console log from child process: " + data.toString('utf8'));
  });

  process.stdout.on('close', function (data){
    console.log('restrarting the application..');
    delete(process);
    start(program, sourcepath);

  });
}
