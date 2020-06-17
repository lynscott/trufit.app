import {drawKeyPoints, drawSkeleton} from '../../config/posenet_utils'
import React, {Component} from 'react'
import * as posenet from '@tensorflow-models/posenet'
import * as tf from '@tensorflow/tfjs'
import * as tmPose from '@teachablemachine/pose'

import './PoseNet.scss'

import {
    useWindowSize,
    useWindowWidth,
    useWindowHeight
} from '@react-hook/window-size'

import * as math from 'mathjs'

const URL = 'https://teachablemachine.withgoogle.com/models/pAPXp2IhR/'

const flipHorizontal = true, //NOTE: Should be true for self facing webcam otherwise false
    algorithm = 'single-pose',
    minPoseConfidence = 0.1,
    minPartConfidence = 0.5,
    maxPoseDetections = 2,
    nmsRadius = 20,
    outputStride = 16,
    imageScaleFactor = 0.5,
    showPoints = true,
    showSkeleton = true,
    showVideo = true

const mobileConfig = {
    architecture: 'MobileNetV1',
    outputStride: 16,
    inputResolution: {width: 257, height: 200},
    multiplier: 1.0 //Could use this and or stride for performance slider
}

const maxPerformanceConfig = {
    architecture: 'ResNet50',
    outputStride: 32,
    inputResolution: {width: 257, height: 200},
    quantBytes: 4 //Could use this and or stride
}

const getCamera = async (videoWidth, videoHeight) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
            'Browser API navigator.mediaDevices.getUserMedia not available'
        )
    }

    let stream

    try {
        stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                facingMode: 'user',
                width: videoWidth,
                height: videoHeight
            }
        })
    } catch (error) {
        throw new Error(
            'This browser does not support video capture, or this device does not have a camera'
        )
    }

    return stream
}

export function usePoseNet(workout) {
    // Need refs here to handle state changes from callbacks
    const video = React.useRef(null)
    const canvas = React.useRef(null)
    const posenetModel = React.useRef(null)
    const active = React.useRef(false)
    const canvasContext = React.useRef(null)
    const machine = React.useRef(null)

    const videoWidth = useWindowWidth() - 20
    const videoHeight = useWindowHeight() - 85

    const [loading, setLoading] = React.useState(false)
    const [maxPerfMode, setPerfMode] = React.useState(false)
    const [config, setConfig] = React.useState(maxPerformanceConfig)
    const [poses, updatePoses] = React.useState([])
    const [updateWorkout, setUpdater] = React.useState(null)
    const modelURL = URL + 'model.json'
    const metadataURL = URL + 'metadata.json'

    const loadVideo = async () => {
        let cam = await getCamera(videoWidth, videoHeight)
        video.current = document.getElementById('videoNoShow')

        video.current.width = videoWidth //stream.width
        video.current.height = videoHeight //stream.height
        video.current.srcObject = cam

        return new Promise(resolve => {
            video.current.onloadedmetadata = () => {
                resolve(video.current.play())
            }
        })
    }

    const loadPoseNet = async () => {
        setLoading(true)
        let net

        try {
            net = await tmPose.load(modelURL, metadataURL) //posenet.load(config)
            // machine.current = net.model
            posenetModel.current = net
        } catch (error) {
            throw new Error('PoseNet failed to load')
        }

        return new Promise(resolve => {
            resolve(setLoading(false))
        })
    }

    const changeModel = value => {
        if (!value) {
            setConfig(maxPerformanceConfig)
            setPerfMode(true)
        } else {
            setConfig(mobileConfig)
            setPerfMode(false)
        }

        if (active.current) loadPoseNet()
    }

    const startPoseDetection = () => {
        canvas.current = document.getElementById('canvas')

        canvasContext.current = canvas.current.getContext('2d')

        canvas.current.width = videoWidth
        canvas.current.height = videoHeight

        findPoseDetectionFrame()
    }

    const start = async () => {
        active.current = true
        await loadVideo()
        await loadPoseNet()

        return new Promise(resolve => {
            resolve(startPoseDetection())
        })
    }

    const end = async () => {
        active.current = false
        await video.current.pause()
        await video.current.srcObject.getTracks().forEach(track => track.stop())
        video.current.src = null
        canvasContext.current.clearRect(0, 0, videoWidth, videoHeight)

        return new Promise(resolve => {
            posenetModel.current = null
            canvasContext.current.clearRect(0, 0, videoWidth, videoHeight)
            resolve()
        })
    }

    const findPoseDetectionFrame = async () => {
        let poses = []
        let predictions = []
        switch (algorithm) {
            case 'multi-pose': {
                const {
                    poses2,
                    posenetOutput2
                } = await posenetModel.current.estimatePose(
                    video.current,
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
                let {
                    pose,
                    posenetOutput
                } = await posenetModel.current.estimatePose(video.current, {
                    flipHorizontal
                })

                if (posenetOutput && posenetModel.current)
                    predictions = await posenetModel.current.predict(
                        posenetOutput
                    )
                console.log(pose, predictions)
                poses.push(pose || {})
                break
            }
        }

        workout.update(predictions)
        console.log(poses)
        updateCanvas(poses)

        if (active.current) requestAnimationFrame(findPoseDetectionFrame)
    }

    const updateCanvas = poses => {
        canvasContext.current.clearRect(0, 0, videoWidth, videoHeight)

        if (showVideo && video.current) {
            canvasContext.current.save()
            canvasContext.current.scale(-1, 1)
            canvasContext.current.translate(-videoWidth, 0)
            canvasContext.current.drawImage(
                video.current,
                0,
                0,
                videoWidth,
                videoHeight
            )
            canvasContext.current.restore()
        }

        poses.forEach(({score = 0, keypoints}) => {
            if (score >= minPoseConfidence) {
                if (showPoints) {
                    drawKeyPoints(
                        keypoints,
                        minPartConfidence,
                        canvasContext.current
                    )
                }

                if (showSkeleton) {
                    drawSkeleton(
                        keypoints,
                        minPartConfidence,
                        canvasContext.current
                    )
                }

                // workout.update(keypoints)
            }
        })
    }

    const calcImage = async () => {
        const imageElement = document.getElementById('push')

        const pose = await posenetModel.estimateSinglePose(imageElement, {
            flipHorizontal: false
        })

        const shoulder = [...Object.values(pose.keypoints[5].position)]
        const elbow = [...Object.values(pose.keypoints[7].position)]
        const wrist = [...Object.values(pose.keypoints[9].position)]

        const vec1 = math.subtract(shoulder, elbow)

        const vec2 = math.subtract(shoulder, wrist)

        const dot = math.dot(vec1, vec2)

        const norm1 = math.norm(vec1)

        const norm2 = math.norm(vec2)

        const cos = dot / (norm1 * norm2)

        const inv = math.acos(cos)

        const sin = math.cos(math.pi / 2 - inv)

        const invs = math.asin(sin) * (180 / math.pi)

        console.log('left degrees', math.round(invs))
    }

    return {
        start,
        end,
        posenetModel,
        poses,
        maxPerfMode,
        loading,
        changeMode: changeModel,
        setUpdater,
        isActive: active.current
    }
}
