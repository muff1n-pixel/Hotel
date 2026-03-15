import { useEffect, useState } from "react";
import getTimeSinceDate from "src/UserInterface/Utils/getTimeSinceDate";

export type TimeSinceDateProps = {
    date: Date;
}

export default function TimeSinceDate({ date }: TimeSinceDateProps) {
    const [timeSinceDate, setTimeSinceDate] = useState(getTimeSinceDate(date));

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeSinceDate(getTimeSinceDate(date));
        }, 15 * 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return timeSinceDate;
}