import { BOARDS_DATA } from '@/lib/mrt/board-data';
import { notFound } from 'next/navigation';
import { BoardClientPage } from '@/components/mrt/board-client-page';
import { MainLayoutClient } from '@/components/main-layout-client';

// The new Server Component wrapper
export default function BoardPage({ params }: { params: { boardId: string } }) {
  const { boardId } = params;
  const initialData = BOARDS_DATA[boardId];

  if (!initialData) {
    notFound();
  }

  // BoardClientPage is a client component, but it's rendered here in a server component.
  // We can't pass functions like setTidyUp directly from a server component.
  // Instead, the MainLayoutClient will manage passing the function down.
  return <BoardClientPage key={boardId} boardId={boardId} initialData={initialData} />;
}

export function generateStaticParams() {
  return Object.keys(BOARDS_DATA).map((boardId) => ({
    boardId,
  }));
}
