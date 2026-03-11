type EventControlsProps = {
  currentState: string;
  availableEvents: string[];
  onDispatch: (event: string) => void;
  onReset: () => void;
  validationErrors: string[];
};

export default function EventControls({
  currentState,
  availableEvents,
  onDispatch,
  onReset,
  validationErrors,
}: EventControlsProps) {
  return (
    <aside className="panel controls-panel">
      <h2>Events</h2>
      <p className="subtle">State: <strong>{currentState}</strong></p>

      <div className="event-grid">
        {availableEvents.length === 0 ? (
          <p className="subtle">No events available from this state.</p>
        ) : (
          availableEvents.map((event) => (
            <button key={event} type="button" onClick={() => onDispatch(event)}>
              Dispatch {event}
            </button>
          ))
        )}
      </div>

      <button type="button" className="reset-btn" onClick={onReset}>
        Reset Machine
      </button>

      <h3>Validation</h3>
      {validationErrors.length === 0 ? (
        <p className="badge-ok">Machine is valid.</p>
      ) : (
        <ul className="error-list">
          {validationErrors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </aside>
  );
}
