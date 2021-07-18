export const states = {
    Disconnected: "DC",
    Turn: "TURN",
    Wait: "WAIT",
    Win: "WIN",
    Lose: "LOSE",
    Retry: "RETRY"
};

export class StateHandler {
    constructor() {
        this.currentState = states.Disconnected;
    }
}