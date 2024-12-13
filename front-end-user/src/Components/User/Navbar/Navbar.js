import React, { useContext , useEffect , useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "./../../../context/authContext";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

import "./Navbar.css";

export default function Navbar() {
  const authContext = useContext(AuthContext);
  // console.log(authContext);

  const navigate = useNavigate();

  const logoutHandler = (e) => {
    e.preventDefault();
    
    swal({
      title: "آیا از خروج اطمینان دارید",
      icon: "warning",
      buttons: ["خیر" , "بله"]
    }).then((result) => {
      // console.log(result);
      if(result){
        authContext.logout();
        swal({
          title: "با موفقیت خارج شدید",
          icon: "success",
          buttons: "باشه",
        }).then(() => {
          navigate("/");
        });
      }
    })

  }


  return (
    <div className="main-header">
      <div className="container-fluid">
        <div className="main-header__content">
          <div className="main-header__right">

            <ul className="main-header__menu">
              <li className="main-header__item">
                <Link to={"/"} className="main-header__link">
                  صفحه اصلی
                </Link>
              </li>
            </ul>
          </div>

          <div className="main-header__left">
            {/* <a href="#" className="main-header__search-btn">
              <i className="fas fa-search main-header__search-icon"></i>
            </a>
            <a href="#" className="main-header__cart-btn">
              <i className="fas fa-shopping-cart main-header__cart-icon"></i>
            </a> */}

            {authContext.isLoggedIn === true ? (
              <>
                <Link to="#" className="main-header__profile" title="خروج از سایت" onClick={logoutHandler}>
                  خروج
                </Link>
                <Link to="/my-account" className="main-header__profile" title="حساب کاربری">
                  حساب کاربری
                </Link>
                <Link to="/my-account" className="main-header__profile">
                  <span className="main-header__profile-text" title="حساب کاربری">
                    {authContext.userInfos.username}
                  </span>
                </Link>
                <img className="avatar-photo" src={authContext.userInfos.avatarUrl || "/images/default-avatar.png"} />
              </>
            ) : (
              <Link to="/login" className="main-header__profile">
                <span className="main-header__profile-text">
                  ورود / ثبت نام
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
