// import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-meeting',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './meeting.html',
//   styleUrls: ['./meeting.css']
// })
// export class MeetingComponent implements OnInit, OnDestroy {
//   @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
//   @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

//   private hubConnection!: HubConnection;
//   private peerConnection!: RTCPeerConnection;
//   meetingId!: string;

//   localStream!: MediaStream;
//   remoteStream!: MediaStream;

//   isConnected = false;
//   connectionId = '';
//   messages: string[] = [];

//   // 🎙️ State for mic/cam
//   micOn = true;
//   camOn = true;

//   constructor(private route: ActivatedRoute) {}

//   async ngOnInit() {
//     this.meetingId = this.route.snapshot.paramMap.get('meetingId') || '';
//     console.log('Joining meeting room:', this.meetingId);

//     await this.initSignalR();
//     await this.setupMedia();
//   }

//   ngOnDestroy(): void {
//     this.hubConnection?.stop();
//     this.peerConnection?.close();
//   }

//   // 🎧 Initialize SignalR Hub Connection
//   async initSignalR() {
//     this.hubConnection = new HubConnectionBuilder()
//       .withUrl('http://localhost:5147/videomeetinghub') // ✅ match your backend route
//       .build();

//     this.hubConnection.on('UserJoined', (connectionId: string) => {
//       this.messages.push(`👤 User joined: ${connectionId}`);
//       this.createOffer();
//     });

//     this.hubConnection.on('ReceiveOffer', async (connectionId: string, sdp: string) => {
//       await this.peerConnection.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp }));
//       const answer = await this.peerConnection.createAnswer();
//       await this.peerConnection.setLocalDescription(answer);
//       await this.hubConnection.invoke('SendAnswer', this.meetingId, answer.sdp);
//     });

//     this.hubConnection.on('ReceiveAnswer', async (_connectionId: string, sdp: string) => {
//       await this.peerConnection.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp }));
//     });

//     this.hubConnection.on('ReceiveIceCandidate', async (_connectionId: string, candidate: string) => {
//       try {
//         await this.peerConnection.addIceCandidate(new RTCIceCandidate(JSON.parse(candidate)));
//       } catch (e) {
//         console.error('Error adding received ice candidate', e);
//       }
//     });

//     await this.hubConnection.start();
//     this.isConnected = true;

//     await this.hubConnection.invoke('JoinRoom', this.meetingId);
//   }

//   // 📹 Set up webcam + mic
//   async setupMedia() {
//     this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//     this.localVideo.nativeElement.srcObject = this.localStream;

//     this.remoteStream = new MediaStream();
//     this.remoteVideo.nativeElement.srcObject = this.remoteStream;

//     this.peerConnection = new RTCPeerConnection();

//     this.localStream.getTracks().forEach(track => {
//       this.peerConnection.addTrack(track, this.localStream);
//     });

//     this.peerConnection.ontrack = event => {
//       event.streams[0].getTracks().forEach(track => this.remoteStream.addTrack(track));
//     };

//     this.peerConnection.onicecandidate = event => {
//       if (event.candidate) {
//         this.hubConnection.invoke('SendIceCandidate', this.meetingId, JSON.stringify(event.candidate));
//       }
//     };
//   }

//   // 🔄 Create and send WebRTC Offer
//   async createOffer() {
//     const offer = await this.peerConnection.createOffer();
//     await this.peerConnection.setLocalDescription(offer);
//     await this.hubConnection.invoke('SendOffer', this.meetingId, offer.sdp);
//   }

//   // 🎙️ Toggle Mic
//   toggleMic() {
//     this.micOn = !this.micOn;
//     this.localStream.getAudioTracks().forEach(track => (track.enabled = this.micOn));
//   }

//   // 📷 Toggle Camera
//   toggleCamera() {
//     this.camOn = !this.camOn;
//     this.localStream.getVideoTracks().forEach(track => (track.enabled = this.camOn));
//   }

//   // ❌ Leave Call
//   leaveCall() {
//     this.hubConnection?.invoke('LeaveRoom', this.meetingId);
//     this.peerConnection?.close();
//     this.localStream?.getTracks().forEach(track => track.stop());
//     alert('You left the call.');
//   }
// }


// import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// // import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
// import { CommonModule } from '@angular/common';
// import { HubConnection, HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';


// @Component({
//   selector: 'app-meeting',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './meeting.html',
//   styleUrls: ['./meeting.css']
// })
// export class MeetingComponent implements OnInit, OnDestroy {
//   @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
//   @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

