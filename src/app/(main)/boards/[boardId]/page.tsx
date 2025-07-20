import { MountainRescueBoard } from '@/components/mrt/mountain-rescue-board';
import { BOARDS_DATA } from '@/lib/mrt/board-data';
import { notFound } from 'next/navigation';

export default function BoardPage({ params }: { params: { boardId: string } }) {
  const boardData = BOARDS_DATA[params.boardId];

  if (!boardData) {
    notFound();
  }

  return (
    <main className="w-full h-full overflow-hidden flex-1">
      <MountainRescueBoard key={params.boardId} boardId={params.boardId} initialData={boardData} />
    </main>
  );
}

export function generateStaticParams() {
  return Object.keys(BOARDS_DATA).map((boardId) => ({
    boardId,
  }));
}
