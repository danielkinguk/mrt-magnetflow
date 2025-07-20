'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import type { TeamMember, Skill } from '@/lib/mrt/types';
import { cn } from '@/lib/utils';
import { GripVertical, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TeamMemberCardProps {
  member: TeamMember;
  skills: Skill[];
  isUnassigned?: boolean;
  onRemove?: (id: string) => void;
  onUpdate: (id: string, updates: Partial<TeamMember>) => void;
}

export function TeamMemberCard({ member, skills, isUnassigned = false, onRemove, onUpdate }: TeamMemberCardProps) {
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
    const [firstName, ...lastNameParts] = name.split(' ');
    onUpdate(member.id, { firstName, lastName: lastNameParts.join(' ') });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <Card
      className={cn(
        'p-2 flex items-center gap-2 mb-2 bg-white/90 dark:bg-slate-800/90 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing border border-slate-200 dark:border-slate-700/80 group',
        {
          'bg-red-200/80 dark:bg-red-900/50': member.role === 'leader',
          'border-l-4 border-yellow-500': member.role === 'driver',
        }
      )}
    >
      <GripVertical className="h-5 w-5 text-slate-400 dark:text-slate-600" />
      <div className="flex-grow" onDoubleClick={handleDoubleClick}>
        {isEditing ? (
          <Input
            type="text"
            value={name}
            onChange={handleNameChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="h-7 text-sm"
            autoFocus
          />
        ) : (
          <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">
            {member.firstName} {member.lastName}
          </p>
        )}
      </div>
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
            <div key={`placeholder-${i}`} className="w-4 h-4 rounded-sm bg-slate-200 dark:bg-slate-700 opacity-50" />
        ))}
      </div>
       {isUnassigned && onRemove && (
        <button onClick={() => onRemove(member.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive/70 hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </Card>
  );
}
