// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var JsonRPC = require('simple-jsonrpc-js')

var jrpc = new JsonRPC()
var socket = new WebSocket("ws://localhost:6800/jsonrpc")

jrpc.toStream = (_msg) => { socket.send(_msg) }
socket.onmessage = (event) => { jrpc.messageHandler(event.data) }
socket.onclose = (event) => { console.log("connection closed") }
socket.onopen = () => {
    console.log("connected")
    jrpc.call("aria2.tellActive", ["token:secret"]).then((result) => {
        console.log("result")
        console.log(result)
    }).catch((err) => {
        console.log("err")
        console.log(err)
    })
}