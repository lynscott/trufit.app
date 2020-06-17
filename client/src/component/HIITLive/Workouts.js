// import * as tf from '@tensorflow/tfjs'
import * as math from 'mathjs'
import React, {useEffect, useState, useRef} from 'react'
import * as posenet from '@tensorflow-models/posenet'
import UIfx from 'uifx'

import counterSound from './sounds/countdown-3.mp3'
import endRound from './sounds/success.mp3'
import nextRound from './sounds/score-beep.mp3'

function* makeGenLoop(arr) {
    for (let i = 0; ; i++) {
        if (i === arr.length) i = 0
        yield arr[i]
    }
}

const countDown = new UIfx(counterSound, {
    volume: 1, // number between 0.0 ~ 1.0
    throttleMs: 0
})

const success = new UIfx(endRound, {
    volume: 1, // number between 0.0 ~ 1.0
    throttleMs: 0
})
const go = new UIfx(nextRound, {
    volume: 0.5, // number between 0.0 ~ 1.0
    throttleMs: 100
})

const WORKOUTS0 = {
    Toe_Taps: {
        name: 'Toe Tap',
        keyStates: 2,
        scoreMultiplier: 2,
        getState: pose => toeTaps(pose)
    },
    Jumping_Jacks: {
        name: 'Jumping Jacks',
        keyStates: 2,
        scoreMultiplier: 1.5,
        getState: pose => jumpingJacks(pose)
    },
    Side_Squat_Jumps: {
        name: 'Side Squat Jumps',
        keyStates: 3,
        scoreMultiplier: 3,
        getState: pose => sideSquatJump(pose)
    }
}

const NEUTRAL_STANDING = 'Standing'
const SQUAT = 'Squat'
const JUMP = 'Jump'
const JUMPING_JACK = 'Jumping_Jack'
const R_LAT_LUNGE = 'Right_LL'
const L_LAT_LUNGE = 'Left_LL'
const PUSH_UP = 'Push_Up'
const PUSH_DOWN = 'Push_Down'
const PUSH_UP_KNEES = 'Push_Up_Knees'
const PUSH_DOWN_KNEES = 'Push_Down_Knees'

const WORKOUTS = {
    Squat: {
        name: 'Squats',
        keyStates: 2,
        states: {1: NEUTRAL_STANDING, 2: SQUAT},
        scoreMultiplier: 2
    },
    Jumping_Jacks: {
        name: 'Jumping Jacks',
        keyStates: 2,
        states: {1: NEUTRAL_STANDING, 2: JUMPING_JACK},
        scoreMultiplier: 1.5
    },
    Lateral_Lunge: {
        name: 'Lateral Lunge',
        keyStates: 2,
        states: {1: NEUTRAL_STANDING, 2: R_LAT_LUNGE, 2: L_LAT_LUNGE},
        scoreMultiplier: 3
    }
    // PushUps: {
    //     name: 'Push Ups',
    //     keyStates: 2,
    //     states: {
    //         1: PUSH_UP,
    //         1: PUSH_UP_KNEES,
    //         2: PUSH_DOWN,
    //         2: PUSH_DOWN_KNEES
    //     },
    //     scoreMultiplier: 1
    // },
    // Burpees: {
    //     name: 'Burpees',
    //     keyStates: 4,
    //     states: {
    //         1: NEUTRAL_STANDING,
    //         2: PUSH_UP,
    //         3: SQUAT,
    //         4: NEUTRAL_STANDING
    //     },
    //     scoreMultiplier: 5
    // }
}

//Ice skaters, squat jumps

const THRESHOLD = 0.2

function formatKeypoints(keys) {
    let ret = {}
    for (let i = 0; i < keys.length; i++) {
        ret[keys[i].part] = keys[i]
    }
    return ret
}

//General interval gen
const getRandomInterval = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min

/**
 * MEGA MODEL
 * Combines exercises, switcher, state reading and debugging
 */
