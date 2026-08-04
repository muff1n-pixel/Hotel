export default class OutgoingEvent<T = any> {
    constructor(public readonly name: string, public readonly body: T) {

    };
};
