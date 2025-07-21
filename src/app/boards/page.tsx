import { ALL_BOARDS } from '@/lib/mrt/board-data';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Lightbulb, 
  User, 
  Briefcase, 
  Mountain,
  ArrowRight,
  Plus
} from 'lucide-react';

export default function BoardsPage() {
  const getBoardIcon = (type: string) => {
    switch (type) {
      case 'mrt':
        return <Mountain className="h-8 w-8 text-blue-500" />;
      case 'inspiration':
        return <Lightbulb className="h-8 w-8 text-yellow-500" />;
      case 'personal':
        return <User className="h-8 w-8 text-green-500" />;
      case 'work':
        return <Briefcase className="h-8 w-8 text-purple-500" />;
      default:
        return <Users className="h-8 w-8 text-gray-500" />;
    }
  };

  const getBoardDescription = (type: string) => {
    switch (type) {
      case 'mrt':
        return 'Mountain Rescue Team resource management and coordination';
      case 'inspiration':
        return 'Collect and organise creative ideas and inspiration';
      case 'personal':
        return 'Organise personal tasks, notes, and ideas';
      case 'work':
        return 'Manage work projects, meetings, and tasks';
      default:
        return 'A flexible board for organising your thoughts';
    }
  };

  const getBoardColor = (type: string) => {
    switch (type) {
      case 'mrt':
        return 'bg-gradient-to-br from-blue-500 to-blue-600';
      case 'inspiration':
        return 'bg-gradient-to-br from-yellow-400 to-orange-500';
      case 'personal':
        return 'bg-gradient-to-br from-green-400 to-green-600';
      case 'work':
        return 'bg-gradient-to-br from-purple-500 to-purple-600';
      default:
        return 'bg-gradient-to-br from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter mb-4">
            Choose Your Board
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select a board to start organising your ideas, managing resources, or planning your projects.
          </p>
        </div>

        {/* Boards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {ALL_BOARDS.map((board) => (
            <Link key={board.id} href={`/boards/${board.id}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-primary/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${getBoardColor(board.type)}`}>
                      {getBoardIcon(board.type)}
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                    {board.name}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {getBoardDescription(board.type)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
          
          {/* New Board Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 bg-muted/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-center">
                <div className="p-3 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600">
                  <Plus className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <CardTitle className="text-xl mb-2 text-muted-foreground group-hover:text-primary transition-colors">
                New Board
              </CardTitle>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Create a custom board for your specific needs
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link 
            href="/welcome" 
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-6 md:px-8 md:py-0 border-t mt-auto">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by you. Powered by DK Apps - Copyright 2025
          </p>
        </div>
      </footer>
    </div>
  );
} 