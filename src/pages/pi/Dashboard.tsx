import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { mockProjects, mockBudgetRequests } from "@/lib/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import {
  FolderKanban,
  Plus,
  FileText,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  Download,
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PIDashboard = () => {
  const navigate = useNavigate();
  const myProjects = mockProjects.filter((p) => p.piEmail === "pi@ifms.edu");
  const myRequests = mockBudgetRequests.filter((r) => r.piName === "Dr. John Smith");

  const stats = [
    {
      title: "My Projects",
      value: myProjects.length.toString(),
      icon: FolderKanban,
      description: "Active projects",
      color: "text-primary",
    },
    {
      title: "Total Sanctioned",
      value: `₹${(myProjects.reduce((sum, p) => sum + p.sanctionedAmount, 0) / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      description: "Across all projects",
      color: "text-success",
    },
    {
      title: "Available Balance",
      value: `₹${(myProjects.reduce((sum, p) => sum + (p.releasedAmount - p.bookedAmount), 0) / 100000).toFixed(1)}L`,
      icon: TrendingUp,
      description: "Ready to book",
      color: "text-accent",
    },
    {
      title: "Pending Requests",
      value: myRequests.filter((r) => r.status === "pending").length.toString(),
      icon: Clock,
      description: "Awaiting approval",
      color: "text-warning",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">PI Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your projects and budget requests</p>
          </div>
          <Button onClick={() => navigate("/pi/book-budget")} className="gap-2">
            <Plus className="h-4 w-4" />
            Book Budget
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My Projects</CardTitle>
            <CardDescription>Overview of all your research projects</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>GP Number</TableHead>
                  <TableHead>Project Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Sanctioned</TableHead>
                  <TableHead className="text-right">Released</TableHead>
                  <TableHead className="text-right">Available</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.gpNumber}</TableCell>
                    <TableCell>{project.title}</TableCell>
                    <TableCell className="capitalize">{project.type}</TableCell>
                    <TableCell>
                      <StatusBadge status={project.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{(project.sanctionedAmount / 100000).toFixed(2)}L
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{(project.releasedAmount / 100000).toFixed(2)}L
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{((project.releasedAmount - project.bookedAmount) / 100000).toFixed(2)}L
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/pi/project/${project.id}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Budget Requests</CardTitle>
            <CardDescription>Track your budget booking requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>GP Number</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Current Stage</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{request.gpNumber}</TableCell>
                    <TableCell className="max-w-xs truncate">{request.purpose}</TableCell>
                    <TableCell className="text-right">
                      ₹{(request.amount / 100000).toFixed(2)}L
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={request.status} />
                    </TableCell>
                    <TableCell className="uppercase text-xs font-semibold">
                      {request.currentStage}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PIDashboard;
