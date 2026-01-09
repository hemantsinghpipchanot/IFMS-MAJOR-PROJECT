import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { BudgetReviewDialog } from "@/components/BudgetReviewDialog";
import { WorkflowManager } from "@/lib/workflowManager";
import { BudgetRequest } from "@/lib/mockData";
import { useState } from "react";
import { Clock, DollarSign, FileCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { formatDate } from "@/lib/utils";

const AO2Dashboard = () => {
  const [selectedRequest, setSelectedRequest] = useState<BudgetRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get requests pending AO2 approval (approved by DR)
  const pendingRequests = WorkflowManager.getRequestsByStage("ao2");
  const completedRequests = WorkflowManager.getCompletedRequests();

  const handleAction = (action: "forward" | "approve" | "reject", remarks: string) => {
    if (!selectedRequest) return;

    try {
      if (action === "approve") {
        WorkflowManager.approveByAO2(selectedRequest.id, "AO2 Officer", remarks);
        toast.success("Request FINALLY APPROVED! UC will be generated.");
      } else if (action === "reject") {
        WorkflowManager.rejectRequest(selectedRequest.id, "ao2", "AO2 Officer", remarks);
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
          <h1 className="text-3xl font-bold text-foreground">AO2 Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Accounts Officer Level 2 - Final approval stage
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-warning/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Final Approval</CardTitle>
              <AlertCircle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRequests.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Requires final decision</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{(pendingRequests.reduce((sum, r) => sum + r.amount, 0) / 100000).toFixed(2)}L
              </div>
              <p className="text-xs text-muted-foreground mt-1">In pending requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Workflow Stage</CardTitle>
              <FileCheck className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Final</div>
              <p className="text-xs text-muted-foreground mt-1">Last approval stage</p>
            </CardContent>
          </Card>
        </div>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Requests for Final Approval</CardTitle>
            <CardDescription>
              Requests approved by DR - Your approval will finalize the budget
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No pending requests for final approval</p>
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
                    <TableHead>Approval History</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        {formatDate(request.createdAt)}
                      </TableCell>
                      <TableCell className="font-medium">{request.gpNumber}</TableCell>
                      <TableCell>{request.piName}</TableCell>
                      <TableCell className="max-w-xs truncate">{request.purpose}</TableCell>
                      <TableCell className="text-right font-semibold">
                        ₹{(request.amount / 100000).toFixed(2)}L
                      </TableCell>
                      <TableCell className="capitalize">{request.projectType}</TableCell>
                      <TableCell>
                        <div className="text-xs space-y-1">
                          {request.adminForwardedAt && (
                            <div className="text-muted-foreground">
                              Admin: {formatDate(request.adminForwardedAt)}
                            </div>
                          )}
                          {request.arApprovedAt && (
                            <div className="text-success">
                              AR: {formatDate(request.arApprovedAt)}
                            </div>
                          )}
                          {request.drApprovedAt && (
                            <div className="text-success">
                              DR: {formatDate(request.drApprovedAt)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleViewRequest(request)}
                          className="bg-warning hover:bg-warning/90"
                        >
                          Final Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
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
        role="ao2"
        onAction={handleAction}
      />
    </Layout>
  );
};

export default AO2Dashboard;
