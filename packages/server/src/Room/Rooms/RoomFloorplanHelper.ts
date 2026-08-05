export default class RoomFloorplanHelper {
    public static parseDepth(value: string) {
        if (value >= '0' && value <= '9') {
            return parseInt(value);
        } else {
            return value.charCodeAt(0) - 55;
        }
    }

    public static getDepthCharacter(value: number | 'X') {
        if (value === 'X') {
            return 'X';
        }

        if (value >= 0 && value <= 9) {
            return value.toString();
        }

        return String.fromCharCode(value + 55);
    }
}
