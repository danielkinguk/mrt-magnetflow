'use client';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import type { Vehicle, TeamMember, Skill, Point } from '@/lib/mrt/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TeamMemberCard } from '@/components/mrt/team-member-card';
import { Input } from '../ui/input';

interface VehicleColumnProps {
  vehicle: Vehicle;
  members: TeamMember[];
  allSkills: Skill[];
  position: Point;
  onMouseDown: (e: MouseEvent) => void;
  updateMember: (id: string, updates: Partial<TeamMember>) => void;
  onResizeMemberStart: (e: MouseEvent, memberId: string) => void;
  onMemberMouseDown: (e: MouseEvent<HTMLDivElement>, memberId: string) => void;
}

export function VehicleColumn({ vehicle, members, allSkills, position, onMouseDown, updateMember, onResizeMemberStart, onMemberMouseDown }: VehicleColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(vehicle.name);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // This should be handled by a central update function, but for now we leave it
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
      <Card data-column-id={vehicle.id} className="w-80 flex-shrink-0 bg-card/80 border cursor-move">
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
              style={{ backgroundColor: vehicle.color }}
            >
              {vehicle.name}
            </CardTitle>
          )}
        </CardHeader>
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
