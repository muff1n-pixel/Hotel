export default interface IncomingProtobuffer<T> {
    name: string;
    
    handle(payload: T): Promise<void>;
}
