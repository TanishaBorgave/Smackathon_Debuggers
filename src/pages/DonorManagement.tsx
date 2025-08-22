import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Activity, Search, Heart, LifeBuoy, CheckCircle, Clock } from "lucide-react";

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
  const [donors, setDonors] = useState<Donor[]>([]);
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedDonors = localStorage.getItem('donors');
    const storedRequests = localStorage.getItem('bloodRequests');
    
    if (storedDonors) {
      setDonors(JSON.parse(storedDonors));
    }
    
    if (storedRequests) {
      setBloodRequests(JSON.parse(storedRequests));
    }
  }, []);

  const filteredDonors = donors.filter(donor => 
    donor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    }
  };

  const getRequestStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge variant="secondary">Pending</Badge>;
      case "approved": return <Badge className="bg-blue-100 text-blue-800">Approved</Badge>;
      case "fulfilled": return <Badge className="bg-green-100 text-green-800">Fulfilled</Badge>;
      case "cancelled": return <Badge variant="destructive">Cancelled</Badge>;
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

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Donor & Request Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive management of blood donors and donation requests
          </p>
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
                <CardTitle>Blood Donors</CardTitle>
                <CardDescription>
                  Manage and view all registered blood donors
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, or city..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Donors List */}
                <div className="space-y-4">
                  {filteredDonors.map((donor) => (
                    <Card key={donor.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold">{donor.fullName}</h4>
                            <Badge variant="outline" className="font-mono">{donor.bloodType}</Badge>
                            {getStatusBadge(donor.status)}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                            <div>Age: {donor.age} years</div>
                            <div>Weight: {donor.weight} kg</div>
                            <div>City: {donor.city}</div>
                            <div>Donations: {donor.totalDonations}</div>
                          </div>
                          <div className="text-sm text-muted-foreground mt-2">
                            <div>Phone: {donor.phone}</div>
                            <div>Email: {donor.email}</div>
                            <div>Last Active: {donor.lastActive}</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {filteredDonors.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No donors found matching your search criteria.
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
                <CardTitle>Blood Requests</CardTitle>
                <CardDescription>
                  View and manage all blood donation requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bloodRequests.map((request) => (
                    <Card key={request.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="font-mono">{request.bloodType}</Badge>
                            {getUrgencyBadge(request.urgency)}
                            {getRequestStatusBadge(request.status)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {request.requestDate}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold">{request.hospitalName}</h4>
                            <p className="text-sm text-muted-foreground">Contact: {request.contactPerson}</p>
                            <p className="text-sm"><strong>Units:</strong> {request.units}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {bloodRequests.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No blood requests found.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DonorManagement;
