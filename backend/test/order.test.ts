import { Server } from 'http';
import io from 'socket.io-client';
import { initServer } from '../src';
import { io as ioServer, SOCKET_URL } from '../src/config';

let server: Server;
let ioClient: SocketIOClient.Socket;

beforeAll(async done => {
  server = await initServer();

  done();
});

beforeEach(done => {
  ioClient = io(SOCKET_URL, {
    reconnection: true,
    forceNew: true,
    transports: ['websocket']
  });

  ioClient.on('connect', () => {
    done();
  });
});

afterEach(done => {
  if (ioClient.connected) {
    ioClient.disconnect();
  }

  done();
});

describe('Connect to socket.io', () => {
  xit('connects to the backend via socket.io ', done => {
    const message = 'Hello World';
    ioClient.emit('socket_connect', message);

    ioClient.on('socket_connected', (recievedMessage: string) => {
      expect(recievedMessage).toBe(message);
      done();
    });

    ioServer.on('connection', mySocket => {
      expect(mySocket).toBeDefined();
    });
  });
});
