var itunes = [
    {'artist' : 'Sun Ra',
     'genre'  : 'Jazz',
     'plays'  : 379},

    {'artist' : 'Om',
     'genre'  : 'Doom',
     'plays'  : 22},

    {'artist' : 'Can',
     'genre'  : 'Prog',
     'plays'  : 190},

    {'artist' : 'Popol Vuh',
     'genre'  : 'Prog',
     'plays'  : 285}
];

function cell(col, row, table) {
  var entry = table[row];
  return entry && entry[col];
}

cell('artist',
     /* of row */ 1, 
     /* from */   itunes);
//=> "Om"

function getArtists(library) {
  var ret = [];

  for (var i = 0; i < library.length; i++) {
    ret.push(cell('artist', i, library));
  }

  return ret;
}

getArtists(itunes);
//=> ["Sun Ra", "Om", "Can", "Popol Vuh"]