export const useWorkout = () => {
    let [currentExercise, updateCurrentExercise] = useState(null)

    const score = useRef(0)
    const pace = useRef(0)
    const totalPace = useRef(0)

    const reps = useRef(0) //Current exercise reps
    const repTimes = useRef([]) //Array of current rep times
    const totalRepTimes = useRef([]) //Total reps times
    const totalReps = useRef(0) //Total reps done

    const prevState = useRef(null)
    const nextState = useRef(null)
    const keyStates = useRef(null)
    const session = useSession()

    const changeExercise = async (exercise = null) => {
        let e
        if (exercise) e = WORKOUTS[exercise]
        else e = getRandomWorkout()
        updateCurrentExercise(e)
        reps.current = 0
        pace.current = 0
        repTimes.current = []
        keyStates.current = makeGenLoop(
            [...Array(e.keyStates).keys()].map(x => (x += 1))
        )
        prevState.current = null
        nextState.current = keyStates.current.next().value
        return await new Promise(r => setTimeout(r, 500))
    }

    //Generate random workout model
    const getRandomWorkout = () => {
        let keys = Object.keys(WORKOUTS)
        return WORKOUTS[keys[getRandomInterval(0, keys.length - 1)]]
    }

    // Main function for analyzing pose
    const update = predictions => {
        if (predictions) {
            let state = 0
            let shouldUpdate = predictions.some(
                p =>
                    p.className === currentExercise.states[nextState.current] &&
                    p.probability >= 0.95
            )
            if (shouldUpdate) state = nextState.current
            console.log(state, predictions)

            if (
                state !== 0 &&
                state !== prevState.current &&
                state === nextState.current
            ) {
                prevState.current = state
                nextState.current = keyStates.current.next().value

                if (state === currentExercise.keyStates) {
                    // Updates rep times
                    let now = Math.round(new Date() / 1000)
                    repTimes.current.push(now)
                    totalRepTimes.current.push(now)

                    if (reps.current > 1) {
                        // update pace
                        let time =
                            repTimes.current[repTimes.current.length - 1] -
                            repTimes.current[0]
                        pace.current = Math.round(
                            (repTimes.current.length - 1) / (time / 30)
                        )

                        let totalTime =
                            totalRepTimes.current[
                                totalRepTimes.current.length - 1
                            ] - totalRepTimes.current[0]
                        totalPace.current = Math.round(
                            (totalRepTimes.current.length - 1) /
                                (totalTime / 30)
                        )
                    }

                    reps.current += 1
                    totalReps.current += 1

                    score.current += Math.round(
                        ((reps.current + totalRepTimes.current) / 2) *
                            ((totalPace.current + pace.current) / 2 / 30) *
                            currentExercise.scoreMultiplier
                    )
                }
            }
        }
    }

    useEffect(() => changeExercise(), [])

    useEffect(() => {
        const switcher = async () => await changeExercise()

        if (session.active && session.time === 0) switcher()
    }, [session.time])

    return {
        reps: reps.current,
        pace: pace.current,
        score: score.current,
        totalReps: totalReps.current,
        totalPace: totalPace.current,
        options: Object.keys(WORKOUTS),
        changeExercise,
        currentExercise,
        update,
        session
    }
}

// Kind of a glorified stop watch but for random time intervals
/**
 * Hook for managing random exercise time in a workout
 *
 */
const useSession = () => {
    const [timer, setTimer] = React.useState(0)
    const [sessionTime, setSessTime] = React.useState(null)
    const [watch, setWatch] = React.useState(0)
    const [active, setActive] = React.useState(false)
    const [totalTime, updateTotalTime] = React.useState(0)
    const updating = React.useRef(false)

    const updateWatch = () => {
        setWatch(prevWatch => prevWatch + 1)
        updateTotalTime(prevTime => prevTime + 1)
    }

    const handleSession = () => {
        updating.current = true
        initWorkout()
        setActive(true)
    }

    const endSession = async () => {
        setActive(false)
        clearInterval(sessionTime)
        setWatch(0)
        setTimer(0)
        await new Promise(r => r())
    }

    //For visual timer
    const timerInterval = () => setInterval(updateWatch, 1000)

    // Callback function for setting random workout
    const initWorkout = async () => {
        //Set initial timer
        setTimer(getRandomInterval(10, 60))

        await new Promise(r => setTimeout(r, 3000))

        updating.current = false
        go.play()

        //Set a new stopwatch interval
        setSessTime(timerInterval())
    }

    React.useEffect(() => {
        if (timer !== 0 && timer === watch) {
            // setStatus(true)
            //Init next exercise timeout
            clearInterval(sessionTime)
            updating.current = true
            setWatch(0)
            setTimer(0)
            success.play()

            //Setup first exercise
            initWorkout()
        }

        if (timer - watch < 6 && timer - watch > 0) {
            countDown.play()
        }
    }, [watch])

    React.useEffect(() => {
        return () => {
            clearInterval(sessionTime)
        }
    }, [])

    return {
        time: timer - watch,
        totalTime,
        active,
        updating: updating.current,
        start: () => handleSession(),
        end: () => endSession()
    }
}

