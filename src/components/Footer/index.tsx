import React from "react";
import { Link, useLocation } from "react-router-dom";

import styles from "./index.module.css";

import white from "../../assets/svg/logo.svg";

const Footer: React.FC = () => {
  const location = useLocation();

  const handleMailClick: React.MouseEventHandler<HTMLParagraphElement> = () => {
    window.location.href = "mailto:betabefree340@gmail.com";
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.first}>
          <div className={styles.logo}>
            <img src={white} alt="befree logo" />
            BeFree
          </div>

          <div className={styles.first_content}>
            <p>
              It is a long established fact that a reader will be distracted
              lookings.
            </p>
          </div>
          <div className={styles.logos}>
            <svg className={styles.link_icon}>
              <use xlinkHref="/sprite.svg#icon-facebook" />
            </svg>
            <svg className={styles.link_icon}>
              <use xlinkHref="/sprite.svg#icon-twitter" />
            </svg>
            <svg className={styles.link_icon}>
              <use xlinkHref="/sprite.svg#icon-linkedin2" />
            </svg>
            <svg className={styles.link_icon}>
              <use xlinkHref="/sprite.svg#icon-instagram" />
            </svg>
          </div>
        </div>

        <div className={styles.second}>
          <Link
            to="/"
            className={location.pathname === "/" ? styles.active : ""}
          >
            <p>Home</p>
          </Link>

          <Link
            to="/about"
            className={location.pathname === "/about" ? styles.active : ""}
          >
            <p>About</p>
          </Link>

          <Link
            to="/contact"
            className={location.pathname === "/contact" ? styles.active : ""}
          >
            <p>Contact Us</p>
          </Link>

          <Link
            to="/terms"
            className={location.pathname === "/terms" ? styles.active : ""}
          >
            <p>Terms and Conditions</p>
          </Link>

          <Link
            to="/privacy"
            className={location.pathname === "/privacy" ? styles.active : ""}
          >
            <p>Privacy Policy</p>
          </Link>
        </div>

        <div className={styles.third}>
          <div className={styles.contact}>
            <h1>Contact</h1>
            <p onClick={handleMailClick}>betabefree340@gmail.com</p>
          </div>
          <div className={styles.address}>
            <h1>Office Address</h1>
            <p>Sector 63 Road, B Block Noida , Uttar Pradesh</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
