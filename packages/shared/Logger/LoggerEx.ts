import LogLevel from "./LogLevel.js";

const sendLog = (logKey: keyof typeof LogLevel, message: string) => {
    console.log(LogLevel[logKey].bgColor, LogLevel[logKey].name, "\x1b[0m", message);
}

const sendCriticalError = (message: string) => {
    sendLog("CRITICAL_ERROR", message);

    process.exit();
}

export { sendLog, sendCriticalError };