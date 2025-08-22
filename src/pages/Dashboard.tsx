import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BloodStockCard from "@/components/BloodStockCard";
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Droplets, 
  Calendar,
  Download,
  Filter,
  Plus,
  Bell,
  CheckCircle
} from "lucide-react";

const Dashboard = () => {
  // Mock data for the dashboard
  const bloodStock = [
    { bloodType: "A+", units: 45, maxUnits: 100, urgency: "medium" as const, expirationDays: 12 },
    { bloodType: "A-", units: 20, maxUnits: 100, urgency: "high" as const, expirationDays: 8 },
    { bloodType: "B+", units: 65, maxUnits: 100, urgency: "low" as const, expirationDays: 18 },
    { bloodType: "B-", units: 15, maxUnits: 100, urgency: "high" as const, expirationDays: 5 },
    { bloodType: "AB+", units: 30, maxUnits: 100, urgency: "medium" as const, expirationDays: 10 },
    { bloodType: "AB-", units: 12, maxUnits: 100, urgency: "high" as const, expirationDays: 7 },
    { bloodType: "O+", units: 80, maxUnits: 100, urgency: "low" as const, expirationDays: 20 },
    { bloodType: "O-", units: 25, maxUnits: 100, urgency: "medium" as const, expirationDays: 14 },
  ];

  const recentRequests = [
    {
      id: "REQ-001",
      bloodType: "O-",
      units: 3,
      urgency: "high",
      hospital: "City General Hospital",
      status: "Fulfilled",
      time: "2 hours ago"
    },
    {
      id: "REQ-002", 
      bloodType: "A+",
      units: 2,
      urgency: "medium",
      hospital: "Memorial Medical Center",
      status: "In Progress",
      time: "4 hours ago"
    },
    {
      id: "REQ-003",
      bloodType: "B-",
      units: 1,
      urgency: "high",
      hospital: "Emergency Care Unit",
      status: "Pending",
      time: "6 hours ago"
    },
    {
      id: "REQ-004",
      bloodType: "AB+",
      units: 2,
      urgency: "low",
      hospital: "St. Mary's Hospital",
      status: "Fulfilled",
      time: "1 day ago"
    }
  ];

  const recentDonations = [
    {
      id: "DON-001",
      donorName: "John Smith",
      bloodType: "O+",
      units: 1,
      location: "Downtown Blood Bank",
      time: "3 hours ago"
    },
    {
      id: "DON-002",
      donorName: "Sarah Johnson",
      bloodType: "B+",
      units: 1,
      location: "City Medical Center",
      time: "5 hours ago"
    },
    {
      id: "DON-003",
      donorName: "Mike Wilson",
      bloodType: "A-",
      units: 1,
      location: "Community Health Center",
      time: "8 hours ago"
    }
  ];

  const stats = [
    {
      title: "Total Units Available",
      value: "287",
      change: "+12%",
      trend: "up",
      icon: Droplets,
      color: "text-primary"
    },
    {
      title: "Active Requests",
      value: "8",
      change: "-25%",
      trend: "down",
      icon: Activity,
      color: "text-urgency-medium"
    },
    {
      title: "Today's Donations",
      value: "24",
      change: "+18%",
      trend: "up",
      icon: Users,
      color: "text-success"
    },
    {
      title: "Low Stock Alerts",
      value: "3",
      change: "0%",
      trend: "stable",
      icon: AlertTriangle,
      color: "text-urgency-high"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Fulfilled":
        return <Badge className="bg-success text-success-foreground">Fulfilled</Badge>;
      case "In Progress":
        return <Badge variant="secondary">In Progress</Badge>;
      case "Pending":
        return <Badge variant="destructive">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{urgency}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Blood Stock Dashboard
            </h1>
            <p className="text-muted-foreground">
              Monitor blood availability, donations, and requests in real-time
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Donation
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className={`h-4 w-4 mr-1 ${stat.trend === 'up' ? 'text-success' : stat.trend === 'down' ? 'text-urgency-high' : 'text-muted-foreground'}`} />
                      <span className={`text-sm ${stat.trend === 'up' ? 'text-success' : stat.trend === 'down' ? 'text-urgency-high' : 'text-muted-foreground'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full bg-primary/10`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="stock" className="space-y-6">
          <TabsList className="grid w-full lg:w-auto grid-cols-3">
            <TabsTrigger value="stock">Blood Stock</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
          </TabsList>

          {/* Blood Stock Tab */}
          <TabsContent value="stock" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Droplets className="mr-2 h-5 w-5 text-primary" />
                  Current Blood Stock Levels
                </CardTitle>
                <CardDescription>
                  Real-time blood availability across all collection centers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {bloodStock.map((stock) => (
                    <BloodStockCard key={stock.bloodType} {...stock} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Low Stock Alerts */}
            <Card className="border-urgency-high/20 bg-urgency-high/5">
              <CardHeader>
                <CardTitle className="flex items-center text-urgency-high">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Low Stock Alerts
                </CardTitle>
                <CardDescription>
                  Blood types requiring immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bloodStock.filter(stock => stock.urgency === 'high').map((stock) => (
                    <div key={stock.bloodType} className="flex items-center justify-between p-3 border border-urgency-high/20 rounded-lg bg-background">
                      <div className="flex items-center space-x-3">
                        <Badge variant="destructive">{stock.bloodType}</Badge>
                        <div>
                          <div className="font-medium">Only {stock.units} units available</div>
                          <div className="text-sm text-muted-foreground">
                            {stock.expirationDays} days until expiry
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Bell className="mr-2 h-4 w-4" />
                        Send Alert
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-primary" />
                  Blood Requests
                </CardTitle>
                <CardDescription>
                  Recent blood requests from hospitals and medical facilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Hospital</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-mono text-sm">{request.id}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {request.bloodType}
                          </Badge>
                        </TableCell>
                        <TableCell>{request.units}</TableCell>
                        <TableCell>{getUrgencyBadge(request.urgency)}</TableCell>
                        <TableCell className="max-w-xs truncate">{request.hospital}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{request.time}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Donations Tab */}
          <TabsContent value="donations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  Recent Donations
                </CardTitle>
                <CardDescription>
                  Latest blood donations received
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donation ID</TableHead>
                      <TableHead>Donor Name</TableHead>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentDonations.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell className="font-mono text-sm">{donation.id}</TableCell>
                        <TableCell className="font-medium">{donation.donorName}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {donation.bloodType}
                          </Badge>
                        </TableCell>
                        <TableCell>{donation.units}</TableCell>
                        <TableCell className="max-w-xs truncate">{donation.location}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{donation.time}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;