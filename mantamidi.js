var fold = (function(start, items, fn) {
  var value = start;
  (function() {
    if ((items) && (items).constructor.name === "Array") {
      return items.forEach((function(item, index) {
        return value = fn(value, item, index);
      }));
    }
  })();
  return value;
});

var plus = (function(list) {
  var list = Array.prototype.slice.call(arguments, 0);
  
  return (list);
});

var sum = (function(list) {
  return fold(0, list, plus);
});

var median = (function(list) {
  return (sum(list) / (list)["length"]);
});


(this)["autowatch"] = 1;
post("mattly.mantamidi\n");

var inVel = 0,
    inCont = 1,
    inSlide = 2;
(this)["inlets"] = 3;
setinletassist(inVel, "Pad/Button Velocity");

setinletassist(inCont, "Pad/Button Continuous");

setinletassist(inSlide, "Sliders");

var outNote = 0,
    outPoly = 1,
    outCc = 2,
    outTouch = 3,
    outManta = 4;
(this)["outlets"] = 5;
setoutletassist(outNote, "Note Out");

setoutletassist(outPoly, "PolyKey Pressure Out");

setoutletassist(outCc, "Control Out");

setoutletassist(outTouch, "Aftertouch Out");

var initializing = 1,
    rowVal = 5,
    colVal = 2,
    base = 48,
    holds = (new Array(128)),
    pads = (new Array(48)),
    sliderPos = [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    sliderMaps = [ 1, 20, 21, 22, 23, 24, 25, 26 ],
    sliders = [ 0, 4 ],
    buttonPos = [ 0, 0, 0, 0 ];
var notesForPads = (function() {
  var idx = 0;
  return (function() {
    var __returnValue__ = undefined;
    while ((idx < 48)) {
      __returnValue__ = (function() {
        var y = Math.floor((idx / 8)),
            x = ((idx % 8) - Math.floor((y / 2))),
            note = (base + (y * rowVal) + (x * colVal));
        (pads)[idx] = note;
        return idx = (1 + idx);
      })();
    };
    return __returnValue__;
  })();
});

notesForPads();

initializing = 0;
var startnote = (function(val) {
  return (function() {
    if (val) {
      base = val;
      return notesForPads();
    } else {
      return undefined;
    }
  })();
});

var col = (function(newCol) {
  colVal = newCol;
  return notesForPads();
});

var row = (function(newRow) {
  rowVal = newRow;
  return notesForPads();
});

var amberOrOff = (function(val) {
  return (function() {
    if ((val > 0)) {
      return 1;
    } else {
      return 0;
    }
  })();
});

var PadVel = (function(note, velocity) {
  (holds)[note] = (velocity / 127);
  var padLit = amberOrOff(velocity);
  outlet(outNote, note, velocity);
  var litPads = fold([], pads, (function(coll, pn, p) {
    (function() {
      if ((pn === note)) {
        return coll.push(p);
      }
    })();
    return coll;
  }));
  return litPads.forEach((function(pad) {
    return outlet(outManta, "pad", pad, padLit);
  }));
});

var PadCont = (function(note, velocity) {
  var pressure = (velocity / 211);
  (holds)[note] = pressure;
  outlet(outPoly, Math.floor((pressure * 128)), note);
  var nonZeroes = holds.filter((function(i) {
    return i;
  }));
  return (function() {
    if ((!((nonZeroes).length === 0))) {
      return outlet(outTouch, Math.floor((median(nonZeroes) * 128)));
    }
  })();
});

var pad = (function(pad, velocity) {
  var note = (pads)[pad];
  return (function() {
    switch(inlet) {
    case inVel:
      return PadVel(note, velocity);
    
    case inCont:
      return PadCont(note, velocity);
    }
  })();
});

var ButtonVel = (function(number, velocity) {
  return (function() {
    if ((velocity > 0)) {
      var newVal = ((1 + (buttonPos)[number]) % 2);
      (buttonPos)[number] = newVal;
      outlet(outManta, "button", number, newVal);
      return (function() {
        if ((number < 2)) {
          var virtualslider = ((buttonPos)[0] + (2 * (buttonPos)[1]));
          (sliders)[0] = virtualslider;
          post("setting slider 0 to ", virtualslider);
          return outlet(outManta, "slider", 0, Math.floor((8 * (sliderPos)[virtualslider])));
        } else {
          var virtualslider = (4 + (buttonPos)[2] + (2 * (buttonPos)[3]));
          (sliders)[1] = virtualslider;
          post("setting slider 1 to ", virtualslider);
          return outlet(outManta, "slider", 1, Math.floor((8 * (sliderPos)[virtualslider])));
        }
      })();
    }
  })();
});

var ButtonCont = (function(number, velocity) {
  // no-op;
  return "";
});

var button = (function(number, velocity) {
  return (function() {
    switch(inlet) {
    case inVel:
      return ButtonVel(number, velocity);
    
    case inCont:
      return ButtonCont(number, velocity);
    }
  })();
});

var slider = (function(number, value) {
  return (function() {
    if ((value > -1)) {
      var virtualslider = (sliders)[number];
      var val = (value / 4096);
      (sliderPos)[virtualslider] = val;
      outlet(outCc, (sliderMaps)[virtualslider], Math.floor((128 * val)));
      return outlet(outManta, "slider", number, Math.floor((8 * val)));
    }
  })();
});

var list = (function(args) {
  var args = Array.prototype.slice.call(arguments, 0);
  
  return (function() {
    switch(inlet) {
    case inSlide:
      return slider.apply(undefined, args);
    }
  })();
});

