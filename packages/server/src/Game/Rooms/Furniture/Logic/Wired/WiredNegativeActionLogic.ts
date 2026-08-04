import WiredLogic, { WiredTriggerOptions } from "./WiredLogic";

export type ScheduledTrigger = {
    options: WiredTriggerOptions | undefined;
    executeAt: number;
}

export default class WiredNegativeActionLogic extends WiredLogic {
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

        this.handleExecution?.(options);
    }

    public async handleActionsInterval(): Promise<void> {
        for(const scheduledTrigger of this.scheduledTriggers) {
            if(performance.now() < scheduledTrigger.executeAt) {
                continue;
            }

            this.scheduledTriggers.splice(this.scheduledTriggers.indexOf(scheduledTrigger), 1);

            this.handleExecution?.(scheduledTrigger.options);
        }
    }

    public async handleAction?(options: WiredTriggerOptions | undefined): Promise<void>;
    
    public handleExecution(options?: WiredTriggerOptions) {
        this.roomWired.startExecution(
            new Promise<void>((resolve, reject) => {
                this.handleAction?.(options)
                    .then(resolve)
                    .catch(reject);
            })
        )?.catch(console.error);
    }
}