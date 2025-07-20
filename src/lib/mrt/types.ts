export type Point = {
  x: number;
  y: number;
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

export type Column = {
    id: string;
    type: 'vehicle' | 'unassigned' | 'toolbar';
    position: Point;
}
