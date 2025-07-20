import type { MagnetData, ConnectionData, Point, AISuggestion } from '@/lib/types';

interface ConnectionsLayerProps {
  magnets: MagnetData[];
  connections: ConnectionData[];
  aiSuggestions: AISuggestion[];
  previewConnection: { sourceId: string; to: Point } | null;
}

const MAGNET_DEFAULTS = {
  width: 200,
  height: 120,
};

function getMagnetCenter(magnet: MagnetData): Point {
  const width = magnet.width || MAGNET_DEFAULTS.width;
  const height = magnet.height || MAGNET_DEFAULTS.height;
  return {
    x: magnet.position.x + width / 2,
    y: magnet.position.y + height / 2,
  };
}

export function ConnectionsLayer({ magnets, connections, aiSuggestions, previewConnection }: ConnectionsLayerProps) {
  const magnetMap = new Map(magnets.map(m => [m.id, m]));

  const renderConnection = (conn: ConnectionData, isAi: boolean = false) => {
    const source = magnetMap.get(conn.sourceId);
    const target = magnetMap.get(conn.targetId);
    if (!source || !target) return null;

    const p1 = getMagnetCenter(source);
    const p2 = getMagnetCenter(target);

    return (
      <g key={conn.id}>
        <path
          d={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`}
          stroke={isAi ? 'hsl(var(--accent))' : 'hsl(var(--primary))'}
          strokeWidth="2"
          strokeDasharray={isAi ? '4 4' : 'none'}
          fill="none"
          className="pointer-events-none transition-all duration-100 ease-in-out"
        />
        {isAi && (conn as AISuggestion).reason && (
           <text x={(p1.x + p2.x)/2} y={(p1.y + p2.y)/2} fill="hsl(var(--accent-foreground))" fontSize="10" textAnchor="middle" dy="-4" className="pointer-events-none bg-accent/20 rounded px-1 py-0.5">
              {(conn as AISuggestion).reason}
           </text>
        )}
      </g>
    );
  };

  const renderPreview = () => {
    if (!previewConnection) return null;
    const source = magnetMap.get(previewConnection.sourceId);
    if (!source) return null;

    const p1 = getMagnetCenter(source);
    const p2 = previewConnection.to;

    return (
      <path
        d={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`}
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeDasharray="5 5"
        fill="none"
        className="pointer-events-none"
      />
    );
  };

  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible">
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--primary))" />
        </marker>
      </defs>
      {connections.map(conn => renderConnection(conn))}
      {aiSuggestions.map(conn => renderConnection(conn, true))}
      {renderPreview()}
    </svg>
  );
}
