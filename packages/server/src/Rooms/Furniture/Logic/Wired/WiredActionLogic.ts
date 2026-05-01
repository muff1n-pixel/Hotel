import WiredLogic, { WiredTriggerOptions } from "./WiredLogic";

export type ScheduledTrigger = {
    options: WiredTriggerOptions | undefined;
    executeAt: number;
}

export default class WiredActionLogic extends WiredLogic {
    private scheduledTriggers: ScheduledTrigger[] = [];
    
    public async handleTrigger(options: WiredTriggerOptions | undefined): Promise<void> {
        const commonDelayData = this.getCommonDelayData();

        if(commonDelayData?.delayInSeconds) {
            this.scheduledTriggers.push({
                options,
                executeAt: performance.now() + (commonDelayData.delayInSeconds * 1000)
            });

            return;
        }

        return this.handleAction?.(options);
    }

    public async handleActionsInterval(): Promise<void> {
        for(const scheduledTrigger of this.scheduledTriggers) {
            if(performance.now() < scheduledTrigger.executeAt) {
                continue;
            }

            this.scheduledTriggers.splice(this.scheduledTriggers.indexOf(scheduledTrigger), 1);

            await this.handleAction?.(scheduledTrigger.options);
        }
    }

    public async handleAction?(options: WiredTriggerOptions | undefined): Promise<void>;
}