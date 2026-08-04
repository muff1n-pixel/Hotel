import User from "../../Users/User";

export default interface IncomingEvent<T = null> {
    name: string;
    
    handle(user: User, event: T): Promise<void>;
}
