"use strict";

importScripts("websocket.js");

onmessage = function(event) {
    sendPing(event.data.useSecure, postMessage.bind(this, {errorOccurred : false}), postMessage.bind(this, {errorOccurred : true}));
}