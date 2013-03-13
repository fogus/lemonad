function poetry(packet) {
  L.pipeline(JSON.parse(packet)
    , L.plucker('seed')
    , function(n) { console.log(n); });
}
