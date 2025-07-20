'use client';

import { useState } from 'react';
import type { TeamMember, Vehicle, Skill } from '@/lib/types';
import { VehicleColumn } from '@/components/vehicle-column';
import { TeamMemberCard } from './team-member-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ALL_SKILLS: Skill[] = [
  { id: 'skill-1', name: 'First Aid', color: '#4CAF50' }, // Green
  { id: 'skill-2', name: 'Rope Rescue', color: '#F44336' }, // Red
  { id: 'skill-3', name: 'Water Rescue', color: '#2196F3' }, // Blue
  { id: 'skill-4', name: 'Navigation', color: '#FFC107' }, // Yellow
];

const INITIAL_VEHICLES: Vehicle[] = [
  { id: 'dm1', name: 'DM1', color: '#D32F2F' },
  { id: 'dm2', name: 'DM2', color: '#FFC107' },
  { id: 'dm3', name: 'DM3', color: '#303F9F' },
  { id: 'sarda', name: 'SARDA', color: '#E91E63' },
];

const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  { id: 'mem-1', firstName: 'Emma', lastName: 'Seery', skills: ['skill-1', 'skill-2', 'skill-3'], vehicleId: 'dm1', role: 'default' },
  { id: 'mem-2', firstName: 'Peter', lastName: 'Kay', skills: ['skill-1', 'skill-3'], vehicleId: 'dm1', role: 'driver' },
  { id: 'mem-3', firstName: 'Paddy', lastName: 'Gannon', skills: ['skill-4', 'skill-1', 'skill-2'], vehicleId: 'dm1', role: 'default' },
  { id: 'mem-4', firstName: 'Ellie', lastName: 'Fidler', skills: [], vehicleId: 'dm1', role: 'default' },
  { id: 'mem-5', firstName: 'Ollie', lastName: 'Parsons', skills: ['skill-1', 'skill-3'], vehicleId: 'dm2', role: 'default' },
  { id: 'mem-6', firstName: 'Andy', lastName: 'Chapman Gibbs', skills: [], vehicleId: 'dm2', role: 'default' },
  { id: 'mem-7', firstName: 'Dan', lastName: 'King', skills: [], vehicleId: 'dm2', role: 'default' },
  { id: 'mem-8', firstName: 'Craig', lastName: 'Stangroom', skills: [], vehicleId: 'dm2', role: 'driver' },
  { id: 'mem-9', firstName: 'Rob', lastName: 'McClymont', skills: ['skill-1', 'skill-3', 'skill-2'], vehicleId: 'dm2', role: 'leader' },
  { id: 'mem-10', firstName: 'Kev', lastName: 'Brooks', skills: ['skill-1', 'skill-2', 'skill-3'], vehicleId: 'dm3', role: 'default' },
  { id: 'mem-11', firstName: 'Gary', lastName: 'Lingard', skills: ['skill-1', 'skill-2'], vehicleId: 'dm3', role: 'default' },
  { id: 'mem-12', firstName: 'Tom', lastName: 'Ferrero', skills: ['skill-1'], vehicleId: 'dm3', role: 'leader' },
  { id: 'mem-13', firstName: 'John', lastName: 'Evanson', skills: [], vehicleId: 'dm3', role: 'default' },
  { id: 'mem-14', firstName: 'Tom', lastName: 'Cox', skills: ['skill-1', 'skill-2', 'skill-3'], vehicleId: 'sarda', role: 'default' },
  { id: 'mem-15', firstName: 'Ryan', lastName: 'Richards', skills: [], vehicleId: 'sarda', role: 'leader' },
  { id: 'mem-16', firstName: 'Michelle', lastName: 'Green', skills: ['skill-4'], vehicleId: null, role: 'default' },
  { id: 'mem-17', firstName: 'Ben', lastName: 'Higgins', skills: ['skill-1', 'skill-4'], vehicleId: null, role: 'driver' },
];

export function MountainRescueBoard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);

  const unassignedMembers = teamMembers.filter(m => m.vehicleId === null);

  return (
    <div className="flex gap-4 p-4 h-full w-full items-start">
      {vehicles.map(vehicle => (
        <VehicleColumn
          key={vehicle.id}
          vehicle={vehicle}
          members={teamMembers.filter(m => m.vehicleId === vehicle.id)}
          allSkills={ALL_SKILLS}
        />
      ))}
      <Card className="w-80 flex-shrink-0 bg-slate-100 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800">
        <CardHeader className="p-2">
            <CardTitle className="text-center text-lg font-bold p-2 rounded-md bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                Unassigned
            </CardTitle>
        </CardHeader>
        <CardContent className="p-2 min-h-[200px]">
            {unassignedMembers.map(member => (
                <TeamMemberCard key={member.id} member={member} skills={ALL_SKILLS} />
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
