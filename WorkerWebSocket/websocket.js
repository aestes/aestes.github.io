"use strict";

function sendPing(useSecure, resolve, reject)
{
    var messageFunction;
    var errorFunction;
    var protocol;
    if (useSecure) {
        messageFunction = resolve;
        errorFunction = reject;
        protocol = "wss";
    } else {
        messageFunction = reject;
        errorFunction = resolve;
        protocol = "ws";
    }

    var webSocket = new WebSocket(protocol + "://echo.websocket.org");
    webSocket.addEventListener("open", function () {
        webSocket.send("ping");
    });
    webSocket.addEventListener("message", function () {
        messageFunction();
    });
    webSocket.addEventListener("error", function () {
        errorFunction();
    });
}

function pingWebSocket(useSecure, useWorker)
{
    return new Promise(function (resolve, reject) {
        if (!useWorker) {
            sendPing(useSecure, resolve, reject);
            return;
        }

        var worker = new Worker("worker.js");
        worker.addEventListener("message", function (event) {
            if (event.data.errorOccurred)
                reject();
            else
                resolve();
        });
        worker.postMessage({useSecure});
    });
}
