import React, { Component } from 'react';
import TrainingForm from './TrainingForm';
import Footer from './Footer';

class OnlineTraining extends Component {
  render() {
    return (
      <div>
        <header id="page-header">
          <div className="container">
            <div className="row">
              <div className="col-md-6 m-auto pt-2 text-center">
                <h4 className="display-4" id="div-title">
                  Online Training
                </h4>
              </div>
            </div>
          </div>
        </header>

        <section id="services" className="py-3">
          <div className="container">
            <div className="row">
              <div className="col-md-4 py-4">
                <div className="card text-center">
                  <div className="card-header">
                    <h3>Fitness</h3>
                  </div>
                  <div className="card-body">
                    <h4 className="card-title">$59.99/Month</h4>
                    <p className="card-text">
                      Fitness program for those just starting thier fitness
                      journey.
                    </p>
                    <ul className="list-group">
                      <li className="list-group-item">
                        <i className="fa fa-check" /> Weekly check-ins via Skype
                        or Phone
                      </li>
                      <li className="list-group-item">
                        <i className="fa fa-check" /> Custom training program
                        synced to the LS Fitness Mobile App
                      </li>
                      <li className="list-group-item">
                        <i className="fa fa-check" /> Nutrition plan with
                        healthy food options!
                      </li>
                      <li className="list-group-item">
                        <i className="fa fa-check" /> Supplement Guide
                      </li>
                    </ul>
                    <a
                      href=""
                      data-toggle="modal"
                      data-target="#form"
                      className="btn btn-primary btn-block mt-2"
                    >
                      Request Program!
                    </a>
                  </div>
                  <div className="card-footer text-muted">12 Week Plan</div>
                </div>
              </div>
              <div className="col-md-4 py-4">
                <div className="card text-center">
                  <div className="card-header">
                    <h3>LifeStyle</h3>
                  </div>
                  <div className="card-body">
                    <h4 className="card-title">$99.99/Month</h4>
                    <p className="card-text">
                      LifeStyle program for those
                      ready to transform.
                    </p>
                    <ul className="list-group">
                      <li className="list-group-item">
                        <i className="fa fa-check" /> Weekly check-ins via Skype
                        or Phone
                      </li>
                      <li className="list-group-item">
                        <i className="fa fa-check" /> Custom training program
                        synced to the LS Fitness Mobile App
                      </li>
                      <li className="list-group-item">
                        <i className="fa fa-check" /> Personalized nutrition plan with
                        healthy food options!
                      </li>
                      <li className="list-group-item">
                        <i className="fa fa-check" /> Supplement Guide
                      </li>
                    </ul>
                    <a
                      href=""
                      data-toggle="modal"
                      data-target="#form"
                      className="btn btn-primary btn-block mt-2"
                    >
                      Request Program!
                    </a>
                  </div>
                  <div className="card-footer text-muted">12 Week Plan</div>
                </div>
              </div>
              <div className="col-md-4 py-4">
                <div className="card text-center">
                  <div className="card-header">
                    <h3>Athlete</h3>
                  </div>
                  <div className="card-body">
                    <h4 className="card-title">$199.99/Month</h4>
                    <p className="card-text">
                      Athlete training plan desinged to push your limts.

                    </p>
                    <ul className="list-group">
                      <li className="list-group-item">
                        <i className="fa fa-check" /> Weekly check-ins via Skype
                        or Phone
                      </li>
                      <li className="list-group-item">
                        <i className="fa fa-check" /> Custom training program
                        synced to the LS Fitness Mobile App
                      </li>
                      <li className="list-group-item">
                        <i className="fa fa-check" /> Personalized nutrition plan with
                        healthy food options!
                      </li>
                      <li className="list-group-item">
                        <i className="fa fa-check" /> Supplement Guide
                      </li>
                      <li className="list-group-item">
                        <i className="fa fa-check" /> Competition/Photoshoot prep.
                      </li>
                    </ul>
                    <a
                      href=""
                      className="btn btn-primary btn-block mt-2"
                      data-toggle="modal"
                      data-target="#form"
                    >
                      Request Program!
                    </a>
                  </div>
                  <div className="card-footer text-muted">12 Week Plan</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="modals" className="hidden">
          <div
            className="modal fade"
            id="form"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="athleteModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header text-center">
                  <h5
                    className="modal-title text-center"
                    id="athleteModalLabel"
                  >
                    Online Training Form
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body bg-light">
                  <p>
                    Fill out this form and Lyn will be in contact with you
                    shortly!
                  </p>
                  <TrainingForm />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary btn-block"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="p-5 bg-dark text-white">
          <div className="container">
            <h1 className="text-center">Frequently Asked Questions</h1>
            <hr />
            <div className="row">
              <div className="col-md-6">
                <div id="accordion">
                  <div className="card">
                    <div className="card-header" id="headingOne">
                      <h5 className="mb-0">
                        <a
                          data-toggle="collapse"
                          data-parent="#accordion"
                          href="#collapseOne"
                        >
                          How Does it Work?
                        </a>
                      </h5>
                    </div>

                    <div id="collapseOne" className="collapse">
                      <div className="card-body">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Magnam soluta dolorem, eligendi, provident
                        quibusdam tempora! Commodi excepturi labore sunt,
                        cupiditate quas adipisci magni dolorem, numquam saepe
                        aut est qui asperiores!
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header" id="headingOne">
                      <h5 className="mb-0">
                        <a
                          data-toggle="collapse"
                          data-parent="#accordion"
                          href="#collapseOne"
                        >
                          How do you tack me??
                        </a>
                      </h5>
                    </div>

                    <div id="collapseOne" className="collapse">
                      <div className="card-body">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Magnam soluta dolorem, eligendi, provident
                        quibusdam tempora! Commodi excepturi labore sunt,
                        cupiditate quas adipisci magni dolorem, numquam saepe
                        aut est qui asperiores!
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header" id="headingOne">
                      <h5 className="mb-0">
                        <a
                          data-toggle="collapse"
                          data-parent="#accordion"
                          href="#collapseOne"
                        >
                          Question Three?
                        </a>
                      </h5>
                    </div>

                    <div id="collapseOne" className="collapse">
                      <div className="card-body">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Magnam soluta dolorem, eligendi, provident
                        quibusdam tempora! Commodi excepturi labore sunt,
                        cupiditate quas adipisci magni dolorem, numquam saepe
                        aut est qui asperiores!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div id="accordion">
                  <div className="card">
                    <div className="card-header" id="headingOne">
                      <h5 className="mb-0">
                        <a
                          data-toggle="collapse"
                          data-parent="#accordion"
                          href="#collapseFour"
                        >
                          Question Four?
                        </a>
                      </h5>
                    </div>

                    <div id="collapseFour" className="collapse">
                      <div className="card-body">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Magnam soluta dolorem, eligendi, provident
                        quibusdam tempora! Commodi excepturi labore sunt,
                        cupiditate quas adipisci magni dolorem, numquam saepe
                        aut est qui asperiores!
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header" id="headingOne">
                      <h5 className="mb-0">
                        <a
                          data-toggle="collapse"
                          data-parent="#accordion"
                          href="#collapseFive"
                        >
                          Question Five?
                        </a>
                      </h5>
                    </div>

                    <div id="collapseFive" className="collapse">
                      <div className="card-body">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Magnam soluta dolorem, eligendi, provident
                        quibusdam tempora! Commodi excepturi labore sunt,
                        cupiditate quas adipisci magni dolorem, numquam saepe
                        aut est qui asperiores!
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header" id="headingOne">
                      <h5 className="mb-0">
                        <a
                          data-toggle="collapse"
                          data-parent="#accordion"
                          href="#collapseSix"
                        >
                          Question Six?
                        </a>
                      </h5>
                    </div>

                    <div id="collapseSix" className="collapse">
                      <div className="card-body">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Magnam soluta dolorem, eligendi, provident
                        quibusdam tempora! Commodi excepturi labore sunt,
                        cupiditate quas adipisci magni dolorem, numquam saepe
                        aut est qui asperiores!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }
}

export default OnlineTraining;
