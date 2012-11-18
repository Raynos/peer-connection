var EventEmitter = require("events").EventEmitter
    , DataChannel = require("data-channel")

module.exports = PeerConnection

function PeerConnection(RTCPeerConnection, options) {
    var pc = new EventEmitter()
        , _pc = RTCPeerConnection(options)

    pc.createAnswer = createAnswer
    pc.createOffer = createOffer
    pc.setRemote = setRemote
    pc.addCandidate = addCandidate
    pc.connect = connect
    pc.setLocal = setLocal

    _pc.onicecandidate = function (candidate) {
        pc.emit("candidate", candidate)
    }

    _pc.ondatachannel = function (channel) {
        pc.emit("connection", DataChannel(channel))
    }

    _pc.onopen = function () {
        pc.emit("open")
    }

    return pc

    function createOffer(callback) {
        call(_pc.createOffer, callback)
    }

    function createAnswer(offer, callback) {
        if (arguments.length === 1) {
            callback = offer
            offer = null
        }

        if (offer) {
            _pc.setRemoteDescription(offer, function () {
                call(_pc.createAnswer, callback)
            }, callback)
        } else {
            call(_pc.createAnswer, callback)
        }
    }

    function setLocal(description) {
        _pc.setLocalDescription(description)
    }

    function setRemote(description) {
        _pc.setRemoteDescription(description)
    }

    function addCandidate(candidate) {
        _pc.addIceCandidate(candidate)
    }

    function connect(meta) {
        return DataChannel(_pc.createDataChannel(meta))
    }

    function call(func, callback) {
        func.call(_pc, function (result) {
            _pc.setLocalDescription(result, function () {
                callback(null, result)
            }, callback)
        }, callback)
    }
}
