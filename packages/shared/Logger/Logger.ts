export class ConsoleLogger {
    constructor(private label = "Default", private backgroundColor = "grey") {

    }

    public log(message: string, ...args: any[]) {
        return console.log(`%c ${this.label} `, this.createStyle(), message, ...args);
    }

    public warn(message: string, ...args: any[]) {
        return console.warn(`%c ${this.label} `, this.createStyle(), message, ...args);
    }

    public error(message: string, ...args: any[]) {
        return console.error(`%c ${this.label} `, this.createStyle(), message, ...args);
    }

    private createStyle() {
        return `
            background: ${this.backgroundColor};
            color: white;
            font-weight: bold;
            padding: 2px 0px;
            border-radius: 2px;
        `;
    }
}

export const Logger = new ConsoleLogger();
export const FigureLogger = new ConsoleLogger("Figure", "lightgreen");
export const RoomLogger = new ConsoleLogger("Room", "lightblue");
export const EventsLogger = new ConsoleLogger("Events", "orange");
