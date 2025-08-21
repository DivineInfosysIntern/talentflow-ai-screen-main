import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AIScreeningTool } from "@/components/AIScreeningTool";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="ml-64">
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <main className="p-8">
          <AIScreeningTool />
        </main>
      </div>
    </div>
  );
};

export default Index;
