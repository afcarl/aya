/*
 * Author: Ilisha Ramachandran <iramachand@brynmawr.edu>
 *
 * Projcet Title: sensorFunctions API  
 *
 * Institution: Bryn Mawr College 
 *
 * Eg. http://165.106.xxx.xx:3000/
 *
 * Code taken and modified from https://software.intel.com/en-us/iot/hardware/sensors/
 */
var mraa = require('mraa'); //require mraa
var groveSensor = require('jsupm_grove')
var grove_moisture = require('jsupm_grovemoisture');
var UVSensor = require('jsupm_guvas12d');
var grove_motion = require('jsupm_biss0001');
var rotary = require("jsupm_rotaryencoder");
var LCD = require('jsupm_i2clcd');
var waterFlow_lib = require('jsupm_grovewfs');

/************************************** test function **************************************/

function helloTest(req,res) {
	var message = req.query.message;	
	res.send('Message sent is: ' + message);
};

/************************************** readTemperature **************************************/
/*
For more information, please visit: 
https://software.intel.com/en-us/iot/hardware/sensors/grove-temperature-sensor
*/

function temperature(req, res) {
	
	var units = req.query.units //query for units 
    var aioPin = req.query.aioPin //query for pin number 
	var tempVal = new groveSensor.GroveTemp(parseInt(aioPin)); //initialising sensor on specified pin 
	var celsius = tempVal.value();
	var fahrenheit = celsius * 9.0/5.0 + 32.0;

	if (units == 'celsius'){
		res.send(celsius.toString())
	}
	else if (units == 'fahrenheit'){
		res.send(fahrenheit.toString());
	}
	else {
		res.send ("Sorry your input was not valid")
	}
}

/************************************** readMoisture **************************************/
/*
For more information, please visit: 
https://software.intel.com/en-us/iot/hardware/sensors/grove-moisture-sensor
*/

function moisture(req, res) {
    var aioPin = req.query.aioPin //query for pin number 
	var myMoistureObj = new grove_moisture.GroveMoisture(parseInt(aioPin)); //initialising sensor on specified pin 
	var moisture_val = parseInt(myMoistureObj.value());
	res.send(moisture_val.toString());
}

/************************************** readUVLevel **************************************/
/*
Plug UV sensor into AIO pin 2 

Returns UV value
Eg. http://165.106.xxx.xx:3000/readUVLevel 

For more information, please visit: 
//https://software.intel.com/en-us/iot/hardware/sensors/grove-uv-sensor
*/

function uvLevel(req, res) {
    var aioPin = req.query.aioPin; //query for pin number 
    var value = req.query.value; //query for value of either AREF or voltage 
	var myUVSensor = new UVSensor.GUVAS12D(parseInt(aioPin)); //initialising sensor on specified pin 

	// analog voltage, usually 3.3 or 5.0
	var g_GUVAS12D_AREF = 5.0;
	var g_SAMPLES_PER_QUERY = 1024;

	//var uvLevelOutput = g_GUVAS12D_AREF + ", " + roundNum(myUVSensor.value(g_GUVAS12D_AREF, g_SAMPLES_PER_QUERY), 6);
    var AREFValue = g_GUVAS12D_AREF;
    var voltageValue = roundNum(myUVSensor.value(g_GUVAS12D_AREF, g_SAMPLES_PER_QUERY), 6);
	
	function roundNum(num, decimalPlaces){
		var extraNum = (1 / (Math.pow(10, decimalPlaces) * 1000));
		return (Math.round((num + extraNum) * (Math.pow(10, decimalPlaces))) / Math.pow(10, decimalPlaces));
    }
        
    if (value == 'AREF'){
		res.send(AREFValue.toString())
	}
	else if (value == 'voltage'){
		res.send(voltageValue.toString());
	}
	else {
		res.send ("Sorry your input was not valid")
	}
}

/************************************** readPIRMotion **************************************/
/*
For more information, please visit: 
https://software.intel.com/en-us/iot/hardware/sensors/biss0001-motion-sensor
*/

