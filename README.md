# peer-connection

A nicer peer connection api

## Example

```js
var PeerConnection = require("peer-connection")
    , shim = require("peer-connection-shim")
    , realDeal = window.RTCPeerConnection
    , signal = someSignalChannel()

// Either use the shim to open a peer connection
var pc = PeerConnection(shim, {
    uri: "http://discoverynetwork.co"
})

// or use the real deal
var pc = PeerConnection(realDeal, {
    iceServers: [...]
})

// Get a pair of peer connections
var pc1, pc2 = ...

// Then use the simplified api!
pc1.createOffer(function (err, offer) {
    signal.send("offer", offer)
})

signal.on("offer", function () {
    pc2.createAnswer(offer, function (err, answer) {
        signal.send("answer", answer)
    })
})

signal.on("answer", function (answer) {
    pc1.setRemote(answer)
})

// With data channels!
pc2.on("connection", function (stream) {
    ...
})

var stream = pc1.connect("some label")
stream.write("hello world!")
```

## Installation

`npm install peer-connection`

## Contributors

 - Raynos

## MIT Licenced