const toeTaps = pose => {
    const KEYPOINTS = [
        'leftHip',
        'rightHip',
        'leftAnkle',
        'rightAnkle',
        'leftElbow',
        'leftShoulder',
        'leftWrist',
        'rightElbow',
        'rightShoulder',
        'rightWrist'
    ]

    const getStats = pose => {
        let kps = formatKeypoints(pose)

        if (KEYPOINTS.every(k => kps[k].score > THRESHOLD)) {
            let e_hips = new Edge(kps['leftHip'], kps['rightHip']),
                e_ankles = new Edge(kps['leftAnkle'], kps['rightAnkle']),
                e_lelbow_lshoulder = new Edge(
                    kps['leftElbow'],
                    kps['leftShoulder']
                ),
                e_lelbow_lwrist = new Edge(kps['leftElbow'], kps['leftWrist']),
                e_relbow_rshoulder = new Edge(
                    kps['rightElbow'],
                    kps['rightShoulder']
                ),
                e_relbow_rwrist = new Edge(
                    kps['rightElbow'],
                    kps['rightWrist']
                ),
                j_lelbow = new Joint(e_lelbow_lshoulder, e_lelbow_lwrist),
                j_relbow = new Joint(e_relbow_rshoulder, e_relbow_rwrist)

            return {
                e_hips_norm: e_hips.norm,
                e_ankles_norm: e_ankles.norm,
                j_lelbow_angle: j_lelbow.angle,
                j_relbow_angle: j_relbow.angle
            }
        } else return null
    }

    const getState = stats => {
        if (stats !== null) {
            if (stats['e_ankles_norm'] <= stats['e_hips_norm']) {
                if (
                    stats['j_lelbow_angle'] >= 90 &&
                    stats['j_relbow_angle'] <= 90
                )
                    return 1
                else if (
                    stats['j_relbow_angle'] >= 90 &&
                    stats['j_lelbow_angle'] <= 90
                )
                    return 2
                else return 0
            } else return 0
        } else return 0
    }

    let stats = getStats(pose)
    return getState(stats)
}

const jumpingJacks = pose => {
    const KEYPOINTS = [
        'leftHip',
        'rightHip',
        'leftAnkle',
        'rightAnkle',
        'leftElbow',
        'leftShoulder',
        'rightElbow',
        'rightShoulder'
    ]

    const getStats = pose => {
        let kps = formatKeypoints(pose)

        if (KEYPOINTS.every(k => kps[k].score > THRESHOLD)) {
            let e_hips = new Edge(kps['leftHip'], kps['rightHip'])
            let e_ankles = new Edge(kps['leftAnkle'], kps['rightAnkle'])
            let e_lshoulder_lelbow = new Edge(
                kps['leftShoulder'],
                kps['leftElbow']
            )
            let e_lshoulder_lhip = new Edge(kps['leftShoulder'], kps['leftHip'])
            let e_rshoulder_relbow = new Edge(
                kps['rightShoulder'],
                kps['rightElbow']
            )
            let e_rshoulder_rhip = new Edge(
                kps['rightShoulder'],
                kps['rightHip']
            )

            let j_lshoulder = new Joint(e_lshoulder_lelbow, e_lshoulder_lhip)
            let j_rshoulder = new Joint(e_rshoulder_relbow, e_rshoulder_rhip)

            return {
                e_hips_norm: e_hips.norm,
                e_ankles_norm: e_ankles.norm,
                j_lshoulder_angle: j_lshoulder.angle,
                j_rshoulder_angle: j_rshoulder.angle
            }
        } else return null
    }

    const getState = stats => {
        if (stats !== null) {
            if (
                stats['e_ankles_norm'] <= stats['e_hips_norm'] &&
                stats['j_lshoulder_angle'] <= 30 &&
                stats['j_rshoulder_angle'] <= 30
            )
                return 1
            else if (
                stats['e_ankles_norm'] >= stats['e_hips_norm'] * 1.5 &&
                stats['j_lshoulder_angle'] >= 110 &&
                stats['j_rshoulder_angle'] >= 110
            )
                return 2
            else return 0
        } else return 0
    }

    let stats = getStats(pose)
    return getState(stats)
}