//   private hubConnection!: HubConnection;
//   private peerConnection!: RTCPeerConnection;

//   meetingId: string = '';
//   localStream!: MediaStream;
//   remoteStream!: MediaStream;

//   micOn = true;
//   camOn = true;
//   isConnected = false;
//   messages: string[] = [];

//   constructor(private route: ActivatedRoute) { }

//   async ngOnInit() {
//     this.meetingId = this.route.snapshot.paramMap.get('meetingId') || '';
//     console.log('Joining meeting room:', this.meetingId);

//     await this.initSignalR();
//     await this.setupMedia();
//   }

//   ngOnDestroy(): void {
//     this.hubConnection?.stop();
//     this.peerConnection?.close();
//     this.localStream?.getTracks().forEach(track => track.stop());
//   }

//   // 🎧 Initialize SignalR Hub
//   async initSignalR() {
//     this.hubConnection = new HubConnectionBuilder()
//       .withUrl('http://localhost:5147/videomeetinghub', {
//         withCredentials: false,
//         transport: HttpTransportType.WebSockets
//       })
//       .withAutomaticReconnect()
//       .build();


//     const pendingCandidates: string[] = [];

//     this.hubConnection.on('UserJoined', async (connectionId: string) => {
//       console.log('User joined:', connectionId);
//       this.messages.push(`👤 User joined: ${connectionId}`);
//       await this.createOffer();
//     });

//     this.hubConnection.on('ReceiveOffer', async (connectionId: string, sdp: string) => {
//       console.log('📩 Received Offer');
//       if (!this.peerConnection) await this.setupPeerConnection();

//       await this.peerConnection.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp }));
//       const answer = await this.peerConnection.createAnswer();
//       await this.peerConnection.setLocalDescription(answer);
//       await this.hubConnection.invoke('SendAnswer', this.meetingId, answer.sdp);
//     });

//     this.hubConnection.on('ReceiveAnswer', async (_connectionId: string, sdp: string) => {
//       console.log('📩 Received Answer');
//       if (this.peerConnection) {
//         await this.peerConnection.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp }));
//       }
//     });

//     this.hubConnection.on('ReceiveIceCandidate', async (_connectionId: string, candidate: string) => {
//       console.log('❄ Received ICE Candidate');
//       const ice = JSON.parse(candidate);
//       if (this.peerConnection) {
//         try {
//           await this.peerConnection.addIceCandidate(new RTCIceCandidate(ice));
//         } catch (e) {
//           console.error('Error adding ICE candidate', e);
//         }
//       } else {
//         pendingCandidates.push(candidate);
//       }
//     });

//     try {
//       await this.hubConnection.start();
//       console.log('✅ SignalR connected');
//       this.isConnected = true;
//       await this.hubConnection.invoke('JoinRoom', this.meetingId);
//     } catch (err) {
//       console.error('❌ SignalR connection failed:', err);
//       alert('Failed to connect to the meeting server. Check if the backend is running on localhost:5147.');
//     }



//     // If connection restarts, reapply pending ICE
//     this.hubConnection.onreconnected(async () => {
//       for (const c of pendingCandidates) {
//         if (this.peerConnection) {
//           await this.peerConnection.addIceCandidate(new RTCIceCandidate(JSON.parse(c)));
//         }
//       }
//       pendingCandidates.length = 0;
//     });
//   }

//   // 📹 Setup Camera + Microphone
//   async setupMedia() {
//     try {
//       this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       this.localVideo.nativeElement.srcObject = this.localStream;

//       // Move this up: Ensure PC is ready before adding tracks
//       await this.setupPeerConnection();

//       this.localStream.getTracks().forEach(track => {
//         this.peerConnection.addTrack(track, this.localStream);
//       });
//     } catch (err) {
//       console.error('Failed to access camera/mic:', err);
//       alert('⚠️ Please allow camera and microphone access.');
//     }
//   }

//   // 🔧 Create and configure peer connection
//   async setupPeerConnection() {
//     // Remove these lines:
//     // this.remoteStream = new MediaStream();
//     // this.remoteVideo.nativeElement.srcObject = this.remoteStream;

//     this.peerConnection = new RTCPeerConnection();

//     this.peerConnection.ontrack = event => {
//       console.log('🎥 Remote track received:', event.track.kind);
//       // Directly set the video srcObject to the incoming stream
//       this.remoteVideo.nativeElement.srcObject = event.streams[0];
//       // Optional: Explicitly play (though autoplay should handle it)
//       this.remoteVideo.nativeElement.play().catch(err => console.error('Play failed:', err));
//     };

