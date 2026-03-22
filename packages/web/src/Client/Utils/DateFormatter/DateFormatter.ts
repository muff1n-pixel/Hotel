const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const formatTime = (date: Date) =>
    `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;

const getFormattedDate = (
    date: Date,
    preformatted?: string,
    hideYear = false
) => {
    if (preformatted) {
        return `${preformatted} at ${formatTime(date)}`;
    }

    const day = date.getDate();
    const month = MONTH_NAMES[date.getMonth()];
    const year = date.getFullYear();

    return hideYear
        ? `${day}. ${month} at ${formatTime(date)}`
        : `${day}. ${month} ${year}. at ${formatTime(date)}`;
};

const TimeAgo = (input: Date | string | number) => {
    if (!input) return null;

    const date = input instanceof Date ? input : new Date(input);
    const now = new Date();

    const diff = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(diff / 60);

    const isToday = now.toDateString() === date.toDateString();
    const isYesterday =
        new Date(now.getTime() - 86400000).toDateString() === date.toDateString();
    const isThisYear = now.getFullYear() === date.getFullYear();

    if (diff < 5) return 'now';
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 90) return 'about a minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (isToday) return getFormattedDate(date, 'Today');
    if (isYesterday) return getFormattedDate(date, 'Yesterday');
    if (isThisYear) return getFormattedDate(date, undefined, true);

    return getFormattedDate(date);
};

export default TimeAgo;