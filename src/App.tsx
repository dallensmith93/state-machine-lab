import { useMemo, useState } from "react";
import EventControls from "./components/EventControls";
import StateGraph from "./components/StateGraph";
import { dispatchEvent, exampleMachines, getAvailableEvents } from "./engine/stateMachine";

export default function App() {
  const [machineId, setMachineId] = useState(exampleMachines[0].id);
  const machine = exampleMachines.find((item) => item.id === machineId) ?? exampleMachines[0];

  const [currentState, setCurrentState] = useState(machine.initialState);

  const events = useMemo(() => getAvailableEvents(machine, currentState), [machine, currentState]);

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <h1>State Machine Lab</h1>
          <p>Simulate UI state transitions by dispatching events.</p>
        </div>
        <label className="machine-picker">
          Machine
          <select
            value={machine.id}
            onChange={(event) => {
              const next = exampleMachines.find((item) => item.id === event.target.value) ?? exampleMachines[0];
              setMachineId(next.id);
              setCurrentState(next.initialState);
            }}
          >
            {exampleMachines.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </header>

      <section className="workspace">
        <StateGraph machine={machine} currentState={currentState} />
        <EventControls
          machineName={machine.name}
          currentState={currentState}
          availableEvents={events}
          onDispatch={(event) => {
            const result = dispatchEvent(machine, currentState, event);
            setCurrentState(result.nextState);
          }}
          onReset={() => setCurrentState(machine.initialState)}
        />
      </section>
    </main>
  );
}