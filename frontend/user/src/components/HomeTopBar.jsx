import React, { Component } from 'react'
import { NavLink } from 'react-router-dom';
import '../assets/css/HomeTopBar.css';
import HomeIcon from '@material-ui/icons/Home'
import FastFoodIcon from '@material-ui/icons/Fastfood'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'

class HomeTopBar extends Component {
    render() {
        return (
            <div className='TopBar-wrapper'>
                <NavLink to='/daily' className='TopBar-navlink' id='TopBar-home'>
                    <HomeIcon className='TopBar-icon' />Home
                </NavLink>
                <NavLink to='/menu' className='TopBar-navlink' id='TopBar-menu'>
                    <FastFoodIcon className='TopBar-icon' />Menu
                </NavLink>
                <NavLink to='/order' className='TopBar-navlink' id='TopBar-order'>
                    <ShoppingCartIcon className='TopBar-icon' />Order
                 </NavLink>
            </div>
        );
    }
}

export default HomeTopBar;