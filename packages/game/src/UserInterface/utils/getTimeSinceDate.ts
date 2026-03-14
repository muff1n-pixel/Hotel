export default function getTimeSinceDate(date: string) {
    const [number, verb] = getIntervalSinceDate(new Date(date));

    if(number === 1) {
        return `${number} ${verb.substring(0, verb.length - 1)} ago`;
    }

    return `${number} ${verb} ago`;
}

function getIntervalSinceDate(date: Date): [number, string] {
    const seconds = Math.floor((new Date().getMilliseconds() - date.getMilliseconds()) / 1000);

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
    
    return [ Math.floor(seconds), "seconds"];
}