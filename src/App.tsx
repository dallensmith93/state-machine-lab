import { useMemo, useState } from "react";
import EventControls from "./components/EventControls";
import StateDiagram from "./components/StateDiagram";
import TransitionPanel from "./components/TransitionPanel";
import {
  dispatchEvent,
  exampleMachines,
  getAvailableEvents,
  type EventId,
  type StateMachineDefinition,
} from "./engine/stateMachine";
import { validator } from "./engine/validator";

type HistoryItem = {
  event: EventId;
  from: string;
  to: string;
  changed: boolean;
};

function getMachine(machineId: string): StateMachineDefinition {
  return exampleMachines.find((machine) => machine.id === machineId) ?? exampleMachines[0];
}

export default function App() {
  const [activeMachineId, setActiveMachineId] = useState(exampleMachines[0].id);
  const activeMachine = useMemo(() => getMachine(activeMachineId), [activeMachineId]);

  const [currentState, setCurrentState] = useState(activeMachine.initialState);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const validation = useMemo(() => validator(activeMachine), [activeMachine]);
  const events = getAvailableEvents(activeMachine, currentState);

  const switchMachine = (nextMachineId: string) => {
    const nextMachine = getMachine(nextMachineId);
    setActiveMachineId(nextMachine.id);
    setCurrentState(nextMachine.initialState);
    setHistory([]);
  };

  const runEvent = (event: EventId) => {
    const result = dispatchEvent(activeMachine, currentState, event);

    setHistory((previous) => [
      {
        event,
        from: currentState,
        to: result.nextState,
        changed: result.changed,
      },
      ...previous,
    ]);

    setCurrentState(result.nextState);
  };

  const resetMachine = () => {
    setCurrentState(activeMachine.initialState);
    setHistory([]);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>State Machine Lab</h1>
          <p>Visualize and test UI state transitions.</p>
        </div>

        <label className="machine-select">
          Machine
          <select value={activeMachine.id} onChange={(event) => switchMachine(event.target.value)}>
            {exampleMachines.map((machine) => (
              <option key={machine.id} value={machine.id}>
                {machine.name}
              </option>
            ))}
          </select>
        </label>
      </header>

      <main className="layout-grid">
        <StateDiagram machine={activeMachine} currentState={currentState} />
        <TransitionPanel machine={activeMachine} currentState={currentState} history={history} />
        <EventControls
          currentState={currentState}
          availableEvents={events}
          onDispatch={runEvent}
          onReset={resetMachine}
          validationErrors={validation.errors}
        />
      </main>
    </div>
  );
}
