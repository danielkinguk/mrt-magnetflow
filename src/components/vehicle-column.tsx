'use client';

import type { Vehicle, TeamMember, Skill } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TeamMemberCard } from '@/components/team-member-card';

interface VehicleColumnProps {
  vehicle: Vehicle;
  members: TeamMember[];
  allSkills: Skill[];
}

export function VehicleColumn({ vehicle, members, allSkills }: VehicleColumnProps) {
  return (
    <Card className="w-80 flex-shrink-0 bg-slate-100 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800">
      <CardHeader className="p-2">
        <CardTitle
          className="text-center text-lg font-bold p-2 rounded-md"
          style={{ backgroundColor: vehicle.color, color: 'hsl(var(--primary-foreground))' }}
        >
          {vehicle.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 min-h-[200px]">
        {members.map(member => (
          <TeamMemberCard key={member.id} member={member} skills={allSkills} />
        ))}
      </CardContent>
    </Card>
  );
}
