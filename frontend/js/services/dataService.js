import { serverUrl } from "../config/config.js";

export class DataService {
    constructor() {
        this.socket = null;
    }    

    connect = () => {
        this.socket = new WebSocket(serverUrl);

        this.socket.onmessage = function(event) {
            const data = JSON.parse(event.data);
            console.log(data);
        }
    }

    sendMessage = (jsonValues) => {
        if(this.socket && this.socket.readyState == WebSocket.OPEN) {
            this.socket.send(JSON.stringify(jsonValues));
        } else {
            alert("You're not connected.");
        }
    }
}