const sideSquatJump = pose => {
    const KEYPOINTS = [
        'leftElbow',
        'leftShoulder',
        'leftWrist',
        'rightElbow',
        'rightShoulder',
        'rightWrist',
        'leftHip',
        'rightHip',
        'leftKnee',
        'rightKnee',
        'leftAnkle',
        'rightAnkle'
    ]

    const getStats = pose => {
        let kps = formatKeypoints(pose)

        if (KEYPOINTS.every(k => kps[k].score > THRESHOLD)) {
            let e_lelbow_lshoulder = new Edge(
                    kps['leftElbow'],
                    kps['leftSshoulder']
                ),
                e_lelbow_lwrist = new Edge(kps['leftElbow'], kps['leftWrist']),
                e_relbow_rshoulder = new Edge(
                    kps['rightElbow'],
                    kps['rightShoulder']
                ),
                e_relbow_rwrist = new Edge(
                    kps['rightElbow'],
                    kps['rightWrist']
                ),
                e_lshoulder_rshoulder = new Edge(
                    kps['leftShoulder'],
                    kps['rightShoulder']
                ),
                e_lwrist_rwrist = new Edge(kps['leftWrist'], kps['rightWrist']),
                e_hips = new Edge(kps['leftHip'], kps['rightHip']),
                e_ankles = new Edge(kps['leftAnkle'], kps['rightAnkle']),
                j_lelbow = new Joint(e_lelbow_lshoulder, e_lelbow_lwrist),
                j_relbow = new Joint(e_relbow_rshoulder, e_relbow_rwrist)

            return {
                e_shoulders_norm: e_lshoulder_rshoulder.norm,
                e_wrists_norm: e_lwrist_rwrist.norm,
                e_hips_norm: e_hips.norm,
                e_ankles_norm: e_ankles.norm,
                j_lelbow_angle: j_lelbow.angle,
                j_relbow_angle: j_relbow.angle
            }
        } else return null
    }

    const getState = stats => {
        if (stats !== null) {
            if (
                stats['e_wrists_norm'] <= stats['e_shoulders_norm'] &&
                stats['j_lelbow_angle'] <= 90 &&
                stats['j_relbow_angle'] <= 90
            )
                if (stats['e_ankles_norm'] <= stats['e_hips_norm'] * 1.5)
                    return 1
                else if (stats['e_ankles_norm'] >= stats['e_hips_norm'] * 2.0)
                    return 2
                else return 0
            else if (
                stats['e_wrists_norm'] >= stats['e_shoulders_norm'] &&
                stats['e_ankles_norm'] <= stats['e_hips_norm'] * 1.5 &&
                stats['j_lelbow_angle'] >= 150 &&
                stats['j_relbow_angle'] >= 150
            )
                return 3
            else return 0
        } else return 0
    }

    let stats = getStats(pose)
    return getState(stats)
}

////// ^^^^NEW ^^^^ /////////////////

class Edge {
    constructor(k_a, k_b) {
        this.__slots__ = ['k_a', 'k_b', 'vec', 'norm', 'center', 'score']

        this.k_a = [...Object.values(k_a.position), 0]
        this.k_b = [...Object.values(k_b.position), 0]
        this.vec = math.subtract(this.k_a, this.k_b)

        this.norm = math.norm(this.vec)
    }

