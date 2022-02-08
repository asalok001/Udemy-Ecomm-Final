import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Badge } from 'antd';
import firebase from 'firebase/compat/app';

import Search from '../forms/Search';

import {
    UserOutlined,
    UserAddOutlined,
    AppstoreOutlined,
    SettingOutlined,
    LogoutOutlined,
    ShoppingOutlined,
    ShoppingCartOutlined,
    CrownTwoTone
} from '@ant-design/icons';

import { Link } from 'react-router-dom';
import cartReducer from '../../store/cartReducer';

const { SubMenu } = Menu;

const Header = () => {
    const [current, setCurrent] = useState('home');

    const history = useHistory();
    const dispatch = useDispatch();
    const { user, cart } = useSelector(state => ({ ...state }));

    const handleClick = event => {
        setCurrent(event.key);
    };

    const logout = () => {
        firebase.auth().signOut();
        dispatch({
            type: 'LOGOUT',
            payload: null
        });

        history.push('/login');
    };
    let count = 0;

    if (cart !== null && cart.length > 0) {
        count = cart.length;
    }


    return (
        <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
            <Menu.Item key="home" icon={<AppstoreOutlined />}>
                <Link to="/">Home </Link>
            </Menu.Item>

            <Menu.Item key="shop" icon={<ShoppingOutlined />}>
                <Link to="/shop">Shop </Link>
            </Menu.Item>

            <Menu.Item key="cart" icon={<ShoppingCartOutlined />}>
                <Link to="/cart" className='fs-3'>
                    <Badge count={count} offset={[11, 0]}>Cart</Badge>
                </Link>
            </Menu.Item>

            <Menu.Item key="search" className='ml-auto' >
                <Search />
            </Menu.Item>

            {!user && (
                <Menu.Item
                    key="register"
                    icon={<UserAddOutlined />}
                    className="ml-auto"   //  align items to right


                >
                    <Link to="/register"  >Register</Link>
                </Menu.Item>
            )}

            {!user && (
                <Menu.Item key="login" icon={<UserOutlined />}>
                    <Link to="/login">Login</Link>
                </Menu.Item>
            )}

            {user && (
                <SubMenu
                    className="ml-auto"
                    key='username'
                    icon={<SettingOutlined />}
                    title={user.email && user.email.split('.sonu03@')[0]}

                >
                    {user && user.role === 'subscriber' && (
                        <Menu.Item key='user-dashboard'>
                            <Link to='/user/history'>Dashboard</Link>
                        </Menu.Item>
                    )}

                    {user && user.role === 'admin' && (
                        <Menu.Item key='admin-dashboard'>
                            <Link to='/admin/dashboard'>Dashboard</Link>
                        </Menu.Item>
                    )}

                    <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
                        Logout
                    </Menu.Item>
                </SubMenu>
            )}

        </Menu>
    );
};

export default Header;
