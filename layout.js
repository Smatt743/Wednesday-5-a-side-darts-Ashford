import Shell from '@/components/Shell';
export const metadata = { title:'Wednesday 5 a Side Darts League', description:'League tables, fixtures, squads and player stats.' };
export default function RootLayout({children}){ return <html lang="en"><body style={{margin:0}}><Shell>{children}</Shell></body></html>; }
