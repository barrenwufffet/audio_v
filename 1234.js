var context;
var bufferLoader;
var myBufferList;
var soundMap;
var names = ["explore_kick_1","explore_kick_2","explore_kick_3","Air_funk","Caddy_ki","Doggiek","fatkick","Glitch_Hop_Kick05","(Kick) FSMH1","Ohiokic","explore_clap","explore_snap1","explore_snap2","explore_snare1","explore_snare2","explore_snare3","BALTIMOR","Newerks","s2","s3","sn1","[Snr] BEAUTIFUL MORNIN","tightsnare","clap","explore_chop","chop1","chop2","chop4","Misc_Stabs_62","Sound192","chimes","FX9","explore_fx","explore_perc","zap1","hih1","hih2","hh1","hh2","crash","crash1","crash2","airhorn","ironside","another-one","hah","haan","milli","montana","shout","scream1","[VOX] BBB4U Quickie","[VOX] Perfect"];
var soundBank = ["sounds/explore_kick_1.mp3","sounds/explore_kick_2.mp3","sounds/explore_kick_3.mp3","sounds/Air_funk.mp3","sounds/Caddy_ki.mp3","sounds/Doggiek.mp3","sounds/fatkick.mp3","sounds/Glitch_Hop_Kick05.mp3","sounds/(Kick) FSMH1.mp3","sounds/Ohiokic.mp3","sounds/explore_clap.mp3","sounds/explore_snap1.mp3","sounds/explore_snap2.mp3","sounds/explore_snare1.mp3","sounds/explore_snare2.mp3","sounds/explore_snare3.mp3","sounds/BALTIMOR.mp3","sounds/Newerks.mp3","sounds/s2.mp3","sounds/s3.mp3","sounds/sn1.mp3","sounds/[Snr] BEAUTIFUL MORNIN.mp3","sounds/tightsnare.mp3","sounds/clap.mp3","sounds/explore_chop.mp3","sounds/chop1.mp3","sounds/chop2.mp3","sounds/chop4.mp3","sounds/Misc_Stabs_62.mp3","sounds/Sound192.mp3","sounds/chimes.mp3","sounds/FX9.mp3","sounds/explore_fx.mp3","sounds/explore_perc.mp3","sounds/zap1.mp3","sounds/hih1.mp3","sounds/hih2.mp3","sounds/hh1.mp3","sounds/hh2.mp3","sounds/crash.mp3","sounds/crash1.mp3","sounds/crash2.mp3","sounds/airhorn.mp3","sounds/ironside.mp3","sounds/another-one.mp3","sounds/hah.mp3","sounds/haan.mp3","sounds/milli.mp3","sounds/montana.mp3","sounds/shout.mp3","sounds/scream1.mp3","sounds/[VOX] BBB4U Quickie.mp3","sounds/[VOX] Perfect.mp3"];
var buttonNames = ['one','two','three','four'];
var buttonList = [1,2,3,4];
var keyList = [49,50,51,52];

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function( callback ){
    window.setTimeout(callback, 1000 / 60);
  };
})();

window.onload = init;

function init() {

  setupTextBox();

  context = new (window.AudioContext || window.webkitAudioContext)();
  bufferLoader = new BufferLoader(context,soundBank,finishedLoading);
  bufferLoader.load();

  window.addEventListener("keydown",function(event) {
    var key = event.keyCode;
    if(isValidKey(key)) onKeyDown(key);
  });
  window.addEventListener("keyup",function(event) {
    var key = event.keyCode;
    if(isValidKey(key)) onKeyUp(key);
  });
}

function finishedLoading(bufferList) {
  myBufferList = bufferList;
  soundMap = {};
  setupLists();
  setupButtons();
}

function setupButtons() {
  for(var i = 0; i < 4; i++) {
    soundMap[i] = new Sound(null,null,1.0,false,true);
  }
}

function setupLists() {
  for(var i = 0; i < 4; i++) {
    var list = document.getElementById('list-'+buttonNames[i]);
    var selectTag = document.createElement("option");
    selectTag.disabled = true;
    selectTag.selected = true;
    selectTag.innerHTML = 'choose a sound';
    list.appendChild(selectTag);
    for(var j = 0; j < soundBank.length; j++) {
      var option = document.createElement("option");
      option.innerHTML = names[j];
      list.appendChild(option);
    }
  }
}

function setupTextBox() {
  var textBox = document.getElementById('text');
  textBox.style.display = "block";
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
      textBox.style.display = "none";
  }
}

function changeSound(number, soundName) {
  if(soundMap[number].playing) { //if sound is already playing 
    stopSound(number);           //stop it before creating and playing the new buffer
  }

  var idx = names.indexOf(soundName);
  soundMap[number].buffer = myBufferList[idx];

  var button = document.getElementById(buttonNames[number]);
  button.style.backgroundColor = "rgba(255,150,30,0.6)";
  //button.innerHTML = soundName;
}

function onKeyUp(key) {
  var number = keyList.indexOf(key);
  if(soundMap[number].buffer != undefined) {
    soundMap[number].can_trigger = true;
    var button = document.getElementById(""+buttonNames[number]);
    button.style.backgroundColor = "rgba(255,150,30,0.6)";
    button.style.color = "black";
    //button.style.backgroundColor = "rgba("+bg[0]+","+bg[1]+","+bg[2]+",0.6)";
  }
}

function onKeyDown(key) {
  var number = keyList.indexOf(key);
  if(soundMap[number].buffer != undefined) {
    if(soundMap[number].can_trigger) {
      var button = document.getElementById(""+buttonNames[number]);
      play(number,0);
      button.style.backgroundColor = "rgba(220,100,30,0.3)";
      button.style.color = "rgba(255,150,30,0.6)"; //visual 'press' effect
    }
  }
}

function play(number) {
  if(soundMap[number].playing) { //if sound is already playing 
    stopSound(number);           //stop it before creating and playing the new buffer
  }
  soundMap[number].playing = true;
  soundMap[number].can_trigger = false;
  playSound(number,0);
}

function playSound(number,time) {
  soundMap[number].playing = true;
  soundMap[number].sound = context.createBufferSource();
  soundMap[number].sound.buffer = soundMap[number].buffer;
  soundMap[number].sound.connect(context.destination);
  soundMap[number].sound.start(time);
  soundMap[number].sound.playbackRate.value = soundMap[number].rate;
}

function stopSound(number) {
  soundMap[number].playing = false;
  soundMap[number].sound.disconnect(context.destination);
}

function isValidKey(key) {
  var idx = keyList.indexOf(key);
  return idx >= 0;
}

function setPlayBack(number,value) {
  soundMap[number].rate = value / 100;
}

function Sound(sound,buffer,rate,playing,can_trigger) {
  this.sound = sound;
  this.buffer = buffer;
  this.rate = rate;
  this.playing = playing;
  this.can_trigger = can_trigger;
}

/*

ideas:

get rid of dropdowns -> drag and drop instead?
maschine-style sound editor window (AnalyserNode to display waveforms?)
add volume sliders
loops
effects rack?
re-design to make it look nicer
better button presses
iOS capable

*/





