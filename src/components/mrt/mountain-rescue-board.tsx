'use client';

import { useState, type MouseEvent, useCallback, useRef } from 'react';
import type { TeamMember, Vehicle, Skill, Column, Point } from '@/lib/mrt/types';
import { VehicleColumn } from '@/components/mrt/vehicle-column';
import { MrtToolbar } from '@/components/mrt/mrt-toolbar';
import { INITIAL_TEAM_MEMBERS, INITIAL_VEHICLES, ALL_SKILLS } from '@/lib/mrt/data';
import { produce } from 'immer';
import { NoSSR } from '@/components/no-ssr';
import { TeamMemberCard } from './team-member-card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Header } from '../header';


const GRID_SIZE = 20;
const MIN_CARD_WIDTH = 200;
const MIN_CARD_HEIGHT = 44;
const MIN_TOOLBAR_WIDTH = 380;
const MIN_TOOLBAR_HEIGHT = 52;


type DraggedItem = {
  id: string;
  offset: Point;
  element?: HTMLElement;
};

type ResizedItem = { 
  id: string, 
  type: 'member' | 'column', 
  initialPos: Point, 
  initialSize: {width: number, height: number} 
}

type NewResourceState = {
  open: boolean;
  name: string;
}

export function MountainRescueBoard() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const boardRef = useRef<HTMLDivElement>(null);
  
  const initialColumns: Column[] = [
    ...INITIAL_VEHICLES.map((v, i) => ({ id: v.id, type: 'vehicle' as const, position: { x: i * 340 + 20, y: 120 } })),
    { id: 'toolbar', type: 'toolbar' as const, position: { x: 20, y: 60 } },
  ];

  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
  const [draggedItemType, setDraggedItemType] = useState<'column' | 'member' | null>(null);
  const [resizedItem, setResizedItem] = useState<ResizedItem | null>(null);
  const [newResource, setNewResource] = useState<NewResourceState>({ open: false, name: '' });

  const getBoardCoordinates = useCallback((e: MouseEvent<HTMLElement> | React.MouseEvent<HTMLElement>) => {
    if (!boardRef.current) return { x: 0, y: 0 };
    const rect = boardRef.current.getBoundingClientRect();
    const scale = rect.width / boardRef.current.offsetWidth;
    return { x: (e.clientX - rect.left) / scale, y: (e.clientY - rect.top) / scale };
  }, []);

  const handleOpenResourceDialog = (name: string) => {
    setNewResource({ open: true, name });
  };
  
  const handleCreateResource = (type: 'person' | 'equipment' | 'vehicle') => {
    const name = newResource.name;
    if (!name.trim()) return;

    if (type === 'vehicle') {
      const newVehicle: Vehicle = {
        id: `vcl-${Date.now()}`,
        name,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`
      };
      setVehicles(prev => [...prev, newVehicle]);
      setColumns(prev => [...prev, {
        id: newVehicle.id,
        type: 'vehicle',
        position: { x: 20, y: 500 }
      }]);
    } else {
      const [firstName, ...lastNameParts] = name.split(' ');
      const newMember: TeamMember = {
        id: `res-${Date.now()}`,
        firstName: firstName || 'New',
        lastName: lastNameParts.join(' ') || 'Resource',
        skills: [],
        vehicleId: null,
        role: 'default',
        type: type,
      };
      setTeamMembers(prev => [...prev, newMember]);
    }
    
    setNewResource({ open: false, name: '' });
  };


  const handleRemoveMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };
  
  const handleMouseDownOnColumn = (e: MouseEvent, id: string) => {
    e.stopPropagation();
    const column = columns.find(c => c.id === id);
    if (!column) return;
    const boardPos = getBoardCoordinates(e);
    setDraggedItemType('column');
    setDraggedItem({
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
    setDraggedItemType('member');
    setDraggedItem({
      id: memberId,
      offset: { x: boardPos.x - startPos.x, y: boardPos.y - startPos.y },
      element: clonedElement,
    });
  };


  const handleResizeStart = (e: MouseEvent, id: string, type: 'member' | 'column') => {
    e.stopPropagation();
    
    const cardElement = (e.target as HTMLElement).closest<HTMLElement>('[data-member-id],[onmousedown]');
    if (!cardElement) return;

    const { width, height } = cardElement.getBoundingClientRect();
    
    let initialSize = { width, height };

    if (type === 'member') {
      const member = teamMembers.find(m => m.id === id);
      initialSize = { width: member?.width || width, height: member?.height || height };
    } else {
      const column = columns.find(c => c.id === id);
      initialSize = { width: column?.width || width, height: column?.height || height };
    }

    setResizedItem({
      id: id,
      type: type,
      initialPos: { x: e.clientX, y: e.clientY },
      initialSize: initialSize,
    });
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    const boardPos = getBoardCoordinates(e);

    if (draggedItem) {
      if (draggedItemType === 'column') {
        let newX = boardPos.x - draggedItem.offset.x;
        let newY = boardPos.y - draggedItem.offset.y;
        
        newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
        newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;

        updateColumn(draggedItem.id, { position: { x: newX, y: newY } });

      } else if (draggedItemType === 'member' && draggedItem.element) {
          const newX = boardPos.x - draggedItem.offset.x;
          const newY = boardPos.y - draggedItem.offset.y;
          draggedItem.element.style.left = `${newX}px`;
          draggedItem.element.style.top = `${newY}px`;
      }
    } else if (resizedItem) {
        const dx = e.clientX - resizedItem.initialPos.x;
        const dy = e.clientY - resizedItem.initialPos.y;
        
        if (resizedItem.type === 'member') {
          const newWidth = Math.max(MIN_CARD_WIDTH, resizedItem.initialSize.width + dx);
          const newHeight = Math.max(MIN_CARD_HEIGHT, resizedItem.initialSize.height + dy);
          updateMember(resizedItem.id, { width: newWidth, height: newHeight });
        } else if (resizedItem.type === 'column') {
          const newWidth = Math.max(MIN_TOOLBAR_WIDTH, resizedItem.initialSize.width + dx);
          const newHeight = Math.max(MIN_TOOLBAR_HEIGHT, resizedItem.initialSize.height + dy);
          updateColumn(resizedItem.id, { width: newWidth, height: newHeight });
        }
    }
  };
  
  const handleMouseUp = (e: React.MouseEvent<HTMLElement>) => {
    if (draggedItem && draggedItemType === 'member') {
      draggedItem.element?.remove();
      const targetElement = document.elementFromPoint(e.clientX, e.clientY);
      const targetColumn = targetElement?.closest('[data-column-id]');
      const targetColumnId = targetColumn?.getAttribute('data-column-id');

      let newVehicleId: string | null = null;
      if (targetColumnId && vehicles.some(v => v.id === targetColumnId)) {
          newVehicleId = targetColumnId;
      }
      updateMember(draggedItem.id, { vehicleId: newVehicleId });
    }
    
    setDraggedItem(null);
    setDraggedItemType(null);
    setResizedItem(null);
  };

  const updateMember = (id: string, updates: Partial<TeamMember>) => {
    setTeamMembers(produce(draft => {
      const member = draft.find(m => m.id === id);
      if (member) Object.assign(member, updates);
    }));
  };

  const updateColumn = (id: string, updates: Partial<Column>) => {
    setColumns(produce(draft => {
        const column = draft.find(c => c.id === id);
        if (column) Object.assign(column, updates);
    }));
  };
  
  const unassignedMembers = teamMembers.filter(m => m.vehicleId === null);

  return (
    <div
      className="w-full h-screen relative flex flex-col bg-background"
    >
      <Header />
      <div 
        className="flex-1 w-full h-full relative"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={boardRef}
      >
        <AlertDialog open={newResource.open} onOpenChange={(open) => setNewResource(prev => ({...prev, open}))}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Create New Resource</AlertDialogTitle>
              <AlertDialogDescription>
                What type of resource is "{newResource.name}"?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleCreateResource('person')}>Person</AlertDialogAction>
              <AlertDialogAction onClick={() => handleCreateResource('equipment')}>Equipment</AlertDialogAction>
              <AlertDialogAction onClick={() => handleCreateResource('vehicle')}>Vehicle</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="p-4 w-full h-full relative">
          {columns.map((column) => {
            if (column.type === 'toolbar') {
              return (
                <NoSSR key={column.id}>
                  <div style={{ position: 'absolute', left: column.position.x, top: column.position.y }}>
                    <MrtToolbar 
                      id={column.id}
                      onAddResource={handleOpenResourceDialog} 
                      onMouseDown={(e) => handleMouseDownOnColumn(e, column.id)} 
                      onResizeStart={(e) => handleResizeStart(e, column.id, 'column')}
                      width={column.width}
                      height={column.height}
                    />
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
                  onMouseDown={(e) => handleMouseDownOnColumn(e, vehicle.id)}
                  updateMember={updateMember}
                  onResizeMemberStart={(e, id) => handleResizeStart(e, id, 'member')}
                  onMemberMouseDown={handleMouseDownOnMember}
                />
              );
            }
            return null;
          })}
        </div>
      </div>
      <div 
        data-column-id="unassigned"
        className="w-full bg-background/50 border-t border-border p-2"
      >
        <h3 className="text-center font-bold text-sm mb-2 text-foreground/60 uppercase tracking-wider">Unassigned Resources</h3>
        <div className="grid grid-cols-5 gap-2 p-2">
            {unassignedMembers.map(member => (
              <div key={member.id} className="mb-2">
                <TeamMemberCard 
                  member={member} 
                  skills={ALL_SKILLS} 
                  isUnassigned={true}
                  onRemove={handleRemoveMember} 
                  onUpdate={updateMember}
                  onResizeStart={(e, id) => handleResizeStart(e, id, 'member')}
                  onMouseDown={handleMouseDownOnMember}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
