import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private listeners: ((count: number) => void)[] = [];

  connect() {
    if (this.socket?.connected) return;

    this.socket = io('http://localhost:4000');

    this.socket.on('connect', () => {
      console.log('✅ Real WebSocket connected');
    });

    this.socket.on('session-count', (count: number) => {
      this.notifyListeners(count);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
    });
  }

  onSessionCount(callback: (count: number) => void) {
    this.listeners.push(callback);
  }

  private notifyListeners(count: number) {
    this.listeners.forEach(cb => cb(count));
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getCurrentSessionCount(): Promise<number> {
    return fetch('http://localhost:4000/health')
        .then(res => res.json())
        .then(data => data.activeSessions)
        .catch(() => 0);
  }
}

const socketService = new SocketService();

export default socketService;