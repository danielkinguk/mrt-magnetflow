import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Logo } from '@/components/icons';
import { Plus, WandSparkles } from 'lucide-react';

interface ToolbarProps {
  onAddMagnet: () => void;
  onSuggestConnections: () => void;
}

export function Toolbar({ onAddMagnet, onSuggestConnections }: ToolbarProps) {
  return (
    <header className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-card/80 backdrop-blur-sm p-2 rounded-lg border shadow-lg flex items-center gap-2">
      <div className="flex items-center gap-2 px-2 mr-2">
        <Logo className="h-6 w-6 text-primary" />
        <span className="font-bold text-lg font-headline text-foreground">MagnetFlow</span>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="icon" onClick={onAddMagnet}>
              <Plus className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add Magnet</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="icon" onClick={onSuggestConnections}>
              <WandSparkles className="h-5 w-5 text-accent" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Suggest Connections (AI)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </header>
  );
}
