import {
  OnConnect,
  SocketController,
  ConnectedSocket,
  OnDisconnect,
  MessageBody,
  OnMessage,
  SocketIO
} from 'socket-controllers';
import { app } from 'src/config';

@SocketController()
export class OrderController {
  @OnConnect()
  connection(@ConnectedSocket() socket: any, @SocketIO() io: any) {
    console.log('client connected');
    console.log('connection count:' + io.engine.clientsCount);
  }

  @OnDisconnect()
  disconnect(@ConnectedSocket() socket: any) {
    console.log('client disconnected');
  }

  @OnMessage('save')
  save(@ConnectedSocket() socket: any, @MessageBody() message: any) {
    console.log('received message:', message);
    console.log('setting id to the message and sending it back to the client');
    message.id = 1;
    socket.emit('message_saved', { message: 'hello' });
  }

  @OnMessage('test')
  test() {
    console.log('test');
  }
}
