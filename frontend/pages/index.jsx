import Link from 'next/link';
import io from 'socket.io-client';
import { Component } from 'react';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ''
    };
    this.socket = io('http://192.168.43.198:8000');
  }

  recieveMessage = newMessage => {
    console.log(newMessage);
    this.setState({ message: newMessage });
  };

  componentDidMount() {
    this.socket.emit('test');
    this.socket.on('message_saved', this.recieveMessage);
  }

  render() {
    return (
      <div>
        Welcome to Luncher Box!
        <button
          onClick={() => {
            this.socket.emit('save', { msg: 'test' });
          }}
        />
        {this.state.message.msg}
      </div>
    );
  }
}
export default Home;
