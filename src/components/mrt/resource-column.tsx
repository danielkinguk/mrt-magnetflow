'use client';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import type { Vehicle, TeamMember, Skill, Point, Team } from '@/lib/mrt/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TeamMemberCard } from '@/components/mrt/team-member-card';
import { Input } from '../ui/input';
import { Trash2, ArrowDownRight } from 'lucide-react';

interface ResourceColumnProps {
  container: Vehicle | Team;
  type: 'vehicle' | 'team';
  members: TeamMember[];
  allSkills: Skill[];
  position: Point;
  width?: number;
  height?: number;
  onMouseDown: (e: MouseEvent) => void;
  onUpdateMember: (id: string, updates: Partial<TeamMember>) => void;
  onUpdateContainer: (id: string, type: 'vehicle' | 'team', updates: Partial<Vehicle | Team>) => void;
  onRemoveContainer: (id: string, type: 'vehicle' | 'team') => void;
  onResizeMemberStart: (e: MouseEvent, memberId: string) => void;
  onMemberMouseDown: (e: MouseEvent<HTMLDivElement>, memberId: string) => void;
  onResizeStart: (e: MouseEvent, id: string, type: 'member' | 'column') => void;
}

export function ResourceColumn({ 
  container, 
  type, 
  members, 
  allSkills, 
  position, 
  width,
  height,
  onMouseDown, 
  onUpdateMember, 
  onUpdateContainer, 
  onRemoveContainer, 
  onResizeMemberStart, 
  onMemberMouseDown,
  onResizeStart
}: ResourceColumnProps) {
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
      onUpdateContainer(container.id, type, { name });
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
      <Card 
        data-column-id={container.id} 
        data-column-type={type} 
        className={width !== undefined ? "flex-shrink-0 cursor-move group relative transition-all duration-200 hover:shadow-xl select-none" : "w-80 flex-shrink-0 cursor-move group relative transition-all duration-200 hover:shadow-xl select-none"}
        style={width !== undefined ? {
          width: width,
          height: height || 'auto'
        } : undefined}
      >
        <div className="bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 rounded-t-lg">
          <CardHeader className="p-3" onDoubleClick={handleDoubleClick}>
            {isEditing ? (
               <Input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  className="h-10 text-lg font-bold text-center bg-white/80 dark:bg-gray-800/80 border-gray-300 dark:border-gray-600"
                  autoFocus
                  onMouseDown={(e) => e.stopPropagation()}
               />
            ) : (
              <CardTitle
                className="text-center text-lg font-bold py-3 px-4 rounded-lg text-white shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${container.color}, ${container.color}dd)`,
                  boxShadow: `0 4px 12px ${container.color}40`
                }}
              >
                {container.name}
              </CardTitle>
            )}
          </CardHeader>
        </div>
        <button
          className="absolute top-3 right-3 w-7 h-7 bg-red-500/10 hover:bg-red-500/20 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
          onClick={(e) => { e.stopPropagation(); onRemoveContainer(container.id, type); }}
          onMouseDown={(e) => e.stopPropagation()}
          title={`Delete ${type}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <div
          onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e, container.id, 'column'); }}
          className="absolute bottom-0 right-0 cursor-se-resize text-muted-foreground hover:text-foreground/80 opacity-50 group-hover:opacity-100 select-none"
        >
          <ArrowDownRight className="w-3 h-3" />
        </div>
        <CardContent className="p-3 min-h-[200px] bg-gradient-to-b from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-b-lg">
          {sortedMembers.map(member => (
            <div key={member.id} className="mb-1">
              <TeamMemberCard 
                member={member} 
                skills={allSkills} 
                isUnassigned={false}
                isFloating={false}
                onUpdate={(updates) => onUpdateMember(member.id, updates)} 
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
