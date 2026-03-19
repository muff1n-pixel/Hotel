export default function getTimeSinceDate(date: Date) {
    const [number, verb] = getIntervalSinceDate(date);

    if(verb === "now") {
        return "Just now";
    }

    if(number === 1) {
        return `${number} ${verb.substring(0, verb.length - 1)} ago`;
    }

    return `${number} ${verb} ago`;
}

function getIntervalSinceDate(date: Date): [number, string] {
    const difference = new Date().getTime() - date.getTime();

    const days = Math.floor(difference / 1000 / 60 / (60 * 24));

    if (days >= 1) {
        return [ days, "days"];
    }

    const hours = Math.floor(difference / (1000 * 60 * 60) - days * 24);

    if (hours >= 1) {
        return [ hours, "hours"];
    }

    const minutes = Math.floor(difference / (1000 * 60) - days * 24 * 60 - hours * (60));

    if (minutes >= 1) {
        return [ minutes, "minutes"];
    }

    const seconds = Math.floor(difference / 1000);

    return [ seconds, "seconds"];
}