import React, { Component } from 'react'
import { Link } from 'react-router-dom'

var today = new Date();
var year = today.getFullYear();
//TODO: Redo component, very old
class Footer extends Component {
  render() {
    return (
          <div className="row" style={{fontSize:'12px', padding:'8px'}}>
            <div className="col-md-8 align-self-center footer-left">
              
              <p className='align-middle' style={{margin:0, textAlign:'left', color:'white', fontSize:'14px'}}> Copyright &copy; {year} TRUFIT</p>
            </div>
            <div className="col-md-4 footer-right">
              <ul className="nav justify-content-end" id="footer">
                <li className="nav-item" id="ig">
                  <a
                    className="nav-link"
                    href="https://www.instagram.com/trufit.ai/"
                  >
                    <i className="fab fa-instagram" />
                  </a>
                </li>
                {/* <li className="nav-item" id="fb">
                  <a
                    className="nav-link"
                    href="#"
                  >
                    <i className="fab fa-facebook-square" />
                  </a>
                </li> */}
                {/* <li className="nav-item" id="tw">
                  <a className="nav-link" href="#">
                    <i className="fab fa-twitter" />
                  </a>
                </li>  */}
              </ul>
            </div>
          </div>

    )
  }
}

export default Footer
