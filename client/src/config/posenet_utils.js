import * as posenet from '@tensorflow-models/posenet'
import * as tf from '@tensorflow/tfjs'

const pointRadius = 3

const color = 'rgb(26, 161, 114)'
const boundingBoxColor = 'red'
const lineWidth = 2

function toTuple({y, x}) {
    return [y, x]
}

export function OLDdrawKeyPoints(
    keypoints,
    minConfidence,
    skeletonColor,
    canvasContext,
    scale = 1
) {
    keypoints.forEach(keypoint => {
        if (keypoint.score >= minConfidence) {
            const {x, y} = keypoint.position
            canvasContext.beginPath()
            canvasContext.arc(x * scale, y * scale, pointRadius, 0, 2 * Math.PI)
            canvasContext.fillStyle = skeletonColor
            canvasContext.fill()
        }
    })
}

function OLDdrawSegment(
    [firstX, firstY],
    [nextX, nextY],
    color,
    lineWidth,
    scale,
    canvasContext
) {
    canvasContext.beginPath()
    canvasContext.moveTo(firstX * scale, firstY * scale)
    canvasContext.lineTo(nextX * scale, nextY * scale)
    canvasContext.lineWidth = lineWidth
    canvasContext.strokeStyle = color
    canvasContext.stroke()
}

export function OLDdrawSkeleton(
    keypoints,
    minConfidence,
    color,
    lineWidth,
    canvasContext,
    scale = 1
) {
    const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
        keypoints,
        minConfidence
    )

    adjacentKeyPoints.forEach(keypoints => {
        drawSegment(
            toTuple(keypoints[0].position),
            toTuple(keypoints[1].position),
            color,
            lineWidth,
            scale,
            canvasContext
        )
    })
}

/** NEW UTILS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */

export function drawPoint(ctx, y, x, r, color) {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.fillStyle = color
    // ctx.font = '48px serif'
    // ctx.fillText('30', x, y)
    ctx.fill()
}

/**
 * Draws a line on a canvas, i.e. a joint
 */
export function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
    ctx.beginPath()
    ctx.moveTo(ax * scale, ay * scale)
    ctx.lineTo(bx * scale, by * scale)
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = color
    ctx.stroke()
}

/**
 * Draws a pose skeleton by looking up all adjacent keypoints/joints
 */
export function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
    const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
        keypoints,
        minConfidence
    )

    adjacentKeyPoints.forEach(keypoints => {
        drawSegment(
            toTuple(keypoints[0].position),
            toTuple(keypoints[1].position),
            color,
            scale,
            ctx
        )
    })
}

/**
 * Draw pose keypoints onto a canvas
 */
export function drawKeyPoints(keypoints, minConfidence, ctx, scale = 1) {
    for (let i = 0; i < keypoints.length; i++) {
        const keypoint = keypoints[i]

        if (keypoint.score < minConfidence) {
            continue
        }

        const {y, x} = keypoint.position
        drawPoint(ctx, y * scale, x * scale, 3, color)
    }
}

/**
 * Draw the bounding box of a pose. For example, for a whole person standing
 * in an image, the bounding box will begin at the nose and extend to one of
 * ankles
 */
export function drawBoundingBox(keypoints, ctx) {
    const boundingBox = posenet.getBoundingBox(keypoints)

    ctx.rect(
        boundingBox.minX,
        boundingBox.minY,
        boundingBox.maxX - boundingBox.minX,
        boundingBox.maxY - boundingBox.minY
    )

    ctx.strokeStyle = boundingBoxColor
    ctx.stroke()
}

/**
 * Draw heatmap values, one of the model outputs, on to the canvas
 * Read our blog post for a description of PoseNet's heatmap outputs
 * https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5
 */
export function drawHeatMapValues(heatMapValues, outputStride, canvas) {
    const ctx = canvas.getContext('2d')
    const radius = 5
    const scaledValues = heatMapValues.mul(tf.scalar(outputStride, 'int32'))

    drawPoints(ctx, scaledValues, radius, color)
}

/**
 * Used by the drawHeatMapValues method to draw heatmap points on to
 * the canvas
 */
function drawPoints(ctx, points, radius, color) {
    const data = points.buffer().values

    for (let i = 0; i < data.length; i += 2) {
        const pointY = data[i]
        const pointX = data[i + 1]

        if (pointX !== 0 && pointY !== 0) {
            ctx.beginPath()
            ctx.arc(pointX, pointY, radius, 0, 2 * Math.PI)
            ctx.fillStyle = color
            ctx.fill()
        }
    }
}
