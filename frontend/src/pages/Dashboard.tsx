import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, BriefcaseIcon, TrendingUp } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Candidates",
      value: "1,247",
      change: "+12%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Active Job Postings",
      value: "23",
      change: "+3",
      trend: "up",
      icon: BriefcaseIcon,
    },
    {
      title: "Screening Completed",
      value: "89%",
      change: "+5%",
      trend: "up",
      icon: BarChart3,
    },
    {
      title: "Placement Rate",
      value: "76%",
      change: "+8%",
      trend: "up",
      icon: TrendingUp,
    },
  ];

  const recentActivity = [
    { action: "New candidate applied", job: "Senior Developer", time: "2 hours ago" },
    { action: "Interview scheduled", candidate: "Sarah Johnson", time: "4 hours ago" },
    { action: "Job posting published", job: "UI/UX Designer", time: "1 day ago" },
    { action: "Candidate shortlisted", candidate: "Michael Chen", time: "2 days ago" },
  ];

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
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Welcome back! Here's an overview of your hiring pipeline.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <Card key={stat.title} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="text-success">
                        {stat.change}
                      </Badge>
                      <span>from last month</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest updates from your hiring pipeline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-border pb-4 last:border-0">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          {activity.action}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activity.job || activity.candidate}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;