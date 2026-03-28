export default class Directions {
    public static normalizeDirection(direction: number) {
        while(direction < 0) {
            direction += 8;
        }

        return direction % 8;
    }
}
