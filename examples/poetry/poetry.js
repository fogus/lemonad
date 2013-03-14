function poetry(packet) {
  L.pipeline(JSON.parse(packet)
    , L.plucker('seed')
    , doit);
}

var locale = {

};

function doit(seed) {

}
