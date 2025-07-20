'use client';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import type { Vehicle, TeamMember, Skill, Point, Team } from '@/lib/mrt/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TeamMemberCard } from '@/components/mrt/team-member-card';
import { Input } from '../ui/input';
import { Trash2 } from 'lucide-react';

interface ResourceColumnProps {
  container: Vehicle | Team;
  type: 'vehicle' | 'team';
  members: TeamMember[];
  allSkills: Skill[];
  position: Point;
  onMouseDown: (e: MouseEvent) => void;
  updateMember: (id: string, updates: Partial<TeamMember>) => void;
  updateContainer: (id: string, type: 'vehicle' | 'team', updates: Partial<Vehicle> | Partial<Team>) => void;
  onRemoveContainer: (id: string, type: 'vehicle' | 'team') => void;
  onResizeMemberStart: (e: MouseEvent, memberId: string) => void;
  onMemberMouseDown: (e: MouseEvent<HTMLDivElement>, memberId: string) => void;
}

export function ResourceColumn({ container, type, members, allSkills, position, onMouseDown, updateMember, updateContainer, onRemoveContainer, onResizeMemberStart, onMemberMouseDown }: ResourceColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(container.name);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (name !== container.name) {
      updateContainer(container.id, type, { name });
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  const sortedMembers = [...members].sort((a, b) => {
    if (a.type === 'person' && b.type === 'equipment') return -1;
    if (a.type === 'equipment' && b.type === 'person') return 1;
    return 0;
  });

  return (
    <div
      className="absolute"
      style={{ left: position.x, top: position.y }}
      onMouseDown={onMouseDown}
    >
      <Card data-column-id={container.id} data-column-type={type} className="w-80 flex-shrink-0 bg-card/80 border cursor-move group relative">
        <CardHeader className="p-2" onDoubleClick={handleDoubleClick}>
          {isEditing ? (
             <Input
                type="text"
                value={name}
                onChange={handleNameChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="h-9 text-lg font-bold text-center"
                autoFocus
                onMouseDown={(e) => e.stopPropagation()}
             />
          ) : (
            <CardTitle
              className="text-center text-lg font-bold p-2 rounded-md text-primary-foreground"
              style={{ backgroundColor: container.color }}
            >
              {container.name}
            </CardTitle>
          )}
        </CardHeader>
        <button
          className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center cursor-pointer hover:bg-destructive/90 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => { e.stopPropagation(); onRemoveContainer(container.id, type); }}
          onMouseDown={(e) => e.stopPropagation()}
          title={`Delete ${type}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        <CardContent className="p-2 min-h-[200px] space-y-2">
          {sortedMembers.map(member => (
            <div key={member.id} className="mb-2">
              <TeamMemberCard 
                member={member} 
                skills={allSkills} 
                onUpdate={updateMember} 
                onResizeStart={onResizeMemberStart}
                onMouseDown={onMemberMouseDown}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
