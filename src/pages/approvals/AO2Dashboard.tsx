import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockBudgetRequests } from "@/lib/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, DollarSign, TrendingUp, Clock } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

const AO2Dashboard = () => {
  const [selectedRequest, setSelectedRequest] = useState<typeof mockBudgetRequests[0] | null>(null);
  const [spentAmount, setSpentAmount] = useState("");
  const [incurredAmount, setIncurredAmount] = useState("");
  const [bookedAmount, setBookedAmount] = useState("");

  // Mock: Filter requests approved by DR
  const pendingRequests = mockBudgetRequests.filter(
    (r) => r.currentStage === "ao2" && r.status === "pending"
  );

  const handleProcess = (request: typeof mockBudgetRequests[0]) => {
    setSelectedRequest(request);
    setBookedAmount(request.amount.toString());
  };

  const confirmProcessing = () => {
    toast.success(
      `Request ${selectedRequest?.id} processed successfully. Amounts updated and project balance adjusted.`
    );
    setSelectedRequest(null);
    setSpentAmount("");
    setIncurredAmount("");
    setBookedAmount("");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AO2 Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Accounts Officer - Final processing and fund management
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Processing</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRequests.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Approved by DR</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{(pendingRequests.reduce((sum, r) => sum + r.amount, 0) / 100000).toFixed(2)}L
              </div>
              <p className="text-xs text-muted-foreground mt-1">To be processed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Processed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground mt-1">Completed requests</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Amount Processed</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹12.5L</div>
              <p className="text-xs text-muted-foreground mt-1">Today</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Requests for Final Processing</CardTitle>
            <CardDescription>
              Enter spent, incurred, and booked amounts to complete processing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>GP Number</TableHead>
                  <TableHead>PI Name</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead className="text-right">Requested Amount</TableHead>
                  <TableHead>Approvals</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{request.gpNumber}</TableCell>
                    <TableCell>{request.piName}</TableCell>
                    <TableCell className="max-w-xs truncate">{request.purpose}</TableCell>
                    <TableCell className="text-right">
                      ₹{(request.amount / 100000).toFixed(2)}L
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="text-success">✓ AR</span>
                        <span className="text-success">✓ DR</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => handleProcess(request)}>
                        Process
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Process Budget Request</DialogTitle>
            <DialogDescription>
              Enter the financial details to complete the processing
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GP Number:</span>
                    <span className="font-medium">{selectedRequest?.gpNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">PI Name:</span>
                    <span className="font-medium">{selectedRequest?.piName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Purpose:</span>
                    <span className="font-medium">{selectedRequest?.purpose}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Requested Amount:</span>
                    <span className="font-semibold text-lg">
                      ₹{((selectedRequest?.amount || 0) / 100000).toFixed(2)}L
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="spent">Spent Amount (₹)</Label>
                <Input
                  id="spent"
                  type="number"
                  value={spentAmount}
                  onChange={(e) => setSpentAmount(e.target.value)}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">Actual amount spent</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="incurred">Incurred Amount (₹)</Label>
                <Input
                  id="incurred"
                  type="number"
                  value={incurredAmount}
                  onChange={(e) => setIncurredAmount(e.target.value)}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">Amount incurred/committed</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="booked">Booked Amount (₹)</Label>
                <Input
                  id="booked"
                  type="number"
                  value={bookedAmount}
                  onChange={(e) => setBookedAmount(e.target.value)}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">Amount to book from budget</p>
              </div>
            </div>

            <div className="bg-info/10 border border-info/20 rounded-lg p-4">
              <p className="text-sm text-info font-medium">Note:</p>
              <p className="text-sm text-muted-foreground mt-1">
                After processing, the booked amount will be deducted from the project's available
                balance. The project head amount will be automatically updated.
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={confirmProcessing} className="flex-1">
                Confirm Processing
              </Button>
              <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AO2Dashboard;
