import React, { Component } from 'react';
import NutritionGuide from './NutritionGuide';
import SupplementGuide from './SupplementGuide';
import TrainingStrength from './TrainingStrength';
import TrainingTone from './TrainingTone';
import TrainingWeightLoss from './TrainingWeightLoss';
import LoadingBar from './LoadingBar';

class PlanHeader extends Component {
  trainingSelector() {
    switch (this.props.planType) {
      case 'Savage Strength':
        return <TrainingStrength />;
      case 'Weight Loss':
        return <TrainingWeightLoss />;
      case 'Tone & Sculpt':
        return <TrainingTone />;
      default:
        return <LoadingBar />;
    }
  }

  render() {
    const calories = this.props.caloricGoal;
    return (
      <div id="accordion" role="tablist">
        <div className="card">
          <div className="card-header" role="tab" id="headingOne">
            <h5 className="mb-0">
              <a
                data-toggle="collapse"
                className="btn btn-dark"
                href="#collapseOne"
                aria-expanded="false"
                aria-controls="collapseOne"
              >
                Training Guide
              </a>
            </h5>
          </div>

          <div
            id="collapseOne"
            className="collapse show"
            role="tabpanel"
            aria-labelledby="headingOne"
            data-parent="#accordion"
          >
            <div className="card-body bg-dark">{this.trainingSelector()}</div>
          </div>
        </div>
        <div className="card">
          <div className="card-header" role="tab" id="headingTwo">
            <h5 className="mb-0">
              <a
                className="collapsed btn btn-dark"
                data-toggle="collapse"
                href="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                Nutrition Guide
              </a>
            </h5>
          </div>
          <div
            id="collapseTwo"
            className="collapse"
            role="tabpanel"
            aria-labelledby="headingTwo"
            data-parent="#accordion"
          >
            <div className="card-body bg-dark">
              <NutritionGuide caloricGoal={calories} />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header bg-light" role="tab" id="headingThree">
            <h5 className="mb-0">
              <a
                className="collapsed btn btn-dark"
                data-toggle="collapse"
                href="#collapseThree"
                aria-expanded="false"
                aria-controls="collapseThree"
              >
                Supplement Guide
              </a>
            </h5>
          </div>
          <div
            id="collapseThree"
            className="collapse"
            role="tabpanel"
            aria-labelledby="headingThree"
            data-parent="#accordion"
          >
            <div className="card-body bg-dark">
              <SupplementGuide />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PlanHeader;
