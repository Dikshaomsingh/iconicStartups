import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Redirect } from "react-router-dom";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { BrowserView, MobileView, isMobile, isTablet, isDesktop } from 'react-device-detect';
import './Dropdown.css';

import userLogin from "../images/login.svg";

const menuItems = [
    {
        title: 'web design',
        url: 'web-design',
    },
    {
        title: 'web development',
        url: 'web-dev',
    },
    {
        title: 'SEO',
        url: 'seo',
    },
];

const Dropdown = ({ items }) => {
    const [dropdown, setDropdown] = useState(false);
    let ref = useRef();
    useEffect(() => {
        const handler = (event) => {
            if (dropdown && ref.current && !ref.current.contains(event.target)) {
                setDropdown(false);

            }
        };
        document.addEventListener("mousedown", handler);
        document.addEventListener("touchstart", handler);
        return () => {
            // Cleanup the event listener
            document.removeEventListener("mousedown", handler);
            document.removeEventListener("touchstart", handler);
        };
    }, [dropdown]);

    const onMouseEnter = () => {
        window.innerWidth > 960 && setDropdown(true);
    };

    const onMouseLeave = () => {
        window.innerWidth > 960 && setDropdown(false);
    };

    const closeDropdown = () => {
        dropdown && setDropdown(false);
    };


    return (
        <div className="menuItems" ref={ref} onClick={closeDropdown} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <BrowserView><button
                className="menuLabel nav-link"
                aria-expanded={dropdown}
                onClick={() => setDropdown(!dropdown)}
            >
                {items.title == "usersLogin" ? <img className="loginImg" src={userLogin} /> : items.title}{" "}
            </button>
                {dropdown ? <ul className="dropdown">
                    <ul className={items.title == "usersLogin" ? "userLoginSubMenu" : "subMenu"}>
                        {items.submenu.map((submenu, index) => (
                            <li className="subMenuList" key={`subMenuList${index}`}>
                                <Link key={index} className="subMenuItems" to={submenu.url}>{submenu.title} </Link>
                            </li>
                        ))}
                    </ul>
                </ul> : null}</BrowserView>
            <MobileView>

                <NavDropdown title={items.title} id="collasible-nav-dropdown">
                    {items.submenu.map((submenu, index) => (
                        <NavDropdown.Item key={`subMenuList${index}`}>
                            <Link className="subMenuItems" to={submenu.url}>{submenu.title} </Link>
                        </NavDropdown.Item>
                    ))}
                </NavDropdown>

            </MobileView>
        </div>
    );
};


export default Dropdown