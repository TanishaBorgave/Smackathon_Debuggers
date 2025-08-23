import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Search, Heart, LifeBuoy, CheckCircle, Clock, Edit, Trash2, UserCheck, UserX, Filter, Download, RefreshCw, Plus, Mail, Phone, MapPin, Calendar, Activity, AlertTriangle, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Donor {
  id: string;
  fullName: string;
  bloodType: string;
  phone: string;
  email: string;
  city: string;
  age: number;
  weight: number;
  lastDonation: string;
  status: "active" | "inactive" | "suspended";
  totalDonations: number;
  lastActive: string;
}

interface BloodRequest {
  id: string;
  bloodType: string;
  units: number;
  urgency: "low" | "medium" | "high";
  hospitalName: string;
  contactPerson: string;
  status: "pending" | "approved" | "fulfilled" | "cancelled";
  requestDate: string;
}

const DonorManagement = () => {
  const { toast } = useToast();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterBloodType, setFilterBloodType] = useState("all");
  const [showViewMode, setShowViewMode] = useState(false); // Toggle between card and table view
  
  // Edit Dialog States
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
  const [editingRequest, setEditingRequest] = useState<BloodRequest | null>(null);
  const [showEditDonorDialog, setShowEditDonorDialog] = useState(false);
  const [showEditRequestDialog, setShowEditRequestDialog] = useState(false);
  
  // Bulk Action States
  const [selectedDonors, setSelectedDonors] = useState<string[]>([]);
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Sample data for demonstration
  const sampleDonors: Donor[] = [
    {
      id: "1",
      fullName: "John Smith",
      bloodType: "O+",
      phone: "+1-555-0123",
      email: "john.smith@email.com",
      city: "New York",
      age: 28,
      weight: 75,
      lastDonation: "2024-01-15",
      status: "active",
      totalDonations: 5,
      lastActive: "2024-01-20"
    },
    {
      id: "2",
      fullName: "Sarah Johnson",
      bloodType: "A-",
      phone: "+1-555-0124",
      email: "sarah.j@email.com",
      city: "Los Angeles",
      age: 32,
      weight: 65,
      lastDonation: "2024-01-10",
      status: "active",
      totalDonations: 3,
      lastActive: "2024-01-18"
    },
    {
      id: "3",
      fullName: "Mike Wilson",
      bloodType: "B+",
      phone: "+1-555-0125",
      email: "mike.w@email.com",
      city: "Chicago",
      age: 25,
      weight: 80,
      lastDonation: "2023-12-20",
      status: "inactive",
      totalDonations: 2,
      lastActive: "2024-01-05"
    }
  ];

  const sampleRequests: BloodRequest[] = [
    {
      id: "1",
      bloodType: "O+",
      units: 4,
      urgency: "high",
      hospitalName: "City General Hospital",
      contactPerson: "Dr. Emily Davis",
      status: "pending",
      requestDate: "2024-01-22"
    },
    {
      id: "2",
      bloodType: "A-",
      units: 2,
      urgency: "medium",
      hospitalName: "Regional Medical Center",
      contactPerson: "Dr. Michael Brown",
      status: "approved",
      requestDate: "2024-01-21"
    }
  ];

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedDonors = localStorage.getItem('donors');
    const storedRequests = localStorage.getItem('bloodRequests');
    
    if (storedDonors) {
      setDonors(JSON.parse(storedDonors));
    } else {
      // Use sample data if no stored data exists
      setDonors(sampleDonors);
    }
    
    if (storedRequests) {
      setBloodRequests(JSON.parse(storedRequests));
    } else {
      // Use sample data if no stored data exists
      setBloodRequests(sampleRequests);
    }
  }, []);

  // Advanced filtering
  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donor.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donor.bloodType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || donor.status === filterStatus;
    const matchesBloodType = filterBloodType === "all" || donor.bloodType === filterBloodType;
    return matchesSearch && matchesStatus && matchesBloodType;
  });

  const filteredRequests = bloodRequests.filter(request => {
    const matchesSearch = request.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.bloodType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || request.status === filterStatus;
    const matchesBloodType = filterBloodType === "all" || request.bloodType === filterBloodType;
    return matchesSearch && matchesStatus && matchesBloodType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive": return <Badge variant="secondary">Inactive</Badge>;
      case "suspended": return <Badge variant="destructive">Suspended</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "high": return <Badge variant="destructive">High</Badge>;
      case "medium": return <Badge variant="secondary">Medium</Badge>;
      case "low": return <Badge variant="outline">Low</Badge>;
      default: return <Badge variant="outline">{urgency}</Badge>;
    }
  };

  const getRequestStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge variant="secondary">Pending</Badge>;
      case "approved": return <Badge className="bg-blue-100 text-blue-800">Approved</Badge>;
      case "fulfilled": return <Badge className="bg-green-100 text-green-800">Fulfilled</Badge>;
      case "cancelled": return <Badge variant="destructive">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDonorStats = () => {
    const totalDonors = donors.length;
    const activeDonors = donors.filter(d => d.status === "active").length;
    const totalDonations = donors.reduce((sum, d) => sum + d.totalDonations, 0);
    return { totalDonors, activeDonors, totalDonations };
  };

  const getRequestStats = () => {
    const totalRequests = bloodRequests.length;
    const pendingRequests = bloodRequests.filter(r => r.status === "pending").length;
    const fulfilledRequests = bloodRequests.filter(r => r.status === "fulfilled").length;
    return { totalRequests, pendingRequests, fulfilledRequests };
  };

  const donorStats = getDonorStats();
  const requestStats = getRequestStats();

  // CRUD Functions for Donors
  const updateDonor = (updatedDonor: Donor) => {
    const updatedDonors = donors.map(d => d.id === updatedDonor.id ? updatedDonor : d);
    setDonors(updatedDonors);
    localStorage.setItem('donors', JSON.stringify(updatedDonors));
    toast({
      title: "Donor Updated",
      description: `${updatedDonor.fullName}'s information has been updated successfully.`
    });
  };

  const deleteDonor = (donorId: string) => {
    const donorToDelete = donors.find(d => d.id === donorId);
    const updatedDonors = donors.filter(d => d.id !== donorId);
    setDonors(updatedDonors);
    localStorage.setItem('donors', JSON.stringify(updatedDonors));
    toast({
      title: "Donor Deleted",
      description: `${donorToDelete?.fullName} has been removed from the system.`,
      variant: "destructive"
    });
  };

  const approveDonor = (donorId: string) => {
    const updatedDonors = donors.map(d => 
      d.id === donorId ? { ...d, status: "active" as const } : d
    );
    setDonors(updatedDonors);
    localStorage.setItem('donors', JSON.stringify(updatedDonors));
    toast({
      title: "Donor Approved",
      description: "Donor has been approved and activated."
    });
  };

  const suspendDonor = (donorId: string) => {
    const updatedDonors = donors.map(d => 
      d.id === donorId ? { ...d, status: "suspended" as const } : d
    );
    setDonors(updatedDonors);
    localStorage.setItem('donors', JSON.stringify(updatedDonors));
    toast({
      title: "Donor Suspended",
      description: "Donor has been suspended from donations.",
      variant: "destructive"
    });
  };

  // CRUD Functions for Blood Requests
  const updateBloodRequest = (updatedRequest: BloodRequest) => {
    const updatedRequests = bloodRequests.map(r => r.id === updatedRequest.id ? updatedRequest : r);
    setBloodRequests(updatedRequests);
    localStorage.setItem('bloodRequests', JSON.stringify(updatedRequests));
    toast({
      title: "Request Updated",
      description: `Blood request from ${updatedRequest.hospitalName} has been updated.`
    });
  };

  const deleteBloodRequest = (requestId: string) => {
    const requestToDelete = bloodRequests.find(r => r.id === requestId);
    const updatedRequests = bloodRequests.filter(r => r.id !== requestId);
    setBloodRequests(updatedRequests);
    localStorage.setItem('bloodRequests', JSON.stringify(updatedRequests));
    toast({
      title: "Request Deleted",
      description: `Request from ${requestToDelete?.hospitalName} has been removed.`,
      variant: "destructive"
    });
  };

  const approveBloodRequest = (requestId: string) => {
    const updatedRequests = bloodRequests.map(r => 
      r.id === requestId ? { ...r, status: "approved" as const } : r
    );
    setBloodRequests(updatedRequests);
    localStorage.setItem('bloodRequests', JSON.stringify(updatedRequests));
    toast({
      title: "Request Approved",
      description: "Blood request has been approved."
    });
  };

  const fulfillBloodRequest = (requestId: string) => {
    const updatedRequests = bloodRequests.map(r => 
      r.id === requestId ? { ...r, status: "fulfilled" as const } : r
    );
    setBloodRequests(updatedRequests);
    localStorage.setItem('bloodRequests', JSON.stringify(updatedRequests));
    toast({
      title: "Request Fulfilled",
      description: "Blood request has been marked as fulfilled."
    });
  };

  // Bulk Actions
  const handleBulkDonorAction = (action: string) => {
    if (selectedDonors.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select donors to perform bulk actions.",
        variant: "destructive"
      });
      return;
    }

    switch (action) {
      case "approve":
        selectedDonors.forEach(id => approveDonor(id));
        break;
      case "suspend":
        selectedDonors.forEach(id => suspendDonor(id));
        break;
      case "delete":
        selectedDonors.forEach(id => deleteDonor(id));
        break;
    }
    setSelectedDonors([]);
  };

  const handleBulkRequestAction = (action: string) => {
    if (selectedRequests.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select requests to perform bulk actions.",
        variant: "destructive"
      });
      return;
    }

    switch (action) {
      case "approve":
        selectedRequests.forEach(id => approveBloodRequest(id));
        break;
      case "fulfill":
        selectedRequests.forEach(id => fulfillBloodRequest(id));
        break;
      case "delete":
        selectedRequests.forEach(id => deleteBloodRequest(id));
        break;
    }
    setSelectedRequests([]);
  };

  // Export Functions
  const exportDonors = () => {
    const dataStr = JSON.stringify(filteredDonors, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `donors_export_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Export Complete",
      description: `${filteredDonors.length} donors exported successfully.`
    });
  };

  const exportRequests = () => {
    const dataStr = JSON.stringify(filteredRequests, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `blood_requests_export_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Export Complete",
      description: `${filteredRequests.length} requests exported successfully.`
    });
  };

  // Edit Form Handlers
  const handleDonorEdit = (donor: Donor) => {
    setEditingDonor(donor);
    setShowEditDonorDialog(true);
  };

  const handleRequestEdit = (request: BloodRequest) => {
    setEditingRequest(request);
    setShowEditRequestDialog(true);
  };

  const handleDonorSave = () => {
    if (editingDonor) {
      updateDonor(editingDonor);
      setShowEditDonorDialog(false);
      setEditingDonor(null);
    }
  };

  const handleRequestSave = () => {
    if (editingRequest) {
      updateBloodRequest(editingRequest);
      setShowEditRequestDialog(false);
      setEditingRequest(null);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                Donor & Request Management
              </h1>
              <p className="text-muted-foreground">
                Advanced management with bulk actions and analytics
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Button variant="outline" size="sm" onClick={() => setShowViewMode(!showViewMode)}>
              <Eye className="mr-2 h-4 w-4" />
              {showViewMode ? "Card View" : "Table View"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Donors</p>
                  <p className="text-2xl font-bold text-foreground">{donorStats.totalDonors}</p>
                </div>
                <div className="p-3 rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Donors</p>
                  <p className="text-2xl font-bold text-foreground">{donorStats.activeDonors}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Donations</p>
                  <p className="text-2xl font-bold text-foreground">{donorStats.totalDonations}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Heart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                  <p className="text-2xl font-bold text-foreground">{requestStats.pendingRequests}</p>
                </div>
                <div className="p-3 rounded-full bg-yellow-100">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="donors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="donors" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Donors ({donors.length})</span>
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center space-x-2">
              <LifeBuoy className="h-4 w-4" />
              <span>Requests ({bloodRequests.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* Donors Tab */}
          <TabsContent value="donors" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>Blood Donors</CardTitle>
                    <CardDescription>
                      Advanced donor management with CRUD operations
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                    <Button variant="outline" size="sm" onClick={exportDonors}>
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowBulkActions(!showBulkActions)}>
                      <Filter className="mr-2 h-4 w-4" />
                      Bulk Actions
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Advanced Search and Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search donors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterBloodType} onValueChange={setFilterBloodType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Blood Types</SelectItem>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("");
                      setFilterStatus("all");
                      setFilterBloodType("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>

                {/* Bulk Actions Panel */}
                {showBulkActions && (
                  <Card className="mb-6 bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">
                          Bulk Actions ({selectedDonors.length} selected)
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleBulkDonorAction("approve")}
                            disabled={selectedDonors.length === 0}
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Approve Selected
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleBulkDonorAction("suspend")}
                            disabled={selectedDonors.length === 0}
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            Suspend Selected
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                disabled={selectedDonors.length === 0}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Selected
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Multiple Donors</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {selectedDonors.length} selected donors? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleBulkDonorAction("delete")}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Donors Table */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {showBulkActions && (
                          <TableHead className="w-12">
                            <input
                              type="checkbox"
                              checked={selectedDonors.length === filteredDonors.length && filteredDonors.length > 0}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedDonors(filteredDonors.map(d => d.id));
                                } else {
                                  setSelectedDonors([]);
                                }
                              }}
                              className="rounded"
                            />
                          </TableHead>
                        )}
                        <TableHead>Donor Information</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Blood Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Donations</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDonors.map((donor) => (
                        <TableRow key={donor.id}>
                          {showBulkActions && (
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedDonors.includes(donor.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedDonors([...selectedDonors, donor.id]);
                                  } else {
                                    setSelectedDonors(selectedDonors.filter(id => id !== donor.id));
                                  }
                                }}
                                className="rounded"
                              />
                            </TableCell>
                          )}
                          <TableCell>
                            <div>
                              <div className="font-medium">{donor.fullName}</div>
                              <div className="text-sm text-muted-foreground">
                                Age: {donor.age} | Weight: {donor.weight}kg
                              </div>
                              <div className="text-sm text-muted-foreground">{donor.city}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <Mail className="mr-1 h-3 w-3" />
                                {donor.email}
                              </div>
                              <div className="flex items-center text-sm">
                                <Phone className="mr-1 h-3 w-3" />
                                {donor.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">
                              {donor.bloodType}
                            </Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(donor.status)}</TableCell>
                          <TableCell>
                            <div className="text-center">
                              <div className="font-semibold">{donor.totalDonations}</div>
                              <div className="text-xs text-muted-foreground">donations</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-muted-foreground">
                              {donor.lastActive}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDonorEdit(donor)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              
                              {donor.status === "inactive" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => approveDonor(donor.id)}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <UserCheck className="h-4 w-4" />
                                </Button>
                              )}
                              
                              {donor.status === "active" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => suspendDonor(donor.id)}
                                  className="text-yellow-600 hover:text-yellow-700"
                                >
                                  <UserX className="h-4 w-4" />
                                </Button>
                              )}

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Donor</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete {donor.fullName}? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteDonor(donor.id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {filteredDonors.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4" />
                      <p>No donors found matching your criteria.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>Blood Requests</CardTitle>
                    <CardDescription>
                      Advanced request management with approval workflow
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                    <Button variant="outline" size="sm" onClick={exportRequests}>
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowBulkActions(!showBulkActions)}>
                      <Filter className="mr-2 h-4 w-4" />
                      Bulk Actions
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Advanced Search and Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search requests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="fulfilled">Fulfilled</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterBloodType} onValueChange={setFilterBloodType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Blood Types</SelectItem>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("");
                      setFilterStatus("all");
                      setFilterBloodType("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>

                {/* Bulk Actions Panel */}
                {showBulkActions && (
                  <Card className="mb-6 bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">
                          Bulk Actions ({selectedRequests.length} selected)
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleBulkRequestAction("approve")}
                            disabled={selectedRequests.length === 0}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve Selected
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleBulkRequestAction("fulfill")}
                            disabled={selectedRequests.length === 0}
                          >
                            <Activity className="mr-2 h-4 w-4" />
                            Fulfill Selected
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                disabled={selectedRequests.length === 0}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Selected
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Multiple Requests</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {selectedRequests.length} selected requests? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleBulkRequestAction("delete")}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Requests Table */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {showBulkActions && (
                          <TableHead className="w-12">
                            <input
                              type="checkbox"
                              checked={selectedRequests.length === filteredRequests.length && filteredRequests.length > 0}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedRequests(filteredRequests.map(r => r.id));
                                } else {
                                  setSelectedRequests([]);
                                }
                              }}
                              className="rounded"
                            />
                          </TableHead>
                        )}
                        <TableHead>Hospital Information</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Blood Type</TableHead>
                        <TableHead>Units</TableHead>
                        <TableHead>Urgency</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Request Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.map((request) => (
                        <TableRow key={request.id}>
                          {showBulkActions && (
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedRequests.includes(request.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedRequests([...selectedRequests, request.id]);
                                  } else {
                                    setSelectedRequests(selectedRequests.filter(id => id !== request.id));
                                  }
                                }}
                                className="rounded"
                              />
                            </TableCell>
                          )}
                          <TableCell>
                            <div>
                              <div className="font-medium">{request.hospitalName}</div>
                              <div className="text-sm text-muted-foreground">
                                ID: {request.id}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{request.contactPerson}</div>
                              <div className="text-sm text-muted-foreground">Contact Person</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">
                              {request.bloodType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-center">
                              <div className="font-semibold">{request.units}</div>
                              <div className="text-xs text-muted-foreground">units</div>
                            </div>
                          </TableCell>
                          <TableCell>{getUrgencyBadge(request.urgency)}</TableCell>
                          <TableCell>{getRequestStatusBadge(request.status)}</TableCell>
                          <TableCell>
                            <div className="text-sm text-muted-foreground">
                              {request.requestDate}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRequestEdit(request)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              
                              {request.status === "pending" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => approveBloodRequest(request.id)}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              
                              {request.status === "approved" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => fulfillBloodRequest(request.id)}
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  <Activity className="h-4 w-4" />
                                </Button>
                              )}

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Blood Request</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete the request from {request.hospitalName}? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteBloodRequest(request.id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {filteredRequests.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <LifeBuoy className="h-12 w-12 mx-auto mb-4" />
                      <p>No blood requests found matching your criteria.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Donor Dialog */}
        <Dialog open={showEditDonorDialog} onOpenChange={setShowEditDonorDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Donor Information</DialogTitle>
              <DialogDescription>
                Update donor details and information
              </DialogDescription>
            </DialogHeader>
            {editingDonor && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                      id="edit-name"
                      value={editingDonor.fullName}
                      onChange={(e) => setEditingDonor({...editingDonor, fullName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editingDonor.email}
                      onChange={(e) => setEditingDonor({...editingDonor, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input
                      id="edit-phone"
                      value={editingDonor.phone}
                      onChange={(e) => setEditingDonor({...editingDonor, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-blood-type">Blood Type</Label>
                    <Select 
                      value={editingDonor.bloodType} 
                      onValueChange={(value) => setEditingDonor({...editingDonor, bloodType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="edit-age">Age</Label>
                    <Input
                      id="edit-age"
                      type="number"
                      value={editingDonor.age}
                      onChange={(e) => setEditingDonor({...editingDonor, age: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-weight">Weight (kg)</Label>
                    <Input
                      id="edit-weight"
                      type="number"
                      value={editingDonor.weight}
                      onChange={(e) => setEditingDonor({...editingDonor, weight: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-status">Status</Label>
                    <Select 
                      value={editingDonor.status} 
                      onValueChange={(value) => setEditingDonor({...editingDonor, status: value as Donor["status"]})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-city">City</Label>
                  <Input
                    id="edit-city"
                    value={editingDonor.city}
                    onChange={(e) => setEditingDonor({...editingDonor, city: e.target.value})}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDonorDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleDonorSave}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Blood Request Dialog */}
        <Dialog open={showEditRequestDialog} onOpenChange={setShowEditRequestDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Blood Request</DialogTitle>
              <DialogDescription>
                Update blood request details
              </DialogDescription>
            </DialogHeader>
            {editingRequest && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-hospital">Hospital Name</Label>
                    <Input
                      id="edit-hospital"
                      value={editingRequest.hospitalName}
                      onChange={(e) => setEditingRequest({...editingRequest, hospitalName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-contact">Contact Person</Label>
                    <Input
                      id="edit-contact"
                      value={editingRequest.contactPerson}
                      onChange={(e) => setEditingRequest({...editingRequest, contactPerson: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="edit-req-blood-type">Blood Type</Label>
                    <Select 
                      value={editingRequest.bloodType} 
                      onValueChange={(value) => setEditingRequest({...editingRequest, bloodType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-req-units">Units Required</Label>
                    <Input
                      id="edit-req-units"
                      type="number"
                      value={editingRequest.units}
                      onChange={(e) => setEditingRequest({...editingRequest, units: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-req-urgency">Urgency</Label>
                    <Select 
                      value={editingRequest.urgency} 
                      onValueChange={(value) => setEditingRequest({...editingRequest, urgency: value as BloodRequest["urgency"]})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-req-status">Status</Label>
                  <Select 
                    value={editingRequest.status} 
                    onValueChange={(value) => setEditingRequest({...editingRequest, status: value as BloodRequest["status"]})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="fulfilled">Fulfilled</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditRequestDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleRequestSave}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DonorManagement;