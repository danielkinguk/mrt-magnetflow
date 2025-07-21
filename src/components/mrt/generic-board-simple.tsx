'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Lightbulb, FileText, CheckSquare, Users } from 'lucide-react';

interface GenericBoardSimpleProps {
  boardId: string;
  boardType: string;
}

export function GenericBoardSimple({ boardId, boardType }: GenericBoardSimpleProps) {
  const getBoardTitle = () => {
    switch (boardType) {
      case 'inspiration': return 'Inspiration Board';
      case 'personal': return 'Personal Board';
      case 'work': return 'Work Board';
      default: return 'Generic Board';
    }
  };

  const getBoardDescription = () => {
    switch (boardType) {
      case 'inspiration': return 'Collect and organise creative ideas and inspiration';
      case 'personal': return 'Organise personal tasks, notes, and ideas';
      case 'work': return 'Manage work projects, meetings, and tasks';
      default: return 'A flexible board for organising your thoughts';
    }
  };

  return (
    <main className="w-full flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">{getBoardTitle()}</h1>
          <p className="text-lg text-muted-foreground">{getBoardDescription()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Sample Content Cards */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Sample Idea
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This is a sample idea card. You can create your own ideas, notes, and tasks using the toolbar below.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Sample Note
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This is a sample note card. Use it to capture important information and thoughts.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-green-500" />
                Sample Task
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This is a sample task card. Track your to-dos and action items here.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-pink-500" />
                Sample Resource
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This is a sample resource card. Use it to track equipment, tools, or other resources.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="mt-8 p-4 bg-card/80 backdrop-blur-sm rounded-lg border shadow-lg">
          <div className="flex items-center justify-center gap-4">
            <span className="font-semibold text-lg">Create New:</span>
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Note
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Idea
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Task
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Resource
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            This is a simplified view of the {getBoardTitle()}. The full drag-and-drop functionality is being implemented.
          </p>
        </div>
      </div>
    </main>
  );
} 