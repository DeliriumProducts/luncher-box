import { Component } from 'react';
import { AdminContext } from '../../context';
import { AuthAPI } from '../../api';
import { NextContext } from 'next';

interface Props {
  isAuthenticated: boolean;
}

class Home extends Component<Props> {
  static async getInitialProps({ req, res }: NextContext) {
    let isAuthenticated = false;

    /**
     * Check for authentication
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
    }
    return { isAuthenticated };
  }

  render() {
    const { isAuthenticated } = this.props;
    return (
      <AdminContext.Provider value={{ isAuthenticated }}>
        <div>Welcome to Luncher Box's admin panel!</div>;
      </AdminContext.Provider>
    );
  }
}
export default Home;
