import './Nav.css';
import NavItem from './NavItem';
import React from 'react';

export default props =>
    <aside className="menu-area">
        <nav className="menu">
            <NavItem url="/" icon="home" title="Início"></NavItem>
            <NavItem url="/users" icon="users" title="Usuários"></NavItem>
        </nav>
    </aside>