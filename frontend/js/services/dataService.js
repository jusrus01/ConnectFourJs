import { serverUrl } from "../config/config.js";

export class DataService {
    
    connect() {
        let socket = new WebSocket(serverUrl);

        socket.onmessage = function(event) {
            const data = JSON.parse(event.data);
            console.log(data);
            socket.close();
        }
        // socket.close();
    }
}