"use strict";
// https://medium.com/dailyjs/real-time-apps-with-typescript-integrating-web-sockets-node-angular-e2b57cbd1ec1?t=1&cn=ZmxleGlibGVfcmVjcw%3D%3D&refsrc=email&iid=9b197a27b4a14948b1d2fd4ad999e0a1&uid=39235406&nid=244%20276893704
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express = require("express");
const socketIo = require("socket.io");
const rxjs_1 = require("rxjs");
const mobile_object_1 = require("./mobile-object/mobile-object");
const operators_1 = require("rxjs/operators");
const operators_2 = require("rxjs/operators");
var MobileObjectCommand;
(function (MobileObjectCommand) {
    MobileObjectCommand["TURN_ON"] = "turnOn";
    MobileObjectCommand["TURN_OFF"] = "turnOff";
    MobileObjectCommand["ACCELERATE_X"] = "accelerateX";
    MobileObjectCommand["ACCELERATE_Y"] = "accelerateY";
    MobileObjectCommand["BRAKE"] = "brake";
})(MobileObjectCommand = exports.MobileObjectCommand || (exports.MobileObjectCommand = {}));
var MobileObjectInfoMessage;
(function (MobileObjectInfoMessage) {
    MobileObjectInfoMessage["TURNED_ON"] = "turnedOn";
    MobileObjectInfoMessage["TURNED_OFF"] = "turnedOff";
})(MobileObjectInfoMessage = exports.MobileObjectInfoMessage || (exports.MobileObjectInfoMessage = {}));
// Events used by the application
const CONTROLLER_COMMAND = 'command';
const DYNAMICS_INFO = 'dynamics';
const TURNED_ON_INFO = 'turnedOn';
class MobileObjectServer {
    constructor() {
        this.mobileObject = new mobile_object_1.MobileObject();
        this.throttleTime = 1000;
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
        this.showDynamics(true);
    }
    createApp() {
        this.app = express();
    }
    createServer() {
        this.server = http_1.createServer(this.app);
    }
    config() {
        this.port = process.env.PORT || MobileObjectServer.PORT;
    }
    sockets() {
        this.io = socketIo(this.server);
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });
        this.io.on('connect', socket => {
            console.log('Connected client on port %s.', this.port);
            this.handleControllerCommands(socket);
            const sendDynamicsInfoSubscription = this.sendDynamicsInfo(socket);
            const sendTurnedOnInfoSubscription = this.sendTurnedOnInfo(socket);
            socket.on('disconnect', () => {
                console.log('Controller client disconnected');
                sendDynamicsInfoSubscription.unsubscribe();
                sendTurnedOnInfoSubscription.unsubscribe();
            });
        });
    }
    handleControllerCommands(socket) {
        socket.on(CONTROLLER_COMMAND, (commandMessage) => {
            console.log('commandMessage', commandMessage);
            if (commandMessage.action === MobileObjectCommand.TURN_ON) {
                this.mobileObject.turnOn();
            }
            else if (commandMessage.action === MobileObjectCommand.TURN_OFF) {
                this.mobileObject.turnOff();
            }
            else if (commandMessage.action === MobileObjectCommand.ACCELERATE_X) {
                this.mobileObject.accelerateX(commandMessage.value);
            }
            else if (commandMessage.action === MobileObjectCommand.ACCELERATE_Y) {
                this.mobileObject.accelerateY(commandMessage.value);
            }
            else if (commandMessage.action === MobileObjectCommand.BRAKE) {
                this.mobileObject.brake();
            }
            else {
                console.error('command not supported', commandMessage);
            }
        });
    }
    sendDynamicsInfo(socket) {
        return rxjs_1.zip(this.mobileObject.dynamicsObsX, this.mobileObject.dynamicsObsY)
            .pipe(operators_1.tap(data => socket.emit(DYNAMICS_INFO, JSON.stringify(data))))
            .subscribe();
    }
    sendTurnedOnInfo(socket) {
        return this.mobileObject.isTurnedOnObs.pipe(operators_1.tap(isOn => console.log('isTurnedOnObs', isOn)), operators_1.tap(isOn => socket.emit(TURNED_ON_INFO, JSON.stringify(isOn))))
            .subscribe();
    }
    getApp() {
        return this.app;
    }
    showDynamics(bool) {
        if (bool) {
            this.showDynamicsSubscriptionX = this.mobileObject.dynamicsObsX
                .pipe(operators_2.throttleTime(this.throttleTime))
                .subscribe(d => console.log('X : ', d.cumulatedSpace, 'vel X :', d.vel));
            this.showDynamicsSubscriptionY = this.mobileObject.dynamicsObsY
                .pipe(operators_2.throttleTime(this.throttleTime))
                .subscribe(d => console.log('Y : ', d.cumulatedSpace, 'vel Y :', d.vel));
        }
        else {
            if (this.showDynamicsSubscriptionX) {
                this.showDynamicsSubscriptionX.unsubscribe();
            }
            if (this.showDynamicsSubscriptionY) {
                this.showDynamicsSubscriptionY.unsubscribe();
            }
        }
    }
}
MobileObjectServer.PORT = 8081;
exports.MobileObjectServer = MobileObjectServer;
//# sourceMappingURL=server.js.map