    findAngle(edge) {
        let cosAng = math.dot(this.vec, edge.vec)
        let sinAng = math.norm(math.cross(this.vec, edge.vec))
        let angle = math.atan2(sinAng, cosAng)

        let dot = math.dot(this.vec, edge.vec)

        let norm1 = math.norm(this.vec)

        let norm2 = math.norm(edge.vec)

        let cos = dot / (norm1 * norm2)

        let inv = math.acos(cos)

        let sin = math.cos(math.pi / 2 - inv)

        let invs = math.asin(sin) * (180 / math.pi)

        // console.log('left degress', angle, invs, `\n`)
        // console.log('MY FUNC', math.round(invs))
        // console.log('STANDARD', angle * (180 / Math.PI))

        return angle * (180 / Math.PI)
    }

    rad2deg(rad) {
        const pi_on_180 = 0.017453292519943295
        return rad / pi_on_180
    }
}

class Joint {
    constructor(e_a, e_b) {
        this.e_a = e_a
        this.e_b = e_b
        this.angle = this.e_a.findAngle(this.e_b)
        this.length = this.e_a.length + this.e_b.length
    }
}

//////////////// DEPRECATED  BELOW /////////////

class Workout {
    /** Base class for tracking workout progress with movement analysis **/
    constructor(n_keystates, scoreMultiplier) {
        this.THRESHOLD = 0.2
        this.N_KEYSTATES = n_keystates
        this.KEYSTATES = makeGenLoop(
            [...Array(n_keystates).keys()].map(x => (x += 1))
        )
        this._prev_state = null
        this._next_state = this.KEYSTATES.next().value
        this.stats = null
        this.scoreMultiplier = scoreMultiplier
        this.reps = 0
        this.pace = 0
        this.score = 0
        // this._init_time = Math.round(new Date() / 1000)
        this._reps_time = []

        this.redis_client = new Map()
        this.redis_client.set('reps', this.reps)
        this.redis_client.set('pace', this.pace)
    }

    getStats(pose) {
        throw Error('Not Implemented!')
    }

    getState(stats) {
        throw Error('Not Implemented!')
    }

    formatKeypoints(keys) {
        let ret = {}
        for (let i = 0; i < keys.length; i++) {
            ret[keys[i].part] = keys[i]
        }
        return ret
    }

    update(pose) {
        if (pose) {
            this.stats = this.getStats(pose)
            let state = this.getState(this.stats)

            if (
                state !== 0 &&
                state !== this._prev_state &&
                state === this._next_state
            ) {
                this._prev_state = state
                this._next_state = this.KEYSTATES.next().value
                if (state === this.N_KEYSTATES) {
                    this._reps_time.push(Math.round(new Date() / 1000))
                    if (this.reps > 1) {
                        let time =
                            this._reps_time[this._reps_time.length - 1] -
                            this._reps_time[0]

                        this.pace = Math.round(
                            (this._reps_time.length - 1) / (time / 30)
                        )
                    }
                    this.reps += 1
                    this.score +=
                        this.reps * (this.pace / 30) * this.scoreMultiplier
                    console.log(
                        this.pace,
                        this.score,
                        this._reps_time,
                        'PACE - SCORE -  TIMES',
                        this.reps
                    )
                    this.redis_client.set('reps', this.reps)
                    this.redis_client.set('pace', this.pace)
                }
            }
        }
    }
}

class JumpingJacks extends Workout {
    constructor() {
        super(2, 1.5)

        this.name = 'Jumping Jacks'
        this.n_keystates = 2
        this.scoreMultiplier = 1.5

        this.KEYPOINTS = [
            'leftHip',
            'rightHip',
            'leftAnkle',
            'rightAnkle',
            'leftElbow',
            'leftShoulder',
            'rightElbow',
            'rightShoulder'
        ]
    }

    getStats(pose) {
        let kps = this.formatKeypoints(pose)

        if (this.KEYPOINTS.every(k => kps[k].score > this.THRESHOLD)) {
            let e_hips = new Edge(kps['leftHip'], kps['rightHip'])
            let e_ankles = new Edge(kps['leftAnkle'], kps['rightAnkle'])
            let e_lshoulder_lelbow = new Edge(
                kps['leftShoulder'],
                kps['leftElbow']
            )
            let e_lshoulder_lhip = new Edge(kps['leftShoulder'], kps['leftHip'])
            let e_rshoulder_relbow = new Edge(
                kps['rightShoulder'],
                kps['rightElbow']
            )
            let e_rshoulder_rhip = new Edge(
                kps['rightShoulder'],
                kps['rightHip']
            )

            let j_lshoulder = new Joint(e_lshoulder_lelbow, e_lshoulder_lhip)
            let j_rshoulder = new Joint(e_rshoulder_relbow, e_rshoulder_rhip)

            return {
                e_hips_norm: e_hips.norm,
                e_ankles_norm: e_ankles.norm,
                j_lshoulder_angle: j_lshoulder.angle,
                j_rshoulder_angle: j_rshoulder.angle
            }
        } else return null
    }

