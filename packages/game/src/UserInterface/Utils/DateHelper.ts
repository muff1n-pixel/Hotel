export default class DateHelper {
    public static getDaysBetweenDates(date: string | Date, endDate: Date) {
        return Math.round((new Date(date).getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
    }

    public static isDateInTheFuture(date: Date | string | undefined): date is Date | string {
        if(!date) {
            return false;
        }

        return new Date(date) >= new Date();
    }
}