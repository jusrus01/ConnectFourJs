using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using ConnectFourServer.Managers;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

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

                string id = _manager.AddSocket(socket);

                if(id == null)
                {
                    await socket.CloseAsync(WebSocketCloseStatus.Empty, null, CancellationToken.None);
                    return;
                }

                await SendConnectionIdToClient(socket, id);

                await HandleResponseData(socket, async(result, buffer) =>
                {
                    if(result.MessageType == WebSocketMessageType.Text)
                    {
                        
                    }
                    else if(result.MessageType == WebSocketMessageType.Close)
                    {
                        // remove from list
                        // remove from some players partner
                        // close socket
                    }
                });
            }
            else
            {
                await _next(context);
            }
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