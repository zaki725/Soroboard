export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 認証チェックはダッシュボード側（page.tsx）で行う
  return <>{children}</>;
}
