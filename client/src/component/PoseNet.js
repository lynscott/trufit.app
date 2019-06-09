import {drawKeyPoints, drawSkeleton} from '../config/posenet_utils'
import React, {Component} from 'react'
import * as posenet from '@tensorflow-models/posenet'
import './PoseNet.scss'
import { Image, Stage, Layer, } from 'react-konva'
import Konva from 'konva'

const devCamID = '5d38061eef9bd6f3102cc898f46cb16abb0954db308c8c3ca7e3c9289acf5baa'
const successColor = '#42f44e'

class PoseNet extends Component {
  static defaultProps = {
    videoWidth: 400,
    videoHeight: window.innerHeight/2,
    flipHorizontal: true,
    algorithm: 'single-pose',
    showVideo: true,
    showSkeleton: true,
    showPoints: true,
    minPoseConfidence: 0.1,
    minPartConfidence: 0.5,
    maxPoseDetections: 2,
    nmsRadius: 20,
    outputStride: 16,
    imageScaleFactor: 0.5,
    skeletonColor: '#008ed6',
    skeletonLineWidth: 6,
    loadingText: 'Loading...please be patient...'
  }

  constructor(props) {
    super(props, PoseNet.defaultProps)


    this.state={
      video:null,
      width: 0
    }
  }

  getCanvas = elem => {
    this.canvas = elem
  }

  getVideo = elem => {
    this.video = elem
  }

  async componentWillUnmount() {
    // this.video.stop()
    this.state.video.srcObject.getTracks().forEach(track => track.stop())
  }

  async componentDidMount() {
    const width = this.divElement.clientWidth
    this.setState({ width })

    try {
      await this.setupCamera()
    } catch (error) {
        console.log(error)
        return null
    //   throw new Error(
    //     'This browser does not support video capture, or this device does not have a camera'
    //   )
    }

    try {
      this.posenet = await posenet.load()
    } catch (error) {
      throw new Error('PoseNet failed to load')
    } finally {
      setTimeout(() => {
        this.setState({loading: false})
      }, 200)
    }

    this.detectPose()
  }

  async setupCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available'
      )
    }
    const {videoWidth, videoHeight} = this.props
    const video = this.video
    video.width = videoWidth
    video.height = videoHeight

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'user',
        deviceId: devCamID, //TODO: Remove later
        width: videoWidth,
        height: videoHeight
      }
    })

    video.srcObject = stream

    this.setState({video})

    return new Promise(resolve => {
      video.onloadedmetadata = () => {
        video.play()
        resolve(video)
      }
    })
  }

  detectPose() {
    const {videoWidth, videoHeight} = this.props
    const canvas = this.canvas
    const canvasContext = canvas.getContext('2d')

    canvas.width = videoWidth
    canvas.height = videoHeight

    this.poseDetectionFrame(canvasContext)
  }

  poseDetectionFrame(canvasContext) {
    const {
      algorithm,
      imageScaleFactor, 
      flipHorizontal, 
      outputStride, 
      minPoseConfidence, 
      minPartConfidence, 
      maxPoseDetections, 
      nmsRadius, 
      videoWidth, 
      videoHeight, 
      showVideo, 
      showPoints, 
      showSkeleton, 
      skeletonColor, 
      skeletonLineWidth 
      } = this.props

    const posenetModel = this.posenet
    const video = this.video

    const findPoseDetectionFrame = async () => {
      let poses = []

      switch (algorithm) {
        case 'multi-pose': {
          poses = await posenetModel.estimateMultiplePoses(
          video, 
          imageScaleFactor, 
          flipHorizontal, 
          outputStride, 
          maxPoseDetections, 
          minPartConfidence, 
          nmsRadius
          )
          break
        }
        case 'single-pose': {
          const pose = await posenetModel.estimateSinglePose(
          video, 
          imageScaleFactor, 
          flipHorizontal, 
          outputStride
          )
          poses.push(pose)
          break
        }
      }

      canvasContext.clearRect(0, 0, videoWidth, videoHeight)

      if (showVideo) {
        canvasContext.save()
        canvasContext.scale(-1, 1)
        canvasContext.translate(-videoWidth, 0)
        canvasContext.drawImage(video, 0, 0, videoWidth, videoHeight)
        canvasContext.restore()
      }


      poses.forEach(({score, keypoints}) => {
        if (score >= minPoseConfidence) {
          // console.log(keypoints, 'KEYPOINTS')
          if (showPoints) {
            drawKeyPoints(
              keypoints,
              minPartConfidence,
              skeletonColor,
              canvasContext
            )
          }
          if (showSkeleton ) {
            drawSkeleton(
              keypoints,
              minPartConfidence,
              this.assesSkeleton(keypoints) ? successColor : skeletonColor,
              skeletonLineWidth,
              canvasContext
            )
          }
        }
      })
      requestAnimationFrame(findPoseDetectionFrame)
    }
    findPoseDetectionFrame()
  }

  assesSkeleton = (keypoints) => {
    let knee = keypoints.find(point =>{
      return point.part === 'leftKnee'
    })

    let hip = keypoints.find(point =>{
      return point.part === 'leftHip'
    })

    let depth = Math.abs(knee.position.y - hip.position.y)
    // console.log(knee, hip, 'depth calc')
    if (depth < 20) return true
    else return false
  }

  handleClick = ( ) => {
    this.state.video.pause()
    this.state.video.srcObject.getTracks().forEach(track => track.stop())
    console.log('logged')
    // this.state.video.removeAttribute('src') // empty source

    // this.state.video.load()
  }

  render() {
    return (
        <div ref={ (divElement) => this.divElement = divElement}
             style={{padding:'10px', borderRadius:'10px'}} 
             className="embed-responsive embed-responsive-21by9">
          <video id="videoNoShow" playsInline ref={this.getVideo} />
          {/* <canvas className="webcam" ref={this.getCanvas} /> */}
          <Stage width={this.state.width} height={window.innerHeight/2}>
            <Layer>
              <Image
                    ref={this.getCanvas}
                    width={this.state.width} height={window.innerHeight/2}
                    image={this.state.video} shadowBlur={5}
                    onClick={this.handleClick}
                />
            </Layer>
          </Stage>
        </div>
    )
  }
}

export default PoseNet