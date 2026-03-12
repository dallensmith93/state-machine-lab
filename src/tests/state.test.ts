import { describe, expect, it } from "vitest";
import { dispatchEvent, exampleMachines, getAvailableEvents, stateMachine } from "../engine/stateMachine";

describe("stateMachine transitions", () => {
  it("transitions on valid event", () => {
    const machine = exampleMachines[0];
    expect(stateMachine("idle", "FETCH", machine)).toBe("loading");
  });

  it("stays in same state for invalid event", () => {
    const machine = exampleMachines[0];
    expect(stateMachine("idle", "UNKNOWN", machine)).toBe("idle");
  });

  it("dispatchEvent returns transition metadata", () => {
    const machine = exampleMachines[1];
    const result = dispatchEvent(machine, "signedIn", "SIGN_OUT");

    expect(result.nextState).toBe("signedOut");
    expect(result.changed).toBe(true);
    expect(result.reason).toBe("transition");
  });

  it("lists available events for current state", () => {
    const machine = exampleMachines[0];
    const events = getAvailableEvents(machine, "loading");

    expect(events).toContain("RESOLVE");
    expect(events).toContain("REJECT");
  });
});