//     this.peerConnection.onicecandidate = event => {
//       if (event.candidate) {
//         this.hubConnection.invoke('SendIceCandidate', this.meetingId, JSON.stringify(event.candidate));
//       }
//     };
//   }

//   // 🔄 Create and send an offer
//   async createOffer() {
//     if (!this.peerConnection) await this.setupPeerConnection();

//     const offer = await this.peerConnection.createOffer();
//     await this.peerConnection.setLocalDescription(offer);
//     await this.hubConnection.invoke('SendOffer', this.meetingId, offer.sdp);
//   }

//   // 🎙️ Toggle microphone
//   toggleMic() {
//     this.micOn = !this.micOn;
//     this.localStream.getAudioTracks().forEach(track => (track.enabled = this.micOn));
//   }

//   // 🎥 Toggle camera
//   toggleCamera() {
//     this.camOn = !this.camOn;
//     this.localStream.getVideoTracks().forEach(track => (track.enabled = this.camOn));
//   }

//   // 🚪 Leave the call
//   leaveCall() {
//     this.hubConnection?.invoke('LeaveRoom', this.meetingId);
//     this.peerConnection?.close();
//     this.localStream?.getTracks().forEach(track => track.stop());
//     alert('👋 You left the meeting.');
//   }
// }


import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HubConnection, HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';

@Component({
  selector: 'app-meeting',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meeting.html',
  styleUrls: ['./meeting.css']
})
export class MeetingComponent implements OnInit, OnDestroy {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  private hubConnection!: HubConnection;
  private peerConnection!: RTCPeerConnection | null;

  meetingId: string = '';
  localStream!: MediaStream;

  micOn = true;
  camOn = true;
  isConnected = false;

  constructor(private route: ActivatedRoute) { }

  async ngOnInit() {
    this.meetingId = this.route.snapshot.paramMap.get('meetingId') || '';
    console.log('Joining meeting room:', this.meetingId);

    await this.setupMedia();
    await this.initSignalR();
  }

  ngOnDestroy(): void {
    this.hubConnection?.stop();
    this.peerConnection?.close();
    this.localStream?.getTracks().forEach(track => track.stop());
  }

  // -------------------------
  // SIGNALR initialization
  // -------------------------
  async initSignalR() {
    // Option A (recommended for local dev): send token via accessTokenFactory
    const token = localStorage.getItem('admin_token') || '';

    this.hubConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5147/videomeetinghub', {
        transport: HttpTransportType.WebSockets,
        accessTokenFactory: () => token,
        // If you prefer cookies, use withCredentials: true and ensure cookies are set correctly.
        // withCredentials: true
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('UserJoined', async (connectionId: string) => {
      console.log('UserJoined:', connectionId);

      // ignore our own event if the server sent it back to us (shouldn't normally)
      if (connectionId === this.hubConnection.connectionId) return;

      // Determine who will create the offer: lexicographic order prevents collisions.
      // The connection with the smaller id will act as the caller (create offer).
      const myId = this.hubConnection.connectionId || '';
      if (!myId) {
        // If we don't have our id yet, wait a short time (rare)
        setTimeout(() => this.handleUserJoined(connectionId), 200);
      } else {
        await this.handleUserJoined(connectionId);
      }
    });

    this.hubConnection.on('ReceiveOffer', async (senderConnectionId: string, sdp: string) => {
      // ignore own
      if (senderConnectionId === this.hubConnection.connectionId) return;

      console.log('ReceiveOffer from', senderConnectionId);
      if (!this.peerConnection) {
        await this.setupPeerConnection();
      }

      await this.peerConnection!.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp }));
      const answer = await this.peerConnection!.createAnswer();
      await this.peerConnection!.setLocalDescription(answer);