    getState(stats) {
        if (stats !== null) {
            if (
                stats['e_ankles_norm'] <= stats['e_hips_norm'] &&
                stats['j_lshoulder_angle'] <= 30 &&
                stats['j_rshoulder_angle'] <= 30
            )
                return 1
            else if (
                stats['e_ankles_norm'] >= stats['e_hips_norm'] * 1.5 &&
                stats['j_lshoulder_angle'] >= 110 &&
                stats['j_rshoulder_angle'] >= 110
            )
                return 2
            else return 0
        } else return 0
    }
}

class ToeTap extends Workout {
    constructor() {
        super(2, 3)

        this.name = 'Toe Tap'
        this.n_keystates = 2
        this.scoreMultiplier = 2

        this.KEYPOINTS = [
            'leftHip',
            'rightHip',
            'leftAnkle',
            'rightAnkle',
            'leftElbow',
            'leftShoulder',
            'leftWrist',
            'rightElbow',
            'rightShoulder',
            'rightWrist'
        ]
    }

    getStats(pose) {
        let kps = this.formatKeypoints(pose)

        if (this.KEYPOINTS.every(k => kps[k].score > this.THRESHOLD)) {
            let e_hips = new Edge(kps['leftHip'], kps['rightHip']),
                e_ankles = new Edge(kps['leftAnkle'], kps['rightAnkle']),
                e_lelbow_lshoulder = new Edge(
                    kps['leftElbow'],
                    kps['leftShoulder']
                ),
                e_lelbow_lwrist = new Edge(kps['leftElbow'], kps['leftWrist']),
                e_relbow_rshoulder = new Edge(
                    kps['rightElbow'],
                    kps['rightShoulder']
                ),
                e_relbow_rwrist = new Edge(
                    kps['rightElbow'],
                    kps['rightWrist']
                ),
                j_lelbow = new Joint(e_lelbow_lshoulder, e_lelbow_lwrist),
                j_relbow = new Joint(e_relbow_rshoulder, e_relbow_rwrist)

            return {
                e_hips_norm: e_hips.norm,
                e_ankles_norm: e_ankles.norm,
                j_lelbow_angle: j_lelbow.angle,
                j_relbow_angle: j_relbow.angle
            }
        } else return null
    }

    getState(stats) {
        if (stats !== null) {
            if (stats['e_ankles_norm'] <= stats['e_hips_norm']) {
                if (
                    stats['j_lelbow_angle'] >= 90 &&
                    stats['j_relbow_angle'] <= 90
                )
                    return 1
                else if (
                    stats['j_relbow_angle'] >= 90 &&
                    stats['j_lelbow_angle'] <= 90
                )
                    return 2
                else return 0
            } else return 0
        } else return 0
    }
}

class PushUp extends Workout {
    constructor() {
        super(2, 1)

        this.name = 'Push Ups'
        this.n_keystates = 2
        this.scoreMultiplier = 1

        this.KEYPOINTS = [
            'leftElbow',
            'leftShoulder',
            'leftWrist',
            'rightElbow',
            'rightShoulder',
            'rightWrist',
            'leftAnkle',
            'rightAnkle',
            'nose'
        ]
    }

