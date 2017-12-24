import React, { Component } from 'react';
import logo from '../img/about_logo.png';
import Footer from './Footer';

class About extends Component {
  render() {
    return (
      <div>
        <header id="about-header">
          <div className="container">
            <div className="row ">
              <div className="col-md-6 m-auto py-4 text-center">
                <h1 id="div-title" className="display-4">
                  About
                </h1>
                <p id="div-footer" className="lead" />
              </div>
            </div>
          </div>
        </header>

        <section id="icon-boxes" className="p-5">
          <div className="container">
            <div className="row text-white mb-4 justify-content-center align-content-center ">
              <h1>How To Get Started</h1>
            </div>
            <div className="row mb-4 text-white">
              <div className="col-md-4 py-3">
                <div className="card bg-primary text-center">
                  <div className="card-body">
                    <i class="fas fa-user-plus" id="icons" />
                    <h3>Login</h3>
                    Easy and secure logins with Google or Facebook.
                  </div>
                </div>
              </div>
              <div className="col-md-4 py-3">
                <div className="card bg-primary text-center">
                  <div className="card-body">
                    <i class="fas fa-check-circle" id="icons" />
                    <h3>Select A Plan</h3>
                    Choose a plan right for you and fill out the intake form.
                  </div>
                </div>
              </div>
              <div className="col-md-4 py-3">
                <div className="card bg-primary text-center">
                  <div className="card-body">
                    <i class="fab fa-hotjar" id="icons" />
                    <h3>Get to Work!</h3>
                    Hit your dashboard to access your plan and get started!
                  </div>
                </div>
              </div>
            </div>
            <div className="row text-white mb-4 justify-content-center align-content-center ">
              <h1>Sponsors</h1>
            </div>

            <div className="row mb-4 text-white">
              <div className="col-md-4 py-3">
                <div className="card bg-secondary text-center">
                  <div className="card-body">
                    <img
                      src="https://www.413healthandfitness.com/wp-content/uploads/2017/06/413-logo-header.svg"
                      className="figure-img w-50 img-fluid rounded"
                      alt=" Plan A"
                    />
                    <h4>4:13 Health and Fitness Athlete</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-4 py-3">
                <div className="card bg-secondary text-center">
                  <div className="card-body">
                    <img
                      src="https://lionedgenutrition.com/wp-content/uploads/2017/08/lionedge-logo-menu.png"
                      className="figure-img w-50 img-fluid rounded"
                      alt=" Plan A"
                    />
                    <h4>Lion Edge Nutrition Athlete</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-4 py-3">
                <div className="card bg-secondary text-center">
                  <div className="card-body">
                    <img
                      src="http://www.toejoez.com/wp-content/uploads/2016/07/logo-comp5.png"
                      className="figure-img w-75 img-fluid rounded"
                      alt=" Plan A"
                    />
                    <h3>ToeJoez</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about">
          <div className="row bg-light">
            <div className="col-md-6 text-center">
              <h1>About Lyn</h1>
              <p className="lead p-2">
                Lyn is a nationally qualified NPC physique athlete, personal
                trainer, and entrepeneur in San Diego. He loves helping people
                reach their goals and break platues they didn't think possible.
                He hold's certifications from ACE and NFPT and is currently
                attaining his Bachelors of Science in Mechanical Engineering
                from San Diego State University. Lyn's vision is to meld fitness
                and technology to create an easy and enjoyable fitness
                experience.
              </p>
              <p className="lead p-2">
                <br />
                Lyn's philosophies on training are custom, quantifiable, and
                results driven. Custom plans based on your ability, experience,
                body type and goals. Quantifiable metrics to determine what
                works, whats doesn't and what needs adjustments. Results driven;
                check-ins, measurements, accountability.
              </p>
            </div>
            <div className="col-md-6 justify-content-center">
              <img
                src={logo}
                alt=""
                className="about-img img-fluid rounded-circle d-none d-md-block"
              />
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }
}

export default About;
