'use client';

import { useState, type MouseEvent } from 'react';
import { Card } from '@/components/ui/card';
import type { TeamMember, Skill } from '@/lib/mrt/types';
import { cn } from '@/lib/utils';
import { GripVertical, Trash2, ArrowDownRight, User, Wrench } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TeamMemberCardProps {
  member: TeamMember;
  skills: Skill[];
  isUnassigned?: boolean;
  onRemove?: (id: string) => void;
  onUpdate: (id: string, updates: Partial<TeamMember>) => void;
  onResizeStart: (e: MouseEvent, id: string) => void;
  onMouseDown: (e: MouseEvent<HTMLDivElement>, id: string) => void;
}

export function TeamMemberCard({ member, skills, isUnassigned = false, onRemove, onUpdate, onResizeStart, onMouseDown }: TeamMemberCardProps) {
  const memberSkills = skills.filter(s => member.skills.includes(s.id));
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(`${member.firstName} ${member.lastName}`);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    const [firstName, ...lastNameParts] = name.trim().split(' ');
    onUpdate(member.id, { firstName, lastName: lastNameParts.join(' ') });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };
  
  const isPerson = member.type === 'person';

  return (
    <Card
      data-member-id={member.id}
      onMouseDown={(e) => onMouseDown(e, member.id)}
      style={{
        width: member.width ? `${member.width}px` : 'auto',
        height: member.height ? `${member.height}px` : 'auto',
      }}
      className={cn(
        'p-2 flex items-center gap-2 bg-card shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing border group relative',
        {
          'bg-red-200/80 dark:bg-red-900/50': member.role === 'leader',
          'border-l-4 border-accent': member.role === 'driver',
          'bg-sky-100 dark:bg-sky-950/70': member.type === 'equipment',
        }
      )}
    >
      <GripVertical className="h-5 w-5 text-muted-foreground" />
      <div className="flex-grow flex items-center gap-2" onDoubleClick={handleDoubleClick}>
        {isPerson ? <User className="h-4 w-4 text-muted-foreground" /> : <Wrench className="h-4 w-4 text-muted-foreground" />}
        {isEditing ? (
          <Input
            type="text"
            value={name}
            onChange={handleNameChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="h-7 text-sm"
            autoFocus
            onMouseDown={(e) => e.stopPropagation()}
          />
        ) : (
          <p className="font-semibold text-sm text-card-foreground">
            {member.firstName} {member.lastName}
          </p>
        )}
      </div>
      {isPerson && (
        <div className="flex gap-1">
          {memberSkills.map(skill => (
            <div
              key={skill.id}
              title={skill.name}
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: skill.color }}
            />
          ))}
          {Array.from({ length: 4 - memberSkills.length }).map((_, i) => (
              <div key={`placeholder-${i}`} className="w-4 h-4 rounded-sm bg-muted opacity-50" />
          ))}
        </div>
      )}
       {isUnassigned && onRemove && (
        <button onClick={() => onRemove(member.id)} onMouseDown={(e) => e.stopPropagation()} className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive/70 hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </button>
      )}
      <div
        onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e, member.id); }}
        className="absolute bottom-0 right-0 cursor-se-resize text-muted-foreground hover:text-foreground/80 opacity-50 group-hover:opacity-100"
      >
        <ArrowDownRight className="w-3 h-3" />
      </div>
    </Card>
  );
}
