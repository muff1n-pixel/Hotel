export default interface ProtobuffListener<T> {
    handle(payload: T): Promise<void>;
}
