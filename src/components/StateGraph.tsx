import type { StateMachineDefinition } from "../engine/stateMachine";

type StateGraphProps = {
  machine: StateMachineDefinition;
  currentState: string;
};

export default function StateGraph({ machine, currentState }: StateGraphProps) {
  return (
    <section className="panel graph-panel">
      <div className="panel-head">
        <h2>State Graph</h2>
        <span>{machine.name}</span>
      </div>

      <div className="state-list">
        {machine.states.map((state) => {
          const outgoing = machine.transitions.filter((transition) => transition.from === state);
          return (
            <article key={state} className={`state-node${state === currentState ? " active" : ""}`}>
              <header>
                <strong>{state}</strong>
                {state === machine.initialState ? <small>initial</small> : null}
              </header>
              {outgoing.length === 0 ? (
                <p className="muted">No outgoing transitions.</p>
              ) : (
                <ul>
                  {outgoing.map((transition) => (
                    <li key={`${transition.from}-${transition.event}-${transition.to}`}>
                      <code>{transition.event}</code>
                      <span> {"->"} </span>
                      <span>{transition.to}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}