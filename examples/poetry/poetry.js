function poetry(packet) {
  _.pipeline(_.accessor('seed'), doit)(JSON.parse(packet));
}

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

function fragment() {
  var args = _.toArray(arguments);
  return args.join(' ');
}

// l@@k https://github.com/jeremyruppel/underscore.inflection

function path() {
  var p = _.random(1);
  var words = choose(above);

  words += fragment(s[p], (choose(trans)+s[(p+1)%2]));

  words += ['', 'the', choose(below)].join(' ') + choose(s) + ".";
  return words;
}

function site() {
  var words = '';

  if (_.random(2) === 1)
    words += choose(above);
  else
    words += choose(below);

  words += 's ' + choose(intrans) + '.';

  return words;
}

function cave() {
  var adjs = ('encompassing,'+choose(texture)+',sinuous,straight,objective,arched,cool,clear,dim,driven').split(',');
  var target = 1 + _.random(3);

  while (adjs.length>target) {
    adjs.splice(_.random(adjs.length),1);
  }

  var words = '\u00a0\u00a0'+choose(imper)+' the '+adjs.join(' ')+' \u2014';
  return words;
}

function doLine() {
  if (n === 0)
    text=' ';
  else if (n == 1) {
    paths = 2 + _.random(2);
    text  = path();
  }
  else if (n < paths)
    text = site();
  else if ( n == paths)
    text = path();
  else if (n == paths + 1)
    text=' ';
  else if (n==paths+2)
    text = cave();
  else {
    text = ' ';
    n = 0;
  }

  n+=1;

  return text.substring(0,1).toUpperCase()+text.substring(1,text.length);
}

function doit(seed) {
  var prose = document.getElementById('prose');
  var text  = doLine(prose);

  last = document.createElement('div');
  last.appendChild(document.createTextNode(text));
  prose.appendChild(last);
}
