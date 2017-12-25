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
            = Romanian Dead Lift{' '} Tempo: (seconds extend - seconds hold - seconds flexion)
          </p>
          <table className="table table-hover table-bordered">
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
                <td>Legs</td>
                <td>None</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Tuesday</td>
                <td>Chest & Triceps</td>
                <td>
                  20-30 mins<br />Steady State
                </td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Thurs</td>
                <td>Back & Biceps</td>
                <td>
                  20-30 mins<br />Steady State
                </td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>Friday</td>
                <td>Shoulders and Abs</td>
                <td>
                  20-30 mins<br />Steady State
                </td>
              </tr>
            </tbody>
          </table>
          <h3>Leg Day</h3>
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
                <td>Back Squat(Bar or Smith Machine)</td>
                <td>5</td>
                <td>10</td>
                <td> - 1 - </td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Leg Press</td>
                <td>4</td>
                <td>10</td>
                <td> - 1 - </td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Hack Squat</td>
                <td>4</td>
                <td>10</td>
                <td> - 1 - </td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>Weighted Walking Lunge</td>
                <td>4</td>
                <td>10/leg</td>
                <td> - 1 - </td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>Leg Curls</td>
                <td>3</td>
                <td>10</td>
                <td> - 1 - </td>
              </tr>
              <tr>
                <th scope="row">6</th>
                <td>Calf Raises</td>
                <td>4</td>
                <td>10</td>
                <td> - 1 - </td>
              </tr>
            </tbody>
          </table>
          <h3>Chest & Triceps</h3>
          <p>
            For taller people use DB for your bench press and incline press to
            help get a better range of motion.
          </p>
          <table className="table table-hover">
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
                <td>Bench Press</td>
                <td>4</td>
                <td>12</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Incline Press</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>DB Flys</td>
                <td>4</td>
                <td>8</td>
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
                <td>Tricep Extension (rope)</td>
                <td>4</td>
                <td>10</td>
                <td>1 - 1 - 1</td>
              </tr>
              <tr>
                <th scope="row">6</th>
                <td>Seated Dumbbell Overhead</td>
                <td>4</td>
                <td>8</td>
                <td> - 1 - </td>
              </tr>
            </tbody>
          </table>
          <h3>Back & Biceps</h3>
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
                <td>
                  Wide Grip <br /> Lat Pulldown
                </td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Dumbbell Row</td>
                <td>4</td>
                <td>10/Arm</td>
                <td>1 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>T-Bar Row</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>Barbell Overhand Grip Row</td>
                <td>4</td>
                <td>10</td>
                <td>1 - 1 - 3</td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>Standing Barbell Curl</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">6</th>
                <td>Standing Hammer Curl</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
            </tbody>
          </table>
          <h3>Shoulders & Abs</h3>
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
                <td>
                  Shoulder Press <br /> (Machine or DB)
                </td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Standing Lateral Raise</td>
                <td>4</td>
                <td>10</td>
                <td>1 - 1 - 3</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Rear Delt Flys</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>Barbell Upright Row</td>
                <td>4</td>
                <td>10</td>
                <td>1 - 1 - 1</td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>Hanging or Laying Leg Raises</td>
                <td>3</td>
                <td>15</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">6</th>
                <td>Situps</td>
                <td>3</td>
                <td>15</td>
                <td>2 - 1 - 2</td>
              </tr>
            </tbody>
          </table>
          <h1 id="mdo" className="py-3">
            Weeks 5-8
          </h1>
          <p>
            Keep your intensity and focus high! 60s rest break between sets.
          </p>
          <p>
            *Suggested Schedule, Adjust Accordingly*<br /> *SS = Super Set, *RDL
            = Romanian Dead Lift{' '} Tempo: (seconds extend - seconds hold - seconds flexion)
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
                <td>Legs</td>
                <td>None</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Tuesday</td>
                <td>Chest & Triceps</td>
                <td>
                  30 mins<br />Steady State
                </td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Thurs</td>
                <td>Back & Biceps</td>
                <td>
                  30 mins<br />Steady State
                </td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>Friday</td>
                <td>Shoulders and Abs</td>
                <td>
                  30 mins<br />Steady State
                </td>
              </tr>
            </tbody>
          </table>
          <h3>Leg Day</h3>
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
                <td>Back Squat (Bar)</td>
                <td>5</td>
                <td>10</td>
                <td> - 1 - </td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Leg Press & Walking Lunge *SS</td>
                <td>4, 4</td>
                <td>10, 10/ leg</td>
                <td> - 1 - </td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Hack Squat</td>
                <td>4</td>
                <td>10</td>
                <td> - 1 - </td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>*RDL Barbell or Dumbbells</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>Leg Curls</td>
                <td>3</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">6</th>
                <td>Standing Calf Raises & Seated Calf Raise SS</td>
                <td>3</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
            </tbody>
          </table>
          <h3>Chest & Triceps</h3>
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
                <td>Barbell Bench Press</td>
                <td>4</td>
                <td>12</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>DB Incline Press</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>DB Bench Press & DB Flys *SS</td>
                <td>4</td>
                <td>8</td>
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
                <td>Tricep Extension (rope)</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">6</th>
                <td>Seated Dumbbell Overhead</td>
                <td>4</td>
                <td>8</td>
                <td> - 1 - </td>
              </tr>
            </tbody>
          </table>
          <h3>Back & Biceps</h3>
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
                <td>
                  Wide Grip <br /> Lat Pulldown
                </td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Dumbbell Row & Straight Arm Pulldown *SS</td>
                <td>4, 4</td>
                <td>10/Arm, 12</td>
                <td>1 - 1 - 2, 2 - 1 - 1</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>T-Bar Row</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>DB Shrugs</td>
                <td>4</td>
                <td>15</td>
                <td>1 - 1 - 1</td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>Preacher Curl SS Hammer Curl</td>
                <td>4, 4</td>
                <td>10, 8</td>
                <td>2 - 1 - 2 for both</td>
              </tr>
              <tr>
                <th scope="row">6</th>
                <td>Standing Cable Curl Drop Set</td>
                <td>2</td>
                <td>Failure, Drop Weight & Continue x 3</td>
                <td>2 - 1 - 2</td>
              </tr>
            </tbody>
          </table>
          <h3>Shoulders & Abs</h3>
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
                <td>
                  Shoulder Press <br /> (Machine or DB)
                </td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Standing Lateral Raise</td>
                <td>4</td>
                <td>10</td>
                <td>1 - 1 - 3</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Rear Delt Flys</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>Seated Arnold Press</td>
                <td>4</td>
                <td>10</td>
                <td>1 - 1 - 1</td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>Hanging or Laying Leg Raises</td>
                <td>3</td>
                <td>15</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">6</th>
                <td>Situps</td>
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
            = Romanian Dead Lift{' '} Tempo: (seconds extend - seconds hold - seconds flexion)
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
                <td>Legs</td>
                <td>None</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Tuesday</td>
                <td>Chest</td>
                <td>
                  20-30 mins<br />Steady State
                </td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Thurs</td>
                <td>Back</td>
                <td>
                  20-30 mins<br />Steady State
                </td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>Friday</td>
                <td>Shoulders and Abs</td>
                <td>
                  20-30 mins<br />Steady State
                </td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>Saturday or Sunday</td>
                <td>Arms</td>
                <td>No Cardio</td>
              </tr>
            </tbody>
          </table>
          <h3>Leg Day</h3>
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
                <td>Back Squat(Barbell) & RDLs *SS </td>
                <td>5</td>
                <td>10, 8</td>
                <td> - 1 - </td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Leg Press & Walking Lunge *SS</td>
                <td>4, 4</td>
                <td>10, 10/ leg</td>
                <td> - 1 - </td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Hack Squat</td>
                <td>4</td>
                <td>10</td>
                <td> - 1 - </td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>Leg Curls</td>
                <td>3</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>Standing Calf Raises & Seated Calf Raise SS</td>
                <td>3</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
            </tbody>
          </table>
          <h3>Chest</h3>
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
                <td>Barbell Bench Press</td>
                <td>5</td>
                <td>12</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>DB Incline Press</td>
                <td>5</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>DB Bench Press & DB Flys *SS</td>
                <td>5</td>
                <td>8</td>
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
                <td>Cable Flys & Dips *SS</td>
                <td>4</td>
                <td>12</td>
                <td> 2- 1 - 2</td>
              </tr>
            </tbody>
          </table>
          <h3>Back </h3>
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
                <td>
                  Wide Grip <br /> Lat Pulldown
                </td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Dumbbell Row & Straight Arm Pulldown *SS</td>
                <td>4, 4</td>
                <td>10/Arm, 12</td>
                <td>1 - 1 - 2, 2 - 1 - 1</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>T-Bar Row & Pullups(Assisted or Regular) *SS</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>DB Shrugs & Rear Delt Flys *SS</td>
                <td>4</td>
                <td>15</td>
                <td>1 - 1 - 1</td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>Seated Row, Wide Grip Drop Set</td>
                <td>2</td>
                <td>Failure, Drop Weight x 3</td>
                <td>1 - 1 - 1</td>
              </tr>
            </tbody>
          </table>
          <h3>Shoulders & Abs</h3>
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
                <td>
                  Shoulder Press <br /> (Machine or DB)
                </td>
                <td>5</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Standing Tri-Lateral Raise</td>
                <td>4</td>
                <td>10</td>
                <td>1 - 1 - 1</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Rear Delt Flys</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>Seated Arnold Press</td>
                <td>4</td>
                <td>10</td>
                <td>1 - 1 - 1</td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>Hanging or Laying Leg Raises</td>
                <td>3</td>
                <td>15</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">6</th>
                <td>Situps</td>
                <td>3</td>
                <td>15</td>
                <td>2 - 1 - 2</td>
              </tr>
            </tbody>
          </table>
          <h3>Arms</h3>
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
                <td>Preacher Curl & Hammer Curl *SS</td>
                <td>4, 4</td>
                <td>10, 8</td>
                <td>2 - 1 - 2 for both</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Standing Cable Curl Drop Set</td>
                <td>3</td>
                <td>Failure, Drop Weight & Continue x 3</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Tricep Extension (rope)</td>
                <td>4</td>
                <td>10</td>
                <td>2 - 1 - 2</td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>Seated Dumbbell Overhead</td>
                <td>4</td>
                <td>8</td>
                <td> - 1 - </td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>Barbell Skull Crushers</td>
                <td>4</td>
                <td>8</td>
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
