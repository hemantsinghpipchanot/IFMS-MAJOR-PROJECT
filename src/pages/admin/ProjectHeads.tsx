import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { mockProjectHeads } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const ProjectHeads = () => {
  const [heads, setHeads] = useState(mockProjectHeads);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newHead = {
      id: (heads.length + 1).toString(),
      name: formData.name,
      type: formData.type as "recurring" | "non-recurring",
    };
    setHeads([...heads, newHead]);
    toast.success("Project head added successfully");
    setFormData({ name: "", type: "" });
    setShowForm(false);
  };

  const recurringHeads = heads.filter((h) => h.type === "recurring");
  const nonRecurringHeads = heads.filter((h) => h.type === "non-recurring");

  const HeadTable = ({ heads }: { heads: typeof mockProjectHeads }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Head Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {heads.map((head) => (
          <TableRow key={head.id}>
            <TableCell className="font-medium">{head.name}</TableCell>
            <TableCell>
              <Badge variant={head.type === "recurring" ? "default" : "secondary"}>
                {head.type}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive">
                <Trash2 className="h-4 w-4" />
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Project Heads</h1>
            <p className="text-muted-foreground mt-1">
              Manage recurring and non-recurring project heads
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Project Head
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Project Head</CardTitle>
              <CardDescription>Create a new budget head for projects</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Head Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Equipment, Travel"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recurring">Recurring</SelectItem>
                        <SelectItem value="non-recurring">Non-Recurring</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Add Project Head</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>All Project Heads</CardTitle>
            <CardDescription>Browse heads by type</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All ({heads.length})</TabsTrigger>
                <TabsTrigger value="recurring">Recurring ({recurringHeads.length})</TabsTrigger>
                <TabsTrigger value="non-recurring">
                  Non-Recurring ({nonRecurringHeads.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                <HeadTable heads={heads} />
              </TabsContent>
              <TabsContent value="recurring" className="mt-4">
                <HeadTable heads={recurringHeads} />
              </TabsContent>
              <TabsContent value="non-recurring" className="mt-4">
                <HeadTable heads={nonRecurringHeads} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ProjectHeads;
