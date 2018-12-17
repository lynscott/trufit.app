module.exports = req => {
    return `
      <html>
        <body>
          <div className="row">
          <div style="background-image: url(../img/cover_photo.png) cover center"  className="col-md-10 text-center bg-dark text-white">
            <h3>New Message!</h3>
          </div>
          <div classname="jumbotron">
          <h1>Welcome ${req.body.name}!</h1>
            <p>
              Thanks for signing up, we look forward getting to helping you reach your fitness goals!
              For any questions feel free to reach out to lynscott@lsphysique.com
  
              LS Fitness 2017
            </p>
          </div>
        </div>
        </body>
      </html>
    `;
  };