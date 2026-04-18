import React, { useRef } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = (props) => {
  const searchInput = useRef(null);
  const location = useLocation();

  return (
    <>
      <nav
        className="navbar navbar-expand-lg position-fixed"
        style={{
          zIndex: "10",
          width: "100%",
          top: "0",
          backgroundColor: "rgba(237, 223, 223, 0.6)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            NewsEagle
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} aria-current="page" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/fake-news' ? 'active' : ''}`} to="/fake-news">
                  Fake News Detection
                </Link>
              </li>
            </ul>

            <div className="nav-item dropdown mx-2">
              <a
                className="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categories
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a
                    onClick={() => props.querySelect("Sports")}
                    className="dropdown-item"
                  >
                    Sports
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => props.querySelect("Politics")}
                    className="dropdown-item"
                  >
                    Politics
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => props.querySelect("Finance")}
                    className="dropdown-item"
                  >
                    Finance
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => props.querySelect("Movies")}
                    className="dropdown-item"
                  >
                    Movies
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => props.querySelect("Health")}
                    className="dropdown-item"
                  >
                    Health
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => props.querySelect("Entertainment")}
                    className="dropdown-item"
                  >
                    Entertainment
                  </a>
                </li>
              </ul>
            </div>

            <form className="d-flex" role="search">
              <input
                ref={searchInput}
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  let value = searchInput.current.value;
                  props.querySelect(value);
                }}
                className="btn btn-success"
                style={{ backgroundColor: "#a25e36", border: "none" }}
                type="submit"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
