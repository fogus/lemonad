function poetry(packet) {
  L.pipeline(JSON.parse(packet)
    , L.plucker('seed')
    , doit);
}

var locale = {
  path: function() {
    var p = _.random(1);
  }
};

var t = 0;
var n = 0;
var paths = 0;

var above='brow,mist,shape,layer,the crag,stone,forest,height'.split(',');
var below='flow,basin,shape,vein,rippling,stone,cove,rock'.split(',');
var trans='command,pace,roam,trail,frame,sweep,exercise,range'.split(',');
var imper='track,shade,translate,stamp,progress through,direct,run,enter'.split(',');
var intrans='linger,dwell,rest,relax,hold,dream,hum'.split(',');
var s='s,'.split(',');
var texture='rough,fine'.split(',');

function choose(array) { // curry nth?
  return array[_.random(_.size(array) - 1)];
}

function path() {
  var p = _.random(1);
  var words = choose(above);

  if ((words === 'forest') && (_.random(3) === 1))
    words = ['monkeys', choose(trans)].join(' ');
  else
    words += [s[p], (choose(trans)+s[(p+1)%2])].join(' ');

  words += ['', 'the', choose(below)].join(' ') + choose(s) + ".";
  return words;
}


function doit(seed) {
  var prose = document.getElementById('prose');
}
