'use client';

import { useState, type MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

interface MrtToolbarProps {
  onAddMember: (name: string) => void;
  onMouseDown: (e: MouseEvent) => void;
}

export function MrtToolbar({ onAddMember, onMouseDown }: MrtToolbarProps) {
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
    <header 
      className="absolute z-10 bg-card/80 backdrop-blur-sm p-2 rounded-lg border shadow-lg flex items-center gap-2 cursor-move"
      onMouseDown={onMouseDown}
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
    </header>
  );
}