    getStats(pose) {
        let kps = this.formatKeypoints(pose)

        if (this.KEYPOINTS.every(k => kps[k].score > this.THRESHOLD)) {
            let e_lelbow_lshoulder = new Edge(
                    kps['leftElbow'],
                    kps['leftShoulder']
                ),
                e_lelbow_lwrist = new Edge(kps['leftElbow'], kps['leftWrist']),
                e_relbow_rshoulder = new Edge(
                    kps['rightElbow'],
                    kps['rightShoulder']
                ),
                e_relbow_rwrist = new Edge(
                    kps['rightElbow'],
                    kps['rightWrist']
                ),
                e_lshoulder_rshoulder = new Edge(
                    kps['leftShoulder'],
                    kps['rightShoulder']
                ),
                j_lelbow = new Joint(e_lelbow_lshoulder, e_lelbow_lwrist),
                j_relbow = new Joint(e_relbow_rshoulder, e_relbow_rwrist),
                j_lshoulder = new Joint(
                    e_lshoulder_rshoulder,
                    e_lelbow_lshoulder
                ),
                j_rshoulder = new Joint(
                    e_lshoulder_rshoulder,
                    e_relbow_rshoulder
                )

            return {
                j_lelbow_angle: j_lelbow.angle,
                j_relbow_angle: j_relbow.angle,
                j_lshoulder_angle: j_lshoulder.angle,
                j_rshoulder_angle: j_rshoulder.angle,
                y_lankle: kps['leftAnkle'].position.y,
                y_rankle: kps['rightAnkle'].position.y,
                y_nose: kps['nose'].position.y
            }
        } else return null
    }

    getState(stats) {
        if (stats !== null) {
            console.log(stats['j_lelbow_angle'], stats['j_relbow_angle'], 'ALL')
            let ankleY = (stats['y_lankle'] + stats['y_rankle']) / 2
            let nose = stats['y_nose']
            if (
                // stats['j_lelbow_angle'] >= 150 &&
                // stats['j_relbow_angle'] >= 150 &&
                // stats['j_lshoulder_angle'] <= 120 &&
                // stats['j_rshoulder_angle'] <= 120
                Math.abs(ankleY - nose) >= 100
            ) {
                return 1
            } else if (
                // stats['j_lelbow_angle'] <= 100 &&
                // stats['j_relbow_angle'] <= 100 &&
                // stats['j_lshoulder_angle'] >= 150 &&
                // stats['j_rshoulder_angle'] >= 150
                Math.abs(ankleY - nose) <= 20
            ) {
                console.log(stats, 'Goal!!!!!!!!!!!!!!!')
                return 2
            } else return 0
        } else return 0
    }
}

class SideSquatJump extends Workout {
    constructor() {
        super(3, 3)

        this.name = 'Side Squat Jumps'
        this.n_keystates = 3
        this.scoreMultiplier = 3

        this.KEYPOINTS = [
            'leftElbow',
            'leftShoulder',
            'leftWrist',
            'rightElbow',
            'rightShoulder',
            'rightWrist',
            'leftHip',
            'rightHip',
            'leftKnee',
            'rightKnee',
            'leftAnkle',
            'rightAnkle'
        ]
    }

    getStats(pose) {
        let kps = this.formatKeypoints(pose)

        if (this.KEYPOINTS.every(k => kps[k].score > this.THRESHOLD)) {
            let e_lelbow_lshoulder = new Edge(
                    kps['leftElbow'],
                    kps['leftSshoulder']
                ),
                e_lelbow_lwrist = new Edge(kps['leftElbow'], kps['leftWrist']),
                e_relbow_rshoulder = new Edge(
                    kps['rightElbow'],
                    kps['rightShoulder']
                ),
                e_relbow_rwrist = new Edge(
                    kps['rightElbow'],
                    kps['rightWrist']
                ),
                e_lshoulder_rshoulder = new Edge(
                    kps['leftShoulder'],
                    kps['rightShoulder']
                ),
                e_lwrist_rwrist = new Edge(kps['leftWrist'], kps['rightWrist']),
                e_hips = new Edge(kps['leftHip'], kps['rightHip']),
                e_ankles = new Edge(kps['leftAnkle'], kps['rightAnkle']),
                j_lelbow = new Joint(e_lelbow_lshoulder, e_lelbow_lwrist),
                j_relbow = new Joint(e_relbow_rshoulder, e_relbow_rwrist)

            return {
                e_shoulders_norm: e_lshoulder_rshoulder.norm,
                e_wrists_norm: e_lwrist_rwrist.norm,
                e_hips_norm: e_hips.norm,
                e_ankles_norm: e_ankles.norm,
                j_lelbow_angle: j_lelbow.angle,
                j_relbow_angle: j_relbow.angle
            }
        } else return null
    }

