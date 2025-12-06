import { AuthProvider } from '@/context/auth-context';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <div>{children}</div>
    </AuthProvider>
  );
}
