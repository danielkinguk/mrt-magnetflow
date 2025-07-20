export type Point = {
  x: number;
  y: number;
};

export type MagnetData = {
  id: string;
  position: Point;
  text: string;
  color: string;
  width?: number;
  height?: number;
};

export type ConnectionData = {
  id: string;
  sourceId: string;
  targetId: string;
};

export type AISuggestion = ConnectionData & {
  reason: string;
};
