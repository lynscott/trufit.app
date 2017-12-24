module.exports = req => {
  return `
    <html>
      <body>
        <div className="row">
        <div style="background-image: url(../img/cover_photo.png) cover center"  className="col text-center bg-dark text-white">
          <h3>New Training Form Submission!</h3>
        </div>
        <div classname="jumbotron">
          <div className="row">
            <div className="col text-center">
          <p>
            From: ${req.body.first + ' ' + req.body.last}<br/>
            Phone Number: ${req.body.phone}<br/>
            Email: ${req.body.email}<br/>
            Age: ${req.body.age}
          </p>
        </div>
        <div className="col text center">
      <p>
        Gender: ${req.body.gender}<br/>
        Weight: ${req.body.weight}<br/>
        Height: ${req.body.height}<br/>
        Body Fat: ${req.body.body_fat}
      </p>
    </div>
        </div>
        <div className="row">
          <div className="col text-center">
        <p>
          Goal: ${req.body.goal}<br/>
          Hitsory: ${req.body.history}<br/>
          Curren Diet: ${req.body.diet}<br/>
        </p>
      </div>
      <div className="col text center">
    <p>
      Availability: ${req.body.call_info}<br/>
      Motivation: ${req.body.motivation}<br/>
      Plan: ${req.body.plan}
    </p>
  </div>
      </div>
          <p>
            Thanks for reaching out! We'll get back to you shortly.

            LS Fitness
          </p>
        </div>
      </div>
      </body>
    </html>
  `;
};
