import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Footer extends Component {
  render() {
    return (
          <div className="row" style={{fontSize:'12px', padding:'8px'}}>
            <div className="col-md-8 align-self-center">
              
              <p className='align-middle' style={{margin:0, textAlign:'left', color:'white', fontSize:'14px'}}> Copyright &copy; 2017 LS Fitness.</p>
            </div>
            <div className="col-md-4">
              <ul className="nav justify-content-end" id="footer">
                <li className="nav-item" id="ig">
                  <a
                    className="nav-link"
                    href="https://www.instagram.com/lynscottfitness/"
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

    )
  }
}

export default Footer
