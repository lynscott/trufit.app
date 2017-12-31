module.exports = req => {
  const { type } = req.body[2];
  const { name } = req.body[1];
  const typePick = () => {
    if (type === 'Endomorph') {
      return `Recommended macronutrients ratio: 25%
       carbohydrates, 40%% protein, 35% fat<br />`;
    } else if (type === 'Ectomorph') {
      return `Recommended macronutrients ratio: 45% carbohydrates,
       40%% protein, 15% fat<br />`;
    } else if (type === 'Mesomorph') {
      return `Recommended macronutrients ratio: 40%
       carbohydrates, 30% protein, 30% fat<br />`;
    }
  };

  const planPick = () => {
    if (name === 'Muscle Up - Mass Gain Plan') {
      return `<p className="lead py-2">
           Try this training program out for building strength.
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
               <td>Back Squat (Smith Machine)</td>
               <td>3</td>
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
               <td>One Leg Body Weight Squats</td>
               <td>4</td>
               <td>10/leg</td>
               <td> - 1 - </td>
             </tr>
             <tr>
               <th scope="row">4</th>
               <td>Walking Lunges</td>
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
           </tbody>
         </table>`;
    } else if (name === 'Shredded - Fat Loss Plan') {
      return ` <p className="lead py-2">
          Try this starter training program out for weight loss.
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
            <tr>
              <th scope="row">5</th>
              <td>Saturday or Sunday</td>
              <td />
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
              <td>Back Squat(Smith Machine)</td>
              <td>4</td>
              <td>12, 10, 8, 8</td>
              <td> 2- 1 -2 </td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Leg Extension</td>
              <td>4</td>
              <td>15 ,12 ,10 ,8</td>
              <td>2 - 1 - 2</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Lateral Lunge</td>
              <td>4</td>
              <td>10</td>
              <td> - 1 - </td>
            </tr>
            <tr>
              <th scope="row">4</th>
              <td>Weighted Step-Ups</td>
              <td>4</td>
              <td>10/leg</td>
              <td> - 1 - </td>
            </tr>
            <tr>
              <th scope="row">5</th>
              <td>Leg Curls</td>
              <td>3</td>
              <td>15</td>
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
              <td>Bench Press (Machine)</td>
              <td>4</td>
              <td>15, 12, 10, 8</td>
              <td>2 - 1 - 2</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Incline Press</td>
              <td>4</td>
              <td>15, 12, 10, 8</td>
              <td>2 - 1 - 2</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>DB Flys</td>
              <td>4</td>
              <td>15, 12, 10, 8</td>
              <td>2 - 1 - 2</td>
            </tr>
            <tr>
              <th scope="row">4</th>
              <td>Machine Flys</td>
              <td>4</td>
              <td>12</td>
              <td> 2- 1 - 2</td>
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
              <td>15, 12, 10, 8</td>
              <td>3 - 1 - 2</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Dumbbell Row</td>
              <td>4</td>
              <td>10/Arm</td>
              <td>2 - 1 - 2</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Barbell Overhand Grip Row</td>
              <td>4</td>
              <td>10</td>
              <td>2 - 1 - 3</td>
            </tr>
            <tr>
              <th scope="row">4</th>
              <td>Standing Barbell Curl</td>
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
              <td>15, 12, 10 ,8</td>
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
              <td>12, 10, 8, 8</td>
              <td>1 - 1 - 1</td>
            </tr>
          </tbody>
        </table>`;
    } else if (name === 'Tone - Body Recomposition Plan') {
      return `<p className="lead py-2">
          Try this starter training program out for toning up.
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
          </tbody>
        </table>
        <h3>Back and Chest</h3>
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
          </tbody>
        </table>`;
    }
  };
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="theme-color" content="#000000">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">
        <link href="https://fonts.googleapis.com/css?family=Fira+Sans" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">
        <script defer src="https://use.fontawesome.com/releases/v5.0.1/js/all.js"></script>
      </head>
      <body>
        <div className="row">
        <div style="background-image: url(../img/cover_photo.png) cover center"  className="col-md-10 text-center bg-dark text-white">
          <h3>${req.body[1].name}</h3>
          <p></p>
        </div>
        <div classname="jumbotron">
          <p>
            To: ${req.body[0].person}<br/>
            Email: ${req.body[0].email}<br/>
            Body Type: ${type}<br/>
            <br/>${typePick()}
          </p>
            ${planPick()}
          <p>

            LS Fitness
          </p>
        </div>
      </div>
      </body>
    </html>
  `;
};
