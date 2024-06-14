import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './NavItem.css';
const NavItem = (props) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(!open);
    };
    let dropdown = null;
    let dropChildren = null;

    if (props.dropdown) {
        dropChildren = props.dropdownChildren.map((child, index) => {
            return (
                <li key={index} className="DarkBlue" onClick={props.clicked}>
                    <NavLink to={child.link}>{child.name}</NavLink>
                </li>
            );
        });
        dropdown = (
            <div className={open ? 'Open MenuDropdown' : 'MenuDropdown'}>
                <ul className="DropdownList Orange-BG Font5">{dropChildren}</ul>
            </div>
        );
    }

    return props.dropdown ? (
        <li className="NavItem Orange Font3" key={props.children}>
            <span onClick={handleOpen}>
                {props.children}
                <span className={open ? 'ml-2 dropdown-toggle caret Open' : 'ml-2 dropdown-toggle caret'}></span>
            </span>
            {dropdown}
        </li>
    ) : (
        <li className="NavItem Grey Font3" key={props.children}>
            <NavLink to={props.link}>{props.children}</NavLink>
        </li>
    );
};

export default NavItem;
