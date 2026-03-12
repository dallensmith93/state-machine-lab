type EventControlsProps = {
  machineName: string;
  currentState: string;
  availableEvents: string[];
  onDispatch: (event: string) => void;
  onReset: () => void;
};

export default function EventControls({
  machineName,
  currentState,
  availableEvents,
  onDispatch,
  onReset,
}: EventControlsProps) {
  return (
    <aside className="panel controls-panel">
      <h2>Event Controls</h2>
      <p className="muted">
        Machine: <strong>{machineName}</strong>
      </p>
      <p className="muted">
        Current state: <strong>{currentState}</strong>
      </p>

      <div className="event-grid">
        {availableEvents.length === 0 ? (
          <p className="muted">No dispatchable events from this state.</p>
        ) : (
          availableEvents.map((event) => (
            <button key={event} type="button" onClick={() => onDispatch(event)}>
              {event}
            </button>
          ))
        )}
      </div>

      <button type="button" className="reset-btn" onClick={onReset}>
        Reset
      </button>
    </aside>
  );
}