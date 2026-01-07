export default class Performance {
    private static performanceChecks: Record<string, {
        minimumDurationInMilliseconds: number;
        startTimestamp: number;
    }> = {};

    public static startPerformanceCheck(label: string, minimumDurationInMilliseconds: number) {
        this.performanceChecks[label] = {
            minimumDurationInMilliseconds,
            startTimestamp: performance.now()
        };
    }

    public static endPerformanceCheck(label: string) {
        const endTimestamp = performance.now();

        const duration = endTimestamp - this.performanceChecks[label].startTimestamp;

        if(duration > this.performanceChecks[label].minimumDurationInMilliseconds) {
            //console.warn(`Performance check "${label}" exceeded ${this.performanceChecks[label].minimumDurationInMilliseconds}ms: ${duration.toFixed(2)}`);
        }

        delete this.performanceChecks[label];
    }
}
