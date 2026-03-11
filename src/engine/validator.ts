import type { StateMachineDefinition } from "./stateMachine";

export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validator(machine: StateMachineDefinition): ValidationResult {
  const errors: string[] = [];

  if (!machine.states.includes(machine.initialState)) {
    errors.push(`Initial state '${machine.initialState}' is not declared.`);
  }

  const stateSet = new Set(machine.states);
  const transitionKeySet = new Set<string>();

  for (const transition of machine.transitions) {
    if (!stateSet.has(transition.from)) {
      errors.push(`Transition source '${transition.from}' is not a declared state.`);
    }

    if (!stateSet.has(transition.to)) {
      errors.push(`Transition target '${transition.to}' is not a declared state.`);
    }

    const key = `${transition.from}::${transition.event}`;
    if (transitionKeySet.has(key)) {
      errors.push(`Duplicate transition for state '${transition.from}' and event '${transition.event}'.`);
    }
    transitionKeySet.add(key);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
