import type { TeamMember, Vehicle, Team } from '@/lib/mrt/types';
import { INITIAL_TEAM_MEMBERS, INITIAL_VEHICLES, INITIAL_TEAMS } from '@/lib/mrt/data';

export type BoardData = {
  teamMembers: TeamMember[];
  vehicles: Vehicle[];
  teams: Team[];
}

export const ALL_BOARDS = [
    { id: 'mrt-board', name: 'MRT Board' },
    { id: 'cumbria', name: 'Cumbria' },
    { id: 'inspiration', name: 'Inspiration' },
    { id: 'personal', name: 'Personal' },
    { id: 'work', name: 'Work' },
];

export const BOARDS_DATA: Record<string, BoardData> = {
  'mrt-board': {
    teamMembers: INITIAL_TEAM_MEMBERS,
    vehicles: INITIAL_VEHICLES,
    teams: INITIAL_TEAMS,
  },
  'cumbria': {
    teamMembers: [],
    vehicles: [],
    teams: [],
  },
  'inspiration': {
    teamMembers: [],
    vehicles: [],
    teams: [],
  },
  'personal': {
    teamMembers: [],
    vehicles: [],
    teams: [],
  },
  'work': {
    teamMembers: [],
    vehicles: [],
    teams: [],
  }
};
