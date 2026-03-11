export type StateId = string;
export type EventId = string;

export type MachineTransition = {
  from: StateId;
  event: EventId;
  to: StateId;
};

export type StateMachineDefinition = {
  id: string;
  name: string;
  initialState: StateId;
  states: StateId[];
  transitions: MachineTransition[];
};

export type TransitionMap = Record<StateId, Record<EventId, StateId>>;

export type TransitionResult = {
  nextState: StateId;
  changed: boolean;
  reason: "transition" | "no-transition";
};

export const exampleMachines: StateMachineDefinition[] = [
  {
    id: "request-flow",
    name: "Request Flow",
    initialState: "idle",
    states: ["idle", "loading", "success", "error"],
    transitions: [
      { from: "idle", event: "FETCH", to: "loading" },
      { from: "loading", event: "RESOLVE", to: "success" },
      { from: "loading", event: "REJECT", to: "error" },
      { from: "error", event: "RETRY", to: "loading" },
      { from: "success", event: "REFETCH", to: "loading" },
      { from: "success", event: "RESET", to: "idle" },
      { from: "error", event: "RESET", to: "idle" },
    ],
  },
  {
    id: "auth-flow",
    name: "Auth Flow",
    initialState: "signedOut",
    states: ["signedOut", "signingIn", "signedIn", "expired"],
    transitions: [
      { from: "signedOut", event: "SIGN_IN", to: "signingIn" },
      { from: "signingIn", event: "SUCCESS", to: "signedIn" },
      { from: "signingIn", event: "FAIL", to: "signedOut" },
      { from: "signedIn", event: "TOKEN_EXPIRED", to: "expired" },
      { from: "expired", event: "REFRESH", to: "signedIn" },
      { from: "signedIn", event: "SIGN_OUT", to: "signedOut" },
    ],
  },
];

export function createTransitionMap(machine: StateMachineDefinition): TransitionMap {
  const map: TransitionMap = {};

  for (const state of machine.states) {
    map[state] = {};
  }

  for (const transition of machine.transitions) {
    map[transition.from][transition.event] = transition.to;
  }

  return map;
}

export function stateMachine(
  currentState: StateId,
  event: EventId,
  machine: StateMachineDefinition | TransitionMap
): StateId {
  const map = isTransitionMap(machine) ? machine : createTransitionMap(machine);
  return map[currentState]?.[event] ?? currentState;
}

export function dispatchEvent(
  machine: StateMachineDefinition,
  currentState: StateId,
  event: EventId
): TransitionResult {
  const nextState = stateMachine(currentState, event, machine);
  const changed = nextState !== currentState;

  return {
    nextState,
    changed,
    reason: changed ? "transition" : "no-transition",
  };
}

export function getAvailableEvents(machine: StateMachineDefinition, state: StateId): EventId[] {
  return machine.transitions
    .filter((transition) => transition.from === state)
    .map((transition) => transition.event)
    .filter((event, index, array) => array.indexOf(event) === index);
}

function isTransitionMap(value: StateMachineDefinition | TransitionMap): value is TransitionMap {
  return !Array.isArray((value as StateMachineDefinition).transitions);
}
