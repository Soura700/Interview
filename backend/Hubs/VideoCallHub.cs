using Microsoft.AspNetCore.SignalR;
namespace backend.Hubs;

public class VideoCallHub : Hub
{
    public async Task JoinRoom(string roomId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
        await Clients.OthersInGroup(roomId).SendAsync("UserJoined", Context.ConnectionId);
    }

    public async Task LeaveRoom(string roomId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);
        await Clients.OthersInGroup(roomId).SendAsync("UserLeft", Context.ConnectionId);
    }

    public async Task SendOffer(string roomId, string sdp)
    {
        await Clients.OthersInGroup(roomId).SendAsync("ReceiveOffer", Context.ConnectionId, sdp);
    }

    public async Task SendAnswer(string roomId, string sdp)
    {
        await Clients.OthersInGroup(roomId).SendAsync("ReceiveAnswer", Context.ConnectionId, sdp);
    }

    public async Task SendIceCandidate(string roomId, string candidate)
    {
        await Clients.OthersInGroup(roomId).SendAsync("ReceiveIceCandidate", Context.ConnectionId, candidate);
    }
}