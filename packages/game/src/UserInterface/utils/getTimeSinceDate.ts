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
    const seconds = Math.floor(new Date().getTime() - date.getTime());

    let interval = seconds / 31536000;

    if (interval > 1) {
        return [ Math.floor(interval), "years"];
    }

    interval = seconds / 2592000;
    
    if (interval > 1) {
        return [ Math.floor(interval), "months"];
    }
    
    interval = seconds / 86400;
    
    if (interval > 1) {
        return [ Math.floor(interval), "days"];
    }
    
    interval = seconds / 3600;
    
    if (interval > 1) {
        return [ Math.floor(interval), "hours"];
    }
    
    interval = seconds / 60;
    
    if (interval > 1) {
        return [ Math.floor(interval), "minutes"];
    }

    if(seconds < 5) {
        return [0, "now"];
    }
    
    return [ Math.floor(seconds), "seconds"];
}