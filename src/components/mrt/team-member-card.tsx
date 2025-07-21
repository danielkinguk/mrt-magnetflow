'use client';

import { useState, type MouseEvent } from 'react';
import { Card } from '@/components/ui/card';
import type { TeamMember, Skill } from '@/lib/mrt/types';
import { cn } from '@/lib/utils';
import { GripVertical, Trash2, ArrowDownRight, User, Wrench, Crown, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TeamMemberCardProps {
  member: TeamMember;
  skills: Skill[];
  isUnassigned?: boolean;
  isFloating?: boolean;
  onRemove?: () => void;
  onUpdate: (updates: Partial<TeamMember>) => void;
  onResizeStart: (e: MouseEvent, id: string) => void;
  onMouseDown: (e: MouseEvent<HTMLDivElement>, id: string) => void;
}

export function TeamMemberCard({ member, skills, isUnassigned = false, isFloating = false, onRemove, onUpdate, onResizeStart, onMouseDown }: TeamMemberCardProps) {
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
    onUpdate({ firstName, lastName: lastNameParts.join(' ') });
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
        'group relative cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-[1.02] hover:shadow-lg',
        'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900',
        'border border-gray-200/60 dark:border-gray-700/60 backdrop-blur-sm',
        'shadow-sm hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20',
        {
          'from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border-red-300/60 dark:border-red-600/60': member.role === 'leader',
          'from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-300/60 dark:border-blue-600/60': member.type === 'equipment',
          'opacity-75 z-50 shadow-2xl': isFloating,
        }
      )}
    >
      {/* Modern Card Content */}
      <div className="p-3">
        {/* Header with Role Badge */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={cn(
              'p-1.5 rounded-lg',
              isPerson 
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
                : 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
            )}>
              {isPerson ? <User className="h-3.5 w-3.5" /> : <Wrench className="h-3.5 w-3.5" />}
            </div>
            {isPerson && (
              <div className="flex gap-1">
                {memberSkills.map(skill => (
                  <div
                    key={skill.id}
                    title={skill.name}
                    className="w-2.5 h-2.5 rounded-full shadow-sm border border-white/50"
                    style={{ backgroundColor: skill.color }}
                  />
                ))}
                {Array.from({ length: 4 - memberSkills.length }).map((_, i) => (
                  <div key={`placeholder-${i}`} className="w-2.5 h-2.5 rounded-full bg-gray-200 dark:bg-gray-600 opacity-50" />
                ))}
              </div>
            )}
            {member.role === 'leader' && (
              <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold rounded-full">
                <Crown className="h-3 w-3" />
                <span>Leader</span>
              </div>
            )}
          </div>
          <GripVertical className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300 transition-colors" />
        </div>

        {/* Name Section */}
        <div className="mb-3" onDoubleClick={handleDoubleClick}>
          {isEditing ? (
            <Input
              type="text"
              value={name}
              onChange={handleNameChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="h-8 text-sm font-semibold bg-white/80 dark:bg-gray-800/80 border-gray-300 dark:border-gray-600"
              autoFocus
              onMouseDown={(e) => e.stopPropagation()}
            />
          ) : (
            <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 leading-tight">
              {member.firstName} {member.lastName}
            </p>
          )}
        </div>



        {/* Remove Button */}
        {(isUnassigned || isFloating) && onRemove && (
          <button 
            onClick={onRemove} 
            onMouseDown={(e) => e.stopPropagation()} 
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Resize Handle */}
        <div
          onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e, member.id); }}
          className="absolute bottom-1 right-1 cursor-se-resize text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 opacity-50 group-hover:opacity-100 transition-all duration-200"
        >
          <ArrowDownRight className="w-3 h-3" />
        </div>
      </div>
    </Card>
  );
}
