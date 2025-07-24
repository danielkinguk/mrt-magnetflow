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

    console.log('Drag start for member:', memberId, member.firstName, member.lastName);

    const cardElement = e.currentTarget as HTMLElement;
    const cardRect = cardElement.getBoundingClientRect();
    const boardRect = boardRef.current?.getBoundingClientRect();
    
    if (boardRect) {
      const initialPosition = {
        x: cardRect.left - boardRect.left,
        y: cardRect.top - boardRect.top,
      };
      // Don't immediately update state - let the drag operation handle it
    }
    
    const boardPos = getBoardCoordinates(e);
    
    // Calculate offset in the same coordinate system as boardPos (accounting for zoom and pan)
    const offsetX = Math.round(((e.clientX - cardRect.left - pan.x) / zoom) * 100) / 100;
    const offsetY = Math.round(((e.clientY - cardRect.top - pan.y) / zoom) * 100) / 100;
    
    setDraggedItem({
      id: memberId,
      type: 'member',
      offset: {
        x: offsetX,
        y: offsetY,
      },
      initialPosition: boardPos,
    });
    
    console.log('DraggedItem set:', {
      id: memberId,
      type: 'member',
      offset: {
        x: offsetX,
        y: offsetY,
      }
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
    if (draggedItem) {
      const boardPos = getBoardCoordinates(e);
      const newX = boardPos.x - draggedItem.offset.x;
      const newY = boardPos.y - draggedItem.offset.y;

      if (draggedItem.type === 'column') {
        onUpdateColumn(draggedItem.id, { position: { x: newX, y: newY } });
      } else if (draggedItem.type === 'member') {
        // For members, we need to handle the initial state change
        const member = teamMembers.find(m => m.id === draggedItem.id);
        if (member && !member.position) {
          // This is the first move - make the member floating
          onUpdateMember(draggedItem.id, { 
            position: { x: newX, y: newY }, 
            assignee: null 
          });
        } else {
          // Continue updating position with improved precision
          const adjustedX = Math.round(newX * 100) / 100; // Round to 2 decimal places
          const adjustedY = Math.round(newY * 100) / 100; // Round to 2 decimal places
          onUpdateMember(draggedItem.id, { position: { x: adjustedX, y: adjustedY } });
        }
      }
    } else if (resizedItem) {
      const dx = e.clientX - resizedItem.initialPos.x;
      const dy = e.clientY - resizedItem.initialPos.y;
      
      const newWidth = Math.max(100, resizedItem.initialSize.width + dx);
      const newHeight = Math.max(100, resizedItem.initialSize.height + dy);
      
      if (resizedItem.type === 'column') {
        onUpdateColumn(resizedItem.id, { width: newWidth, height: newHeight });
      } else if (resizedItem.type === 'member') {
        onUpdateMember(resizedItem.id, { width: newWidth, height: newHeight });
      }
    }
  };
  
  const handleMouseUp = (e: React.MouseEvent<HTMLElement>) => {
    console.log('Mouse up event triggered');
    console.log('DraggedItem state:', draggedItem);
    
    if (draggedItem && draggedItem.type === 'member') {
      console.log('Drop detected for member:', draggedItem.id);
      
      // Get the element at the drop position
      const targetElement = document.elementFromPoint(e.clientX, e.clientY);
      console.log('Target element:', targetElement);
      
      // Look for the closest column element, including the card itself
      let targetColumnEl = targetElement?.closest('[data-column-id]');
      
      // If we didn't find a column, check if we're dropping on a team member card
      if (!targetColumnEl && targetElement?.closest('[data-member-id]')) {
        const memberCard = targetElement.closest('[data-member-id]');
        const memberId = memberCard?.getAttribute('data-member-id');
        if (memberId) {
          const member = teamMembers.find(m => m.id === memberId);
          if (member?.assignee) {
            // Find the column that contains this member
            const column = columns.find(col => col.id === member.assignee?.id);
            if (column) {
              targetColumnEl = document.querySelector(`[data-column-id="${column.id}"]`);
            }
          }
        }
      }
      
      console.log('Target column element:', targetColumnEl);
      
      const targetColumnId = targetColumnEl?.getAttribute('data-column-id');
      const targetColumnType = targetColumnEl?.getAttribute('data-column-type') as 'vehicle' | 'team' | 'unassigned' | undefined;
      
      console.log('Target column ID:', targetColumnId);
      console.log('Target column type:', targetColumnType);

      let newAssignee: Assignee = null;
      
      // If dropped on a valid column (vehicle or team), assign to that column
      if (targetColumnId && targetColumnType && ['vehicle', 'team'].includes(targetColumnType)) {
        newAssignee = { type: targetColumnType as 'vehicle' | 'team', id: targetColumnId };
        console.log('Assigning to column:', newAssignee);
      }
      // If dropped outside of any column or on unassigned area, move to unassigned
      else {
        newAssignee = null; // This will make it unassigned
        console.log('Moving to unassigned');
      }

      // Update the member: set assignee and clear position to snap it into place
      onUpdateMember(draggedItem.id, { assignee: newAssignee, position: undefined });
    }
    
    setDraggedItem(null);
    setResizedItem(null);
  };

  const handleWheel = (e: React.WheelEvent<HTMLElement>) => {
    e.preventDefault();
    const delta = e.deltaY;
    const newPan = { ...pan };
    
    if (e.ctrlKey || e.metaKey) {
      // Zoom with Ctrl/Cmd + wheel
      const zoomDelta = delta > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.25, Math.min(3, zoom * zoomDelta));
      setZoom(newZoom);
    } else {
      // Pan with wheel - add scroll limits
      const newY = newPan.y + delta * 0.5;
      
      // Calculate content bounds more directly
      const boardRect = boardRef.current?.getBoundingClientRect();
      if (boardRect) {
        // Find the actual content boundaries by looking at all positioned elements
        const allPositions = [
          ...columns.map(col => col.position.y),
          ...floatingMembers.map(member => member.position?.y || 0),
          ...teamMembers.map(member => {
            if (member.assignee) {
              const container = columns.find(col => col.id === member.assignee?.id);
              return container ? container.position.y : 0;
            }
            return 0;
          })
        ].filter(pos => pos !== undefined);
        
        const minContentY = Math.min(...allPositions, 0);
        const maxContentY = Math.max(...allPositions, 0) + 600; // Add space for cards
        
        // Calculate scroll limits
        const maxScrollUp = 50; // Very small padding at top to prevent content from disappearing
        const maxScrollDown = -(maxContentY * zoom - boardRect.height + 150); // Reduced padding to match new layout
        
        // Clamp the scroll position
        const clampedY = Math.max(maxScrollDown, Math.min(maxScrollUp, newY));
        newPan.y = clampedY;
        
        console.log('Scroll limits:', {
          maxScrollUp,
          maxScrollDown,
          newY,
          clampedY,
          minContentY,
          maxContentY,
          zoom,
          boardHeight: boardRect.height,
          allPositions: allPositions.slice(0, 5) // Log first 5 positions
        });
      } else {
        newPan.y = newY;
      }
      
      setPan(newPan);
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
      <div className="fixed top-20 right-4 z-50 flex items-center gap-1 bg-background/80 backdrop-blur-sm border rounded-lg p-1">
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
        className={cn("flex-1 w-full relative overflow-auto board-scroll", {
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
          className="p-4 w-full relative"
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: 'top left',
            transition: 'transform 0.1s ease-out',
            minHeight: '100vh',
            paddingBottom: `${Math.max(20, Math.min(60, 30))}px` // Fixed padding regardless of zoom
          }}
          onWheel={handleWheel}
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
                  width={column.width}
                  height={column.height}
                  onMouseDown={(e) => handleMouseDownOnColumn(e, column.id)}
                  onUpdateMember={onUpdateMember}
                  onUpdateContainer={onUpdateContainer}
                  onRemoveContainer={onRemoveContainer}
                  onResizeMemberStart={(e, id) => handleResizeStart(e, id, 'member')}
                  onMemberMouseDown={handleMouseDownOnMember}
                  onResizeStart={(e, id, type) => handleResizeStart(e, id, type)}
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
        className={cn(
          "w-full bg-background/50 border-t border-border p-2 z-10 unassigned-scroll transition-all duration-200",
          {
            "bg-background/70 border-primary/50 select-none": draggedItem?.type === 'member'
          }
        )}
        style={{ 
          height: `${Math.max(75, Math.min(250, 150 / zoom))}px`, // Dynamic height with limits
          flexShrink: 0,
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        <div>
          <h3 className="text-center font-bold text-sm mb-2 text-foreground/60 uppercase tracking-wider sticky top-0 bg-background/50 backdrop-blur-sm py-1 z-10">
            Unassigned Resources
            {unassignedPeople.length + unassignedEquipment.length > 0 && (
              <span className="ml-2 text-xs text-foreground/40">
                ({unassignedPeople.length + unassignedEquipment.length} items)
              </span>
            )}
          </h3>
          
          {/* People Row */}
          {unassignedPeople.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold mb-2 text-foreground/70 uppercase tracking-wider">People</h4>
              <div className="grid grid-cols-5 gap-2 p-2">
                {unassignedPeople.map(member => {
                  return (
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
                  );
                })}
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
    </div>
  );
}