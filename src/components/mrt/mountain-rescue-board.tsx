'use client';

import { useState, type MouseEvent, useCallback, useRef } from 'react';
import type { TeamMember, Vehicle, Skill, Column, Point } from '@/lib/mrt/types';
import { VehicleColumn } from '@/components/mrt/vehicle-column';
import { MrtToolbar } from '@/components/mrt/mrt-toolbar';
import { INITIAL_TEAM_MEMBERS, INITIAL_VEHICLES, ALL_SKILLS } from '@/lib/mrt/data';
import { UnassignedColumn } from '@/components/mrt/unassigned-column';
import { produce } from 'immer';
import { NoSSR } from '@/components/no-ssr';

const GRID_SIZE = 20;
const MIN_CARD_WIDTH = 200;
const MIN_CARD_HEIGHT = 44;

export function MountainRescueBoard() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const boardRef = useRef<HTMLDivElement>(null);
  
  const initialColumns: Column[] = [
    ...INITIAL_VEHICLES.map((v, i) => ({ id: v.id, type: 'vehicle' as const, position: { x: i * 340 + 20, y: 80 } })),
    { id: 'unassigned', type: 'unassigned' as const, position: { x: INITIAL_VEHICLES.length * 340 + 20, y: 80 } },
    { id: 'toolbar', type: 'toolbar' as const, position: { x: 20, y: 20 } },
  ];

  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [draggedItem, setDraggedItem] = useState<{ id: string; offset: { x: number; y: number } } | null>(null);
  const [resizedItem, setResizedItem] = useState<{ id: string, initialPos: Point, initialSize: {width: number, height: number} } | null>(null);

  const getBoardCoordinates = useCallback((e: MouseEvent) => {
    if (!boardRef.current) return { x: 0, y: 0 };
    const rect = boardRef.current.getBoundingClientRect();
    const scale = rect.width / boardRef.current.offsetWidth;
    return { x: (e.clientX - rect.left) / scale, y: (e.clientY - rect.top) / scale };
  }, []);

  const handleAddMember = (name: string) => {
    if (!name.trim()) return;
    const [firstName, lastName] = name.split(' ');
    const newMember: TeamMember = {
      id: `mem-${Date.now()}`,
      firstName: firstName || 'New',
      lastName: lastName || 'Member',
      skills: [],
      vehicleId: null,
      role: 'default',
    };
    setTeamMembers(prev => [...prev, newMember]);
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };
  
  const handleMouseDownOnColumn = (e: MouseEvent, id: string) => {
    e.stopPropagation();
    const column = columns.find(c => c.id === id);
    if (!column) return;
    const boardPos = getBoardCoordinates(e);
    setDraggedItem({
      id,
      offset: { x: boardPos.x - column.position.x, y: boardPos.y - column.position.y },
    });
  };

  const handleResizeMemberStart = (e: MouseEvent, memberId: string) => {
    e.stopPropagation();
    const member = teamMembers.find(m => m.id === memberId);
    if (!member) return;
    
    // Find the rendered element to get its current size
    const cardElement = (e.target as HTMLElement).closest('[class*="p-2 flex items-center"]');
    if (!cardElement) return;

    const { width, height } = cardElement.getBoundingClientRect();

    setResizedItem({
      id: memberId,
      initialPos: { x: e.clientX, y: e.clientY },
      initialSize: { width: member.width || width, height: member.height || height },
    });
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    const boardPos = getBoardCoordinates(e);

    if (draggedItem) {
      let newX = boardPos.x - draggedItem.offset.x;
      let newY = boardPos.y - draggedItem.offset.y;
      
      newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
      newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;

      setColumns(
          produce(draft => {
              const dragged = draft.find(c => c.id === draggedItem.id);
              if(dragged) {
                  dragged.position.x = newX;
                  dragged.position.y = newY;
              }
          })
      );
    } else if (resizedItem) {
        const dx = e.clientX - resizedItem.initialPos.x;
        const dy = e.clientY - resizedItem.initialPos.y;
        
        const newWidth = Math.max(MIN_CARD_WIDTH, resizedItem.initialSize.width + dx);
        const newHeight = Math.max(MIN_CARD_HEIGHT, resizedItem.initialSize.height + dy);

        updateMember(resizedItem.id, { width: newWidth, height: newHeight });
    }
  };
  
  const handleMouseUp = () => {
    setDraggedItem(null);
    setResizedItem(null);
  };

  const updateMember = (id: string, updates: Partial<TeamMember>) => {
    setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  return (
    <div
      className="w-full h-full relative"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      ref={boardRef}
    >
      <div className="flex-1 p-4 w-full h-full">
        {columns.map((column) => {
          if (column.type === 'toolbar') {
            return (
              <NoSSR key={column.id}>
                <div style={{ position: 'absolute', left: column.position.x, top: column.position.y }}>
                  <MrtToolbar onAddMember={handleAddMember} onMouseDown={(e) => handleMouseDownOnColumn(e, column.id)} />
                </div>
              </NoSSR>
            );
          }
          if (column.type === 'vehicle') {
            const vehicle = vehicles.find(v => v.id === column.id);
            if (!vehicle) return null;
            return (
              <VehicleColumn
                key={vehicle.id}
                vehicle={vehicle}
                members={teamMembers.filter(m => m.vehicleId === vehicle.id)}
                allSkills={ALL_SKILLS}
                position={column.position}
                onMouseDown={(e) => handleMouseDownOnColumn(e, column.id)}
                updateVehicle={updateVehicle}
                updateMember={updateMember}
                onResizeMemberStart={handleResizeMemberStart}
              />
            );
          }
          if (column.type === 'unassigned') {
            return (
              <UnassignedColumn
                key={column.id}
                members={teamMembers.filter(m => m.vehicleId === null)}
                allSkills={ALL_SKILLS}
                position={column.position}
                onMouseDown={(e) => handleMouseDownOnColumn(e, column.id)}
                onRemoveMember={handleRemoveMember}
                updateMember={updateMember}
                onResizeMemberStart={handleResizeMemberStart}
              />
            )
          }
        })}
      </div>
    </div>
  );
}
