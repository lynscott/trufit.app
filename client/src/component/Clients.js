import React, { Component } from 'react'

// import pic_3 from '../img/clients/adam.jpg'

import "react-responsive-carousel/lib/styles/carousel.min.css"
import { Carousel } from 'react-responsive-carousel'

class ClientRoll extends Component {

  //DEPRECATED:
  // clientSection() {
  //   return (
  //     <div>

  //       <div id="carousel" className="carousel slide" data-ride="carousel">
  //         <ol className="carousel-indicators">
  //           <li data-target="#carousel" data-slide-to="0" className="active" />
  //           <li data-target="#carousel" data-slide-to="1" />
  //           {/* <li data-target="#carousel" data-slide-to="2" /> */}
  //         </ol>
  //         <div className="carousel-inner">
  //           <div className="carousel-item active">
  //             <img
  //               className="d-block w-100 img-fluid rounded"
  //               src={pic_1}
  //               alt="First slide"
  //             />
  //             <div className="carousel-caption d-none d-md-block">
  //               <h3>Adam F.</h3>
  //               <h4>
  //                 <em>Down 70 lbs!</em>
  //               </h4>
  //             </div>
  //           </div>
  //           <div className="carousel-item" id="client">
  //             <img
  //               className="d-block w-100 img-fluid rounded"
  //               src={pic_2}
  //               alt="Second slide"
  //             />
  //             <div className="carousel-caption d-none d-md-block">
  //               <h3>David S.</h3>
  //               <h4>
  //                 <em>Down 100 lbs!</em>
  //               </h4>
  //             </div>
  //           </div>
  //           {/* <div className="carousel-item">
  //             <img
  //               className="d-block w-100 img-fluid rounded"
  //               src={pic_3}
  //               alt="Third slide"
  //             />
  //             <div className="carousel-caption d-none d-md-block">
  //               <h3>David S.</h3>
  //               <h4>
  //                 <em>+ 30lbs!</em>
  //               </h4>
  //             </div>
  //           </div> */}
  //         </div>
  //         <a
  //           className="carousel-control-prev"
  //           href="#carousel"
  //           role="button"
  //           data-slide="prev"
  //         >
  //           <span className="carousel-control-prev-icon" aria-hidden="true" />
  //           <span className="sr-only">Previous</span>
  //         </a>
  //         <a
  //           className="carousel-control-next"
  //           href="#carousel"
  //           role="button"
  //           data-slide="next"
  //         >
  //           <span className="carousel-control-next-icon" aria-hidden="true" />
  //           <span className="sr-only">Next</span>
  //         </a>
  //       </div>
  //     </div>
  //   )
  // }


  render() {
    return (
      <div>
        <div className="row justify-content-center">
          <div className="col-sm-5">
          <Carousel 
            showThumbs={false}
            className='client-roll'
            // showArrows={false}
            showStatus={false}
            infiniteLoop={true}
            autoPlay={false}
            style={{borderRadius:'5px'}}
            >
                <div>
                    <img src={'https://cloud-cube.s3.amazonaws.com/fsh57utbg0z9/public/adam2.jpg'} />
                    <p className="legend">Adam F. - Down 70lbs</p>
                </div>
                <div>
                    <img src={'https://cloud-cube.s3.amazonaws.com/fsh57utbg0z9/public/david.png'} />
                    <p className="legend">David S. - Down 80lbs</p>
                </div>
                {/* <div>
                    <img src={pic_3} />
                    <p className="legend">Legend 3</p>
                </div> */}
            </Carousel>
          </div>
        </div>
      </div>
    )
  }
}

export default ClientRoll
