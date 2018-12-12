import React, { Component } from 'react';
import StrengthPlan from '../Strength/StrengthPlan';
import ShredPlan from '../Shred/ShredPlan';
import TonePlan from '../Tone/TonePlan';

class PremiumPlans extends Component {
  render() {
    return (
      <div>
        <div className="row justify-content-center">
        </div>
        <div className="row justify-content-center">
          <StrengthPlan />
          <ShredPlan />
          <TonePlan />
        </div>
        {/*  */}
      </div>
    );
  }
}

export default PremiumPlans;
