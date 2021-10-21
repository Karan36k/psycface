
// D-Akebono scale - http://www.hapitones.com/virtual-hapi-drum-d-akebono.html
var g_scale_0 = [ "D4", "E4", "F4", "A4", "E5", "F5", "Bb4", "D5", "E5", "F5", "A5", "E6", "F6", "Bb5" ];
var g_scale_1 = [ "D4", "F4", "A4", "E5"];

var osc = new Tone.Oscillator(440, "square");

// vibrato
//var vibrato = new Tone.LFO(6, -25, 25);
//vibrato.start();
//vibrato.connect(osc.detune);

// feedback
var feedbackDelay = new Tone.PingPongDelay("8n");
feedbackDelay.setFeedback(0.6);
osc.connect(feedbackDelay);
feedbackDelay.toMaster();	
feedbackDelay.setWet(0.8);	

// panner
var panner = new Tone.AutoPanner();
panner.toMaster();
panner.setDry(0.3);
panner.setFrequency(0.5);
osc.connect(panner);

//a lowpass filter
//var lowpass = new Tone.Filter(600, "highpass");
//osc.connect(lowpass);
//lowpass.toMaster();

// envelope
var env = new Tone.Envelope(2.5, 0.1, 0.1, 0.2);
env.connect(osc.output.gain);

//connect it to the output
//osc.setVolume(-10);
osc.toMaster();
osc.start();

/////////////////////////////////////////////

var osc_bg = new Tone.Oscillator(440, "sine");
osc_bg.toMaster();
osc_bg.start();
osc_bg.setVolume(-10);

// vibrato
var vibrato = new Tone.LFO(6, -25, 25);
vibrato.start();
vibrato.connect(osc_bg.detune);

// feedback
var feedbackDelay = new Tone.PingPongDelay("8n");
feedbackDelay.setFeedback(0.2);
osc_bg.connect(feedbackDelay);
feedbackDelay.toMaster();	
feedbackDelay.setWet(0.8);

Tone.Transport.setLoopEnd("1m");
Tone.Transport.loop = true;
Tone.Transport.setInterval(function(time){

	var index = Math.floor( Math.random() * g_scale_1.length );
	var freq = osc_bg.noteToFrequency( g_scale_1[ index ] );
	osc_bg.setFrequency(freq);
}, "4n");

Tone.Transport.setInterval(function(time){
	var index = Math.floor( Math.random() * g_scale_0.length );
	var freq = osc_bg.noteToFrequency( g_scale_0[ index ] );
	g_objs.get("head").osc.setFrequency(freq);

}, "16n");

Tone.Transport.start();