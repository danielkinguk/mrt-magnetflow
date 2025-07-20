import type { MouseEvent } from 'react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { MagnetData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { GripVertical, Trash2 } from 'lucide-react';

interface MagnetProps {
  data: MagnetData;
  onMouseDown: (e: MouseEvent) => void;
  onStartConnection: (e: MouseEvent) => void;
  onUpdateText: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

export function Magnet({ data, onMouseDown, onStartConnection, onUpdateText, onDelete }: MagnetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.text);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onUpdateText(data.id, text);
  };

  return (
    <div
      data-magnet-id={data.id}
      className="absolute group transition-all duration-100 ease-in-out"
      style={{
        left: data.position.x,
        top: data.position.y,
        width: data.width || 200,
        height: data.height || 120,
      }}
      onMouseDown={onMouseDown}
    >
      <Card
        className="w-full h-full flex flex-col cursor-move shadow-md hover:shadow-xl transition-shadow"
        style={{ backgroundColor: data.color }}
        onDoubleClick={handleDoubleClick}
      >
        <CardContent className="p-3 flex-grow relative">
          {isEditing ? (
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={handleBlur}
              autoFocus
              className="w-full h-full resize-none bg-transparent border-0 focus-visible:ring-0 p-0"
            />
          ) : (
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{data.text}</p>
          )}
        </CardContent>
      </Card>
      <div
        className="absolute -right-1 top-1/2 -translate-y-1/2 w-4 h-6 bg-secondary/80 rounded-r-md flex items-center justify-center cursor-pointer hover:bg-primary group-hover:opacity-100 opacity-50 transition-opacity"
        onMouseDown={(e) => { e.stopPropagation(); onStartConnection(e); }}
        title="Drag to connect"
      >
        <GripVertical className="w-3 h-3 text-secondary-foreground" />
      </div>
      <button
        className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center cursor-pointer hover:bg-destructive/90 group-hover:opacity-100 opacity-0 transition-opacity"
        onClick={(e) => { e.stopPropagation(); onDelete(data.id); }}
        title="Delete magnet"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
