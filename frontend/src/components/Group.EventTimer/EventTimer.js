import React from 'react';
import { useState, useEffect } from 'react';
import { getRemainingTimeUntilMsTimestamp } from "../../utils/CountDownTimerUtils";

const defaultRemainingTime = {
    seconds: '00',
    minutes: '00',
    hours: '00',
    days: '00'
}

const GroupEventTimer = ({countdownTimestampMs}) => {
  const [remainingTime, setRemainingTime] = useState(defaultRemainingTime);

    useEffect(() => {
        const intervalId = setInterval(() => {
            updateRemainingTime(countdownTimestampMs);
        }, 1000);
        return () => clearInterval(intervalId);
    },[countdownTimestampMs]);

    function updateRemainingTime(countdown) {
        // console.log("countdown: ", countdown)
        setRemainingTime(getRemainingTimeUntilMsTimestamp(countdown));
    }

    return(
        <div className="countdown-timer">
        <span>{remainingTime.days}</span>
            <span fontSize="0.75rem">days </span>
        <span className="two-numbers">{remainingTime.hours}</span>
            <span fontSize="0.75rem">hours </span>
        <span className="two-numbers">{remainingTime.minutes}</span>
            <span fontSize="0.75rem">minutes </span>
        <span className="two-numbers">{remainingTime.seconds}</span>
            <span fontSize="0.75rem">seconds </span>
        </div>
    );
}

export default GroupEventTimer