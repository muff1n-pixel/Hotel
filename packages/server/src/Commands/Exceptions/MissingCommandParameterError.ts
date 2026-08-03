export class MissingCommandParameterError extends Error {
    constructor(message: string) {
        super(message);
    }
}
