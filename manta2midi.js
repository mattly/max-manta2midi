autowatch = 1;

inlets = 3;
var VELIN = 0
  , CONTIN = 1
  , SLIDEIN = 2
  ;
setinletassist(VELIN, "Pad / Button Velocity");
setinletassist(CONTIN, "Pad / Button Continuous");
setinletassist(SLIDEIN, "Sliders");

outlets = 6;
var NOTEOUT = 0
  , POLYOUT = 1
  , CCOUT = 2
  , TOUCHOUT = 3
  , MANTAOUT = 4
  , SVCOUT = 5;
setoutletassist(NOTEOUT, "Note Out");
setoutletassist(POLYOUT, "PolyKey Pressure Out");
setoutletassist(CCOUT, "Control Out");
setoutletassist(TOUCHOUT, "Aftertouch Out");
setoutletassist(MANTAOUT, "To Manta");

var initializing = 1;
var rowVal = 5;
var colVal = 2;
var base = 48;
var holds = new Array(128);
var pads = new Array(48);

var sliderPos = [0, 0, 0, 0, 0, 0, 0, 0];
var sliderMaps = [1, 20, 21, 22, 23, 24, 25, 26];
var buttonPos = [0, 0, 0, 0];

var notesForPads = function() {
  for (i=0; i<48; i++) {
    var y = Math.floor( i / 8 );
    var x = i % 8 - Math.floor( y / 2 );
    var note = base + ( y * rowVal ) + ( x * colVal );
    pads[i] = note;
    if (! initializing) {
      outlet( SVCOUT, "pad", i, note );
      }
    }
  }
notesForPads();

var sliders = [0, 4];
initializing = 0;

function startnote(val) {
  if (val) {
    base = val;
    notesForPads();
    }
  else {
    outlet( SVCOUT, "startnote", base );
    }
  }

function col() {
  colVal = arguments[0];
  notesForPads();
  }
function row() {
  rowVal = arguments[0];
  notesForPads();
  }


function pad(number, velocity){
  var note = pads[number];
  if (inlet == VELIN) {
    holds[note] = velocity / 127;
    outlet( NOTEOUT, note, velocity );
    outlet( MANTAOUT, "pad", velocity > 0 ? "amber" : "off", number);
    pads
      .reduce(function(a, n, i){ if (n == note) { return a.concat([i]) }; return a; }, [])
      .forEach(function(pad){ outlet( MANTAOUT, "pad", velocity > 0 ? "amber" : "off", pad); })
    }
  if (inlet == CONTIN) {
    var pressure = velocity / 211;
    holds[note] = pressure;
    outlet( POLYOUT, Math.floor(pressure * 128), note );
    var nonZeros = holds.filter(function(i){ return i; });
    if (nonZeros.length > 0) {
      var pressure = nonZeros.reduce(function(sum, i){ return sum + i; }) / nonZeros.length * 128;
      outlet( TOUCHOUT, Math.floor(pressure) );
      }
    }
  }

function button(number, velocity) {
  var virtualSlider;
  if (inlet == VELIN && velocity) {
    buttonPos[number] = (buttonPos[number] + 1) % 2;
    outlet( MANTAOUT, "button", buttonPos[number] ? "amber" : "off", number );
    if (number < 2) {
      virtualSlider = buttonPos[0] + (buttonPos[1] * 2)
      sliders[0] = virtualSlider;
      outlet( MANTAOUT, "slider", 0, Math.floor( sliderPos[virtualSlider] * 8 ) );
      }
    else {
      virtualSlider = 4 + buttonPos[2] + (buttonPos[3] * 2)
      sliders[1] = virtualSlider;
      outlet( MANTAOUT, "slider", 1, Math.floor( sliderPos[virtualSlider] * 8 ) );
      }
    }
  }

function list(){
  if (inlet == SLIDEIN) {
    var slider = arguments[0]
      , value = arguments[1]
      , on = arguments[3]
      , virtualSlider = sliders[slider]
      , control = sliderMaps[virtualSlider]
      , value = value / 4096
      ;
    sliderPos[virtualSlider] = value;
    outlet( CCOUT, control, Math.floor(value * 128) );
    outlet( MANTAOUT, "slider", slider, Math.floor(value * 8) );
    }
  }
