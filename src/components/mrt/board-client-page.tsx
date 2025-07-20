'use client';

import { useState, useEffect, useCallback } from 'react';
import { produce } from 'immer';
import type { TeamMember, Vehicle, Team, Column, BoardData, Point, Assignee } from '@/lib/mrt/types';
import { MountainRescueBoard } from '@/components/mrt/mountain-rescue-board';

const HORIZONTAL_SPACING = 340;
const VERTICAL_POSITION = 120;
const TOOLBAR_POSITION = { x: 20, y: 20 };

export function BoardClientPage({
  boardId,
  initialData,
  setTidyUp,
}: {
  boardId: string;
  initialData: BoardData;
  setTidyUp?: (fn: () => void) => void;
}) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialData.teamMembers);
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialData.vehicles);
  const [teams, setTeams] = useState<Team[]>(initialData.teams);

  const getInitialColumns = (data: BoardData): Column[] => [
    ...data.vehicles.map((v, i) => ({ id: v.id, type: 'vehicle' as const, position: { x: i * HORIZONTAL_SPACING + 20, y: VERTICAL_POSITION } })),
    ...data.teams.map((t, i) => ({ id: t.id, type: 'team' as const, position: { x: (i + data.vehicles.length) * HORIZONTAL_SPACING + 20, y: VERTICAL_POSITION } })),
    { id: 'toolbar', type: 'toolbar' as const, position: TOOLBAR_POSITION },
  ];

  const [columns, setColumns] = useState<Column[]>(getInitialColumns(initialData));

  useEffect(() => {
    setTeamMembers(initialData.teamMembers);
    setVehicles(initialData.vehicles);
    setTeams(initialData.teams);
    setColumns(getInitialColumns(initialData));
  }, [initialData]);

  const handleTidyUp = useCallback(() => {
    setColumns(produce(draft => {
      let vehicleIndex = 0;
      let teamIndex = 0;

      draft.forEach(col => {
        if (col.type === 'vehicle') {
          col.position = { x: vehicleIndex * HORIZONTAL_SPACING + 20, y: VERTICAL_POSITION };
          vehicleIndex++;
        }
      });

      const vehicleCount = vehicleIndex;

      draft.forEach(col => {
        if (col.type === 'team') {
          col.position = { x: (teamIndex + vehicleCount) * HORIZONTAL_SPACING + 20, y: VERTICAL_POSITION };
          teamIndex++;
        } else if (col.type === 'toolbar') {
            col.position = TOOLBAR_POSITION;
        }
      });
    }));

    setTeamMembers(produce(draft => {
        draft.forEach(member => {
            member.position = undefined;
        });
    }));
  }, []);

  useEffect(() => {
    if (setTidyUp) {
      setTidyUp(() => handleTidyUp);
    }
  }, [setTidyUp, handleTidyUp]);

  const updateMember = useCallback((id: string, updates: Partial<TeamMember>) => {
    setTeamMembers(produce(draft => {
      const member = draft.find(m => m.id === id);
      if (member) {
        Object.assign(member, updates);
      }
    }));
  }, []);

  const updateColumn = useCallback((id: string, updates: Partial<Column>) => {
    setColumns(produce(draft => {
      const col = draft.find(c => c.id === id);
      if (col) {
        Object.assign(col, updates);
      }
    }));
  }, []);

  const updateContainer = useCallback((id: string, type: 'vehicle' | 'team', updates: Partial<Vehicle | Team>) => {
    const setter = type === 'vehicle' ? setVehicles : setTeams;
    setter(produce((draft: any) => {
      const item = draft.find((i: Vehicle | Team) => i.id === id);
      if (item) {
        Object.assign(item, updates);
      }
    }));
  }, []);

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
        position: undefined,
      };
      setTeamMembers(prev => [...prev, newMember]);
    }
  };

  const handleRemoveContainer = (id: string, type: 'vehicle' | 'team') => {
    const stateSetter = type === 'vehicle' ? setVehicles : setTeams;
    stateSetter(prev => prev.filter(item => item.id !== id));
    setColumns(prev => prev.filter(c => c.id !== id));
    setTeamMembers(produce(draft => {
      draft.forEach(member => {
        if (member.assignee?.id === id) {
          member.assignee = null;
        }
      });
    }));
  };
  
  const handleRemoveMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  return (
    <main className="w-full h-full overflow-hidden flex-1">
      <MountainRescueBoard
        key={boardId}
        teamMembers={teamMembers}
        vehicles={vehicles}
        teams={teams}
        columns={columns}
        onCreateResource={handleCreateResource}
        onRemoveMember={handleRemoveMember}
        onRemoveContainer={handleRemoveContainer}
        onUpdateMember={updateMember}
        onUpdateColumn={updateColumn}
        onUpdateContainer={updateContainer}
      />
    </main>
  );
}
