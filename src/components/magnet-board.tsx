'use client';

import { useState, useRef, useCallback, useEffect, type MouseEvent } from 'react';
import type { MagnetData, ConnectionData, Point, AISuggestion } from '@/lib/types';
import { getAiSuggestions } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Toolbar } from '@/components/toolbar';
import { Magnet } from '@/components/magnet';
import { ConnectionsLayer } from '@/components/connections-layer';

const initialMagnets: MagnetData[] = [
  { id: 'magnet-1', text: 'Brainstorming session Q3', position: { x: 100, y: 150 }, color: '#FDDC8C' },
  { id: 'magnet-2', text: 'User feedback analysis', position: { x: 400, y: 100 }, color: '#A4D9F8' },
  { id: 'magnet-3', text: 'New feature ideas', position: { x: 150, y: 400 }, color: '#B2EAC8' },
  { id: 'magnet-4', text: 'Marketing campaign for new feature', position: { x: 500, y: 450 }, color: '#F8C8DC' },
];

const MAGNET_COLORS = ['#FDDC8C', '#A4D9F8', '#B2EAC8', '#F8C8DC', '#D8C8F8'];

export function MagnetBoard() {
  const { toast } = useToast();
  const boardRef = useRef<HTMLDivElement>(null);

  const [magnets, setMagnets] = useState<MagnetData[]>(initialMagnets);
  const [connections, setConnections] = useState<ConnectionData[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  
  const [draggedMagnet, setDraggedMagnet] = useState<{ id: string; offset: Point } | null>(null);
  const [newConnection, setNewConnection] = useState<{ sourceId: string; to: Point } | null>(null);

  const getBoardCoordinates = useCallback((e: MouseEvent) => {
    if (!boardRef.current) return { x: 0, y: 0 };
    const rect = boardRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const handleAddMagnet = () => {
    const newId = `magnet-${Date.now()}`;
    const nextColor = MAGNET_COLORS[magnets.length % MAGNET_COLORS.length];
    const newMagnet: MagnetData = {
      id: newId,
      text: 'New Idea',
      position: { x: Math.random() * 500 + 50, y: Math.random() * 300 + 50 },
      color: nextColor,
    };
    setMagnets(prev => [...prev, newMagnet]);
  };

  const handleUpdateMagnetText = (id: string, text: string) => {
    setMagnets(prev => prev.map(m => m.id === id ? { ...m, text } : m));
  };
  
  const handleDeleteMagnet = (id: string) => {
    setMagnets(prev => prev.filter(m => m.id !== id));
    setConnections(prev => prev.filter(c => c.sourceId !== id && c.targetId !== id));
    setAiSuggestions(prev => prev.filter(c => c.sourceId !== id && c.targetId !== id));
  };

  const handleSuggestConnections = async () => {
    toast({ title: 'AI is thinking...', description: 'Generating connection suggestions.' });
    const result = await getAiSuggestions({
      magnets: magnets.map(({ id, text }) => ({ id, text })),
    });

    if (result.success && result.suggestions) {
      const validSuggestions = result.suggestions
        .filter(s => magnets.some(m => m.id === s.sourceId) && magnets.some(m => m.id === s.targetId))
        .map(s => ({ ...s, id: `ai-${s.sourceId}-${s.targetId}`}));
      setAiSuggestions(validSuggestions);
      toast({ title: 'Suggestions loaded!', description: `${validSuggestions.length} new connections suggested by AI.` });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
  };

  const handleMouseDownOnMagnet = (e: MouseEvent, id: string) => {
    e.stopPropagation();
    const magnet = magnets.find(m => m.id === id);
    if (!magnet) return;
    const boardPos = getBoardCoordinates(e);
    setDraggedMagnet({
      id,
      offset: { x: boardPos.x - magnet.position.x, y: boardPos.y - magnet.position.y },
    });
  };
  
  const handleStartConnection = (e: MouseEvent, sourceId: string) => {
    e.stopPropagation();
    const boardPos = getBoardCoordinates(e);
    setNewConnection({ sourceId, to: boardPos });
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    const boardPos = getBoardCoordinates(e);
    if (draggedMagnet) {
      setMagnets(prev => prev.map(m => m.id === draggedMagnet.id ? { ...m, position: { x: boardPos.x - draggedMagnet.offset.x, y: boardPos.y - draggedMagnet.offset.y } } : m));
    }
    if (newConnection) {
      setNewConnection(prev => prev ? { ...prev, to: boardPos } : null);
    }
  };
  
  const handleMouseUp = (e: MouseEvent) => {
    setDraggedMagnet(null);
    if (newConnection) {
      const targetElement = document.elementFromPoint(e.clientX, e.clientY);
      const targetId = targetElement?.closest('[data-magnet-id]')?.getAttribute('data-magnet-id');

      if (targetId && targetId !== newConnection.sourceId) {
        // Prevent duplicate connections
        const exists = connections.some(c => 
            (c.sourceId === newConnection.sourceId && c.targetId === targetId) ||
            (c.sourceId === targetId && c.targetId === newConnection.sourceId)
        );
        if (!exists) {
            const newConnectionData: ConnectionData = {
                id: `conn-${newConnection.sourceId}-${targetId}`,
                sourceId: newConnection.sourceId,
                targetId: targetId,
            };
            setConnections(prev => [...prev, newConnectionData]);
        }
      }
      setNewConnection(null);
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative">
      <Toolbar onAddMagnet={handleAddMagnet} onSuggestConnections={handleSuggestConnections} />
      <div
        ref={boardRef}
        className="w-full h-full relative overflow-hidden cursor-default"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <ConnectionsLayer magnets={magnets} connections={connections} aiSuggestions={aiSuggestions} previewConnection={newConnection}/>
        {magnets.map(magnet => (
          <Magnet
            key={magnet.id}
            data={magnet}
            onMouseDown={(e) => handleMouseDownOnMagnet(e, magnet.id)}
            onStartConnection={(e) => handleStartConnection(e, magnet.id)}
            onUpdateText={handleUpdateMagnetText}
            onDelete={handleDeleteMagnet}
          />
        ))}
      </div>
    </div>
  );
}
