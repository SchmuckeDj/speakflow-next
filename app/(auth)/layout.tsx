export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "radial-gradient(ellipse at 60% 0%, rgba(124,106,255,0.15) 0%, transparent 60%), var(--color-bg)" }}>
      {children}
    </div>
  );
}
