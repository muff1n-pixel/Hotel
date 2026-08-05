import WiredLogic, { WiredTriggerOptions } from "./WiredLogic";

export default class WiredConditionLogic extends WiredLogic {
    public async handleCondition(options?: WiredTriggerOptions): Promise<boolean> {
        return true;
    };
}