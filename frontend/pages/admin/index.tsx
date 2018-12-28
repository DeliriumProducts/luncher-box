import { Component } from 'react';
import { AdminContext } from '../../context';
import { AuthAPI } from '../../api';
import { NextContext } from 'next';
import Router from 'next/router';

interface Props {
  isAuthenticated: boolean;
}

class Home extends Component<Props> {
  static async getInitialProps({ req, res }: NextContext) {
    let isAuthenticated = false;

    /**
     * Check for authentication
     */

    /**
     * Check wheter authentication is happening server-side or client-side based on received context
     */
    if (req && res) {
      if (req.headers.cookie) {
        isAuthenticated = await AuthAPI.isAuthenticated(req.headers.cookie);
      }
      if (!isAuthenticated) {
        res.writeHead(302, {
          Location: '/login'
        });
        res.end();
      }
    } else {
      isAuthenticated = await AuthAPI.isAuthenticated();
      if (!isAuthenticated) {
        Router.push('/login');
      }
    }

    return { isAuthenticated };
  }

  render() {
    return <div>Welcome to Luncher Box's admin panel!</div>;
  }
}
export default Home;
