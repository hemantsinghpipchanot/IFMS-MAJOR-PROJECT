import { Status } from "@/components/StatusBadge";

export interface Department {
  id: string;
  name: string;
  hodName: string;
  hodEmail: string;
}

export interface Project {
  id: string;
  gpNumber: string;
  title: string;
  piName: string;
  piEmail: string;
  department: string;
  type: "recurring" | "non-recurring";
  status: Status;
  sanctionedAmount: number;
  releasedAmount: number;
  bookedAmount: number;
  spentAmount: number;
  incurredAmount: number;
  createdAt: string;
  sanctionedDate?: string;
  releaseDate?: string;
  letterDate?: string;
}

export interface BudgetRequest {
  id: string;
  projectId: string;
  gpNumber: string;
  projectTitle: string;
  piName: string;
  amount: number;
  purpose: string;
  status: Status;
  currentStage: "pi" | "ar" | "dr" | "ao2" | "completed";
  createdAt: string;
  arApprovedAt?: string;
  drApprovedAt?: string;
  ao2ApprovedAt?: string;
  remarks?: string;
}

export interface ProjectHead {
  id: string;
  name: string;
  type: "recurring" | "non-recurring";
}

export const mockDepartments: Department[] = [
  {
    id: "1",
    name: "Computer Science",
    hodName: "Dr. Rajesh Kumar",
    hodEmail: "rajesh.kumar@ifms.edu",
  },
  {
    id: "2",
    name: "Electrical Engineering",
    hodName: "Dr. Priya Sharma",
    hodEmail: "priya.sharma@ifms.edu",
  },
  {
    id: "3",
    name: "Mechanical Engineering",
    hodName: "Dr. Amit Patel",
    hodEmail: "amit.patel@ifms.edu",
  },
];

export const mockProjectHeads: ProjectHead[] = [
  { id: "1", name: "Equipment", type: "non-recurring" },
  { id: "2", name: "Consumables", type: "recurring" },
  { id: "3", name: "Travel", type: "recurring" },
  { id: "4", name: "Infrastructure", type: "non-recurring" },
  { id: "5", name: "Manpower", type: "recurring" },
];

export const mockProjects: Project[] = [
  {
    id: "1",
    gpNumber: "GP2024001",
    title: "AI Research in Healthcare",
    piName: "Dr. John Smith",
    piEmail: "pi@ifms.edu",
    department: "Computer Science",
    type: "recurring",
    status: "released",
    sanctionedAmount: 5000000,
    releasedAmount: 3000000,
    bookedAmount: 1500000,
    spentAmount: 800000,
    incurredAmount: 700000,
    createdAt: "2024-01-15",
    sanctionedDate: "2024-02-01",
    releaseDate: "2024-02-15",
    letterDate: "2024-02-10",
  },
  {
    id: "2",
    gpNumber: "GP2024002",
    title: "Smart Grid Technology",
    piName: "Dr. Priya Sharma",
    piEmail: "priya@ifms.edu",
    department: "Electrical Engineering",
    type: "non-recurring",
    status: "sanctioned",
    sanctionedAmount: 8000000,
    releasedAmount: 0,
    bookedAmount: 0,
    spentAmount: 0,
    incurredAmount: 0,
    createdAt: "2024-02-10",
    sanctionedDate: "2024-03-01",
  },
];

export const mockBudgetRequests: BudgetRequest[] = [
  {
    id: "1",
    projectId: "1",
    gpNumber: "GP2024001",
    projectTitle: "AI Research in Healthcare",
    piName: "Dr. John Smith",
    amount: 250000,
    purpose: "Purchase of GPU servers for deep learning",
    status: "pending",
    currentStage: "ar",
    createdAt: "2024-03-15",
  },
  {
    id: "2",
    projectId: "1",
    gpNumber: "GP2024001",
    projectTitle: "AI Research in Healthcare",
    piName: "Dr. John Smith",
    amount: 150000,
    purpose: "Conference travel and registration",
    status: "approved",
    currentStage: "completed",
    createdAt: "2024-02-20",
    arApprovedAt: "2024-02-21",
    drApprovedAt: "2024-02-22",
    ao2ApprovedAt: "2024-02-23",
  },
];
