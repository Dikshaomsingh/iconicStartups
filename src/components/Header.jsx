import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

// import the necessary modules here
import "./Header.css"
import LandingPage from "./LandingPage";
import Dropdown from "./Dropdown";

// // Authentication related pages
import Login from "../Pages/Authentication/Login";
import Logout from "../Pages/Authentication/Logout";
import Register from "../Pages/Authentication/Register";
import ForgetPwd from "../Pages/Authentication/ForgetPassword";
import UserProfile from "../Pages/Authentication/userProfile";

//import Articles related Pages
import ArticlesPost from '../Pages/Articles/Articles';
import ParentArticle from "../Pages/Content/parentArticles";
import ArticleDetails from "../Pages/Content/ArticleDetails";

//menu items
import userMenuItems from "../data/userMenu";
import { initFirebaseBackend } from "../Pages/helpers/firebase_helper";
import getMenuItems from "../data/navBarMenu";
import { useSelector } from "react-redux";
import DefaultPage from "./DefaultPage";
import { Nav, Navbar } from "react-bootstrap";

import { BrowserView, MobileView } from 'react-device-detect';

const Header = () => {

  const [menuItems, setMenuItems] = useState(userMenuItems)
  const [userDetails, setUserDetails] = useState(null)
  const firebaseBackend = initFirebaseBackend()

  const { login } = useSelector(state => ({
    login: state.Login.login
  }));

  useEffect(() => {
    let menu;
    let isAdmin = localStorage.getItem("isAdmin") && localStorage.getItem("isAdmin") == 'true' ? true : false;
    let userLoggedIn = localStorage.getItem("authUser") ? true : false;
    const obj = JSON.parse(localStorage.getItem("authUser"));
    if (firebaseBackend && obj) {
      firebaseBackend.isAdmin(obj.uid).then(res => {
        isAdmin = res.data().admin
        setUserDetails(res.data())
        menu = getMenuItems(userLoggedIn, isAdmin)
        if (menu) setMenuItems(menu)
      })
    } else {
      menu = getMenuItems(userLoggedIn, isAdmin)
      if (menu) setMenuItems(menu)
    }

  }, [login]);

  return (
    <Router>
      <div>
        {/* DO NOT REMOVE THE BELOW COMPONENT STATEMENT */}
        <BrowserView>
          <nav className="navbar navbar-expand-lg navbar-light  bg-custom">
            <span className="navbar-brand">
              <Link className="nav-link" to="/">
                iconicStartups
              </Link></span>
            <ul className="navbar-nav">
              {menuItems && menuItems.map((menu, key) => (
                <li className="nav-item" key={key}>
                  <Dropdown items={menu} />
                </li>
              ))}
            </ul>

          </nav>

        </BrowserView>
        <MobileView>

          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="#home">
              <Nav.Link className="nav-link" href="/">
                iconicStartups
              </Nav.Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">

              {menuItems && menuItems.map((menu, key) => (
                <Nav className="mr-auto" key={key}>
                  <Dropdown items={menu} />
                </Nav>
              ))}

            </Navbar.Collapse>
          </Navbar>
        </MobileView>

        {/* code the required routes here */}
        <Routes>
          <Route exact path='/createPosts' element={<ArticlesPost />} />
          <Route exact path='/viewPosts' element={<ParentArticle articleName="adminView" />} />
          <Route exact path='/updatePosts' element={<ParentArticle articleName="edit" />} />
          <Route path='/articleDetails' element={<ArticleDetails />} />
          <Route exact path='/' element={<LandingPage />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/logout' element={<Logout />} />
          <Route exact path='/register' element={<Register />} />
          <Route exact path='/forgot-password' element={<ForgetPwd />} />
          <Route exact path='/UserProfile' element={<UserProfile userDetails={userDetails} />} />
          <Route exact path='/*' element={<DefaultPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Header;