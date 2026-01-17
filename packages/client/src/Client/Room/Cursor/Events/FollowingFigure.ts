export default class FollowingFigure extends Event {
    constructor(public readonly userId: string, public readonly position: { left: number, top: number }) {
        super("FollowingFigure");
    }
}
