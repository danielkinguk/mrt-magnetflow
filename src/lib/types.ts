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
  id:string;
  sourceId: string;
  targetId: string;
};

export type AISuggestion = ConnectionData & {
  reason: string;
};

// Mountain Rescue Types
export type Skill = {
  id: string;
  name: string;
  color: string;
};

export type TeamMember = {
  id: string;
  firstName: string;
  lastName: string;
  skills: Skill['id'][];
  role?: 'default' | 'driver' | 'leader';
  vehicleId: Vehicle['id'] | null;
};

export type Vehicle = {
  id: string;
  name: string;
  color: string;
};

export type BoardData = {
  teamMembers: TeamMember[];
  vehicles: Vehicle[];
  unassigned: TeamMember[];
};
