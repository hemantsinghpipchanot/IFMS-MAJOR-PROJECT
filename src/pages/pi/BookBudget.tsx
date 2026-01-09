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
import { DollarSign, FileText, Receipt, Send, Sparkles, TrendingUp, Wallet } from "lucide-react";
import { WorkflowManager } from "@/lib/workflowManager";

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

    // Use WorkflowManager to create budget request
    try {
      WorkflowManager.createBudgetRequest({
        projectId: project.id,
        gpNumber: project.gpNumber,
        projectTitle: project.title,
        projectType: project.type,
        piName: "Dr. John Smith",
        piEmail: "pi@ifms.edu",
        amount: requestAmount,
        purpose: formData.purpose,
        description: formData.description,
        invoiceNumber: formData.invoiceNumber,
      });

      toast.success("Budget request submitted and sent to Admin for verification");
      navigate("/pi");
    } catch (error) {
      toast.error("Failed to create budget request");
    }
  };

  return (
    <Layout>
      <div className="space-y-8 relative">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-accent/20 blur-3xl animate-float"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-accent-secondary/20 blur-3xl animate-float" style={{ animationDelay: "-3s" }}></div>
        </div>

        {/* Page Header */}
        <div className="animate-slide-up relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-2xl bg-gradient-accent shadow-glow-accent">
              <Wallet className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold">
                <span className="gradient-text-vibrant">Book Budget</span>
              </h1>
              <p className="text-muted-foreground text-lg flex items-center gap-2 mt-1">
                <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                Submit a new budget booking request
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="border-2 shadow-elevated bg-card/50 backdrop-blur-sm animate-scale-in relative z-10 overflow-hidden">
          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-3xl"></div>

          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-accent/10">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Budget Booking Form</CardTitle>
                <CardDescription className="text-base">Fill in the details for your budget request</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Selection */}
              <div className="space-y-2 group">
                <Label htmlFor="project" className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Select Project (GP Number)
                </Label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger className="border-2 h-12 hover:border-primary transition-colors duration-200">
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

              {/* Project Balance Display */}
              {project && (
                <Card className="bg-gradient-to-br from-success/5 via-accent/5 to-primary/5 border-2 border-accent/30 shadow-glow-accent animate-scale-in">
                  <CardContent className="pt-6">
                    <div className="grid gap-6 md:grid-cols-3 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          <p className="font-medium">Released Amount</p>
                        </div>
                        <p className="text-2xl font-bold text-primary">₹{(project.releasedAmount / 100000).toFixed(2)}L</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Receipt className="h-4 w-4" />
                          <p className="font-medium">Already Booked</p>
                        </div>
                        <p className="text-2xl font-bold text-warning">₹{(project.bookedAmount / 100000).toFixed(2)}L</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <TrendingUp className="h-4 w-4" />
                          <p className="font-medium">Available Balance</p>
                        </div>
                        <p className="text-2xl font-bold text-success animate-pulse">
                          ₹{((project.releasedAmount - project.bookedAmount) / 100000).toFixed(2)}L
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Form Fields Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2 group">
                  <Label htmlFor="projectHead" className="text-sm font-semibold">Project Head</Label>
                  <Select
                    value={formData.projectHead}
                    onValueChange={(value) => setFormData({ ...formData, projectHead: value })}
                  >
                    <SelectTrigger className="border-2 h-12 hover:border-accent transition-colors duration-200">
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
                <div className="space-y-2 group">
                  <Label htmlFor="amount" className="text-sm font-semibold flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-success" />
                    Amount (₹)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="100000"
                    className="border-2 h-12 hover:border-success focus:border-success transition-colors duration-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="purpose" className="text-sm font-semibold">Purpose</Label>
                <Input
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="Brief purpose of expenditure"
                  className="border-2 h-12 hover:border-primary focus:border-primary transition-colors duration-200"
                  required
                />
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="description" className="text-sm font-semibold">Detailed Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide detailed justification for the budget request"
                  rows={4}
                  className="border-2 hover:border-accent focus:border-accent transition-colors duration-200 resize-none"
                  required
                />
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="invoiceNumber" className="text-sm font-semibold flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-info" />
                  Invoice/Bill Number
                </Label>
                <Input
                  id="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  placeholder="INV-2024-001"
                  className="border-2 h-12 hover:border-info focus:border-info transition-colors duration-200"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-accent to-accent-secondary hover:shadow-neon transition-all duration-300 hover:scale-105 gap-2 h-12 px-8 font-bold relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Send className="h-5 w-5 relative z-10" />
                  <span className="relative z-10">Submit for Approval</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/pi")}
                  className="h-12 px-6 border-2 hover:border-destructive hover:text-destructive transition-all duration-200"
                >
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
