import { serverUrl } from "../config/config.js";

export class DataService {
    constructor() {
        this.socket = null;
    }    

    connect = (callback) => {
        this.socket = new WebSocket(serverUrl);
        this.socket.onmessage = callback;
    }

    sendMessage = (jsonValues) => {
        if(this.socket && this.socket.readyState == WebSocket.OPEN) {
            this.socket.send(JSON.stringify(jsonValues));
        } else {
            alert("You are not connected to the server.");
        }
    }

    close = () => {
        if(this.socket && this.socket.readyState == WebSocket.OPEN) {
            this.socket.close();
        }
    }
}