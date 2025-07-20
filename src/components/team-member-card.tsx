'use client';

import { Card } from '@/components/ui/card';
import type { TeamMember, Skill } from '@/lib/types';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';

interface TeamMemberCardProps {
  member: TeamMember;
  skills: Skill[];
}

export function TeamMemberCard({ member, skills }: TeamMemberCardProps) {
  const memberSkills = skills.filter(s => member.skills.includes(s.id));

  return (
    <Card
      className={cn(
        'p-2 flex items-center gap-2 mb-2 bg-white/90 dark:bg-slate-800/90 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing',
        {
          'bg-red-200 dark:bg-red-900/50': member.role === 'leader',
          'border-l-4 border-yellow-500': member.role === 'driver',
        }
      )}
    >
      <GripVertical className="h-5 w-5 text-slate-400 dark:text-slate-600" />
      <div className="flex-grow">
        <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">
          {member.firstName} {member.lastName}
        </p>
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
            <div key={i} className="w-4 h-4 rounded-sm bg-slate-200 dark:bg-slate-700 opacity-50" />
        ))}
      </div>
    </Card>
  );
}
