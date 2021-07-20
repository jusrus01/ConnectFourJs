export const states = {
    Disconnected: "DISCONNECTED",
    Turn: "TURN",
    Wait: "WAIT",
    Win: "WIN",
    Lost: "LOST",
    Retry: "RETRY",
    Tie: "TIE"
};

export class StateHandler {
    constructor() {
        this.currentState = states.Disconnected;
    }

    setState = (state) => {
        this.currentState = state;
    }
}