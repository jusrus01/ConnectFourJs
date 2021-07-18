using System.Net.WebSockets;

namespace ConnectFourServer.Models
{
    public class Player
    {
        public string Id { get; }
        public int Number { get; set; }
        public string PartnerId { get; set; }
        public bool Won { get; set; }
        public WebSocket Socket { get; set; }
        public Player(string id)
        {
            Id = id;
            PartnerId = null;
            Won = false;
        }

        public override bool Equals(object obj)
        {
            if(obj != null) 
            {
                return (obj as Player).Id.Equals(Id);
            }
            return false;
        }

        public override int GetHashCode()
        {
            return Id.GetHashCode();
        }
    }
}