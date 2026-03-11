import type { StateMachineDefinition } from "../engine/stateMachine";

type StateDiagramProps = {
  machine: StateMachineDefinition;
  currentState: string;
};

type Point = { x: number; y: number };

const WIDTH = 520;
const HEIGHT = 360;
const RADIUS = 132;
const NODE_RADIUS = 34;

export default function StateDiagram({ machine, currentState }: StateDiagramProps) {
  const points = buildPoints(machine.states.length);
  const positions = Object.fromEntries(
    machine.states.map((state, index) => [state, points[index]])
  ) as Record<string, Point>;

  return (
    <section className="panel diagram-panel">
      <h2>State Graph</h2>
      <svg width={WIDTH} height={HEIGHT} className="diagram" role="img" aria-label="State machine graph">
        <defs>
          <marker id="sm-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
        </defs>

        {machine.transitions.map((transition, index) => {
          const from = positions[transition.from];
          const to = positions[transition.to];
          if (!from || !to) return null;

          return (
            <g key={`${transition.from}-${transition.event}-${index}`}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#64748b"
                strokeWidth={2}
                markerEnd="url(#sm-arrow)"
              />
              <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 6} className="edge-label">
                {transition.event}
              </text>
            </g>
          );
        })}

        {machine.states.map((state) => {
          const point = positions[state];
          const active = state === currentState;

          return (
            <g key={state}>
              <circle
                cx={point.x}
                cy={point.y}
                r={NODE_RADIUS}
                className={`state-node${active ? " active" : ""}`}
              />
              <text x={point.x} y={point.y + 4} textAnchor="middle" className="state-label">
                {state}
              </text>
            </g>
          );
        })}
      </svg>
    </section>
  );
}

function buildPoints(count: number): Point[] {
  const centerX = WIDTH / 2;
  const centerY = HEIGHT / 2;

  return Array.from({ length: count }, (_, index) => {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
    return {
      x: centerX + Math.cos(angle) * RADIUS,
      y: centerY + Math.sin(angle) * RADIUS,
    };
  });
}
