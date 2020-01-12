import React, {Component} from 'react'

import Footer from './Footer.js'
import {connect} from 'react-redux'
import * as actions from '../actions'
import Fade from 'react-reveal/Fade'
import Alert from 'react-s-alert'
import {Spring} from 'react-spring'
import Particles from 'react-particles-js'
import BetaRequestForm from './BetaRequestForm'
import SignUpForm from './SignUpV2'
import {useTheme} from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
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
// import SignUpForm from './SignUpForm.js'

const IconBlock = ({text, iconClass, title, icon}) => {
    return (
        <Fade bottom delay={500}>
            <div className="col-md-4 mb-4 text-center">
                {/* {icon} */}
                <i className={iconClass} id="icons" />
                <h5>{title}</h5>
                <p style={{color: 'white'}}>{text}</p>
            </div>
        </Fade>
    )
}

const LogoBtnBlock = ({formWithModal}) => {
    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.up('sm'))
    const large = useMediaQuery(theme.breakpoints.up('l'))
    // console.log(matches)
    return (
        <>
            <img
                src={require('./images/Trufit.png')}
                className="img-fluid"
                style={{
                    minWidth: 10,
                    margin: 'auto',
                    maxWidth: matches ? '50vw' : '70vw',
                    left: 0,
                    right: 0,
                    top: matches ? '20%' : '30%',
                    position: 'absolute'
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    textAlign: 'center',
                    width: '100%',
                    top: large ? '85%' : '65%'
                }}
            >
                <SignUpForm />
            </div>
        </>
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

    formWithModal = () => {
        //TODO: Fix form dimensions
        // const [openForm, setForm] = useState(false)
        // const success = useSelector(state => state.emails.successBetaRequest)
        return (
            <>
                <Button
                    className="MainButton"
                    onClick={() => this.signup()}
                    color="info"
                >
                    Sign Up For Our Public Beta, It's Free.
                </Button>
                <Modal isOpen={this.state.signup} toggle={() => this.signup()}>
                    <ModalHeader toggle={() => this.signup()}>
                        {/* Request Beta Access{' '} */}
                    </ModalHeader>
                    <ModalBody>
                        <SignUpForm />
                    </ModalBody>
                    <ModalFooter style={{padding: '0.5rem'}}>
                        <Button color="secondary" onClick={() => this.signup()}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </>
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
                            <h6>At it's core, it's a set of simple ideas:</h6>
                            <ul
                                style={{
                                    listStyle: 'none',
                                    padding: 0,
                                    fontSize: '1.1em'
                                }}
                            >
                                <li>
                                    That all of your nutritional and fitness
                                    planning should be in the same place.
                                </li>
                                <br />
                                <li>
                                    That the effectiveness of a program should
                                    be based on analytics and data driven
                                    results. Not popularity.
                                </li>
                                <br />
                                <li>
                                    That data should be used to learn how you do
                                    fitness and help you do it better.
                                </li>
                                <br />
                                <li>
                                    Lastly, it shouldn't cost you an arm, leg,
                                    or elbow for quality health & fitness
                                    management.
                                </li>
                            </ul>
                            <p></p>
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
                            'A Collection Of Workout Plans For Any Style of Training. [COMING SOON]'
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
                            'AI That Works For You Just Like A Real Trainer. [COMING SOON]'
                        }
                        iconClass={'fas fa-robot py-2'}
                    />
                </div>

                {/* <BetaRequestForm /> */}
            </div>
        )
    }

    render() {
        return (
            <div className="container-fluid bg-dark">
                <LogoBtnBlock formWithModal={this.formWithModal} />
                <div className="row title-head" id="header">
                    <Particles
                        params={{
                            particles: {
                                number: {
                                    value: 120,
                                    density: {
                                        enable: false,
                                        value_area: 300
                                    }
                                },
                                color: {
                                    value: '#ebebeb'
                                },
                                shape: {
                                    type: 'circle',
                                    stroke: {
                                        width: 2,
                                        color: '#2d2d2d'
                                    },
                                    polygon: {
                                        nb_sides: 4
                                    },
                                    image: {
                                        src: 'img/github.svg',
                                        width: 100,
                                        height: 100
                                    }
                                },
                                opacity: {
                                    value: 0.2725800503471389,
                                    random: true,
                                    anim: {
                                        enable: false,
                                        speed: 1,
                                        opacity_min: 0.1,
                                        sync: false
                                    }
                                },
                                size: {
                                    value: 12.02559045649142,
                                    random: true,
                                    anim: {
                                        enable: false,
                                        speed: 40,
                                        size_min: 0.1,
                                        sync: false
                                    }
                                },
                                line_linked: {
                                    enable: true,
                                    distance: 112.2388442605866,
                                    color: '#1aa172',
                                    opacity: 0.4,
                                    width: 1
                                },
                                move: {
                                    enable: true,
                                    speed: 4,
                                    direction: 'none',
                                    random: false,
                                    straight: false,
                                    out_mode: 'bounce',
                                    bounce: false,
                                    attract: {
                                        enable: false,
                                        rotateX: 600,
                                        rotateY: 1200
                                    }
                                }
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
                    />
                    {/* <div className="col d-md-block">
                        <Fade top>
                            <div className="arrow bounce">
                                <a className="fa fa-arrow-down fa-2x"></a>
                            </div>
                        </Fade>
                    </div> */}
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
