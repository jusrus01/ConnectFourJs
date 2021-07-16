using System;
using System.Collections.Concurrent;
using System.Net.WebSockets;
using ConnectFourServer.Models;

namespace ConnectFourServer.Managers
{
    public class ConnectionsManager
    {
        public ConcurrentDictionary<Player, WebSocket> Sockets { get; }
        public ConnectionsManager()
        {
            Sockets = new ConcurrentDictionary<Player, WebSocket>();
        }

        public string AddSocket(WebSocket socket)
        {
            // generate unique id for connection
            string id = Guid.NewGuid().ToString();

            // store the connection socket
            if(Sockets.TryAdd(new Player(id), socket))
            {
                return id;
            }
            
            return null;
        }
    }
}