import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Footer extends Component {
  render() {
    return (
      <div>
          <div className="row">
            <div className="col-md-8">
              <ul className="nav mx-0" id="footer">
                <li className="nav-item">
                  <Link className="nav-link" to="/about">
                    About
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/training">
                    Online Training
                  </Link>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="http://www.lynscottdev.com/"
                  >
                    Development
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-md-4">
              <ul className="nav justify-content-end" id="footer">
                <li className="nav-item" id="ig">
                  <a
                    className="nav-link"
                    href="https://www.instagram.com/lsphysique/"
                  >
                    <i className="fab fa-instagram" />
                  </a>
                </li>
                <li className="nav-item" id="fb">
                  <a
                    className="nav-link"
                    href="https://www.facebook.com/lsphysique/"
                  >
                    <i className="fab fa-facebook-square" />
                  </a>
                </li>
                {/* <li className="nav-item" id="tw">
                  <a className="nav-link" href="">
                    <i className="fab fa-twitter" />
                  </a>
                </li> */}
              </ul>
            </div>
          </div>
          <div className="row justify-content-left pl-3">
            <div className="col-md-8 text-left">
              <p style={{margin:0}}> Copyright &copy; 2017 LS Fitness.</p>
            </div>
          </div>
      </div>
    );
  }
}

export default Footer;