function pirMotion(req, res) {
    
    var digitalPin = req.query.digitalPin; //query for pin number 
	var myMotionObj = new grove_motion.BISS0001(parseInt(digitalPin)); //initialising sensor on specified pin 
	var motionVal; 
    
	if (myMotionObj.value())
		motionVal = "Detecting moving object";
	else
		motionVal = "No moving objects detected";
    
  	res.send(motionVal);
};

/************************************** readEncoder **************************************/
/*
For more information, please visit: 
https://software.intel.com/en-us/iot/hardware/sensors/grove-rotary-encoder
*/

function rotaryEncoder(req, res) {
    var digitalPin1 = req.query.digitalPin1; //query for pin number 
    var digitalPin2 = req.query.digitalPin2; //query for pin number
    console.log(digitalPin1, digitalPin2);
	var myRotaryEncoder = new rotary.RotaryEncoder(parseInt(digitalPin1),parseInt(digitalPin2));
  	res.send(myRotaryEncoder.position().toString());
    
};


/************************************** readButtonLevel **************************************/
/*
For more information, please visit: 
https://software.intel.com/en-us/iot/hardware/sensors/grove-button
*/

function button(req, res) {
    var digitalPin = req.query.digitalPin; // query for pin number  
	var button = new groveSensor.GroveButton(parseInt(digitalPin)); // initialising sensor on specified pin 
    var buttonVal = button.value().toString(); 
    res.send(buttonVal);
}

/************************************** lightSensor **************************************/
/*
For more information, please visit: 
https://software.intel.com/en-us/iot/hardware/sensors/grove-light-sensor
*/

function lightSensor(req, res) {
    var groveSensor = require('jsupm_grove');
    var aioPin = req.query.aioPin //query for pin number 
    var value = req.query.value; // query for value (either raw or lux)
	var light = new groveSensor.GroveLight(parseInt(aioPin)); // initialising sensor on specified pin 
    var rawVal = light.raw_value().toString();
    var luxVal = light.value().toString();
    
    if (value == 'raw'){
		res.send(rawVal)
	}
	else if (value == 'lux'){
		res.send(luxVal);
	}
	else {
		res.send ("Sorry your input was not valid")
	}
}

/************************************** flowMeter **************************************/
/*
For more information, please visit: 
https://software.intel.com/en-us/iot/hardware/sensors/grove-water-flow-sensor
*/


/*
function flowMeter(req, res) {
    var digitalPin = req.query.digitalPin //query for pin number 
    var myWaterFlow_obj = new waterFlow_lib.GroveWFS(parseInt(digitalPin));
    //myWaterFlow_obj.clearFlowCounter();
    //myWaterFlow_obj.startFlowCounter();
    var fr = myWaterFlow_obj.flowRate().toString();
    res.send(fr); 
}
*/

function flowMeter(req,res){
    var waterFlow_lib = require('jsupm_grovewfs');
    var digitalPin = req.query.digitalPin //query for pin number 
// Instantiate a Grove Water Flow Sensor on digital pin D2
var myWaterFlow_obj = new waterFlow_lib.GroveWFS(parseInt(digitalPin));

// set the flow counter to 0 and start counting
myWaterFlow_obj.clearFlowCounter();
myWaterFlow_obj.startFlowCounter();


var millis, flowCount, fr;
var myInterval = setInterval(function()
{
	// we grab these (millis and flowCount) just for display
	// purposes in this example
	millis = myWaterFlow_obj.getMillis();
	flowCount = myWaterFlow_obj.flowCounter();

	fr = myWaterFlow_obj.flowRate();

	// output milliseconds passed, flow count, and computed flow rate
	outputStr = "Millis: " + millis + " Flow Count: " + flowCount +
	" Flow Rate: " + fr + " LPM";
	console.log(outputStr);

	// best to gather data for at least one second for reasonable
	// results.
}, 2000);
    
    res.send("flow started");
};


/************************************** initialise module functions **************************************/

module.exports.hello = helloTest;
module.exports.getTemperature = temperature;
module.exports.getMoisture = moisture;
module.exports.getUVLevel = uvLevel;
module.exports.getPirMotion = pirMotion;
module.exports.getRotaryEncoder = rotaryEncoder;
module.exports.buttonLevel = button;
module.exports.lightSensorVal = lightSensor;
module.exports.getFlowRate = flowMeter;





