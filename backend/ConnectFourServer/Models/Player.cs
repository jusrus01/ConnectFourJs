namespace ConnectFourServer.Models
{
    public class Player
    {
        public string Id { get; }
        public string PartnerId { get; }
        public Player(string id)
        {
            Id = id;
            PartnerId = null;
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