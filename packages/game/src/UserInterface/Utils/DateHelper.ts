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

    public static getFormattedDays(days: number) {
        if(days >= 365) {
            const years = Math.round(days / 365);

            return `${years} ${(years === 1)?("year"):("years")}`;
        }

        if(days >= 30) {
            const months = Math.round(days / 30);

            return `${months} ${(months === 1)?("month"):("months")}`;
        }

        return `${days} ${(days === 1)?("day"):("days")}`;
    }

    public static getFormattedTimeUntilDate(date?: string) {
        if(!date) {
            return '-';
        }
        
        const difference = new Date(date).getTime() - Date.now();

        if (difference <= 0) {
            return "0 hr.";
        }

        const hour = 1000 * 60 * 60;
        const day = hour * 24;
        const month = day * 30;
        const year = day * 365;

        if (difference >= year) {
            return `${Math.round(difference / year)} yr.`;
        }

        if (difference >= month) {
            return `${Math.round(difference / month)} mon.`;
        }

        if (difference >= day) {
            return `${Math.round(difference / day)} d.`;
        }

        return `${Math.max(1, Math.round(difference / hour))} hr.`;
    }

    public static getFormattedTimeFromDays(days?: number) {
        if(!days) {
            return '-';
        }
        
        const month = days * 30;
        const year = days * 365;

        if (days >= year) {
            return `${Math.round(days / year)} yr.`;
        }

        if (days >= month) {
            return `${Math.round(days / month)} mon.`;
        }

        return `${Math.round(days)} d.`;
    }

    public static getFormattedDate(value?: string) {
        if(!value) {
            return '-';
        }

        const date = new Date(value);

        return `${date.getFullYear()}/${date.getMonth().toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
    }
}