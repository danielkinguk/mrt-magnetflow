'use client';

import { useState, type MouseEvent, useCallback, useRef } from 'react';
import type { TeamMember, Vehicle, Skill, Column, Point, Team, Assignee } from '@/lib/mrt/types';
import { ResourceColumn } from '@/components/mrt/resource-column';
import { MrtToolbar } from '@/components/mrt/mrt-toolbar';
import { ALL_SKILLS } from '@/lib/mrt/data';
import { NoSSR } from '@/components/no-ssr';
import { TeamMemberCard } from './team-member-card';
import { Button } from '@/components/ui/button';
import { Plus, Minus, RotateCcw } from 'lucide-react';
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
  boardId?: string;
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
  boardId,
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
  
  // Load zoom and pan from localStorage on component mount
  const [zoom, setZoom] = useState(() => {
    if (boardId && typeof window !== 'undefined') {
      const saved = localStorage.getItem(`magnetflow-zoom-${boardId}`);
      return saved ? parseFloat(saved) : 1;
    }
    return 1;
  });
  
  const [pan, setPan] = useState(() => {
    if (boardId && typeof window !== 'undefined') {
      const saved = localStorage.getItem(`magnetflow-pan-${boardId}`);
      return saved ? JSON.parse(saved) : { x: 0, y: 0 };
    }
    return { x: 0, y: 0 };
  });

  const getBoardCoordinates = useCallback((e: MouseEvent<HTMLElement> | React.MouseEvent<HTMLElement>) => {
    if (!boardRef.current) return { x: 0, y: 0 };
    const rect = boardRef.current.getBoundingClientRect();
    return { 
      x: (e.clientX - rect.left - pan.x) / zoom, 
      y: (e.clientY - rect.top - pan.y) / zoom 
    };
  }, [zoom, pan]);

  // Throttle mouse move events for smoother performance
  const throttledMouseMove = useCallback((e: MouseEvent<HTMLElement>) => {
    if (draggedItem || resizedItem) {
      handleMouseMove(e);
    }
  }, [draggedItem, resizedItem]);

  const handleOpenResourceDialog = (name: string) => {
    setNewResource({ open: true, name });
  };
  
  const handleCreateResource = (type: 'person' | 'equipment' | 'vehicle' | 'team') => {
    const name = newResource.name;
    if (!name.trim()) return;
    onCreateResource(type, name);
    setNewResource({ open: false, name: '' });
  };

  const handleZoomIn = () => {
    setZoom(prev => {
      const newZoom = Math.min(prev + 0.25, 3);
      if (boardId && typeof window !== 'undefined') {
        localStorage.setItem(`magnetflow-zoom-${boardId}`, newZoom.toString());
      }
      return newZoom;
    });
  };

  const handleZoomOut = () => {
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.25, 0.25);
      if (boardId && typeof window !== 'undefined') {
        localStorage.setItem(`magnetflow-zoom-${boardId}`, newZoom.toString());
      }
      return newZoom;
    });
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    if (boardId && typeof window !== 'undefined') {
      localStorage.setItem(`magnetflow-zoom-${boardId}`, '1');
      localStorage.setItem(`magnetflow-pan-${boardId}`, JSON.stringify({ x: 0, y: 0 }));
    }
  };
  
  const handleMouseDownOnColumn = (e: MouseEvent<Element>, id: string) => {
    e.stopPropagation();
    const column = columns.find(c => c.id === id);
    if (!column) return;
    // Ensure we always pass a MouseEvent with HTMLElement as currentTarget to getBoardCoordinates
    // This avoids type errors when e.currentTarget is not HTMLElement
    let eventForCoords: MouseEvent<HTMLElement>;
    if (e.currentTarget instanceof HTMLElement) {
      eventForCoords = e as MouseEvent<HTMLElement>;
    } else {
      // Fallback: synthesize a MouseEvent with boardRef.current as currentTarget
      eventForCoords = Object.assign({}, e, { currentTarget: boardRef.current }) as MouseEvent<HTMLElement>;
    }
    const boardPos = getBoardCoordinates(eventForCoords);
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
        // If the member doesn't have a position, it's in a column. Calculate its initial
        // position on the board before detaching it.
        initialPosition = {
          x: cardRect.left - boardRect.left,
          y: cardRect.top - boardRect.top,
        };
        // Immediately update state to reflect it's being dragged and has a position
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
  
  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      const boardPos = getBoardCoordinates(e);

      if (draggedItem) {
        let newX = boardPos.x - draggedItem.offset.x;
        let newY = boardPos.y - draggedItem.offset.y;
        
        // Only snap to grid for columns, allow smooth movement for members
        if (draggedItem.type === 'column') {
          newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
          newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;
        }

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
    });
  };
  
  const handleMouseUp = (e: React.MouseEvent<HTMLElement>) => {
    if (draggedItem && draggedItem.type === 'member') {
      // Temporarily hide the dragged element to detect drop target
      const draggedEl = document.querySelector(`[data-member-id="${draggedItem.id}"]`) as HTMLElement;
      let originalDisplay: string | null = null;
      
      if (draggedEl) {
        originalDisplay = draggedEl.style.display;
        draggedEl.style.display = 'none';
      }
  
      try {
        // Now we can properly detect the drop target
        const targetElement = document.elementFromPoint(e.clientX, e.clientY);
        const targetColumnEl = targetElement?.closest('[data-column-id]');
        const targetColumnId = targetColumnEl?.getAttribute('data-column-id');
        const targetColumnType = targetColumnEl?.getAttribute('data-column-type') as 'vehicle' | 'team' | 'unassigned' | undefined;
  
        let newAssignee: Assignee = null;
        if (targetColumnId && targetColumnType && ['vehicle', 'team'].includes(targetColumnType)) {
          newAssignee = { type: targetColumnType as 'vehicle' | 'team', id: targetColumnId };
        }
  
        // Final update: set assignee and clear position to snap it into place.
        onUpdateMember(draggedItem.id, { assignee: newAssignee, position: undefined });

      } finally {
        // Always restore the element's visibility and clear drag state
        if (draggedEl && originalDisplay !== null) {
          draggedEl.style.display = originalDisplay;
        }
        setDraggedItem(null);
        setResizedItem(null);
      }
    } else {
      // Clear drag state if it wasn't a member being dragged
      setDraggedItem(null);
      setResizedItem(null);
    }
  };
  
  const unassignedMembers = teamMembers.filter(m => m.assignee === null && m.position === undefined);
  const unassignedPeople = unassignedMembers.filter(m => m.type === 'person');
  const unassignedEquipment = unassignedMembers.filter(m => m.type === 'equipment');

  const floatingMembers = teamMembers.filter(m => m.position !== undefined);

  return (
    <div
      className="w-full h-full relative flex flex-col bg-background"
    >
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-1 bg-background/80 backdrop-blur-sm border rounded-lg p-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomOut}
          disabled={zoom <= 0.25}
          className="h-8 w-8"
          title="Zoom Out"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <div className="px-2 text-sm font-medium min-w-[3rem] text-center">
          {Math.round(zoom * 100)}%
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomIn}
          disabled={zoom >= 3}
          className="h-8 w-8"
          title="Zoom In"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleResetZoom}
          className="h-8 w-8"
          title="Reset Zoom"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      <div 
        className={cn("flex-1 w-full h-full relative", {
          'select-none': !!draggedItem
        })}
        onMouseMove={throttledMouseMove}
        onMouseUp={handleMouseUp}
        ref={boardRef}
      >
        <AlertDialog open={newResource.open} onOpenChange={(open) => setNewResource(prev => ({...prev, open}))}>
          <AlertDialogContent className="text-center">
            <AlertDialogHeader className="text-center">
              <AlertDialogTitle>Create New Resource</AlertDialogTitle>
              <AlertDialogDescription>
                What type of resource is "{newResource.name}"?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex justify-center gap-2">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleCreateResource('person')}>Person</AlertDialogAction>
              <AlertDialogAction onClick={() => handleCreateResource('equipment')}>Equipment</AlertDialogAction>
              <AlertDialogAction onClick={() => handleCreateResource('vehicle')}>Vehicle</AlertDialogAction>
              <AlertDialogAction onClick={() => handleCreateResource('team')}>Team</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div 
          className="p-4 w-full h-full relative"
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: 'top left',
            transition: 'transform 0.1s ease-out'
          }}
        >
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
              <div 
                key={member.id} 
                className="absolute z-50 transform-gpu" 
                style={{
                  left: member.position!.x, 
                  top: member.position!.y,
                  transform: 'translate3d(0, 0, 0)' // Force hardware acceleration
                }}
              >
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
        
        {/* People Row */}
        {unassignedPeople.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold mb-2 text-foreground/70 uppercase tracking-wider">People</h4>
            <div className="grid grid-cols-5 gap-2 p-2">
              {unassignedPeople.map(member => (
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
        )}
        
        {/* Equipment Row */}
        {unassignedEquipment.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold mb-2 text-foreground/70 uppercase tracking-wider">Equipment</h4>
            <div className="grid grid-cols-5 gap-2 p-2">
              {unassignedEquipment.map(member => (
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
        )}
      </div>
    </div>
  );
}
