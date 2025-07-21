'use client';

import { useState, type MouseEvent, useCallback, useRef } from 'react';
import type { Magnet, Container, Point } from '@/lib/mrt/types';
import { NoSSR } from '@/components/no-ssr';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, GripVertical, Trash2, ArrowDownRight, Lightbulb, FileText, CheckSquare, User, Wrench, Car, Users, Folder } from 'lucide-react';
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

const GRID_SIZE = 20;
const MIN_CARD_WIDTH = 150;
const MIN_CARD_HEIGHT = 80;
const MIN_TOOLBAR_WIDTH = 380;
const MIN_TOOLBAR_HEIGHT = 52;

type DraggedItem = {
  id: string;
  type: 'magnet' | 'container';
  offset: Point;
  initialPosition?: Point;
};

type ResizedItem = { 
  id: string, 
  type: 'magnet' | 'container', 
  initialPos: Point, 
  initialSize: {width: number, height: number} 
}

type NewMagnetState = {
  open: boolean;
  title: string;
  type: 'note' | 'idea' | 'task' | 'person' | 'equipment' | 'vehicle' | 'team';
}

interface GenericBoardProps {
  magnets: Magnet[];
  containers: Container[];
  onUpdateMagnet: (id: string, updates: Partial<Magnet>) => void;
  onUpdateContainer: (id: string, updates: Partial<Container>) => void;
  onCreateMagnet: (type: Magnet['type'], title: string, content?: string) => void;
  onCreateContainer: (name: string, type: Container['type']) => void;
  onRemoveMagnet: (id: string) => void;
  onRemoveContainer: (id: string) => void;
}

const getMagnetIcon = (type: Magnet['type']) => {
  switch (type) {
    case 'idea': return <Lightbulb className="h-4 w-4" />;
    case 'note': return <FileText className="h-4 w-4" />;
    case 'task': return <CheckSquare className="h-4 w-4" />;
    case 'person': return <User className="h-4 w-4" />;
    case 'equipment': return <Wrench className="h-4 w-4" />;
    case 'vehicle': return <Car className="h-4 w-4" />;
    case 'team': return <Users className="h-4 w-4" />;
    default: return <FileText className="h-4 w-4" />;
  }
};

const getContainerIcon = (type: Container['type']) => {
  switch (type) {
    case 'category': return <Folder className="h-4 w-4" />;
    case 'vehicle': return <Car className="h-4 w-4" />;
    case 'team': return <Users className="h-4 w-4" />;
    case 'toolbar': return <Plus className="h-4 w-4" />;
    default: return <Folder className="h-4 w-4" />;
  }
};

