module.exports = req => {
    return `
      <html>
        <body>
          <div className="row">
          <div style="background-image: url(https://cloud-cube.s3.amazonaws.com/fsh57utbg0z9/public/logo2_edit.png) cover center"  className="col-md-10 text-center bg-dark text-white">
            <h3>Welcome!</h3>
          </div>
          <div classname="jumbotron">

            <h4>
              Hey ${req.body.name}, <br/><br/>
              Thanks for signing up! We're excited to tag along on your journey to achieving your fitness goals!
              A few things you can do to get started in your dashboard:
              - Choose a goal for yourself, weight loss/gain, maintenance.
              - Fill in your affirmation!
              - Create a nutrition plan and schedule meal times.
              - Setup a fitness plan. <br/>
              <br/>
              Lets get started!<br/>
              www.tru-fit.co
              <br/>
              <br/>
              <br/>
              TruFit.ai Inc.
            </h4>
          </div>
        </div>
        </body>
      </html>
    `;
  };