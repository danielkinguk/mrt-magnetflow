'use client';

import { useState } from 'react';
import { MountainRescueBoard } from '@/components/mrt/mountain-rescue-board';
import { BOARDS_DATA } from '@/lib/mrt/board-data';
import { notFound } from 'next/navigation';
import { produce } from 'immer';
import type { TeamMember, Vehicle, Team, Column } from '@/lib/mrt/types';

export default function BoardPage({ params }: { params: { boardId: string } }) {
  const initialData = BOARDS_DATA[params.boardId];

  if (!initialData) {
    notFound();
  }

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialData.teamMembers);
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialData.vehicles);
  const [teams, setTeams] = useState<Team[]>(initialData.teams);

  const initialColumns: Column[] = [
    ...initialData.vehicles.map((v, i) => ({ id: v.id, type: 'vehicle' as const, position: { x: i * 340 + 20, y: 120 } })),
    ...initialData.teams.map((t, i) => ({ id: t.id, type: 'team' as const, position: { x: (i + initialData.vehicles.length) * 340 + 20, y: 120 } })),
    { id: 'toolbar', type: 'toolbar' as const, position: { x: 20, y: 20 } },
  ];
  const [columns, setColumns] = useState<Column[]>(initialColumns);

  const stateSetters = {
    member: setTeamMembers,
    vehicle: setVehicles,
    team: setTeams,
    column: setColumns,
  };

  const updateItem = (id: string, type: 'member' | 'vehicle' | 'team' | 'column', updates: Partial<TeamMember | Vehicle | Team | Column>) => {
    const setter = stateSetters[type as keyof typeof stateSetters];
    if (setter) {
      // @ts-ignore
      setter(produce((draft: any[]) => {
        const item = draft.find(i => i.id === id);
        if (item) {
          Object.assign(item, updates);
        }
      }));
    }
  };

  const handleCreateResource = (type: 'person' | 'equipment' | 'vehicle' | 'team', name: string) => {
    const newId = `${type}-${Date.now()}`;
    const newPosition = { x: 20, y: 500 };

    if (type === 'vehicle' || type === 'team') {
      const newContainer = {
        id: newId,
        name,
        color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
      };
      
      const stateSetter = type === 'vehicle' ? setVehicles : setTeams;
      stateSetter(prev => [...prev, newContainer]);
      
      setColumns(prev => [...prev, { id: newId, type, position: newPosition }]);
    } else {
      const [firstName, ...lastNameParts] = name.split(' ');
      const newMember: TeamMember = {
        id: newId,
        firstName: firstName || 'New',
        lastName: lastNameParts.join(' ') || 'Resource',
        skills: [],
        assignee: null,
        role: 'default',
        type: type,
      };
      setTeamMembers(prev => [...prev, newMember]);
    }
  };

  const handleRemoveItem = (id: string, type: 'member' | 'vehicle' | 'team') => {
    if (type === 'member') {
      setTeamMembers(prev => prev.filter(m => m.id !== id));
    } else { 
      const stateSetter = type === 'vehicle' ? setVehicles : setTeams;
      // @ts-ignore
      stateSetter(prev => prev.filter(item => item.id !== id));
      
      setColumns(prev => prev.filter(c => c.id !== id));
      
      setTeamMembers(produce(draft => {
        draft.forEach(member => {
          if (member.assignee?.id === id) {
            member.assignee = null;
          }
        });
      }));
    }
  };


  return (
    <main className="w-full h-full overflow-hidden flex-1">
      <MountainRescueBoard
        key={params.boardId}
        teamMembers={teamMembers}
        vehicles={vehicles}
        teams={teams}
        columns={columns}
        onUpdateItem={updateItem}
        onCreateResource={handleCreateResource}
        onRemoveItem={handleRemoveItem}
      />
    </main>
  );
}

// Re-enable generateStaticParams if you intend to use static generation
// export function generateStaticParams() {
//   return Object.keys(BOARDS_DATA).map((boardId) => ({
//     boardId,
//   }));
// }