    getState(stats) {
        if (stats !== null) {
            if (
                stats['e_wrists_norm'] <= stats['e_shoulders_norm'] &&
                stats['j_lelbow_angle'] <= 90 &&
                stats['j_relbow_angle'] <= 90
            )
                if (stats['e_ankles_norm'] <= stats['e_hips_norm'] * 1.5)
                    return 1
                else if (stats['e_ankles_norm'] >= stats['e_hips_norm'] * 2.0)
                    return 2
                else return 0
            else if (
                stats['e_wrists_norm'] >= stats['e_shoulders_norm'] &&
                stats['e_ankles_norm'] <= stats['e_hips_norm'] * 1.5 &&
                stats['j_lelbow_angle'] >= 150 &&
                stats['j_relbow_angle'] >= 150
            )
                return 3
            else return 0
        } else return 0
    }
}

class Squat extends Workout {
    constructor() {
        super(2, 2)

        this.name = 'Body Weight Squat'
        this.n_keystates = 2
        this.scoreMultiplier = 2

        this.KEYPOINTS = [
            'leftElbow',
            'leftShoulder',
            'leftWrist',
            'rightElbow',
            'rightShoulder',
            'rightWrist',
            'leftHip',
            'rightHip',
            'leftKnee',
            'rightKnee',
            'leftAnkle',
            'rightAnkle'
        ]
    }

    getStats(pose) {
        let kps = this.formatKeypoints(pose)

        if (this.KEYPOINTS.every(k => kps[k].score > this.THRESHOLD)) {
            let e_lelbow_lshoulder = new Edge(
                    kps['leftElbow'],
                    kps['leftSshoulder']
                ),
                e_lelbow_lwrist = new Edge(kps['leftElbow'], kps['leftWrist']),
                e_relbow_rshoulder = new Edge(
                    kps['rightElbow'],
                    kps['rightShoulder']
                ),
                e_relbow_rwrist = new Edge(
                    kps['rightElbow'],
                    kps['rightWrist']
                ),
                e_lshoulder_rshoulder = new Edge(
                    kps['leftShoulder'],
                    kps['rightShoulder']
                ),
                e_lwrist_rwrist = new Edge(kps['leftWrist'], kps['rightWrist']),
                e_hips = new Edge(kps['leftHip'], kps['rightHip']),
                e_ankles = new Edge(kps['leftAnkle'], kps['rightAnkle']),
                j_lelbow = new Joint(e_lelbow_lshoulder, e_lelbow_lwrist),
                j_relbow = new Joint(e_relbow_rshoulder, e_relbow_rwrist)

            return {
                e_shoulders_norm: e_lshoulder_rshoulder.norm,
                e_wrists_norm: e_lwrist_rwrist.norm,
                e_hips_norm: e_hips.norm,
                e_ankles_norm: e_ankles.norm,
                j_lelbow_angle: j_lelbow.angle,
                j_relbow_angle: j_relbow.angle
            }
        } else return null
    }

    getState(stats) {
        if (stats !== null) {
            if (
                stats['e_wrists_norm'] <= stats['e_shoulders_norm'] &&
                stats['j_lelbow_angle'] <= 90 &&
                stats['j_relbow_angle'] <= 90
            )
                if (stats['e_ankles_norm'] <= stats['e_hips_norm'] * 1.5)
                    return 1
                else if (stats['e_ankles_norm'] >= stats['e_hips_norm'] * 2.0)
                    return 2
                else return 0
            else if (
                stats['e_wrists_norm'] >= stats['e_shoulders_norm'] &&
                stats['e_ankles_norm'] <= stats['e_hips_norm'] * 1.5 &&
                stats['j_lelbow_angle'] >= 150 &&
                stats['j_relbow_angle'] >= 150
            )
                return 3
            else return 0
        } else return 0
    }
}

const WORKOUTS2 = {
    Toe_Taps: ToeTap,
    Jumping_Jacks: JumpingJacks,
    // Push_Ups: PushUp,
    Side_Squat_Jumps: SideSquatJump
}

export default WORKOUTS2
