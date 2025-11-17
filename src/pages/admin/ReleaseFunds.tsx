import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockProjects } from "@/lib/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

const ReleaseFunds = () => {
  const [selectedProject, setSelectedProject] = useState<typeof mockProjects[0] | null>(null);
  const [releaseAmount, setReleaseAmount] = useState("");
  const [letterDate, setLetterDate] = useState("");
  const [letterNumber, setLetterNumber] = useState("");

  const sanctionedProjects = mockProjects.filter((p) => p.status === "sanctioned");

  const handleRelease = (project: typeof mockProjects[0]) => {
    setSelectedProject(project);
    setReleaseAmount("");
    setLetterDate("");
    setLetterNumber("");
  };

  const confirmRelease = () => {
    const amount = Number(releaseAmount);
    if (amount > (selectedProject?.sanctionedAmount || 0)) {
      toast.error("Release amount cannot exceed sanctioned amount");
      return;
    }
    toast.success(`Funds released successfully for project ${selectedProject?.gpNumber}`);
    setSelectedProject(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Release Funds</h1>
          <p className="text-muted-foreground mt-1">
            Release funds to sanctioned projects with letter details
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sanctioned Projects</CardTitle>
            <CardDescription>Projects awaiting fund release</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>GP Number</TableHead>
                  <TableHead>Project Title</TableHead>
                  <TableHead>PI Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Sanctioned Amount</TableHead>
                  <TableHead className="text-right">Already Released</TableHead>
                  <TableHead className="text-right">Available to Release</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sanctionedProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.gpNumber}</TableCell>
                    <TableCell className="max-w-xs truncate">{project.title}</TableCell>
                    <TableCell>{project.piName}</TableCell>
                    <TableCell>{project.department}</TableCell>
                    <TableCell className="text-right">
                      ₹{(project.sanctionedAmount / 100000).toFixed(2)}L
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{(project.releasedAmount / 100000).toFixed(2)}L
                    </TableCell>
                    <TableCell className="text-right text-success font-semibold">
                      ₹{((project.sanctionedAmount - project.releasedAmount) / 100000).toFixed(2)}L
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={project.status} />
                    </TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => handleRelease(project)}>
                        <DollarSign className="h-4 w-4 mr-1" />
                        Release
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Release Funds</DialogTitle>
            <DialogDescription>
              Enter release amount and letter details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GP Number:</span>
                    <span className="font-medium">{selectedProject?.gpNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Project Title:</span>
                    <span className="font-medium">{selectedProject?.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">PI Name:</span>
                    <span className="font-medium">{selectedProject?.piName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sanctioned Amount:</span>
                    <span className="font-semibold">
                      ₹{((selectedProject?.sanctionedAmount || 0) / 100000).toFixed(2)}L
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Already Released:</span>
                    <span className="font-medium">
                      ₹{((selectedProject?.releasedAmount || 0) / 100000).toFixed(2)}L
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Available to Release:</span>
                    <span className="font-semibold text-success text-lg">
                      ₹
                      {(
                        ((selectedProject?.sanctionedAmount || 0) -
                          (selectedProject?.releasedAmount || 0)) /
                        100000
                      ).toFixed(2)}
                      L
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="amount">Release Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={releaseAmount}
                  onChange={(e) => setReleaseAmount(e.target.value)}
                  placeholder="Enter amount to release"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="letterDate">Letter Date</Label>
                <Input
                  id="letterDate"
                  type="date"
                  value={letterDate}
                  onChange={(e) => setLetterDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="letterNumber">Letter/Reference Number</Label>
              <Input
                id="letterNumber"
                value={letterNumber}
                onChange={(e) => setLetterNumber(e.target.value)}
                placeholder="REF/2024/001"
                required
              />
            </div>

            <div className="bg-info/10 border border-info/20 rounded-lg p-4">
              <p className="text-sm text-info font-medium">Note:</p>
              <p className="text-sm text-muted-foreground mt-1">
                The released amount will be added to the project's available balance. PI will be
                able to book budgets against this released amount.
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={confirmRelease} className="flex-1">
                Confirm Release
              </Button>
              <Button variant="outline" onClick={() => setSelectedProject(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ReleaseFunds;
