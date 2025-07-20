'use client';

import type { TeamMember, Skill, Point } from '@/lib/mrt/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TeamMemberCard } from '@/components/mrt/team-member-card';
import type { MouseEvent } from 'react';
import { cn } from '@/lib/utils';

interface UnassignedColumnProps {
  members: TeamMember[];
  allSkills: Skill[];
  position: Point;
  onMouseDown: (e: MouseEvent, id: string) => void;
  onRemoveMember: (id: string) => void;
  updateMember: (id: string, updates: Partial<TeamMember>) => void;
  onResizeMemberStart: (e: MouseEvent, memberId: string) => void;
  onMemberMouseDown: (e: MouseEvent<HTMLDivElement>, memberId: string) => void;
  isMemberDragging: boolean;
}

export function UnassignedColumn({ members, allSkills, position, onMouseDown, onRemoveMember, updateMember, onResizeMemberStart, onMemberMouseDown, isMemberDragging }: UnassignedColumnProps) {
  return (
    <div
      className="absolute"
      style={{ left: position.x, top: position.y }}
      onMouseDown={(e) => onMouseDown(e, 'unassigned')}
    >
      <Card data-column-id="unassigned" className="w-80 flex-shrink-0 bg-slate-100 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 cursor-move">
        <CardHeader className="p-2">
            <CardTitle className="text-center text-lg font-bold p-2 rounded-md bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                Unassigned
            </CardTitle>
        </CardHeader>
        <CardContent className="p-2 min-h-[200px]">
            {members.map(member => (
              <TeamMemberCard 
                key={member.id}
                member={member} 
                skills={allSkills} 
                isUnassigned={true}
                isDragging={isMemberDragging}
                onRemove={onRemoveMember} 
                onUpdate={updateMember}
                onResizeStart={onResizeMemberStart}
                onMouseDown={onMemberMouseDown}
              />
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
