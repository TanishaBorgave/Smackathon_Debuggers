import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { LifeBuoy, MapPin, Clock, Users, Phone, Mail, Building, AlertTriangle, CheckCircle, Activity, Search, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface BloodRequest {
  id: string;
  bloodType: string;
  units: number;
  urgency: "low" | "medium" | "high";
  hospitalName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  patientInfo: string;
  additionalNotes: string;
  requestDate: string;
  status: "pending" | "approved" | "fulfilled" | "cancelled";
  assignedDonors: string[];
  fulfillmentDate?: string;
  notes?: string;
}

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
  medicalConditions: string;
  agreesToTerms: boolean;
  agreesToNotifications: boolean;
  registrationDate: string;
  status: "active" | "inactive" | "suspended";
  totalDonations: number;
  lastActive: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  preferredDonationTime?: string;
  notes?: string;
}

const BloodRequest = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewRequestsOpen, setIsViewRequestsOpen] = useState(false);
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [formData, setFormData] = useState({
    bloodType: "",
    units: "",
    urgency: "",
    hospitalName: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    patientInfo: "",
    additionalNotes: ""
  });
  const { toast } = useToast();

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const urgencyLevels = [
    { value: "high", label: "High - Emergency", color: "destructive" },
    { value: "medium", label: "Medium - Urgent", color: "warning" },
    { value: "low", label: "Low - Planned", color: "success" }
  ];

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedRequests = localStorage.getItem('bloodRequests');
    const storedDonors = localStorage.getItem('donors');
    
    if (storedRequests) {
      setBloodRequests(JSON.parse(storedRequests));
    } else {
      // Initialize with sample data
      const sampleRequests: BloodRequest[] = [
        {
          id: "1",
          bloodType: "A+",
          units: 2,
          urgency: "high",
          hospitalName: "City General Hospital",
          contactPerson: "Dr. Sarah Wilson",
          phone: "+1 (555) 123-4567",
          email: "sarah.wilson@cityhospital.com",
          address: "123 Medical Center Dr, New York, NY 10001",
          patientInfo: "Patient: 45-year-old male, surgery scheduled for tomorrow",
          additionalNotes: "Urgent need for surgery preparation",
          requestDate: "2024-01-25",
          status: "pending",
          assignedDonors: [],
          notes: "Critical surgery case"
        },
        {
          id: "2",
          bloodType: "O-",
          units: 1,
          urgency: "medium",
          hospitalName: "Community Medical Center",
          contactPerson: "Dr. Michael Brown",
          phone: "+1 (555) 234-5678",
          email: "michael.brown@communitymed.com",
          address: "456 Health Ave, Los Angeles, CA 90210",
          patientInfo: "Patient: 32-year-old female, scheduled procedure",
          additionalNotes: "Universal donor preferred",
          requestDate: "2024-01-24",
          status: "approved",
          assignedDonors: ["2"],
          notes: "Procedure scheduled for next week"
        }
      ];
      setBloodRequests(sampleRequests);
      localStorage.setItem('bloodRequests', JSON.stringify(sampleRequests));
    }

    if (storedDonors) {
      setDonors(JSON.parse(storedDonors));
    }
  }, []);

  // Listen for donor updates
  useEffect(() => {
    const handleDonorUpdate = () => {
      const storedDonors = localStorage.getItem('donors');
      if (storedDonors) {
        setDonors(JSON.parse(storedDonors));
      }
    };

    window.addEventListener('donors-updated', handleDonorUpdate);
    return () => window.removeEventListener('donors-updated', handleDonorUpdate);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!formData.bloodType || !formData.units || !formData.urgency || !formData.hospitalName || !formData.contactPerson || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Units validation
    const units = parseInt(formData.units);
    if (units < 1 || units > 10) {
      toast({
        title: "Invalid Units",
        description: "Please request between 1 and 10 units.",
        variant: "destructive"
      });
      return;
    }

    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    const newRequest: BloodRequest = {
      id: Date.now().toString(),
      bloodType: formData.bloodType,
      units: parseInt(formData.units),
      urgency: formData.urgency as "low" | "medium" | "high",
      hospitalName: formData.hospitalName,
      contactPerson: formData.contactPerson,
      phone: formData.phone,
      email: formData.email || "",
      address: formData.address || "",
      patientInfo: formData.patientInfo || "",
      additionalNotes: formData.additionalNotes || "",
      requestDate: new Date().toISOString().split('T')[0],
      status: "pending",
      assignedDonors: [],
      notes: ""
    };

    const updatedRequests = [...bloodRequests, newRequest];
    setBloodRequests(updatedRequests);
    localStorage.setItem('bloodRequests', JSON.stringify(updatedRequests));

    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('blood-requests-updated'));

    toast({
      title: "Request Submitted Successfully!",
      description: `Blood request for ${formData.units} units of ${formData.bloodType} has been submitted.`,
    });
    setIsDialogOpen(false);
    
    // Reset form
    setFormData({
      bloodType: "",
      units: "",
      urgency: "",
      hospitalName: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      patientInfo: "",
      additionalNotes: ""
    });
  };

  const getUrgencyBadgeVariant = (urgency: string) => {
    switch (urgency) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge variant="secondary">Pending</Badge>;
      case "approved": return <Badge className="bg-blue-100 text-blue-800">Approved</Badge>;
      case "fulfilled": return <Badge className="bg-green-100 text-green-800">Fulfilled</Badge>;
      case "cancelled": return <Badge variant="destructive">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getBloodTypeBadge = (bloodType: string) => {
    return <Badge variant="outline" className="font-mono">{bloodType}</Badge>;
  };

  const updateRequestStatus = (requestId: string, newStatus: BloodRequest["status"]) => {
    const updatedRequests = bloodRequests.map(request => 
      request.id === requestId ? { ...request, status: newStatus } : request
    );
    setBloodRequests(updatedRequests);
    localStorage.setItem('bloodRequests', JSON.stringify(updatedRequests));
    
    toast({
      title: "Status Updated",
      description: `Request status changed to ${newStatus}.`,
    });
  };

  const assignDonor = (requestId: string, donorId: string) => {
    const updatedRequests = bloodRequests.map(request => 
      request.id === requestId 
        ? { ...request, assignedDonors: [...request.assignedDonors, donorId] }
        : request
    );
    setBloodRequests(updatedRequests);
    localStorage.setItem('bloodRequests', JSON.stringify(updatedRequests));
    
    toast({
      title: "Donor Assigned",
      description: "Donor has been assigned to this request.",
    });
  };

  const getAvailableDonors = (bloodType: string) => {
    return donors.filter(donor => 
      donor.bloodType === bloodType && 
      donor.status === "active" &&
      !donor.medicalConditions.toLowerCase().includes("hiv") &&
      !donor.medicalConditions.toLowerCase().includes("hepatitis")
    );
  };

  const filteredRequests = bloodRequests.filter(request => {
    const matchesSearch = 
      request.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.bloodType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || request.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getRequestStats = () => {
    const totalRequests = bloodRequests.length;
    const pendingRequests = bloodRequests.filter(r => r.status === "pending").length;
    const fulfilledRequests = bloodRequests.filter(r => r.status === "fulfilled").length;
    const emergencyRequests = bloodRequests.filter(r => r.urgency === "high").length;

    return { totalRequests, pendingRequests, fulfilledRequests, emergencyRequests };
  };

  const stats = getRequestStats();

  return (
    <div className="min-h-screen py-12 bg-muted/20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <LifeBuoy className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Request Blood Donation
          </h1>
          <p className="text-lg text-muted-foreground">
            Submit an urgent blood request and connect with nearby donors instantly
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalRequests}</p>
                </div>
                <div className="p-3 rounded-full bg-primary/10">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-foreground">{stats.pendingRequests}</p>
                </div>
                <div className="p-3 rounded-full bg-yellow-100">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fulfilled</p>
                  <p className="text-2xl font-bold text-foreground">{stats.fulfilledRequests}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Emergency</p>
                  <p className="text-2xl font-bold text-foreground">{stats.emergencyRequests}</p>
                </div>
                <div className="p-3 rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Request Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LifeBuoy className="mr-2 h-5 w-5 text-primary" />
                  Blood Request Form
                </CardTitle>
                <CardDescription>
                  Provide details about your blood requirement
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Blood Requirements */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Blood Requirements</h3>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bloodType">Blood Type Needed *</Label>
                        <Select value={formData.bloodType} onValueChange={(value) => setFormData({...formData, bloodType: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood type" />
                          </SelectTrigger>
                          <SelectContent>
                            {bloodTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="units">Number of Units *</Label>
                        <Input
                          id="units"
                          type="number"
                          placeholder="e.g., 2"
                          min="1"
                          max="10"
                          value={formData.units}
                          onChange={(e) => setFormData({...formData, units: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="urgency">Urgency Level *</Label>
                        <Select value={formData.urgency} onValueChange={(value) => setFormData({...formData, urgency: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select urgency" />
                          </SelectTrigger>
                          <SelectContent>
                            {urgencyLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                <div className="flex items-center">
                                  <Clock className="mr-2 h-4 w-4" />
                                  {level.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Hospital Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Hospital Information</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hospitalName">
                        <Building className="inline mr-1 h-4 w-4" />
                        Hospital/Medical Facility Name *
                      </Label>
                      <Input
                        id="hospitalName"
                        placeholder="Enter hospital name"
                        value={formData.hospitalName}
                        onChange={(e) => setFormData({...formData, hospitalName: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">
                        <MapPin className="inline mr-1 h-4 w-4" />
                        Hospital Address
                      </Label>
                      <Input
                        id="address"
                        placeholder="Full address with city and postal code"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactPerson">Contact Person *</Label>
                        <Input
                          id="contactPerson"
                          placeholder="Doctor or staff name"
                          value={formData.contactPerson}
                          onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          <Phone className="inline mr-1 h-4 w-4" />
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        <Mail className="inline mr-1 h-4 w-4" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="hospital@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Additional Information</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="patientInfo">Patient Information (Optional)</Label>
                      <Textarea
                        id="patientInfo"
                        placeholder="Patient age, condition, or any relevant medical information..."
                        value={formData.patientInfo}
                        onChange={(e) => setFormData({...formData, patientInfo: e.target.value})}
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="additionalNotes">Additional Notes</Label>
                      <Textarea
                        id="additionalNotes"
                        placeholder="Any special instructions or additional information..."
                        value={formData.additionalNotes}
                        onChange={(e) => setFormData({...formData, additionalNotes: e.target.value})}
                        rows={2}
                      />
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    <LifeBuoy className="mr-2 h-5 w-5" />
                    Submit Blood Request
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  View All Requests
                </CardTitle>
                <CardDescription>
                  Manage and track blood requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsViewRequestsOpen(true)}
                >
                  <Activity className="mr-2 h-4 w-4" />
                  View Requests ({bloodRequests.length})
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <Clock className="mx-auto h-12 w-12 text-primary" />
                  <h3 className="font-semibold">Emergency Support</h3>
                  <p className="text-sm text-muted-foreground">
                    For critical emergencies, call our 24/7 hotline
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Emergency Line
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
                  <h3 className="font-semibold text-green-800">Request Guidelines</h3>
                  <ul className="text-sm text-green-700 text-left space-y-1">
                    <li>• Provide accurate patient information</li>
                    <li>• Specify urgency level clearly</li>
                    <li>• Include hospital details</li>
                    <li>• Emergency requests prioritized</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Confirmation Dialog */}
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center">
                <LifeBuoy className="mr-2 h-5 w-5 text-primary" />
                Request Submitted Successfully!
              </AlertDialogTitle>
              <AlertDialogDescription>
                Your blood request has been sent to nearby donors. Based on urgency level{" "}
                {formData.urgency && (
                  <Badge variant={getUrgencyBadgeVariant(formData.urgency)} className="mx-1">
                    {urgencyLevels.find(l => l.value === formData.urgency)?.label}
                  </Badge>
                )}
                , donors will be notified immediately. You should receive responses within the next few hours.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleConfirm}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* View Requests Dialog */}
        <AlertDialog open={isViewRequestsOpen} onOpenChange={setIsViewRequestsOpen}>
          <AlertDialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-primary" />
                Blood Requests ({bloodRequests.length})
              </AlertDialogTitle>
              <AlertDialogDescription>
                View and manage all blood donation requests
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            {/* Search and Filter */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by hospital, contact person, or blood type..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="fulfilled">Fulfilled</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Requests Table */}
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {getBloodTypeBadge(request.bloodType)}
                        {getStatusBadge(request.status)}
                        <Badge variant={getUrgencyBadgeVariant(request.urgency)}>
                          {urgencyLevels.find(l => l.value === request.urgency)?.label}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {request.requestDate}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold">{request.hospitalName}</h4>
                        <p className="text-sm text-muted-foreground">{request.address}</p>
                        <p className="text-sm">Contact: {request.contactPerson}</p>
                        <p className="text-sm">Phone: {request.phone}</p>
                        <p className="text-sm">Email: {request.email}</p>
                      </div>
                      <div>
                        <p className="text-sm"><strong>Units:</strong> {request.units}</p>
                        <p className="text-sm"><strong>Patient:</strong> {request.patientInfo || "Not specified"}</p>
                        <p className="text-sm"><strong>Notes:</strong> {request.additionalNotes || "None"}</p>
                        <p className="text-sm"><strong>Assigned Donors:</strong> {request.assignedDonors.length}</p>
                      </div>
                    </div>

                    {/* Available Donors */}
                    {request.status === "pending" && (
                      <div className="border-t pt-4">
                        <h5 className="font-medium mb-2">Available Donors for {request.bloodType}:</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {getAvailableDonors(request.bloodType).slice(0, 4).map((donor) => (
                            <div key={donor.id} className="flex items-center justify-between p-2 border rounded">
                              <div>
                                <p className="text-sm font-medium">{donor.fullName}</p>
                                <p className="text-xs text-muted-foreground">{donor.city}</p>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => assignDonor(request.id, donor.id)}
                                disabled={request.assignedDonors.includes(donor.id)}
                              >
                                {request.assignedDonors.includes(donor.id) ? "Assigned" : "Assign"}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 border-t pt-4">
                      {request.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateRequestStatus(request.id, "approved")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateRequestStatus(request.id, "cancelled")}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {request.status === "approved" && (
                        <Button
                          size="sm"
                          onClick={() => updateRequestStatus(request.id, "fulfilled")}
                        >
                          Mark Fulfilled
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setIsViewRequestsOpen(false)}>
                Close
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default BloodRequest;