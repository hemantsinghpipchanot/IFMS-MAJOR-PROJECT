import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockProjects } from "@/lib/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Search, FileText } from "lucide-react";

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = mockProjects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.gpNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.piName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const registeredProjects = filteredProjects.filter((p) => p.status === "pending");
  const sanctionedProjects = filteredProjects.filter((p) => p.status === "sanctioned");
  const releasedProjects = filteredProjects.filter((p) => p.status === "released");

  const ProjectTable = ({ projects }: { projects: typeof mockProjects }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>GP Number</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>PI Name</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Sanctioned</TableHead>
          <TableHead className="text-right">Released</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell className="font-medium">{project.gpNumber}</TableCell>
            <TableCell className="max-w-xs truncate">{project.title}</TableCell>
            <TableCell>{project.piName}</TableCell>
            <TableCell>{project.department}</TableCell>
            <TableCell className="capitalize">{project.type}</TableCell>
            <TableCell className="text-right">₹{(project.sanctionedAmount / 100000).toFixed(2)}L</TableCell>
            <TableCell className="text-right">₹{(project.releasedAmount / 100000).toFixed(2)}L</TableCell>
            <TableCell>
              <StatusBadge status={project.status} />
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="sm">
                <FileText className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Projects</h1>
          <p className="text-muted-foreground mt-1">View and manage all research projects</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Projects</CardTitle>
                <CardDescription>Browse projects by status</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({filteredProjects.length})</TabsTrigger>
                <TabsTrigger value="registered">Registered ({registeredProjects.length})</TabsTrigger>
                <TabsTrigger value="sanctioned">Sanctioned ({sanctionedProjects.length})</TabsTrigger>
                <TabsTrigger value="released">Released ({releasedProjects.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                <ProjectTable projects={filteredProjects} />
              </TabsContent>
              <TabsContent value="registered" className="mt-4">
                <ProjectTable projects={registeredProjects} />
              </TabsContent>
              <TabsContent value="sanctioned" className="mt-4">
                <ProjectTable projects={sanctionedProjects} />
              </TabsContent>
              <TabsContent value="released" className="mt-4">
                <ProjectTable projects={releasedProjects} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Projects;
