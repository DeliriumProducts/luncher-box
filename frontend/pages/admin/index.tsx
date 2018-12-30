import { Component } from 'react';
import withAuth from '../../components/withAuth';

class Home extends Component {
  render() {
    return <div>Welcome to Luncher Box's admin panel!</div>;
  }
}
export default withAuth(Home);
