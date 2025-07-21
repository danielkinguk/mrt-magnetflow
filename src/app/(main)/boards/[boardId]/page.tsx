import { BOARDS_DATA, GENERIC_BOARDS_DATA, ALL_BOARDS } from '@/lib/mrt/board-data';
import { notFound } from 'next/navigation';
import { BoardClientPage } from '@/components/mrt/board-client-page';
import { GenericBoardSimple } from '@/components/mrt/generic-board-simple';

// The new Server Component wrapper
export default async function BoardPage({ params }: { params: Promise<{ boardId: string }> }) {
  const { boardId } = await params;
  
  // Find the board configuration
  const boardConfig = ALL_BOARDS.find(board => board.id === boardId);
  if (!boardConfig) {
    notFound();
  }

  // Handle different board types
  if (boardConfig.type === 'mrt') {
    const initialData = BOARDS_DATA[boardId];
    if (!initialData) {
      notFound();
    }
    return <BoardClientPage key={boardId} boardId={boardId} initialData={initialData} />;
  } else {
    // Use the simplified generic board component
    return <GenericBoardSimple key={boardId} boardId={boardId} boardType={boardConfig.type} />;
  }
}

export function generateStaticParams() {
  return ALL_BOARDS.map((board) => ({
    boardId: board.id,
  }));
}
