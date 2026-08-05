export class InvalidCommandParameterError extends Error {
    constructor(message: string) {
        super(message);
    }
}
