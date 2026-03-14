export class StateMachine<TState extends string> {
  private currentState: TState;

  constructor(initialState: TState) {
    this.currentState = initialState;
  }

  get state(): TState {
    return this.currentState;
  }

  setState(nextState: TState): void {
    this.currentState = nextState;
  }

  is(state: TState): boolean {
    return this.currentState === state;
  }
}
