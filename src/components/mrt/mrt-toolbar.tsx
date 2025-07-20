'use client';

import { useState, type MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MrtToolbarProps {
  onAddMember: (name: string) => void;
  onMouseDown: (e: MouseEvent) => void;
  onResizeStart: (e: MouseEvent, id: string) => void;
  id: string;
  width?: number;
  height?: number;
}

export function MrtToolbar({ onAddMember, onMouseDown, onResizeStart, id, width, height }: MrtToolbarProps) {
  const [newMemberName, setNewMemberName] = useState('');

  const handleAddClick = () => {
    onAddMember(newMemberName);
    setNewMemberName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddClick();
    }
  }

  return (
    <div
      className="bg-card/80 backdrop-blur-sm p-2 rounded-lg border shadow-lg flex items-center gap-2 cursor-move relative group"
      onMouseDown={onMouseDown}
      style={{
        width: width ? `${width}px` : 'auto',
        height: height ? `${height}px` : 'auto',
      }}
    >
      <div className="flex items-center gap-2 px-2 mr-2">
        <span className="font-bold text-lg font-headline text-foreground">MRT Board</span>
      </div>
      <div className="flex items-center gap-2">
        <Input 
          placeholder="New member name..." 
          value={newMemberName} 
          onChange={(e) => setNewMemberName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-9"
          onMouseDown={(e) => e.stopPropagation()}
        />
        <Button size="icon" onClick={handleAddClick} onMouseDown={(e) => e.stopPropagation()}>
          <Plus className="h-5 w-5" />
        </Button>
      </div>
       <div
        onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e, id); }}
        className="absolute bottom-0 right-0 cursor-se-resize text-slate-400 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-400 opacity-50 group-hover:opacity-100"
      >
        <ArrowDownRight className="w-3 h-3" />
      </div>
    </div>
  );
}
