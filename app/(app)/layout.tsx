import Nav from "@/components/layout/Nav";
import MobileDrawer from "@/components/layout/MobileDrawer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Nav />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <MobileDrawer />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-5xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
