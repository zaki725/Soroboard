import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // サーバー側でセッションCookieをチェック
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('connect.sid');

  // セッションがある場合はダッシュボードにリダイレクト
  if (sessionCookie) {
    redirect('/');
  }

  return <>{children}</>;
}
