var serialport = require("serialport"), // include the serialport library
        SerialPort  = serialport.SerialPort,    // make a local instance of it
        portName = process.argv[2],                             // get the serial port name from the command line
        ledState = false;

var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { console.log(error) }

// open the serial port. The portname comes from the command line /dev/cu.usbmodem1411
var myPort = new SerialPort("/dev/ttyACM0", {
        baudRate: 9600,
        // add an option in the serial port object
        // so that you can keep track of whether or not the serial port is open:
        options: false,
        // look for return and newline at the end of each data packet:
        parser: serialport.parsers.readline("\r\n")
});

// called when the serial port opens:
myPort.on('open', function() {
        console.log('port open');
        // set options.open so you can track the port statue:
        myPort.options.open = true;
});

// called when the serial port closes:
myPort.on('close', function() {
        console.log('cerar');
        // set options.open so you can track the port statue:
        myPort.options.open = false;
});

// called when there's an error with the serial port:
myPort.on('error', function(error) {
        console.log('there was an error with the serial port: ' + error);
        myPort.close();
});

exec("export DISPLAY=':0.0'", puts);
// called when there's new incoming serial data:
myPort.on('data', function (data) {
        console.log(data);
        // for debugging, you should see this in Terminal:
        if(data == "el numero de boton:  0"){
         console.log('f');
         exec('xdotool key "a"', puts);
        } else if (data == "el numero de boton:  1"){
         console.log('f');
         exec("export DISPLAY=:0.0", puts);
         exec('xdotool key "s"', puts);
        } else if (data == "el numero de boton:  2"){
         console.log('d');
         exec("export DISPLAY=:0.0", puts);
         exec('xdotool key "d"', puts);
        } else if (data == "el numero de boton:  3"){
         console.log('f');
         exec("export DISPLAY=:0.0", puts);
         exec('xdotool key "f"', puts);
        } else if (data == "el numero de boton:  4"){
         console.log('g');
         exec("export DISPLAY=:0.0", puts);
         exec('xdotool key "g"', puts);
        } else if (data == "el numero de boton:  Misil"){
         console.log('z');
         exec("export DISPLAY=:0.0", puts);
         exec('xdotool key "z"', puts);
        }






});

if (myPort.options.open) {
        console.log('pintar');
  myPort.write("my string\n3");
}