import WiredLogic, { WiredTriggerOptions } from "./WiredLogic";

export default class WiredActionLogic extends WiredLogic {
    public async handleAction?(options: WiredTriggerOptions | undefined): Promise<void>;
}