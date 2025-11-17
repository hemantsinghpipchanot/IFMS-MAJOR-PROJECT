import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockBudgetRequests } from "@/lib/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const ARDashboard = () => {
  const [selectedRequest, setSelectedRequest] = useState<typeof mockBudgetRequests[0] | null>(null);
  const [remarks, setRemarks] = useState("");
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);

  const pendingRequests = mockBudgetRequests.filter(
    (r) => r.currentStage === "ar" && r.status === "pending"
  );
  const recurringRequests = pendingRequests.filter((r) => {
    const project = mockBudgetRequests.find((p) => p.id === r.id);
    return project?.gpNumber.includes("001"); // Mock recurring check
  });
  const nonRecurringRequests = pendingRequests.filter((r) => {
    const project = mockBudgetRequests.find((p) => p.id === r.id);
    return !project?.gpNumber.includes("001"); // Mock non-recurring check
  });

  const handleAction = (request: typeof mockBudgetRequests[0], action: "approve" | "reject") => {
    setSelectedRequest(request);
    setActionType(action);
  };

  const confirmAction = () => {
    if (actionType === "approve") {
      toast.success(`Request ${selectedRequest?.id} approved and forwarded to DR`);
    } else {
      toast.error(`Request ${selectedRequest?.id} rejected and sent back to PI`);
    }
    setSelectedRequest(null);
    setActionType(null);
    setRemarks("");
  };

  const RequestTable = ({ requests }: { requests: typeof mockBudgetRequests }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>GP Number</TableHead>
          <TableHead>PI Name</TableHead>
          <TableHead>Purpose</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
            <TableCell className="font-medium">{request.gpNumber}</TableCell>
            <TableCell>{request.piName}</TableCell>
            <TableCell className="max-w-xs truncate">{request.purpose}</TableCell>
            <TableCell className="text-right">₹{(request.amount / 100000).toFixed(2)}L</TableCell>
            <TableCell>
              <StatusBadge status={request.status} />
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="default"
                  className="bg-success hover:bg-success/90"
                  onClick={() => handleAction(request, "approve")}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleAction(request, "reject")}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
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
          <h1 className="text-3xl font-bold text-foreground">AR Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Assistant Registrar - First level approval
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRequests.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting your approval</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Recurring</CardTitle>
              <CheckCircle className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recurringRequests.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Recurring projects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Non-Recurring</CardTitle>
              <CheckCircle className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{nonRecurringRequests.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Non-recurring projects</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Budget Requests for Approval</CardTitle>
            <CardDescription>Review and approve or reject budget requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All ({pendingRequests.length})</TabsTrigger>
                <TabsTrigger value="recurring">Recurring ({recurringRequests.length})</TabsTrigger>
                <TabsTrigger value="non-recurring">
                  Non-Recurring ({nonRecurringRequests.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                <RequestTable requests={pendingRequests} />
              </TabsContent>
              <TabsContent value="recurring" className="mt-4">
                <RequestTable requests={recurringRequests} />
              </TabsContent>
              <TabsContent value="non-recurring" className="mt-4">
                <RequestTable requests={nonRecurringRequests} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve Request" : "Reject Request"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "This request will be forwarded to DR for next level approval"
                : "This request will be sent back to PI with your remarks"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks (Optional)</Label>
              <Textarea
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter your comments or remarks"
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={confirmAction}
                variant={actionType === "approve" ? "default" : "destructive"}
                className="flex-1"
              >
                Confirm {actionType === "approve" ? "Approval" : "Rejection"}
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

export default ARDashboard;
