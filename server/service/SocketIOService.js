"use strict";

export default class SocketIOService {
  constructor(socketio) {
    this.socketio = socketio;
    this.sockets = [];
    //this.stackData = [];
    //this.isTimerMeet = false;
    socketio.on("connection", (socket) => {
      socket.emit("status", { connected: true });
      this.addSocket(socket);
    });

    this.config = {
      trace: false,
    };
  }

  addSocket(socket) {
    this.sockets.push(socket);
  }
}
