using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading;
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

        public void RemovePlayersPartner(string partnerId)
        {
            try
            {
                var value = Sockets.Where(pair => pair.Key.Id == partnerId)
                    .First();

                value.Key.PartnerId = null;
            }
            catch
            {
                Console.WriteLine($"Manager->RemovePlayersPartner: Failed to find player with {partnerId}");
            }
        }

        public void RemoveSocket(WebSocket socket)
        {
            try
            {
                var value = Sockets.Where(pair => pair.Value == socket)
                    .First();

                bool result = Sockets.TryRemove(value);

                if(!result)
                {
                    Console.WriteLine($"Manager->RemoveSocket: Failed to remove socket");
                }
            }
            catch
            {
                Console.WriteLine($"Manager->RemoveSocket: Failed to find given socket");
            }
        }

        public Player AddSocket(WebSocket socket)
        {
            // generate unique id for connection
            string id = Guid.NewGuid().ToString();

            Player p = new Player(id);

            // store the connection socket
            if(Sockets.TryAdd(p, socket))
            {
                return p;
            }
            
            return null;
        }

        public async void CloseAllConnections()
        {
            foreach(var sock in Sockets)
            {
                await sock.Value.CloseAsync(WebSocketCloseStatus.EndpointUnavailable,
                    null, CancellationToken.None);
            }
        }
    }
}