export function GenericBoard({ 
  magnets, 
  containers, 
  onUpdateMagnet,
  onUpdateContainer,
  onCreateMagnet, 
  onCreateContainer,
  onRemoveMagnet,
  onRemoveContainer
}: GenericBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
  const [resizedItem, setResizedItem] = useState<ResizedItem | null>(null);
  const [newMagnet, setNewMagnet] = useState<NewMagnetState>({ open: false, title: '', type: 'note' });

  const getBoardCoordinates = useCallback((e: MouseEvent<HTMLElement> | React.MouseEvent<HTMLElement>) => {
    if (!boardRef.current) return { x: 0, y: 0 };
    const rect = boardRef.current.getBoundingClientRect();
    const scale = rect.width / boardRef.current.offsetWidth;
    return { x: (e.clientX - rect.left) / scale, y: (e.clientY - rect.top) / scale };
  }, []);

  const handleOpenMagnetDialog = (type: Magnet['type']) => {
    // Only allow valid Magnet types for creation (exclude 'category')
    const validTypes: ('note' | 'idea' | 'task' | 'person' | 'equipment' | 'vehicle' | 'team')[] = ['note', 'idea', 'task', 'person', 'equipment', 'vehicle', 'team'];
    if (validTypes.includes(type as any)) {
      setNewMagnet({ open: true, title: '', type: type as any });
    } else {
      // fallback to 'note' if invalid type is passed
      setNewMagnet({ open: true, title: '', type: 'note' });
    }
  };
  
  const handleCreateMagnet = () => {
    const { title, type } = newMagnet;
    if (!title.trim()) return;
    onCreateMagnet(type, title);
    setNewMagnet({ open: false, title: '', type: 'note' });
  };
  
  const handleMouseDownOnContainer = (e: MouseEvent<HTMLElement>, id: string) => {
    e.stopPropagation();
    const container = containers.find(c => c.id === id);
    if (!container) return;
    const boardPos = getBoardCoordinates(e);
    setDraggedItem({
      id,
      type: 'container',
      offset: { x: boardPos.x - container.position.x, y: boardPos.y - container.position.y },
    });
  };

  const handleMouseDownOnMagnet = (e: MouseEvent<HTMLDivElement>, magnetId: string) => {
    e.stopPropagation();
    const magnet = magnets.find(m => m.id === magnetId);
    if (!magnet) return;
    
    const cardElement = e.currentTarget as HTMLDivElement;
    const cardRect = cardElement.getBoundingClientRect();
    const boardRect = boardRef.current?.getBoundingClientRect();

    if (!boardRect) return;

    let initialPosition = magnet.position;
    
    if (!initialPosition) {
        initialPosition = {
          x: cardRect.left - boardRect.left,
          y: cardRect.top - boardRect.top,
        };
        onUpdateMagnet(magnetId, { position: initialPosition, assignee: undefined });
    }
    
    const boardPos = getBoardCoordinates(e);

    setDraggedItem({
      id: magnetId,
      type: 'magnet',
      offset: { x: boardPos.x - initialPosition.x, y: boardPos.y - initialPosition.y },
      initialPosition,
    });
  };

  const handleResizeStart = (e: MouseEvent, id: string, type: 'magnet' | 'container') => {
    e.stopPropagation();
    
    const cardElement = (e.target as HTMLElement).closest<HTMLElement>('[data-magnet-id],[data-container-id]');
    if (!cardElement) return;

    let item;
    if (type === 'magnet') {
      item = magnets.find(m => m.id === id);
    } else {
      item = containers.find(c => c.id === id);
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
    const boardPos = getBoardCoordinates(e);

    if (draggedItem) {
      let newX = boardPos.x - draggedItem.offset.x;
      let newY = boardPos.y - draggedItem.offset.y;
      
      newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
      newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;

      if (draggedItem.type === 'container') {
        onUpdateContainer(draggedItem.id, { position: { x: newX, y: newY } });
      } else if (draggedItem.type === 'magnet') {
        onUpdateMagnet(draggedItem.id, { position: { x: newX, y: newY } });
      }
    } else if (resizedItem) {
        const dx = e.clientX - resizedItem.initialPos.x;
        const dy = e.clientY - resizedItem.initialPos.y;
        
        if (resizedItem.type === 'magnet') {
          const newWidth = Math.max(MIN_CARD_WIDTH, resizedItem.initialSize.width + dx);
          const newHeight = Math.max(MIN_CARD_HEIGHT, resizedItem.initialSize.height + dy);
          onUpdateMagnet(resizedItem.id, { width: newWidth, height: newHeight });
        } else if (resizedItem.type === 'container') {
          const newWidth = Math.max(MIN_TOOLBAR_WIDTH, resizedItem.initialSize.width + dx);
          const newHeight = Math.max(MIN_TOOLBAR_HEIGHT, resizedItem.initialSize.height + dy);
          onUpdateContainer(resizedItem.id, { width: newWidth, height: newHeight });
        }
    }
  };
  
  const handleMouseUp = (e: React.MouseEvent<HTMLElement>) => {
    if (draggedItem && draggedItem.type === 'magnet') {
      const draggedEl = document.querySelector(`[data-magnet-id="${draggedItem.id}"]`) as HTMLElement;
      let originalDisplay: string | null = null;
      
      if (draggedEl) {
        originalDisplay = draggedEl.style.display;
        draggedEl.style.display = 'none';
      }
  
      try {
        const targetElement = document.elementFromPoint(e.clientX, e.clientY);
        const targetContainerEl = targetElement?.closest('[data-container-id]');
        const targetContainerId = targetContainerEl?.getAttribute('data-container-id');
  
        if (targetContainerId) {
          onUpdateMagnet(draggedItem.id, { assignee: targetContainerId, position: undefined });
        }

      } finally {
        if (draggedEl && originalDisplay !== null) {
          draggedEl.style.display = originalDisplay;
        }
        setDraggedItem(null);
        setResizedItem(null);
      }
    } else {
      setDraggedItem(null);
      setResizedItem(null);
    }
  };
  
  const unassignedMagnets = magnets.filter(m => !m.assignee && !m.position);
  const floatingMagnets = magnets.filter(m => m.position !== undefined);

  return (
    <div className="w-full h-full relative flex flex-col bg-background">
      <div 
        className={cn("flex-1 w-full h-full relative", {
          'select-none': !!draggedItem
        })}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={boardRef}
      >
        <AlertDialog open={newMagnet.open} onOpenChange={(open) => setNewMagnet(prev => ({...prev, open}))}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Create New Magnet</AlertDialogTitle>
              <AlertDialogDescription>
                What type of magnet is "{newMagnet.title}"?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleCreateMagnet()}>Create</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="p-4 w-full h-full relative">
          {containers.map((container) => {
            if (container.type === 'toolbar') {
              return (
                <NoSSR key={container.id}>
                  <div style={{ position: 'absolute', left: container.position.x, top: container.position.y }}>
                    <div
                      data-container-id={container.id}
                      className="bg-card/80 backdrop-blur-sm p-2 rounded-lg border shadow-lg flex items-center gap-2 cursor-move relative group"
                      onMouseDown={(e) => handleMouseDownOnContainer(e, container.id)}
                      style={{
                        width: container.width ? `${container.width}px` : 'auto',
                        height: container.height ? `${container.height}px` : 'auto',
                      }}
                    >
                      <div className="flex items-center gap-2 px-2 mr-2">
                        <span className="font-bold text-lg text-foreground">Add Magnet</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => handleOpenMagnetDialog('note')} onMouseDown={(e) => e.stopPropagation()}>
                          <FileText className="h-4 w-4 mr-1" />
                          Note
                        </Button>
                        <Button size="sm" onClick={() => handleOpenMagnetDialog('idea')} onMouseDown={(e) => e.stopPropagation()}>
                          <Lightbulb className="h-4 w-4 mr-1" />
                          Idea
                        </Button>
                        <Button size="sm" onClick={() => handleOpenMagnetDialog('task')} onMouseDown={(e) => e.stopPropagation()}>
                          <CheckSquare className="h-4 w-4 mr-1" />
                          Task
                        </Button>
                      </div>
                      <div
                        onMouseDown={(e) => { e.stopPropagation(); handleResizeStart(e, container.id, 'container'); }}
                        className="absolute bottom-0 right-0 cursor-se-resize text-muted-foreground hover:text-foreground/80 opacity-50 group-hover:opacity-100"
                      >
                        <ArrowDownRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </NoSSR>
              );
            }
            
            const containerMagnets = magnets.filter(m => m.assignee === container.id && !m.position);
            
            return (
              <div
                key={container.id}
                className="absolute"
                style={{ left: container.position.x, top: container.position.y }}
                onMouseDown={(e) => handleMouseDownOnContainer(e, container.id)}
              >
                <Card 
                  data-container-id={container.id} 
                  data-container-type={container.type}
                  className="w-80 flex-shrink-0 bg-card/80 border cursor-move group relative"
                  style={{
                    width: container.width ? `${container.width}px` : 'auto',
                    height: container.height ? `${container.height}px` : 'auto',
                  }}
                >
                  <CardHeader className="p-2">
                    <CardTitle
                      className="text-center text-lg font-bold p-2 rounded-md text-primary-foreground flex items-center justify-center gap-2"
                      style={{ backgroundColor: container.color }}
                    >
                      {getContainerIcon(container.type)}
                      {container.name}
                    </CardTitle>
                  </CardHeader>
                  <button
                    className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center cursor-pointer hover:bg-destructive/90 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => { e.stopPropagation(); onRemoveContainer(container.id); }}
                    onMouseDown={(e) => e.stopPropagation()}
                    title={`Delete ${container.type}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <CardContent className="p-2 min-h-[200px] space-y-2">
                    {containerMagnets.map(magnet => (
                      <div key={magnet.id} className="mb-2">
                        <Card
                          data-magnet-id={magnet.id}
                          onMouseDown={(e) => handleMouseDownOnMagnet(e, magnet.id)}
                          style={{
                            width: magnet.width ? `${magnet.width}px` : 'auto',
                            height: magnet.height ? `${magnet.height}px` : 'auto',
                          }}
                          className="p-2 flex items-center gap-2 bg-card shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing border group relative"
                        >
                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-grow">
                            <div className="flex items-center gap-2">
                              {getMagnetIcon(magnet.type)}
                              <p className="font-semibold text-sm text-card-foreground">{magnet.title}</p>
                            </div>
                            {magnet.content && (
                              <p className="text-xs text-muted-foreground mt-1">{magnet.content}</p>
                            )}
                          </div>
                          <button 
                            onClick={() => onRemoveMagnet(magnet.id)} 
                            onMouseDown={(e) => e.stopPropagation()} 
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive/70 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <div
                            onMouseDown={(e) => { e.stopPropagation(); handleResizeStart(e, magnet.id, 'magnet'); }}
                            className="absolute bottom-0 right-0 cursor-se-resize text-muted-foreground hover:text-foreground/80 opacity-50 group-hover:opacity-100"
                          >
                            <ArrowDownRight className="w-3 h-3" />
                          </div>
                        </Card>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            );
          })}

          {floatingMagnets.map(magnet => (
            <div key={magnet.id} className="absolute z-50" style={{left: magnet.position!.x, top: magnet.position!.y}}>
              <Card
                data-magnet-id={magnet.id}
                onMouseDown={(e) => handleMouseDownOnMagnet(e, magnet.id)}
                style={{
                  width: magnet.width ? `${magnet.width}px` : 'auto',
                  height: magnet.height ? `${magnet.height}px` : 'auto',
                }}
                className="p-2 flex items-center gap-2 bg-card shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing border group relative opacity-75"
              >
                <GripVertical className="h-5 w-5 text-muted-foreground" />
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    {getMagnetIcon(magnet.type)}
                    <p className="font-semibold text-sm text-card-foreground">{magnet.title}</p>
                  </div>
                  {magnet.content && (
                    <p className="text-xs text-muted-foreground mt-1">{magnet.content}</p>
                  )}
                </div>
                <button 
                  onClick={() => onRemoveMagnet(magnet.id)} 
                  onMouseDown={(e) => e.stopPropagation()} 
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive/70 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div
                  onMouseDown={(e) => { e.stopPropagation(); handleResizeStart(e, magnet.id, 'magnet'); }}
                  className="absolute bottom-0 right-0 cursor-se-resize text-muted-foreground hover:text-foreground/80 opacity-50 group-hover:opacity-100"
                >
                  <ArrowDownRight className="w-3 h-3" />
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <div 
        data-container-id="unassigned"
        data-container-type="unassigned"
        className="w-full bg-background/50 border-t border-border p-2 min-h-24"
      >
        <h3 className="text-center font-bold text-sm mb-2 text-foreground/60 uppercase tracking-wider">Unassigned Magnets</h3>
        <div className="grid grid-cols-5 gap-2 p-2">
            {unassignedMagnets.map(magnet => (
              <div key={magnet.id} className="mb-2">
                <Card
                  data-magnet-id={magnet.id}
                  onMouseDown={(e) => handleMouseDownOnMagnet(e, magnet.id)}
                  style={{
                    width: magnet.width ? `${magnet.width}px` : 'auto',
                    height: magnet.height ? `${magnet.height}px` : 'auto',
                  }}
                  className="p-2 flex items-center gap-2 bg-card shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing border group relative"
                >
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      {getMagnetIcon(magnet.type)}
                      <p className="font-semibold text-sm text-card-foreground">{magnet.title}</p>
                    </div>
                    {magnet.content && (
                      <p className="text-xs text-muted-foreground mt-1">{magnet.content}</p>
                    )}
                  </div>
                  <button 
                    onClick={() => onRemoveMagnet(magnet.id)} 
                    onMouseDown={(e) => e.stopPropagation()} 
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive/70 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div
                    onMouseDown={(e) => { e.stopPropagation(); handleResizeStart(e, magnet.id, 'magnet'); }}
                    className="absolute bottom-0 right-0 cursor-se-resize text-muted-foreground hover:text-foreground/80 opacity-50 group-hover:opacity-100"
                  >
                    <ArrowDownRight className="w-3 h-3" />
                  </div>
                </Card>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
} 