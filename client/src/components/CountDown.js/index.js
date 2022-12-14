import { useEffect, useRef, useState } from "react";
import format from "../../helper/format";

export default function CountDown({seconds, onEnd}) {
    const [countDown, setCountDown] = useState(seconds)
    const timerId = useRef()

    useEffect(() => {
        timerId.current = setInterval(() => setCountDown(prev => prev - 1), 1000)
        return () => clearInterval(timerId.current)
    }, [])

    useEffect(() => {
        if (countDown <= 0) {
            clearInterval(timerId.current)
            onEnd()
        }
    }, [countDown, onEnd])

    return (<h2>{format.convertToMMSS(countDown)}</h2>)
}