using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using ConnectFourServer.Managers;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using ConnectFourServer.Models;
using System.Linq;

namespace ConnectFourServer.Middlewares
{
    public class ServerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ConnectionsManager _manager;

        public ServerMiddleware(RequestDelegate next, ConnectionsManager manager)
        {
            _next = next;
            _manager = manager;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if(context.WebSockets.IsWebSocketRequest)
            {
                WebSocket socket = await context.WebSockets.AcceptWebSocketAsync();
                Player p = _manager.AddSocket(socket);

                if(p == null)
                {
                    await socket.CloseAsync(WebSocketCloseStatus.Empty, null, CancellationToken.None);
                    await _next(context);
                }

                await SendIdToClient(socket, p.Id);

                await HandleResponseData(socket, async(result, buffer) =>
                {
                    if(result.MessageType == WebSocketMessageType.Text)
                    {
                        if(p.PartnerId == null)
                        {
                            try
                            {
                                // check if id was sent
                                string json = Encoding.UTF8.GetString(buffer, 0, result.Count);
                                string id = JsonConvert.DeserializeObject<dynamic>(json).PartnerId;

                                // search for connection with that id
                                if(p.Id != id)
                                {
                                    var partner = _manager.Sockets.Where(conn => conn.Key.Id == id)
                                        .FirstOrDefault();

                                    // i wonder if values in the list update or not...
                                    partner.Key.PartnerId = p.Id;
                                    p.PartnerId = partner.Key.Id;

                                    // send to partner your id
                                    await SendIdToClient(partner.Value, p.Id);
                                    
                                    await SendIdToClient(socket, p.PartnerId);
                                }
                            }
                            catch
                            {
                                // do nothing
                            }
                        }
                        else
                        {
                            // create game state communication between connected clients
                        }
                    }
                    else if(result.MessageType == WebSocketMessageType.Close)
                    {
                        // remove from list
                        _manager.RemoveSocket(socket);
                        // remove from some players partner
                        if(p.PartnerId != null)
                        {
                            _manager.RemovePlayersPartner(p.PartnerId);
                        }
                        // close socket
                        await socket.CloseAsync(WebSocketCloseStatus.Empty, null, CancellationToken.None);
                        await _next(context);
                    }
                });
            }
            else
            {
                await _next(context);
            }
        }

        private async Task SendIdToClient(WebSocket socket, string id)
        {
            // convert data to json
            string json = JsonConvert.SerializeObject(new { Id = id });
            // get json bytes
            byte[] jsonBytes = Encoding.UTF8.GetBytes(json);
            // send to client
            await socket.SendAsync(jsonBytes, WebSocketMessageType.Text, true, CancellationToken.None);
        }

        private async Task HandleResponseData(WebSocket socket, Action<WebSocketReceiveResult, byte[]> handleMessage)
        {
            byte[] buffer = new byte[1024];

            while(socket.State == WebSocketState.Open)
            {
                WebSocketReceiveResult result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer),
                    CancellationToken.None);

                handleMessage(result, buffer); 
            }
        }
    }
}