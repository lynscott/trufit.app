import React, { Component } from 'react';
import StrengthPlan from '../Strength/StrengthPlan';
import ShredPlan from '../Shred/ShredPlan';
import TonePlan from '../Tone/TonePlan';

class PremiumPlans extends Component {
  render() {
    return (
      <div>
        <div className="row justify-content-center">
          <StrengthPlan />
          <ShredPlan />
          <TonePlan />
        </div>
        <br />
        <hr />
        <h3>Follow Lyn On IG! @Lsphysique</h3>
        <br />
        <div className="row justify-content-center">
          <script src="//lightwidget.com/widgets/lightwidget.js" />
          <iframe
            title="IG Feed"
            src="//lightwidget.com/widgets/03c4457e13fa5ce4ba5131e79fceb9ad.html"
            scrolling="no"
            allowtransparency="true"
            className="lightwidget-widget"
          />
        </div>
      </div>
    );
  }
}

export default PremiumPlans;
