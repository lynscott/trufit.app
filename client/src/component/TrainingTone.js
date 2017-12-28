import React, { Component } from 'react';

class Plan extends Component {
  render() {
    return (
      <section>
        <nav id="navbar-example2" className="navbar navbar-light bg-light">
          <ul className="nav nav-pills mx-auto">
            <li className="nav-item">
              <a className="nav-link" href="#fat">
                Weeks 1-4
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#mdo">
                Weeks 5-8
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#athlete">
                Weeks 9-12
              </a>
            </li>
          </ul>
        </nav>
        <div data-spy="scroll" data-target="#navbar-example2" data-offset="10">
          <h1 id="fat" className="py-3">
            Weeks 1-4
          </h1>
          <p>
            Keep your intensity and focus high! Be sure to warm up properly and
            keep your form strict. 60s rest break between sets.
          </p>
          <p>
            *Suggested Schedule, Adjust Accordingly*<br /> *SS = Super Set, *RDL
            = Romanian Dead Lift Tempo: (seconds extend - seconds hold - seconds
            flexion)
          </p>
          <table className="table table-hover table-responsive-sm table-bordered">
            <thead className="thead-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Day</th>
                <th scope="col">Muscle Group</th>
                <th scope="col">Cardio</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Monday</td>
                <td>Legs & Glutes</td>
                <td>None</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Tuesday</td>
                <td>Back and Chest</td>
                <td>
                  20-30 mins<br />Steady State
                </td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Thurs</td>
                <td>Legs & Glutes</td>
                <td>
                  HITT<br />10 rounds/ 20 seconds active 40seconds rest
                </td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>Friday</td>
                <td>Shoulders and Arms</td>
                <td>
                  20-30 mins<br />Steady State
                </td>
              </tr>
            </tbody>
          </table>
          <h3>Legs & Glutes 1</h3>
          <table className="table table-responsive-sm table-hover">
            <thead className="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Excercise</th>
                <th scope="col">Sets</th>
                <th scope="col">Reps</th>
                <th scope="col">Tempo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>*Warm-Up* Body Weight Squat</td>
                <td>2</td>
                <td>20</td>
                <td> - 1 - </td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>RDLs *Squeeze Glutes At the Top of the Movement*</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Glute Bridge (No Weight)</td>
                <td>4</td>
                <td>15</td>
                <td> 2- 1 -2 </td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>Glute Kickback</td>
                <td>4</td>
                <td>15/leg</td>
                <td> - 1 - </td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>Lateral Lunge</td>
                <td>4</td>
                <td>10 each direction</td>
                <td> - 1 - </td>
              </tr>
            </tbody>
          </table>
          <h3>Back and Chest</h3>
          <p>
            For taller people use DB for your bench press and incline press to
            help get a better range of motion.
          </p>
          <table className="table table-responsive-sm table-hover">
            <thead className="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Excercise</th>
                <th scope="col">Sets</th>
                <th scope="col">Reps</th>
                <th scope="col">Tempo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Pushups (Regular or with Knees)</td>
                <td>4</td>
                <td>10</td>
                <td> - 1 - </td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Lat Pulldown</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Seated Cable Row</td>
                <td>4</td>
                <td>12</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>Machine Flys</td>
                <td>4</td>
                <td>12</td>
                <td> 2- 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>Assisted Pullups *Adjust Weight To Reach 10*</td>
                <td>4</td>
                <td>10</td>
                <td>1 - 1 - 1</td>
              </tr>
            </tbody>
          </table>
          <h3>Shoulders & Arms</h3>
          <table className="table table-responsive-sm table-hover">
            <thead className="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Excercise</th>
                <th scope="col">Sets</th>
                <th scope="col">Reps</th>
                <th scope="col">Tempo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Standing Barbell Shoulder Press</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>DB Lateral Raise</td>
                <td>4</td>
                <td>12</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Rear Delt Flys *Machine*</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>Barbell Bicep Curl</td>
                <td>4</td>
                <td>10</td>
                <td> - 1 - </td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>Dips</td>
                <td>4</td>
                <td>10</td>
                <td> - 1 - </td>
              </tr>
              <tr>
                <th scope="row">6</th>
                <td>Face Pulls</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
            </tbody>
          </table>
          <h3>Legs and Glutes 2</h3>
          <table className="table table-responsive-sm table-hover">
            <thead className="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Excercise</th>
                <th scope="col">Sets</th>
                <th scope="col">Reps</th>
                <th scope="col">Tempo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Stiffed Leg Barbell Deadlift</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Barbell Hip Thrust</td>
                <td>4</td>
                <td>10</td>
                <td> - 1 - </td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Walking Lunge</td>
                <td>4</td>
                <td>20 steps</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>One leg DB Squat</td>
                <td>4</td>
                <td>10/leg</td>
                <td>1 - 1 - 1</td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>Standing Calf Raise</td>
                <td>3</td>
                <td>15</td>
                <td>2 - 1 - 2</td>
              </tr>
            </tbody>
          </table>
          <h1 id="mdo" className="py-3">
            Week 5-8
          </h1>
          <p>
            Keep your intensity and focus high! 60s rest break between sets.
          </p>
          <p>
            *Suggested Schedule, Adjust Accordingly*<br /> *SS = Super Set, *RDL
            = Romanian Dead Lift Tempo: (seconds extend - seconds hold - seconds
            flexion)
          </p>
          <table className="table table-responsive-sm table-hover">
            <thead className="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Excercise</th>
                <th scope="col">Sets</th>
                <th scope="col">Reps</th>
                <th scope="col">Tempo</th>
              </tr>
            </thead>
            <h3>Legs & Glutes 1</h3>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>*Warm-Up* Body Weight Squat</td>
                <td>2</td>
                <td>20</td>
                <td> - 1 - </td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>RDLs *Squeeze Glutes At the Top of the Movement*</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Glute Bridge (Single Leg) </td>
                <td>4</td>
                <td>15</td>
                <td> 2- 1 -2 </td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>Cable Glute Kickback</td>
                <td>4</td>
                <td>15/leg</td>
                <td> - 1 - </td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>Barbell Walking Lunge</td>
                <td>3</td>
                <td>20 Steps</td>
                <td> - 1 - </td>
              </tr>
            </tbody>
          </table>
          <h3>Back and Chest</h3>
          <p>
            For taller people use DB for your bench press and incline press to
            help get a better range of motion.
          </p>
          <table className="table table-responsive-sm table-hover">
            <thead className="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Excercise</th>
                <th scope="col">Sets</th>
                <th scope="col">Reps</th>
                <th scope="col">Tempo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Pushups (Regular or with Knees)</td>
                <td>4</td>
                <td>10</td>
                <td> - 1 - </td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Lat Pulldown</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>DB Bench Press</td>
                <td>4</td>
                <td>12</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>Incline DB Flys</td>
                <td>4</td>
                <td>12</td>
                <td> 2- 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>Assisted Pullups *Adjust Weight To Reach 10*</td>
                <td>4</td>
                <td>15</td>
                <td>1 - 1 - 1</td>
              </tr>
            </tbody>
          </table>
          <h3>Shoulders & Arms</h3>
          <table className="table table-responsive-sm table-hover">
            <thead className="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Excercise</th>
                <th scope="col">Sets</th>
                <th scope="col">Reps</th>
                <th scope="col">Tempo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Standing Barbell Shoulder Press</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>DB Lateral Raise</td>
                <td>4</td>
                <td>12</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Rear Delt Flys *Machine*</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>Barbell Bicep Curl</td>
                <td>4</td>
                <td>10</td>
                <td> - 1 - </td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>Bench Dips</td>
                <td>4</td>
                <td>10</td>
                <td> - 1 - </td>
              </tr>
              <tr>
                <th scope="row">6</th>
                <td>Standing DB Tricep Extension</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
            </tbody>
          </table>
          <h3>Legs and Glutes 2</h3>
          <table className="table table-responsive-sm table-hover">
            <thead className="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Excercise</th>
                <th scope="col">Sets</th>
                <th scope="col">Reps</th>
                <th scope="col">Tempo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Stiffed Leg Barbell Deadlift</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Barbell Hip Thrust</td>
                <td>4</td>
                <td>10</td>
                <td> - 1 - </td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>DB Walking Lunge</td>
                <td>4</td>
                <td>20 steps</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>One Leg DB Squat</td>
                <td>4</td>
                <td>10/leg</td>
                <td>1 - 1 - 1</td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>Leg Press</td>
                <td>4</td>
                <td>12</td>
                <td>2 - 1 - 3</td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>Standing Calf Raise</td>
                <td>3</td>
                <td>15</td>
                <td>2 - 1 - 2</td>
              </tr>
            </tbody>
          </table>
          <h1 id="athlete" className="py-3">
            Weeks 9-12
          </h1>
          <p>
            Challenge yourself and push a good weight, the last two reps should
            be a challenge!
            <br />Take 60s between sets.
          </p>
          <p>
            *Suggested Schedule, Adjust Accordingly*<br /> *SS = Super Set, *RDL
            = Romanian Dead Lift Tempo: (seconds extend - seconds hold - seconds
            flexion)
          </p>
          <h3>Leg Day 1</h3>
          <table className="table table-responsive-sm table-hover">
            <thead className="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Excercise</th>
                <th scope="col">Sets</th>
                <th scope="col">Reps</th>
                <th scope="col">Tempo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>*Warm-Up* Body Weight Squat</td>
                <td>2</td>
                <td>20</td>
                <td> - 1 - </td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>RDLs *Squeeze Glutes At the Top of the Movement*</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Glute Bridge Weighted</td>
                <td>4</td>
                <td>15</td>
                <td> 2- 1 -2 </td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>Back Squat</td>
                <td>4</td>
                <td>12</td>
                <td> - 1 - </td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>Smith Machine Reverse Lunge</td>
                <td>4</td>
                <td>10/Leg</td>
                <td> - 1 - </td>
              </tr>
            </tbody>
          </table>
          <h3>Back and Chest</h3>
          <p>
            For taller people use DB for your bench press and incline press to
            help get a better range of motion.
          </p>
          <table className="table table-responsive-sm table-hover">
            <thead className="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Excercise</th>
                <th scope="col">Sets</th>
                <th scope="col">Reps</th>
                <th scope="col">Tempo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Pushups (Regular or with Knees)</td>
                <td>4</td>
                <td>10</td>
                <td> - 1 - </td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Lat Pulldown</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Cable Crossover</td>
                <td>4</td>
                <td>12</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>DB Row</td>
                <td>4</td>
                <td>10/arm</td>
                <td> 2- 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>Assisted Pullups *Adjust Weight To Reach 10*</td>
                <td>4</td>
                <td>10</td>
                <td>1 - 1 - 1</td>
              </tr>
            </tbody>
          </table>
          <h3>Shoulders & Arms</h3>
          <table className="table table-responsive-sm table-hover">
            <thead className="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Excercise</th>
                <th scope="col">Sets</th>
                <th scope="col">Reps</th>
                <th scope="col">Tempo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Standing DB Shoulder Press</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>DB Lateral Raise</td>
                <td>4</td>
                <td>12</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Rear Delt Flys *Incline Bench*</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>DB Bicep Curl Alternating</td>
                <td>4</td>
                <td>10</td>
                <td> - 1 - </td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>Dips</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">6</th>
                <td>Face Pulls</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
            </tbody>
          </table>
          <h3>Legs and Glutes 2</h3>
          <table className="table table-responsive-sm table-hover">
            <thead className="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Excercise</th>
                <th scope="col">Sets</th>
                <th scope="col">Reps</th>
                <th scope="col">Tempo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Box Jumps</td>
                <td>2</td>
                <td>20</td>
                <td> - - </td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Leg Extension</td>
                <td>4</td>
                <td>10</td>
                <td> - 1 - </td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Seated Leg Curl</td>
                <td>4</td>
                <td>20 steps</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>DB Squat</td>
                <td>4</td>
                <td>15</td>
                <td>1 - 1 - 1</td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>Seated Calf Raise</td>
                <td>3</td>
                <td>15</td>
                <td>2 - 1 - 2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    );
  }
}

export default Plan;
