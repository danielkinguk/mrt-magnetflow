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
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  updateMember: (id: string, updates: Partial<TeamMember>) => void;
  onResizeMemberStart: (e: MouseEvent, memberId: string) => void;
}

export function VehicleColumn({ vehicle, members, allSkills, position, onMouseDown, updateVehicle, updateMember, onResizeMemberStart }: VehicleColumnProps) {
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
    updateVehicle(vehicle.id, { name });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <div
      className="absolute"
      style={{ left: position.x, top: position.y }}
      onMouseDown={onMouseDown}
    >
      <Card className="w-80 flex-shrink-0 bg-slate-100 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 cursor-move">
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
             />
          ) : (
            <CardTitle
              className="text-center text-lg font-bold p-2 rounded-md"
              style={{ backgroundColor: vehicle.color, color: 'hsl(var(--primary-foreground))' }}
            >
              {vehicle.name}
            </CardTitle>
          )}
        </CardHeader>
        <CardContent className="p-2 min-h-[200px]">
          {members.map(member => (
            <div key={member.id} onMouseDown={(e) => e.stopPropagation()}>
                <TeamMemberCard 
                    member={member} 
                    skills={allSkills} 
                    onUpdate={updateMember} 
                    onResizeStart={onResizeMemberStart}
                />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
