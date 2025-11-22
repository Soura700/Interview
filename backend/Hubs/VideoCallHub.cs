using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    public class VideoCallHub : Hub
    {
        // Join a room and notify others who joined
        public async Task JoinRoom(string roomId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);

            // notify others in the room that a new user has joined
            await Clients.OthersInGroup(roomId).SendAsync("UserJoined", Context.ConnectionId);
        }

        // Leave a room and notify others
        public async Task LeaveRoom(string roomId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);
            await Clients.OthersInGroup(roomId).SendAsync("UserLeft", Context.ConnectionId);
        }

        // Relay offer to other peers in the room and include sender id
        public async Task SendOffer(string roomId, string sdp)
        {
            await Clients.OthersInGroup(roomId).SendAsync("ReceiveOffer", Context.ConnectionId, sdp);
        }

        // Relay answer to other peers in the room and include sender id
        public async Task SendAnswer(string roomId, string sdp)
        {
            await Clients.OthersInGroup(roomId).SendAsync("ReceiveAnswer", Context.ConnectionId, sdp);
        }

        // Relay ICE candidate to other peers in the room and include sender id
        public async Task SendIceCandidate(string roomId, string candidate)
        {
            await Clients.OthersInGroup(roomId).SendAsync("ReceiveIceCandidate", Context.ConnectionId, candidate);
        }

        // Optionally override OnDisconnected to notify others
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            // If you track rooms per connection, notify groups here. For simplicity, we won't do that automatically.
            await base.OnDisconnectedAsync(exception);
        }
    }
}
