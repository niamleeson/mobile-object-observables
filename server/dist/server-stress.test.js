"use strict";
// import { tap } from 'rxjs/operators';
// import { take } from 'rxjs/operators';
// import { switchMap } from 'rxjs/operators';
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_observable_1 = require("./socket-io-observable");
const socketServerUrl = 'http://localhost:8081';
// const controllers = 20;
// const socketControllers = (new Array<any>(controllers))
// .fill(null)
// .map(_ => {
//     const socketClientObs = new SocketObs(socketServerUrl);
//     socketClientObs.onEvent('connect').pipe(
//         tap(() => socketClientObs.send('controller')),
//     )
//     .subscribe();
//     return socketClientObs;
// });
// setTimeout(() => {
//     socketControllers.map(c => c.close())
// }, 2000);
// const monitors = 1;
// const socketMonitors = (new Array<any>(monitors))
// .fill(null)
// .map(_ => {
//     const socketClientObs = new SocketObs(socketServerUrl);
//     socketClientObs.onEvent('connect').pipe(
//         tap(() => socketClientObs.send('monitor')),
//     )
//     .subscribe();
//     return socketClientObs;
// })
// setTimeout(() => {
//     socketMonitors.map(s => s.close())
// }, 2000);
const s = new socket_io_observable_1.SocketObs(socketServerUrl);
setTimeout(() => {
    s.close();
}, 2000);
//# sourceMappingURL=server-stress.test.js.map