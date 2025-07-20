'use client';

import { useState, type MouseEvent, useCallback, useRef } from 'react';
import type { TeamMember, Vehicle, Skill, Column, Point, Team, Assignee } from '@/lib/mrt/types';
import { ResourceColumn } from '@/components/mrt/resource-column';
import { MrtToolbar } from '@/components/mrt/mrt-toolbar';
import { ALL_SKILLS } from '@/lib/mrt/data';
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
import { cn } from '@/lib/utils';


const GRID_SIZE = 20;
const MIN_CARD_WIDTH = 200;
const MIN_CARD_HEIGHT = 44;
const MIN_TOOLBAR_WIDTH = 380;
const MIN_TOOLBAR_HEIGHT = 52;


type DraggedItem = {
  id: string;
  type: 'member' | 'column';
  offset: Point;
  initialPosition?: Point;
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

interface MountainRescueBoardProps {
  teamMembers: TeamMember[];
  vehicles: Vehicle[];
  teams: Team[];
  columns: Column[];
  onUpdateMember: (id: string, updates: Partial<TeamMember>) => void;
  onUpdateContainer: (id: string, type: 'vehicle' | 'team', updates: Partial<Vehicle | Team>) => void;
  onUpdateColumn: (id: string, updates: Partial<Column>) => void;
  onCreateResource: (type: 'person' | 'equipment' | 'vehicle' | 'team', name: string) => void;
  onRemoveMember: (id: string) => void;
  onRemoveContainer: (id: string, type: 'vehicle' | 'team') => void;
}

export function MountainRescueBoard({ 
  teamMembers, 
  vehicles, 
  teams, 
  columns, 
  onUpdateMember,
  onUpdateContainer,
  onUpdateColumn,
  onCreateResource, 
  onRemoveMember,
  onRemoveContainer
}: MountainRescueBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
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
  
  const handleCreateResource = (type: 'person' | 'equipment' | 'vehicle' | 'team') => {
    const name = newResource.name;
    if (!name.trim()) return;
    onCreateResource(type, name);
    setNewResource({ open: false, name: '' });
  };
  
  const handleMouseDownOnColumn = (e: MouseEvent, id: string) => {
    e.stopPropagation();
    const column = columns.find(c => c.id === id);
    if (!column) return;
    const boardPos = getBoardCoordinates(e);
    setDraggedItem({
      id,
      type: 'column',
      offset: { x: boardPos.x - column.position.x, y: boardPos.y - column.position.y },
    });
  };

  const handleMouseDownOnMember = (e: MouseEvent<HTMLDivElement>, memberId: string) => {
    e.stopPropagation();
    const member = teamMembers.find(m => m.id === memberId);
    if (!member) return;
    
    const cardElement = e.currentTarget as HTMLDivElement;
    const cardRect = cardElement.getBoundingClientRect();
    const boardRect = boardRef.current?.getBoundingClientRect();

    if (!boardRect) return;

    let initialPosition = member.position;
    
    if (!initialPosition) {
        initialPosition = {
          x: cardRect.left - boardRect.left,
          y: cardRect.top - boardRect.top,
        };
        onUpdateMember(memberId, { position: initialPosition, assignee: null });
    }
    
    const boardPos = getBoardCoordinates(e);

    setDraggedItem({
      id: memberId,
      type: 'member',
      offset: { x: boardPos.x - initialPosition.x, y: boardPos.y - initialPosition.y },
      initialPosition,
    });
  };


  const handleResizeStart = (e: MouseEvent, id: string, type: 'member' | 'column') => {
    e.stopPropagation();
    
    const cardElement = (e.target as HTMLElement).closest<HTMLElement>('[data-member-id],[data-column-id]');
    if (!cardElement) return;

    let item;
    if (type === 'member') {
      item = teamMembers.find(m => m.id === id);
    } else {
      item = columns.find(c => c.id === id);
    }
    if (!item) return;

    const initialSize = { width: item.width || cardElement.offsetWidth, height: item.height || cardElement.offsetHeight };

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
      let newX = boardPos.x - draggedItem.offset.x;
      let newY = boardPos.y - draggedItem.offset.y;
      
      newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
      newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;

      if (draggedItem.type === 'column') {
        onUpdateColumn(draggedItem.id, { position: { x: newX, y: newY } });
      } else if (draggedItem.type === 'member') {
        onUpdateMember(draggedItem.id, { position: { x: newX, y: newY } });
      }
    } else if (resizedItem) {
        const dx = e.clientX - resizedItem.initialPos.x;
        const dy = e.clientY - resizedItem.initialPos.y;
        
        if (resizedItem.type === 'member') {
          const newWidth = Math.max(MIN_CARD_WIDTH, resizedItem.initialSize.width + dx);
          const newHeight = Math.max(MIN_CARD_HEIGHT, resizedItem.initialSize.height + dy);
          onUpdateMember(resizedItem.id, { width: newWidth, height: newHeight });
        } else if (resizedItem.type === 'column') {
          const newWidth = Math.max(MIN_TOOLBAR_WIDTH, resizedItem.initialSize.width + dx);
          const newHeight = Math.max(MIN_TOOLBAR_HEIGHT, resizedItem.initialSize.height + dy);
          onUpdateColumn(resizedItem.id, { width: newWidth, height: newHeight });
        }
    }
  };
  
  const handleMouseUp = (e: React.MouseEvent<HTMLElement>) => {
    if (draggedItem && draggedItem.type === 'member') {
      const draggedEl = document.querySelector(`[data-member-id="${draggedItem.id}"]`) as HTMLElement;
      let originalPointerEvents: string | null = null;
  
      if (draggedEl) {
        originalPointerEvents = draggedEl.style.pointerEvents;
        draggedEl.style.pointerEvents = 'none';
      }
  
      try {
        const targetElement = document.elementFromPoint(e.clientX, e.clientY);
        const targetColumnEl = targetElement?.closest('[data-column-id]');
        const targetColumnId = targetColumnEl?.getAttribute('data-column-id');
        const targetColumnType = targetColumnEl?.getAttribute('data-column-type') as 'vehicle' | 'team' | 'unassigned' | undefined;
  
        let newAssignee: Assignee = null;
        if (targetColumnId && targetColumnType && ['vehicle', 'team'].includes(targetColumnType)) {
          newAssignee = { type: targetColumnType as 'vehicle' | 'team', id: targetColumnId };
        }
  
        onUpdateMember(draggedItem.id, { assignee: newAssignee, position: undefined });
      } finally {
        if (draggedEl && originalPointerEvents !== null) {
          draggedEl.style.pointerEvents = originalPointerEvents;
        }
        setDraggedItem(null);
        setResizedItem(null);
      }
    } else {
      setDraggedItem(null);
      setResizedItem(null);
    }
  };
  
  const unassignedMembers = [...teamMembers.filter(m => m.assignee === null && m.position === undefined)].sort((a, b) => {
    if (a.type === 'person' && b.type === 'equipment') return -1;
    if (a.type === 'equipment' && b.type === 'person') return 1;
    return 0;
  });

  const floatingMembers = teamMembers.filter(m => m.position !== undefined);

  return (
    <div
      className="w-full h-full relative flex flex-col bg-background"
    >
      <div 
        className={cn("flex-1 w-full h-full relative", {
          'select-none': !!draggedItem
        })}
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
              <AlertDialogAction onClick={() => handleCreateResource('team')}>Team</AlertDialogAction>
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
            if (column.type === 'vehicle' || column.type === 'team') {
              const container = column.type === 'vehicle' ? vehicles.find(v => v.id === column.id) : teams.find(t => t.id === column.id);
              if (!container) return null;
              
              const members = teamMembers.filter(m => m.assignee?.id === column.id && m.position === undefined);

              return (
                <ResourceColumn
                  key={column.id}
                  container={container}
                  type={column.type}
                  members={members}
                  allSkills={ALL_SKILLS}
                  position={column.position}
                  onMouseDown={(e) => handleMouseDownOnColumn(e, column.id)}
                  onUpdateMember={onUpdateMember}
                  onUpdateContainer={onUpdateContainer}
                  onRemoveContainer={onRemoveContainer}
                  onResizeMemberStart={(e, id) => handleResizeStart(e, id, 'member')}
                  onMemberMouseDown={handleMouseDownOnMember}
                />
              );
            }
            return null;
          })}

          {floatingMembers.map(member => (
              <div key={member.id} className="absolute z-10" style={{left: member.position!.x, top: member.position!.y}}>
                <TeamMemberCard 
                  member={member} 
                  skills={ALL_SKILLS} 
                  isFloating={true}
                  onRemove={() => onRemoveMember(member.id)} 
                  onUpdate={(updates) => onUpdateMember(member.id, updates)}
                  onResizeStart={(e, id) => handleResizeStart(e, id, 'member')}
                  onMouseDown={handleMouseDownOnMember}
                />
              </div>
          ))}

        </div>
      </div>
      <div 
        data-column-id="unassigned"
        data-column-type="unassigned"
        className="w-full bg-background/50 border-t border-border p-2 min-h-24"
      >
        <h3 className="text-center font-bold text-sm mb-2 text-foreground/60 uppercase tracking-wider">Unassigned Resources</h3>
        <div className="grid grid-cols-5 gap-2 p-2">
            {unassignedMembers.map(member => (
              <div key={member.id} className="mb-2">
                <TeamMemberCard 
                  member={member} 
                  skills={ALL_SKILLS} 
                  isUnassigned={true}
                  onRemove={() => onRemoveMember(member.id)} 
                  onUpdate={(updates) => onUpdateMember(member.id, updates)}
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
