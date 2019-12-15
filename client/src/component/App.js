import React, {Component} from 'react'

import Footer from './Footer.js'
import {connect} from 'react-redux'
import * as actions from '../actions'
import Fade from 'react-reveal/Fade'
import Alert from 'react-s-alert'
import {Spring} from 'react-spring'
import Particles from 'react-particles-js'
import BetaRequestForm from './BetaRequestForm'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/scale.css'
import './App2.scss'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Badge,
    Input,
    InputGroup,
    InputGroupAddon,
    Card,
    CardBody,
    CardTitle,
    CardSubtitle,
    CardText,
    CardImg
} from 'reactstrap'

const IconBlock = ({text, iconClass, title, icon}) => {
    return (
        <Fade bottom delay={500}>
            <div className="col-md-4 mb-4 text-center">
                {/* {icon} */}
                <i className={iconClass} id="icons" />
                <h5 style={{color: 'white'}}>{title}</h5>
                <p>{text}</p>
            </div>
        </Fade>
    )
}

const InfoText = [
    'Train smarter with custom plans that factor in your body fat, BMR, and activity level instantly.'
]

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            users: [],
            text: '',
            modal: false,
            signup: false
        }

        this.toggle = this.toggle.bind(this)
        this.signup = this.signup.bind(this)
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        })
    }

    signup() {
        this.setState({
            signup: !this.state.signup
        })
    }

    componentDidMount() {
        //TODO: Create refresh token
        // this.props.fetchUser()
        // if (localStorage.getItem('token')) {
        //   let token = localStorage.getItem('token')
        //   this.props.mountToken(token)
        //   this.props.fetchUserLocal(token)
        // } else {
        //   this.props.fetchUser()
        // }
    }

    renderInfoBlock = () => {
        return (
            <Card>
                <CardImg
                    top
                    width="100%"
                    src="/assets/318x180.svg"
                    alt="Card image cap"
                />
                <CardBody>
                    <CardTitle>Card title</CardTitle>
                    <CardSubtitle>Card subtitle</CardSubtitle>
                    <CardText>
                        Some quick example text to build on the card title and
                        make up the bulk of the card's content.
                    </CardText>
                    <Button>Button</Button>
                </CardBody>
            </Card>
        )
    }

    renderHomeBlocks = () => {
        return (
            <div className="row justify-content-center p-3" id="test-div">
                <div
                    id="demo-block"
                    className="row justify-content-center p-2 align-items-center text-white section-row"
                >
                    <div className="col-md-8 align-middle">
                        <Fade bottom>
                            <h1 className="section-header">What's TruFit?</h1>
                            <p>
                                In a nutshell we're the Netflix of online
                                fitness. Get it? Okay we'll expand a bit more.
                            </p>
                        </Fade>
                        {/* <Fade left>
                <img
                  className="d-block w-100 img-fluid rounded"
                  src={'https://cloud-cube.s3.amazonaws.com/fsh57utbg0z9/public/dash_prev.webp'}
                  alt="img of dash"
                />
              </Fade> */}
                    </div>
                </div>
                <div
                    id="icon-block"
                    className="row p-3 text-dark section-row align-items-center"
                >
                    <IconBlock
                        text={`Hundreds of fitness plans to chose from across many disciplines of fitness. 
                Curated by professional trainers from all over the world through our Trainer Advocate program.`}
                        iconClass={'fas fa-check-double py-2'}
                        icon={<FontAwesomeIcon icon={'robot'} size="3x" />}
                        title={
                            'A Collection Of Workout Plans For Any Style of Training.'
                        }
                    />
                    <IconBlock
                        text={`We built a system from the ground up to help you manage your macros, create nutrition plans,
                 manage your workout schedule, and keep track of your goals.`}
                        title={'A Full Nutrition & Fitness Tracking Platform.'}
                        iconClass={'fas fa-dumbbell py-2'}
                    />
                    <IconBlock
                        text={`Our AI analyzes your physical and dietary activity to recommend actions based on your goal.
                  In a surplus? We'll bump up your activity to get you back on track.`}
                        title={
                            'AI That Works For You Just Like A Real Trainer.'
                        }
                        iconClass={'fas fa-robot py-2'}
                    />
                </div>

                <BetaRequestForm />
            </div>
        )
    }

    render() {
        return (
            <div className="container-fluid bg-dark">
                <div className="row title-head" id="header">
                    <div className="col d-md-block">
                        <Particles
                            params={{
                                particles: {
                                    number: {
                                        value: 80,
                                        density: {
                                            enable: true,
                                            value_area: 500
                                        }
                                    },
                                    size: {
                                        value: 3
                                    }
                                },
                                color: {
                                    value: '#d41b5c'
                                },
                                interactivity: {
                                    events: {
                                        onhover: {
                                            enable: true,
                                            mode: 'repulse'
                                        }
                                    }
                                }
                            }}
                            style={{
                                width: '100%',
                                backgroundImage: require('./images/Trufit.png')
                            }}
                        />
                        {/* <Fade top>
                            <img
                                src={require('./images/Trufit.png')}
                                className="img-fluid"
                                style={{
                                    minWidth: 10,
                                    marginBottom: 0,
                                    maxWidth: '50vw'
                                }}
                            />
                            <div className="arrow bounce">
                                <a className="fa fa-arrow-down fa-2x"></a>
                            </div> */}
                        {/* <h5
                className="main-header p-2"
                id="title-line"
                style={{ textDecoration: 'none' }}
              >
                Changing fitness one workout at a time. 
              </h5> */}
                        {/* <blockquote class="blockquote">
                <p class="mb-0">In a time of deceit, telling the truth is a revolutionary act.</p>
                <footer class="blockquote-footer">George Orwell</footer>
              </blockquote> */}
                        {/* </Fade> */}
                        {/* <div className="row pt-3">
                            <Fade top delay={1000}>
                    
                            </Fade>
                        </div> */}
                    </div>
                </div>

                {this.renderHomeBlocks()}

                <div className="row justify-content-center">
                    <div className="col footer">
                        <Footer />
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(null, actions)(App)
