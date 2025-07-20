'use client';

import { useState, type MouseEvent, useCallback, useRef } from 'react';
import type { TeamMember, Vehicle, Skill, Column, Point } from '@/lib/mrt/types';
import { VehicleColumn } from '@/components/mrt/vehicle-column';
import { MrtToolbar } from '@/components/mrt/mrt-toolbar';
import { INITIAL_TEAM_MEMBERS, INITIAL_VEHICLES, ALL_SKILLS } from '@/lib/mrt/data';
import { produce } from 'immer';
import { NoSSR } from '@/components/no-ssr';
import { TeamMemberCard } from './team-member-card';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const GRID_SIZE = 20;
const MIN_CARD_WIDTH = 200;
const MIN_CARD_HEIGHT = 44;

type DraggedMember = {
  id: string;
  offset: Point;
  element: HTMLElement;
  originalPosition: Point;
};

export function MountainRescueBoard() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const boardRef = useRef<HTMLDivElement>(null);
  
  const initialColumns: Column[] = [
    ...INITIAL_VEHICLES.map((v, i) => ({ id: v.id, type: 'vehicle' as const, position: { x: i * 340 + 20, y: 80 } })),
    { id: 'toolbar', type: 'toolbar' as const, position: { x: 20, y: 20 } },
  ];

  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [draggedColumn, setDraggedColumn] = useState<{ id: string; offset: Point } | null>(null);
  const [draggedMember, setDraggedMember] = useState<DraggedMember | null>(null);
  const [resizedItem, setResizedItem] = useState<{ id: string, initialPos: Point, initialSize: {width: number, height: number} } | null>(null);

  const getBoardCoordinates = useCallback((e: MouseEvent<HTMLElement> | React.MouseEvent<HTMLElement>) => {
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
    setDraggedColumn({
      id,
      offset: { x: boardPos.x - column.position.x, y: boardPos.y - column.position.y },
    });
  };

  const handleMouseDownOnMember = (e: MouseEvent<HTMLDivElement>, memberId: string) => {
    e.stopPropagation();
    const cardElement = e.currentTarget as HTMLDivElement;
    const cardRect = cardElement.getBoundingClientRect();
    const boardRect = boardRef.current?.getBoundingClientRect();

    if (!boardRect) return;

    const startPos = {
      x: cardRect.left - boardRect.left,
      y: cardRect.top - boardRect.top,
    };
    
    const boardPos = getBoardCoordinates(e);

    const clonedElement = cardElement.cloneNode(true) as HTMLElement;
    clonedElement.style.position = 'absolute';
    clonedElement.style.left = `${startPos.x}px`;
    clonedElement.style.top = `${startPos.y}px`;
    clonedElement.style.width = `${cardRect.width}px`;
    clonedElement.style.height = `${cardRect.height}px`;
    clonedElement.style.zIndex = '100';
    clonedElement.style.pointerEvents = 'none';
    clonedElement.classList.add('opacity-75');

    boardRef.current?.appendChild(clonedElement);

    setDraggedMember({
      id: memberId,
      offset: { x: boardPos.x - startPos.x, y: boardPos.y - startPos.y },
      element: clonedElement,
      originalPosition: startPos,
    });
  };


  const handleResizeMemberStart = (e: MouseEvent, memberId: string) => {
    e.stopPropagation();
    const member = teamMembers.find(m => m.id === memberId);
    if (!member) return;
    
    const cardElement = (e.target as HTMLElement).closest<HTMLElement>('[data-member-id]');
    if (!cardElement) return;

    const { width, height } = cardElement.getBoundingClientRect();
    const memberCard = teamMembers.find(m => m.id === memberId);

    setResizedItem({
      id: memberId,
      initialPos: { x: e.clientX, y: e.clientY },
      initialSize: { width: memberCard?.width || width, height: memberCard?.height || height },
    });
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    const boardPos = getBoardCoordinates(e);

    if (draggedColumn) {
      let newX = boardPos.x - draggedColumn.offset.x;
      let newY = boardPos.y - draggedColumn.offset.y;
      
      newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
      newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;

      setColumns(
          produce(draft => {
              const dragged = draft.find(c => c.id === draggedColumn.id);
              if(dragged) {
                  dragged.position.x = newX;
                  dragged.position.y = newY;
              }
          })
      );
    } else if (draggedMember) {
        const newX = boardPos.x - draggedMember.offset.x;
        const newY = boardPos.y - draggedMember.offset.y;
        draggedMember.element.style.left = `${newX}px`;
        draggedMember.element.style.top = `${newY}px`;
    } else if (resizedItem) {
        const dx = e.clientX - resizedItem.initialPos.x;
        const dy = e.clientY - resizedItem.initialPos.y;
        
        const newWidth = Math.max(MIN_CARD_WIDTH, resizedItem.initialSize.width + dx);
        const newHeight = Math.max(MIN_CARD_HEIGHT, resizedItem.initialSize.height + dy);

        updateMember(resizedItem.id, { width: newWidth, height: newHeight });
    }
  };
  
  const handleMouseUp = (e: React.MouseEvent<HTMLElement>) => {
    if (draggedMember) {
      draggedMember.element.remove();
      const targetElement = document.elementFromPoint(e.clientX, e.clientY);
      const targetColumn = targetElement?.closest('[data-column-id]');
      const targetColumnId = targetColumn?.getAttribute('data-column-id');

      let newVehicleId: string | null = null;
      if (targetColumnId) {
        const isVehicle = vehicles.some(v => v.id === targetColumnId);
        if (isVehicle) {
            newVehicleId = targetColumnId;
        }
      }
      updateMember(draggedMember.id, { vehicleId: newVehicleId });

      setDraggedMember(null);
    }
    
    setDraggedColumn(null);
    setResizedItem(null);
  };

  const updateMember = (id: string, updates: Partial<TeamMember>) => {
    setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  };
  
  const unassignedMembers = teamMembers.filter(m => m.vehicleId === null);

  return (
    <div
      className="w-full h-full relative flex flex-col"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      ref={boardRef}
    >
      <div className="flex-1 p-4 w-full h-full relative">
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
                onMemberMouseDown={handleMouseDownOnMember}
              />
            );
          }
          return null;
        })}
      </div>
      <div 
        data-column-id="unassigned"
        className="w-full bg-slate-100 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 p-2"
      >
        <h3 className="text-center font-bold text-sm mb-2 text-slate-600 dark:text-slate-400 uppercase tracking-wider">Unassigned</h3>
        <div className="flex flex-wrap gap-2 justify-center p-2">
            {unassignedMembers.map(member => (
              <div key={member.id}>
                <TeamMemberCard 
                  member={member} 
                  skills={ALL_SKILLS} 
                  isUnassigned={true}
                  onRemove={handleRemoveMember} 
                  onUpdate={updateMember}
                  onResizeStart={handleResizeMemberStart}
                  onMouseDown={handleMouseDownOnMember}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
