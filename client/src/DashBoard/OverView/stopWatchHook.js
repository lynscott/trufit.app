import {useState, useEffect} from 'react'

export const useTimer = () => {
    const [isRunning, setIsRunning] = useState(false)
    const [elapsedTime, setElapsedTime] = useState(0)

    useEffect(() => {
        let interval
        if (isRunning) {
            interval = setInterval(
                () => setElapsedTime(prevElapsedTime => prevElapsedTime + 0.1),
                100
            )
        }
        return () => clearInterval(interval)
    }, [isRunning])

    return {
        isRunning,
        setIsRunning,
        elapsedTime,
        setElapsedTime
    }
}

export const useStopwatch = () => {
    const [laps, setLaps] = useState([])
    const {isRunning, setIsRunning, elapsedTime, setElapsedTime} = useTimer()

    const handleReset = () => {
        setIsRunning(false)
        setElapsedTime(0)
        setLaps([])
    }

    const handleAddLap = () => {
        const prevTotal =
            laps.length > 0 ? laps.reduce((acc, curr) => acc + curr, 0) : 0
        const currentLap =
            laps.length > 0 ? elapsedTime - prevTotal : elapsedTime
        isRunning && setLaps([...laps, currentLap])
    }

    return {
        elapsedTime: elapsedTime.toFixed(1),
        laps,
        addLap: () => handleAddLap(),
        resetTimer: () => handleReset(),
        startTimer: () => setIsRunning(true),
        stopTimer: () => setIsRunning(false),
        isRunning
    }
}
