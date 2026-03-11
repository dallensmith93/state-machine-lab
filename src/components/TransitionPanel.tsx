import type { StateMachineDefinition } from "../engine/stateMachine";

type HistoryItem = {
  event: string;
  from: string;
  to: string;
  changed: boolean;
};

type TransitionPanelProps = {
  machine: StateMachineDefinition;
  currentState: string;
  history: HistoryItem[];
};

export default function TransitionPanel({ machine, currentState, history }: TransitionPanelProps) {
  const relevant = machine.transitions.filter((transition) => transition.from === currentState);

  return (
    <section className="panel transition-panel">
      <h2>Transitions</h2>
      <p className="subtle">Current State: <strong>{currentState}</strong></p>

      <ul className="transition-list">
        {relevant.length === 0 ? (
          <li className="subtle">No outgoing transitions.</li>
        ) : (
          relevant.map((transition) => (
            <li key={`${transition.from}-${transition.event}`}>
              <code>{transition.from}</code>
              <span> --{transition.event}--> </span>
              <code>{transition.to}</code>
            </li>
          ))
        )}
      </ul>

      <h3>History</h3>
      <ul className="history-list">
        {history.length === 0 ? (
          <li className="subtle">No events dispatched yet.</li>
        ) : (
          history.slice(0, 8).map((item, index) => (
            <li key={`${item.event}-${index}`}>
              <span>{item.event}</span>
              <span>{item.from} -> {item.to}</span>
              <span className={item.changed ? "badge-ok" : "badge-warn"}>
                {item.changed ? "changed" : "ignored"}
              </span>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