      // send answer (server will forward to others with sender id)
      await this.hubConnection.invoke('SendAnswer', this.meetingId, answer.sdp);
    });

    this.hubConnection.on('ReceiveAnswer', async (senderConnectionId: string, sdp: string) => {
      if (senderConnectionId === this.hubConnection.connectionId) return;
      console.log('ReceiveAnswer from', senderConnectionId);
      if (this.peerConnection) {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp }));
      }
    });

    this.hubConnection.on('ReceiveIceCandidate', async (senderConnectionId: string, candidate: string) => {
      if (senderConnectionId === this.hubConnection.connectionId) return;
      const ice = JSON.parse(candidate);
      if (this.peerConnection) {
        try {
          await this.peerConnection.addIceCandidate(new RTCIceCandidate(ice));
        } catch (e) {
          console.error('Error adding ICE candidate', e);
        }
      }
    });

    this.hubConnection.on('UserLeft', (connectionId: string) => {
      console.log('UserLeft', connectionId);
      // if the other left, close pc and clear remote video
      if (this.peerConnection) {
        try { this.peerConnection.close(); } catch {}
        this.peerConnection = null;
      }
      if (this.remoteVideo && this.remoteVideo.nativeElement) {
        this.remoteVideo.nativeElement.srcObject = null;
      }
    });

    this.hubConnection.onreconnected(async () => {
      console.log('SignalR reconnected, rejoining room');
      await this.hubConnection.invoke('JoinRoom', this.meetingId);
    });

    try {
      await this.hubConnection.start();
      console.log('SignalR connected', this.hubConnection.connectionId);
      this.isConnected = true;
      await this.hubConnection.invoke('JoinRoom', this.meetingId);
    } catch (err) {
      console.error('SignalR connection failed:', err);
      if (typeof window !== 'undefined') {
        alert('Failed to connect to the meeting server. Check if the backend is running on localhost:5147.');
      }
    }
  }

  // helper to decide offerer/answerer and create offer if needed
  private async handleUserJoined(otherConnectionId: string) {
    const myId = this.hubConnection.connectionId || '';

    // guard
    if (!myId || !otherConnectionId) return;

    // lexicographic rule: smaller string becomes caller
    if (myId < otherConnectionId) {
      console.log('I am caller -> create offer');
      if (!this.peerConnection) await this.setupPeerConnection();
      await this.createOffer();
    } else {
      console.log('I am answerer -> wait for offer');
    }
  }

  // -------------------------
  // MEDIA
  // -------------------------
  async setupMedia() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.localVideo.nativeElement.srcObject = this.localStream;
      this.localVideo.nativeElement.muted = true;
      await this.localVideo.nativeElement.play().catch(() => {});
    } catch (err) {
      console.error('Failed to access camera/mic:', err);
      if (typeof window !== 'undefined') {
        alert('⚠️ Please allow camera and microphone access.');
      }
    }
  }

  // -------------------------
  // WebRTC setup
  // -------------------------
  async setupPeerConnection() {
    if (this.peerConnection) return;

    this.peerConnection = new RTCPeerConnection();

    this.peerConnection.ontrack = (event) => {
      console.log('Remote track received:', event.track.kind);
      if (event.streams && event.streams[0]) {
        this.remoteVideo.nativeElement.srcObject = event.streams[0];
        this.remoteVideo.nativeElement.play().catch(err => console.error('Play failed:', err));
      }
    };

    this.peerConnection.onicecandidate = event => {
      if (event.candidate) {
        // send candidate to others; server will include sender id when rebroadcasting
        this.hubConnection.invoke('SendIceCandidate', this.meetingId, JSON.stringify(event.candidate));
      }
    };

    // add local tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        try {
          this.peerConnection!.addTrack(track, this.localStream);
        } catch (e) {
          console.warn('Failed to add track', e);
        }
      });
    }
  }

  // create and send offer
  async createOffer() {
    if (!this.peerConnection) await this.setupPeerConnection();
    const offer = await this.peerConnection!.createOffer();
    await this.peerConnection!.setLocalDescription(offer);

    await this.hubConnection.invoke('SendOffer', this.meetingId, offer.sdp);
  }

  // -------------------------
  // Controls
  // -------------------------
  toggleMic() {
    this.micOn = !this.micOn;
    this.localStream.getAudioTracks().forEach(track => (track.enabled = this.micOn));
  }

  toggleCamera() {
    this.camOn = !this.camOn;
    this.localStream.getVideoTracks().forEach(track => (track.enabled = this.camOn));
  }

  async leaveCall() {
    try {
      await this.hubConnection.invoke('LeaveRoom', this.meetingId);
    } catch (e) { /* ignore */ }
    if (this.peerConnection) {
      try { this.peerConnection.close(); } catch {}
      this.peerConnection = null;
    }
    this.localStream?.getTracks().forEach(track => track.stop());
    if (typeof window !== 'undefined') {
      alert('👋 You left the meeting.');
    }
  }
}
