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

                await SendConnectionIdToClient(socket, p.Id);

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

                                Console.WriteLine(json);

                                // search for connection with that id
                                if(p.Id != id)
                                {
                                    var partner = _manager.Sockets.Where(conn => conn.Key.Id == id)
                                        .FirstOrDefault();

                                    partner.Key.PartnerId = p.Id;
                                    p.PartnerId = partner.Key.Id;


                                    // the player who set id gets to go first
                                    p.Number = 1;
                                    
                                    partner.Key.Number = 2;

                                    // send to partner your id
                                    await SendInitialState(partner.Value, p.Id, partner.Key.Number);

                                    await SendInitialState(socket, p.PartnerId, p.Number);
                                }
                            }
                            catch
                            {
                                // do nothing
                            }
                        }
                        else
                        {
                            string data = Encoding.UTF8.GetString(buffer, 0, result.Count);

                            Console.WriteLine(data);

                            var dataObj = JsonConvert.DeserializeObject<dynamic>(data);

                            if(p.PartnerId == (string)dataObj.PartnerId)
                            {
                                // find it
                                var recipient = _manager.Sockets.Where(pair => pair.Key.Id == (string)dataObj.PartnerId).FirstOrDefault();

                                // check if there is only one difference between states
                                // check if currently occupied space is not overridden
                                // check stuff with gravity

                                // check if client sent Retry request
                                // will allow one side to dictate
                                if(dataObj.Retry != null && (bool)dataObj.Retry)
                                {
                                    // change player turns
                                    int temp = recipient.Key.Number;
                                    recipient.Key.Number = p.Number;
                                    p.Number = temp;


                                    // send initial data again
                                    await SendInitialState(recipient.Value, p.Id, recipient.Key.Number);

                                    await SendInitialState(socket, p.PartnerId, p.Number);
                                }
                                else
                                {
                                    await recipient.Value.SendAsync(Encoding.UTF8.GetBytes("{ \"BoardState\" : \"" + dataObj.BoardState + "\"}"),
                                        WebSocketMessageType.Text, true, CancellationToken.None);
                                }

                            }
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
        private async Task SendInitialState(WebSocket socket, string partnerId, int player)
        {
            string json = JsonConvert.SerializeObject(
                new 
                {
                    PartnerId = partnerId,
                    Player = player,
                    BoardState = "0000000000000000000000000000000000000000000000000000000000000000"
                });

            byte[] bytes = Encoding.UTF8.GetBytes(json);

            await socket.SendAsync(bytes, WebSocketMessageType.Text, true, CancellationToken.None);
        }

        private async Task SendConnectionIdToClient(WebSocket socket, string id)
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