'use client';

import { useState, useEffect, useCallback } from 'react';
import { produce } from 'immer';
import type { Magnet, Container, GenericBoardData, Point } from '@/lib/mrt/types';
import { GenericBoard } from '@/components/mrt/generic-board';

const HORIZONTAL_SPACING = 340;
const VERTICAL_POSITION = 120;
const TOOLBAR_POSITION = { x: 20, y: 20 };

export function GenericBoardClientPage({
  boardId,
  initialData,
  setTidyUp,
}: {
  boardId: string;
  initialData: GenericBoardData;
  setTidyUp?: (fn: () => void) => void;
}) {
  const [magnets, setMagnets] = useState<Magnet[]>(initialData.magnets);
  const [containers, setContainers] = useState<Container[]>(initialData.containers);

  useEffect(() => {
    setMagnets(initialData.magnets);
    setContainers(initialData.containers);
  }, [initialData]);

  const handleTidyUp = useCallback(() => {
    setContainers(produce(draft => {
      let categoryIndex = 0;
      let toolbarIndex = 0;

      draft.forEach(container => {
        if (container.type === 'category') {
          container.position = { x: categoryIndex * HORIZONTAL_SPACING + 20, y: VERTICAL_POSITION };
          categoryIndex++;
        } else if (container.type === 'toolbar') {
          container.position = TOOLBAR_POSITION;
          toolbarIndex++;
        }
      });
    }));

    setMagnets(produce(draft => {
        draft.forEach(magnet => {
            magnet.position = undefined;
        });
    }));
  }, []);

  useEffect(() => {
    if (setTidyUp) {
      setTidyUp(() => handleTidyUp);
    }
  }, [setTidyUp, handleTidyUp]);

  const updateMagnet = useCallback((id: string, updates: Partial<Magnet>) => {
    setMagnets(produce(draft => {
      const magnet = draft.find(m => m.id === id);
      if (magnet) {
        Object.assign(magnet, updates);
        magnet.updatedAt = new Date();
      }
    }));
  }, []);

  const updateContainer = useCallback((id: string, updates: Partial<Container>) => {
    setContainers(produce(draft => {
      const container = draft.find(c => c.id === id);
      if (container) {
        Object.assign(container, updates);
      }
    }));
  }, []);

  const handleCreateMagnet = (type: Magnet['type'], title: string, content?: string) => {
    const newId = `magnet-${Date.now()}`;
    const newMagnet: Magnet = {
      id: newId,
      type,
      title,
      content,
      color: getRandomColor(),
      tags: [],
      position: undefined,
      assignee: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setMagnets(prev => [...prev, newMagnet]);
  };

  const handleCreateContainer = (name: string, type: Container['type']) => {
    const newId = `container-${Date.now()}`;
    const newContainer: Container = {
      id: newId,
      name,
      type,
      color: getRandomColor(),
      position: { x: 20, y: 500 },
      magnets: [],
    };
    setContainers(prev => [...prev, newContainer]);
  };

  const handleRemoveContainer = (id: string) => {
    setContainers(prev => prev.filter(container => container.id !== id));
    setMagnets(produce(draft => {
      draft.forEach(magnet => {
        if (magnet.assignee === id) {
          magnet.assignee = undefined;
        }
      });
    }));
  };
  
  const handleRemoveMagnet = (id: string) => {
    setMagnets(prev => prev.filter(magnet => magnet.id !== id));
  };

  const getRandomColor = () => {
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#607D8B', '#795548', '#E91E63'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <main className="w-full h-full overflow-hidden flex-1">
      <GenericBoard
        key={boardId}
        magnets={magnets}
        containers={containers}
        onCreateMagnet={handleCreateMagnet}
        onCreateContainer={handleCreateContainer}
        onRemoveMagnet={handleRemoveMagnet}
        onRemoveContainer={handleRemoveContainer}
        onUpdateMagnet={updateMagnet}
        onUpdateContainer={updateContainer}
      />
    </main>
  );
} 