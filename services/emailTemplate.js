module.exports = req => {
  return `
    <html>
      <body>
        <div className="row">
        <div style="background-image: url(../img/cover_photo.png) cover center"  className="col-md-10 text-center bg-dark text-white">
          <h3>New Message!</h3>
        </div>
        <div classname="jumbotron">
          <p>
            From: ${req.body.name}<br/>
            <br/>
            Email: ${req.body.email}
          </p>
          <p className="lead py-2">
            New User 
          </p>
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
