import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { mockDepartments } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, UserPlus, Mail, Phone, Building, Award, Users } from "lucide-react";
import { toast } from "sonner";

interface PI {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
}

const RegisterPI = () => {
  const [pis, setPis] = useState<PI[]>([
    {
      id: "1",
      name: "Dr. John Smith",
      email: "pi@ifms.edu",
      phone: "+91 9876543210",
      department: "Computer Science",
      designation: "Professor",
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPI: PI = {
      id: (pis.length + 1).toString(),
      ...formData,
    };
    setPis([...pis, newPI]);
    toast.success("Principal Investigator registered successfully");
    setFormData({ name: "", email: "", phone: "", department: "", designation: "" });
    setShowForm(false);
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Register PI</h1>
            <p className="text-muted-foreground mt-1">
              Register and manage Principal Investigators
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="gap-2 h-11"
          >
            <Plus className="h-4 w-4" />
            Register New PI
          </Button>
        </div>

        {/* Registration Form */}
        {showForm && (
          <Card className="shadow-soft border animate-scale-in">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Register New Principal Investigator</CardTitle>
              <CardDescription>Enter PI details to register in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Dr. Jane Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane.doe@ifms.edu"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <Select
                      value={formData.designation}
                      onValueChange={(value) => setFormData({ ...formData, designation: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select designation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Professor">Professor</SelectItem>
                        <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                        <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                        <SelectItem value="Senior Scientist">Senior Scientist</SelectItem>
                        <SelectItem value="Scientist">Scientist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDepartments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.name}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    className="gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Register PI
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* PI List Table */}
        <Card className="shadow-soft border">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Registered Principal Investigators</CardTitle>
            <CardDescription>List of all registered PIs in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Phone</TableHead>
                    <TableHead className="font-semibold">Department</TableHead>
                    <TableHead className="font-semibold">Designation</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="table-zebra">
                  {pis.map((pi) => (
                    <TableRow key={pi.id}>
                      <TableCell className="font-medium">{pi.name}</TableCell>
                      <TableCell>{pi.email}</TableCell>
                      <TableCell>{pi.phone}</TableCell>
                      <TableCell>
                        <span className="badge-institutional">
                          {pi.department}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-success/10 border border-success/30 text-success text-sm font-semibold">
                          {pi.designation}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-destructive/10 hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RegisterPI;
