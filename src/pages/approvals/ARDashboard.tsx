import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { BudgetReviewDialog } from "@/components/BudgetReviewDialog";
import { WorkflowManager } from "@/lib/workflowManager";
import { BudgetRequest } from "@/lib/mockData";
import { useState } from "react";
import { Clock, CheckCircle, FileText } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { formatDate } from "@/lib/utils";

const ARDashboard = () => {
  const [selectedRequest, setSelectedRequest] = useState<BudgetRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get requests pending AR approval (forwarded by Admin)
  const pendingRequests = WorkflowManager.getRequestsByStage("ar");
  const completedRequests = WorkflowManager.getCompletedRequests();
  const recurringRequests = pendingRequests.filter((r) => r.projectType === "recurring");
  const nonRecurringRequests = pendingRequests.filter((r) => r.projectType === "non-recurring");

  const handleAction = (action: "forward" | "approve" | "reject", remarks: string) => {
    if (!selectedRequest) return;

    try {
      if (action === "approve") {
        WorkflowManager.approveByAR(selectedRequest.id, "AR Officer", remarks);
        toast.success("Request approved and forwarded to DR");
      } else if (action === "reject") {
        WorkflowManager.rejectRequest(selectedRequest.id, "ar", "AR Officer", remarks);
        toast.error("Request rejected");
      }
      setDialogOpen(false);
      setSelectedRequest(null);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleViewRequest = (request: BudgetRequest) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AR Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Assistant Registrar - First level approval
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRequests.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Requires your decision</p>
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
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{nonRecurringRequests.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Non-recurring projects</p>
            </CardContent>
          </Card>
        </div>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Requests for Approval</CardTitle>
            <CardDescription>
              Review and approve or reject budget requests forwarded by Admin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All ({pendingRequests.length})</TabsTrigger>
                <TabsTrigger value="recurring">Recurring ({recurringRequests.length})</TabsTrigger>
                <TabsTrigger value="non-recurring">Non-Recurring ({nonRecurringRequests.length})</TabsTrigger>
              </TabsList>

              {[
                { key: "all", requests: pendingRequests },
                { key: "recurring", requests: recurringRequests },
                { key: "non-recurring", requests: nonRecurringRequests },
              ].map(({ key, requests }) => (
                <TabsContent key={key} value={key} className="mt-4">
                  {requests.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No pending requests</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>GP Number</TableHead>
                          <TableHead>PI Name</TableHead>
                          <TableHead>Purpose</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>
                              {formatDate(request.createdAt)}
                            </TableCell>
                            <TableCell className="font-medium">{request.gpNumber}</TableCell>
                            <TableCell>{request.piName}</TableCell>
                            <TableCell className="max-w-xs truncate">{request.purpose}</TableCell>
                            <TableCell className="text-right">
                              ₹{(request.amount / 100000).toFixed(2)}L
                            </TableCell>
                            <TableCell className="capitalize">{request.projectType}</TableCell>
                            <TableCell>
                              <StatusBadge status={request.status} />
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                onClick={() => handleViewRequest(request)}
                              >
                                Review
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Completed Requests Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-muted-foreground" />
              <CardTitle>History: Completed Requests</CardTitle>
            </div>
            <CardDescription>
              All sanctioned or rejected budget requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {completedRequests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No completed requests yet</p>
              </div>
            ) : (
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
                  {completedRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        {formatDate(request.createdAt)}
                      </TableCell>
                      <TableCell className="font-medium">{request.gpNumber}</TableCell>
                      <TableCell>{request.piName}</TableCell>
                      <TableCell className="max-w-xs truncate">{request.purpose}</TableCell>
                      <TableCell className="text-right">
                        ₹{(request.amount / 100000).toFixed(2)}L
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={request.status} />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewRequest(request)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <BudgetReviewDialog
        request={selectedRequest}
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedRequest(null);
        }}
        role="ar"
        onAction={handleAction}
      />
    </Layout>
  );
};

export default ARDashboard;
