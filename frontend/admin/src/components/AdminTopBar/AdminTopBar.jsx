import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './AdminTopBar.css';
import LockIcon from '@material-ui/icons/Lock';
import RegIcon from '@material-ui/icons/HowToReg';
import DashboardIcon from '@material-ui/icons/Dashboard';

class AdminTopBar extends Component {

    render() {
        return (
            <div className="AdminTopBar-wrapper">
                {!this.props.isAuthenticated && <NavLink to='/login' className="AdminTopBar-navlink" id="AdminTopBar-login"><LockIcon className="AdminTopBar-icon"/>Login</NavLink>}
                {!this.props.isAuthenticated && <NavLink to='/register' className="AdminTopBar-navlink" id="AdminTopBar-Register"><RegIcon  className="AdminTopBar-icon"/>Register</NavLink>}
                {this.props.isAuthenticated && <NavLink to='/dashboard' id="AdminTopBar-dashboard"><DashboardIcon/>Dashboard </NavLink>}
            </div>
        )
    }
}

export default AdminTopBar;