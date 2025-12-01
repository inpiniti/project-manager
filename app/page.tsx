import { Sidebar } from "@/components/layout/Sidebar";
import { ListPanel } from "@/components/layout/ListPanel";
import { MainContent } from "@/components/layout/MainContent";

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <ListPanel />
      <MainContent />
    </div>
  );
}
