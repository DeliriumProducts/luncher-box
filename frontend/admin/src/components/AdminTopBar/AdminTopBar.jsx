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
                {!this.props.isAuthenticated && <NavLink to='/signin' className="AdminTopBar-navlink" id="AdminTopBar-sign-in"><LockIcon className="AdminTopBar-icon"/>Sign in</NavLink>}
                {!this.props.isAuthenticated && <NavLink to='/signup' className="AdminTopBar-navlink" id="AdminTopBar-sign-up"><RegIcon  className="AdminTopBar-icon"/>Sign up</NavLink>}
                {this.props.isAuthenticated && <NavLink to='/dashboard' id="AdminTopBar-dashboard"><DashboardIcon/>Dashboard </NavLink>}
            </div>
        )
    }
}

export default AdminTopBar;