import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to the welcome page by default.
  // The welcome page will then link to the main board.
  redirect('/welcome');
}
