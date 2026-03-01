import User from "../../Users/User";

export default interface ProtobuffListener<T> {
    handle(user: User, payload: T): Promise<void>;
}
