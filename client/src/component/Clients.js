import React, { Component } from 'react';
import pic_1 from '../img/clients/adam2.jpg';
import pic_2 from '../img/clients/david.png';
import pic_3 from '../img/clients/adam.jpg';

class ClientRoll extends Component {
  clientSection() {
    return (
      <div>
        {/* <Slider {...settings}>
          <div>
            <div className="row">
              <div className="col">
                <img
                  className="d-block w-100 img-fluid rounded"
                  src={pic_1}
                  alt="First slide"
                />
                <h3>Adam F.</h3>
                <h4>
                  <em>Down 70 lbs!</em>
                </h4>
              </div>
            </div>
          </div>
          <div>
            <div className="row">
              <div className="col">
                <img
                  className="d-block w-100 img-fluid rounded"
                  src={pic_2}
                  alt="First slide"
                />
                <h3>David S.</h3>
                <h4>
                  <em>Down 90 lbs!</em>
                </h4>
              </div>
            </div>
          </div>
        </Slider> */}

        <div id="carousel" className="carousel slide" data-ride="carousel">
          <ol className="carousel-indicators">
            <li data-target="#carousel" data-slide-to="0" className="active" />
            <li data-target="#carousel" data-slide-to="1" />
            <li data-target="#carousel" data-slide-to="2" />
          </ol>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                className="d-block w-100 img-fluid rounded"
                src={pic_1}
                alt="First slide"
              />
              <div className="carousel-caption d-none d-md-block">
                <h3>Adam F.</h3>
                <h4>
                  <em>Down 70 lbs!</em>
                </h4>
              </div>
            </div>
            <div className="carousel-item" id="client">
              <img
                className="d-block w-100 img-fluid rounded"
                src={pic_2}
                alt="Second slide"
              />
              <div className="carousel-caption d-none d-md-block">
                <h3>David S.</h3>
                <h4>
                  <em>Down 100 lbs!</em>
                </h4>
              </div>
            </div>
            <div className="carousel-item">
              <img
                className="d-block w-100 img-fluid rounded"
                src={pic_3}
                alt="Third slide"
              />
              <div className="carousel-caption d-none d-md-block">
                <h3>David S.</h3>
                <h4>
                  <em>+ 30lbs!</em>
                </h4>
              </div>
            </div>
          </div>
          <a
            className="carousel-control-prev"
            href="#carousel"
            role="button"
            data-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="sr-only">Previous</span>
          </a>
          <a
            className="carousel-control-next"
            href="#carousel"
            role="button"
            data-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="sr-only">Next</span>
          </a>
        </div>
      </div>
    );
  }

  info() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm">One of three columns</div>
          <div className="col-sm">One of three columns</div>
          <div className="col-sm">One of three columns</div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="row justify-content-center">
          <div className="col-sm-3">{this.clientSection()}</div>
        </div>
      </div>
    );
  }
}

export default ClientRoll;
