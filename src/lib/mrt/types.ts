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

export type Assignee = 
  | { type: 'vehicle', id: string }
  | { type: 'team', id: string }
  | null;

export type TeamMember = {
  id: string;
  firstName: string;
  lastName: string;
  skills: Skill['id'][];
  role?: 'default' | 'driver' | 'leader';
  assignee: Assignee;
  width?: number;
  height?: number;
  type: 'person' | 'equipment';
  position?: Point;
};

export type Vehicle = {
  id: string;
  name: string;
  color: string;
};

export type Team = {
  id: string;
  name: string;
  color: string;
}

export type Column = {
    id: string;
    type: 'vehicle' | 'team' | 'toolbar';
    position: Point;
    width?: number;
    height?: number;
}

export type BoardData = {
  teamMembers: TeamMember[];
  vehicles: Vehicle[];
  teams: Team[];
}

// Generic Magnetic Board Types
export type MagnetType = 'note' | 'idea' | 'task' | 'person' | 'equipment' | 'vehicle' | 'team' | 'category';

export type Magnet = {
  id: string;
  type: MagnetType;
  title: string;
  content?: string;
  color?: string;
  tags?: string[];
  position?: Point;
  width?: number;
  height?: number;
  assignee?: string; // ID of container/category
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
};

export type Container = {
  id: string;
  name: string;
  type: 'category' | 'vehicle' | 'team' | 'toolbar';
  color: string;
  position: Point;
  width?: number;
  height?: number;
  magnets: string[]; // Array of magnet IDs
};

export type GenericBoardData = {
  magnets: Magnet[];
  containers: Container[];
  boardType: 'mrt' | 'inspiration' | 'personal' | 'work' | 'resource' | 'general';
  title: string;
  description?: string;
};
