import { describe, expect, it } from "vitest";
import {
  createTransitionMap,
  dispatchEvent,
  exampleMachines,
  getAvailableEvents,
  stateMachine,
} from "../engine/stateMachine";
import { validator } from "../engine/validator";

describe("stateMachine", () => {
  it("moves to next state when transition exists", () => {
    const machine = exampleMachines[0];
    expect(stateMachine("idle", "FETCH", machine)).toBe("loading");
  });

  it("stays in same state for unknown events", () => {
    const machine = exampleMachines[0];
    expect(stateMachine("idle", "UNKNOWN", machine)).toBe("idle");
  });

  it("dispatchEvent returns change metadata", () => {
    const machine = exampleMachines[0];
    const result = dispatchEvent(machine, "loading", "RESOLVE");

    expect(result.nextState).toBe("success");
    expect(result.changed).toBe(true);
  });

  it("lists available events for a state", () => {
    const machine = exampleMachines[1];
    const events = getAvailableEvents(machine, "signedIn");

    expect(events).toContain("SIGN_OUT");
    expect(events).toContain("TOKEN_EXPIRED");
  });

  it("supports transition-map format", () => {
    const machine = exampleMachines[0];
    const map = createTransitionMap(machine);
    expect(stateMachine("loading", "REJECT", map)).toBe("error");
  });
});

describe("validator", () => {
  it("accepts valid machine", () => {
    const result = validator(exampleMachines[0]);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects invalid transition target", () => {
    const broken = {
      ...exampleMachines[0],
      transitions: [...exampleMachines[0].transitions, { from: "idle", event: "BAD", to: "ghost" }],
    };

    const result = validator(broken);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("ghost");
  });
});
