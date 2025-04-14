import { redirect } from 'next/navigation';

export default function Page() {
    // Redirect to our custom auth page
    redirect('/auth');
}