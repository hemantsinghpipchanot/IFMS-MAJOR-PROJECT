import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { mockProjects, mockProjectHeads } from "@/lib/mockData";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const BookBudget = () => {
  const navigate = useNavigate();
  const myProjects = mockProjects.filter((p) => p.piEmail === "pi@ifms.edu");
  const [selectedProject, setSelectedProject] = useState("");
  const [formData, setFormData] = useState({
    projectHead: "",
    amount: "",
    purpose: "",
    description: "",
    invoiceNumber: "",
  });

  const project = myProjects.find((p) => p.id === selectedProject);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!project) {
      toast.error("Please select a project");
      return;
    }

    const availableBalance = project.releasedAmount - project.bookedAmount;
    const requestAmount = Number(formData.amount);

    if (requestAmount > availableBalance) {
      toast.error(`Insufficient balance. Available: ₹${(availableBalance / 100000).toFixed(2)}L`);
      return;
    }

    toast.success("Budget booking request submitted for approval");
    navigate("/pi");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Book Budget</h1>
          <p className="text-muted-foreground mt-1">Submit a new budget booking request</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Budget Booking Form</CardTitle>
            <CardDescription>Fill in the details for your budget request</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="project">Select Project (GP Number)</Label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {myProjects
                      .filter((p) => p.status === "released")
                      .map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.gpNumber} - {project.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {project && (
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <div className="grid gap-4 md:grid-cols-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Released Amount</p>
                        <p className="text-lg font-semibold">₹{(project.releasedAmount / 100000).toFixed(2)}L</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Already Booked</p>
                        <p className="text-lg font-semibold">₹{(project.bookedAmount / 100000).toFixed(2)}L</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Available Balance</p>
                        <p className="text-lg font-semibold text-success">
                          ₹{((project.releasedAmount - project.bookedAmount) / 100000).toFixed(2)}L
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="projectHead">Project Head</Label>
                  <Select
                    value={formData.projectHead}
                    onValueChange={(value) => setFormData({ ...formData, projectHead: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select head" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProjectHeads
                        .filter((h) => h.type === project?.type)
                        .map((head) => (
                          <SelectItem key={head.id} value={head.id}>
                            {head.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="100000"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Input
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="Brief purpose of expenditure"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide detailed justification for the budget request"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice/Bill Number</Label>
                <Input
                  id="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  placeholder="INV-2024-001"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Submit for Approval</Button>
                <Button type="button" variant="outline" onClick={() => navigate("/pi")}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default BookBudget;
