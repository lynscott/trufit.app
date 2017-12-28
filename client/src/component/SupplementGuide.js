import React, { Component } from 'react';

class Guide extends Component {
  render() {
    return (
      <div className="list-group bg-dark text-dark">
        <p className="text-white py-3">
          Supplements will help maximize your results and keep your body in good
          condition with the extra stress of training. Below is a list of key
          supplements and proper dosing. You can find all of these items on
          amazon or at your local nutrition and supplement store.
        </p>
        <a className="list-group-item list-group-item-action flex-column align-items-start">
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">Glutamine</h5>
          </div>
          <p className="mb-1">
            Glutamine is a non essential amino acid great for recovery.
          </p>
          <p className="text-muted">10g before bedtime.</p>
        </a>
        <a className="list-group-item list-group-item-action flex-column align-items-start">
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">EFA, CLA, & GLA</h5>
          </div>
          <p className="mb-1">Supports brain and cardiovascular health.</p>
          <p className="text-muted">
            1g Omegas with breakfast lunch and dinner.
          </p>
        </a>
        <a className="list-group-item list-group-item-action flex-column align-items-start">
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">L-Carnitine</h5>
          </div>
          <p className="mb-1">
            Antioxidant; enhances weight loss and endurance performance.
          </p>
          <p className="text-muted">2g 20 min before cardio</p>
        </a>
        <a className="list-group-item list-group-item-action flex-column align-items-start">
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">Digestive Enzymes</h5>
            {/* <small className="text-muted">3 days ago</small> */}
          </div>
          <p className="mb-1">
            Breaks down Fats, Carbs & Protein. Optimizes Nutrient Availability.
          </p>
          <p className="text-muted">1 each with breakfast, lunch, and dinner</p>
        </a>
        <a className="list-group-item list-group-item-action flex-column align-items-start">
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">Multi-Vitamin</h5>
          </div>
          <p className="mb-1">Supports energy, immunity and metabolism.</p>
          <p className="text-muted">Once daily as directed</p>
        </a>
        <a className="list-group-item list-group-item-action flex-column align-items-start">
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">ALA</h5>
          </div>
          <p className="mb-1">Helps maintain a healthy blood sugar level.</p>
          <p className="text-muted">300mg with breakfast and lunch</p>
        </a>
        <a className="list-group-item list-group-item-action flex-column align-items-start">
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">BCAAs </h5>
          </div>
          <p className="mb-1">Help support muscle recovery & endurance.</p>
          <p className="text-muted">
            During cardio/workouts, or throughout the day.
          </p>
        </a>
      </div>
    );
  }
}

export default Guide;
