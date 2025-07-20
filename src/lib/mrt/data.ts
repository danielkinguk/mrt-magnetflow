import type { TeamMember, Vehicle, Skill } from '@/lib/mrt/types';

export const ALL_SKILLS: Skill[] = [
  { id: 'skill-1', name: 'First Aid', color: '#4CAF50' }, // Green
  { id: 'skill-2', name: 'Rope Rescue', color: '#F44336' }, // Red
  { id: 'skill-3', name: 'Water Rescue', color: '#2196F3' }, // Blue
  { id: 'skill-4', name: 'Navigation', color: '#FFC107' }, // Yellow
];

export const INITIAL_VEHICLES: Vehicle[] = [
  { id: 'dm1', name: 'DM1', color: '#D32F2F' },
  { id: 'dm2', name: 'DM2', color: '#FFC107' },
  { id: 'dm3', name: 'DM3', color: '#303F9F' },
  { id: 'sarda', name: 'SARDA', color: '#E91E63' },
];

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  { id: 'mem-1', firstName: 'Emma', lastName: 'Seery', skills: ['skill-1', 'skill-2', 'skill-3'], vehicleId: 'dm1', role: 'default', type: 'person' },
  { id: 'mem-2', firstName: 'Peter', lastName: 'Kay', skills: ['skill-1', 'skill-3'], vehicleId: 'dm1', role: 'driver', type: 'person' },
  { id: 'mem-3', firstName: 'Paddy', lastName: 'Gannon', skills: ['skill-4', 'skill-1', 'skill-2'], vehicleId: 'dm1', role: 'default', type: 'person' },
  { id: 'mem-4', firstName: 'Ellie', lastName: 'Fidler', skills: [], vehicleId: 'dm1', role: 'default', type: 'person' },
  { id: 'mem-5', firstName: 'Ollie', lastName: 'Parsons', skills: ['skill-1', 'skill-3'], vehicleId: 'dm2', role: 'default', type: 'person' },
  { id: 'mem-6', firstName: 'Andy', lastName: 'Chapman Gibbs', skills: [], vehicleId: 'dm2', role: 'default', type: 'person' },
  { id: 'mem-7', firstName: 'Dan', lastName: 'King', skills: [], vehicleId: 'dm2', role: 'default', type: 'person' },
  { id: 'mem-8', firstName: 'Craig', lastName: 'Stangroom', skills: [], vehicleId: 'dm2', role: 'driver', type: 'person' },
  { id: 'mem-9', firstName: 'Rob', lastName: 'McClymont', skills: ['skill-1', 'skill-3', 'skill-2'], vehicleId: 'dm2', role: 'leader', type: 'person' },
  { id: 'mem-10', firstName: 'Kev', lastName: 'Brooks', skills: ['skill-1', 'skill-2', 'skill-3'], vehicleId: 'dm3', role: 'default', type: 'person' },
  { id: 'mem-11', firstName: 'Gary', lastName: 'Lingard', skills: ['skill-1', 'skill-2'], vehicleId: 'dm3', role: 'default', type: 'person' },
  { id: 'mem-12', firstName: 'Tom', lastName: 'Ferrero', skills: ['skill-1'], vehicleId: 'dm3', role: 'leader', type: 'person' },
  { id: 'mem-13', firstName: 'John', lastName: 'Evanson', skills: [], vehicleId: 'dm3', role: 'default', type: 'person' },
  { id: 'mem-14', firstName: 'Tom', lastName: 'Cox', skills: ['skill-1', 'skill-2', 'skill-3'], vehicleId: 'sarda', role: 'default', type: 'person' },
  { id: 'mem-15', firstName: 'Ryan', lastName: 'Richards', skills: [], vehicleId: 'sarda', role: 'leader', type: 'person' },
  { id: 'mem-16', firstName: 'Michelle', lastName: 'Green', skills: ['skill-4'], vehicleId: null, role: 'default', type: 'person' },
  { id: 'mem-17', firstName: 'Ben', lastName: 'Higgins', skills: ['skill-1', 'skill-4'], vehicleId: null, role: 'driver', type: 'person' },
];
