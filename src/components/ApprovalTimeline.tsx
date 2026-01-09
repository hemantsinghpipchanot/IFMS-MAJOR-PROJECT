import { BudgetRequest } from "@/lib/mockData";
import { CheckCircle, Clock, XCircle, Circle } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

interface ApprovalTimelineProps {
    request: BudgetRequest;
}

export const ApprovalTimeline = ({ request }: ApprovalTimelineProps) => {
    const stages = [
        { key: "pi", label: "PI Created", role: "pi" },
        { key: "admin", label: "Admin Verified", role: "admin" },
        { key: "ar", label: "AR Approved", role: "ar" },
        { key: "dr", label: "DR Approved", role: "dr" },
        { key: "ao2", label: "AO2 Approved", role: "ao2" },
    ];

    const getStageStatus = (stageKey: string) => {
        // Check if rejected
        if (request.status === "rejected") {
            const rejectionLog = request.approvalLogs.find((log) => log.action === "rejected");
            if (rejectionLog) {
                // All stages before rejection are completed
                const stageIndex = stages.findIndex((s) => s.role === rejectionLog.role);
                const currentIndex = stages.findIndex((s) => s.key === stageKey);

                if (currentIndex < stageIndex) {
                    return "completed";
                } else if (currentIndex === stageIndex) {
                    return "rejected";
                } else {
                    return "pending";
                }
            }
        }

        // Check completion based on approval logs
        if (stageKey === "pi") {
            return "completed"; // Always completed if request exists
        }
        if (stageKey === "admin" && request.adminForwardedAt) {
            return "completed";
        }
        if (stageKey === "ar" && request.arApprovedAt) {
            return "completed";
        }
        if (stageKey === "dr" && request.drApprovedAt) {
            return "completed";
        }
        if (stageKey === "ao2" && request.ao2ApprovedAt) {
            return "completed";
        }

        // Check if current stage
        if (
            (stageKey === "admin" && request.currentStage === "admin") ||
            (stageKey === "ar" && request.currentStage === "ar") ||
            (stageKey === "dr" && request.currentStage === "dr") ||
            (stageKey === "ao2" && request.currentStage === "ao2")
        ) {
            return "current";
        }

        return "pending";
    };

    const getTimestamp = (stageKey: string) => {
        const log = request.approvalLogs.find((l) => l.role === stageKey);
        if (log) {
            return log.timestamp;
        }
        return null;
    };

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground">Approval Timeline</h3>
            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

                <div className="space-y-6">
                    {stages.map((stage, index) => {
                        const status = getStageStatus(stage.key);
                        const timestamp = getTimestamp(stage.role);

                        return (
                            <div key={stage.key} className="relative flex items-start gap-4">
                                {/* Icon */}
                                <div
                                    className={cn(
                                        "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2",
                                        status === "completed" && "bg-success border-success",
                                        status === "current" && "bg-warning border-warning animate-pulse",
                                        status === "rejected" && "bg-destructive border-destructive",
                                        status === "pending" && "bg-background border-border"
                                    )}
                                >
                                    {status === "completed" && <CheckCircle className="h-4 w-4 text-white" />}
                                    {status === "current" && <Clock className="h-4 w-4 text-white" />}
                                    {status === "rejected" && <XCircle className="h-4 w-4 text-white" />}
                                    {status === "pending" && <Circle className="h-4 w-4 text-muted-foreground" />}
                                </div>

                                {/* Content */}
                                <div className="flex-1 pb-6">
                                    <div className="flex items-center justify-between">
                                        <p
                                            className={cn(
                                                "font-medium",
                                                status === "completed" && "text-success",
                                                status === "current" && "text-warning",
                                                status === "rejected" && "text-destructive",
                                                status === "pending" && "text-muted-foreground"
                                            )}
                                        >
                                            {stage.label}
                                        </p>
                                        {timestamp && (
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(timestamp)}
                                            </p>
                                        )}
                                    </div>
                                    {timestamp && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {new Date(timestamp).toLocaleTimeString()}
                                        </p>
                                    )}
                                    {status === "rejected" && request.rejectionRemarks && (
                                        <p className="text-sm text-destructive mt-2 bg-destructive/10 p-2 rounded">
                                            <span className="font-semibold">Rejection reason:</span> {request.rejectionRemarks}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Approval Logs */}
            {request.approvalLogs.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                    <h4 className="font-semibold text-sm text-muted-foreground mb-3">Detailed Logs</h4>
                    <div className="space-y-2">
                        {request.approvalLogs.map((log, index) => (
                            <div key={index} className="text-xs bg-muted/50 p-2 rounded">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="font-semibold uppercase">{log.role}</span>
                                        <span className="text-muted-foreground"> - {log.action}</span>
                                        <span className="text-muted-foreground"> by {log.actor}</span>
                                    </div>
                                    <span className="text-muted-foreground">
                                        {formatDate(log.timestamp)} {new Date(log.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                                {log.remarks && (
                                    <p className="mt-1 text-muted-foreground italic">&quot;{log.remarks}&quot;</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
