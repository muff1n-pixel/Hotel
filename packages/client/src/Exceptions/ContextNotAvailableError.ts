export default class ContextNotAvailableError extends Error {
    constructor(message?: string) {
        super("Context is not available: " + message);
    }
}
