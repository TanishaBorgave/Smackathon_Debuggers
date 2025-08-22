import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Search, Download, AlertTriangle, Droplets, Calendar, MapPin, User, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BloodStock {
  id: string;
  bloodType: string;
  units: number;
  maxUnits: number;
  urgency: "low" | "medium" | "high";
  expirationDate: string;
  source: string;
  location: string;
  donorName?: string;
  collectionDate: string;
  status: "available" | "reserved" | "expired";
  notes?: string;
}

const Inventory = () => {
  const { toast } = useToast();
  const [bloodStock, setBloodStock] = useState<BloodStock[]>([]);
  const [filteredStock, setFilteredStock] = useState<BloodStock[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<BloodStock | null>(null);
  const [newStock, setNewStock] = useState({
    bloodType: "",
    units: 0,
    maxUnits: 100,
    urgency: "medium" as "low" | "medium" | "high",
    expirationDate: "",
    source: "",
    location: "",
    donorName: "",
    collectionDate: "",
    notes: ""
  });

  // Initialize with sample data
  useEffect(() => {
    const storedStock = localStorage.getItem('bloodStock');
    if (storedStock) {
      setBloodStock(JSON.parse(storedStock));
      setFilteredStock(JSON.parse(storedStock));
    } else {
      const sampleData: BloodStock[] = [
        {
          id: "1", bloodType: "A+", units: 45, maxUnits: 100, urgency: "medium",
          expirationDate: "2024-02-15", source: "Voluntary Donation", location: "Main Blood Bank",
          donorName: "John Smith", collectionDate: "2024-01-15", status: "available",
          notes: "Healthy donor, no complications"
        },
        {
          id: "2", bloodType: "A-", units: 20, maxUnits: 100, urgency: "high",
          expirationDate: "2024-02-08", source: "Emergency Collection", location: "Emergency Center",
          donorName: "Sarah Johnson", collectionDate: "2024-01-08", status: "available",
          notes: "Urgent need for surgery"
        },
        {
          id: "3", bloodType: "B+", units: 65, maxUnits: 100, urgency: "low",
          expirationDate: "2024-02-18", source: "Regular Donation", location: "Community Center",
          donorName: "Mike Wilson", collectionDate: "2024-01-18", status: "available",
          notes: "Regular donor, excellent health"
        },
        {
          id: "4", bloodType: "B-", units: 15, maxUnits: 100, urgency: "high",
          expirationDate: "2024-02-05", source: "Directed Donation", location: "Hospital Ward",
          donorName: "Emily Davis", collectionDate: "2024-01-05", status: "reserved",
          notes: "Reserved for patient surgery"
        },
        {
          id: "5", bloodType: "AB+", units: 30, maxUnits: 100, urgency: "medium",
          expirationDate: "2024-02-10", source: "Voluntary Donation", location: "Main Blood Bank",
          donorName: "David Brown", collectionDate: "2024-01-10", status: "available",
          notes: "Universal plasma donor"
        },
        {
          id: "6", bloodType: "AB-", units: 12, maxUnits: 100, urgency: "high",
          expirationDate: "2024-02-07", source: "Emergency Collection", location: "Emergency Center",
          donorName: "Lisa Garcia", collectionDate: "2024-01-07", status: "available",
          notes: "Rare blood type, critical"
        },
        {
          id: "7", bloodType: "O+", units: 80, maxUnits: 100, urgency: "low",
          expirationDate: "2024-02-20", source: "Regular Donation", location: "Community Center",
          donorName: "Robert Taylor", collectionDate: "2024-01-20", status: "available",
          notes: "Universal donor, high demand"
        },
        {
          id: "8", bloodType: "O-", units: 25, maxUnits: 100, urgency: "medium",
          expirationDate: "2024-02-14", source: "Voluntary Donation", location: "Main Blood Bank",
          donorName: "Jennifer Lee", collectionDate: "2024-01-14", status: "available",
          notes: "Universal donor, emergency use"
        }
      ];
      setBloodStock(sampleData);
      setFilteredStock(sampleData);
      localStorage.setItem('bloodStock', JSON.stringify(sampleData));
    }
  }, []);

  // Save to localStorage whenever bloodStock changes
  useEffect(() => {
    if (bloodStock.length > 0) {
      localStorage.setItem('bloodStock', JSON.stringify(bloodStock));
      // Dispatch custom event to notify Dashboard
      window.dispatchEvent(new CustomEvent('inventory-updated'));
    }
  }, [bloodStock]);

  // Filter stock based on search
  useEffect(() => {
    if (searchTerm) {
      const filtered = bloodStock.filter(stock =>
        stock.bloodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.source.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStock(filtered);
    } else {
      setFilteredStock(bloodStock);
    }
  }, [bloodStock, searchTerm]);

  const addNewStock = () => {
    if (!newStock.bloodType || newStock.units <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const stock: BloodStock = {
      id: Date.now().toString(),
      ...newStock,
      status: "available",
      collectionDate: newStock.collectionDate || new Date().toISOString().split('T')[0]
    };

    setBloodStock(prev => [...prev, stock]);
    setNewStock({
      bloodType: "", units: 0, maxUnits: 100, urgency: "medium",
      expirationDate: "", source: "", location: "", donorName: "", collectionDate: "", notes: ""
    });
    setIsAddDialogOpen(false);

    toast({
      title: "Success",
      description: `Added ${newStock.units} units of ${newStock.bloodType} blood to inventory.`
    });
  };

  const updateStock = () => {
    if (!editingStock) return;
    setBloodStock(prev => prev.map(stock => 
      stock.id === editingStock.id ? editingStock : stock
    ));
    setIsEditDialogOpen(false);
    setEditingStock(null);
    toast({
      title: "Success",
      description: `Updated ${editingStock.bloodType} blood stock.`
    });
  };

  const deleteStock = (id: string) => {
    const stock = bloodStock.find(s => s.id === id);
    setBloodStock(prev => prev.filter(s => s.id !== id));
    toast({
      title: "Deleted",
      description: `Removed ${stock?.bloodType} blood stock from inventory.`
    });
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "high": return <Badge variant="destructive">High</Badge>;
      case "medium": return <Badge variant="secondary">Medium</Badge>;
      case "low": return <Badge variant="outline">Low</Badge>;
      default: return <Badge variant="outline">{urgency}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available": return <Badge className="bg-success text-success-foreground">Available</Badge>;
      case "reserved": return <Badge variant="secondary">Reserved</Badge>;
      case "expired": return <Badge variant="destructive">Expired</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const calculateExpirationDays = (expirationDate: string) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExpirationStatus = (expirationDate: string) => {
    const days = calculateExpirationDays(expirationDate);
    if (days < 0) return { status: "expired", color: "text-destructive" };
    if (days <= 7) return { status: "expiring soon", color: "text-urgency-high" };
    if (days <= 14) return { status: "expiring soon", color: "text-urgency-medium" };
    return { status: "good", color: "text-success" };
  };

  const exportInventory = () => {
    const csvContent = [
      ["Blood Type", "Units", "Max Units", "Urgency", "Expiration Date", "Source", "Location", "Donor", "Collection Date", "Status", "Notes"],
      ...filteredStock.map(stock => [
        stock.bloodType, stock.units, stock.maxUnits, stock.urgency,
        stock.expirationDate, stock.source, stock.location, stock.donorName || "",
        stock.collectionDate, stock.status, stock.notes || ""
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blood-inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Exported",
      description: "Inventory data exported successfully."
    });
  };

  const totalUnits = bloodStock.reduce((sum, stock) => sum + stock.units, 0);
  const lowStockCount = bloodStock.filter(stock => stock.units < stock.maxUnits * 0.2).length;
  const expiringSoonCount = bloodStock.filter(stock => calculateExpirationDays(stock.expirationDate) <= 7).length;

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Blood Inventory Management
            </h1>
            <p className="text-muted-foreground">
              Manage blood stock levels, track donations, and monitor expiration dates
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button variant="outline" size="sm" onClick={exportInventory}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Stock
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Blood Stock</DialogTitle>
                  <DialogDescription>
                    Add new blood units to the inventory system
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type *</Label>
                    <Select value={newStock.bloodType} onValueChange={(value) => setNewStock(prev => ({ ...prev, bloodType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="units">Units *</Label>
                    <Input
                      id="units"
                      type="number"
                      min="1"
                      value={newStock.units}
                      onChange={(e) => setNewStock(prev => ({ ...prev, units: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxUnits">Max Capacity</Label>
                    <Input
                      id="maxUnits"
                      type="number"
                      min="1"
                      value={newStock.maxUnits}
                      onChange={(e) => setNewStock(prev => ({ ...prev, maxUnits: parseInt(e.target.value) || 100 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency Level</Label>
                    <Select value={newStock.urgency} onValueChange={(value: "low" | "medium" | "high") => setNewStock(prev => ({ ...prev, urgency: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expirationDate">Expiration Date *</Label>
                    <Input
                      id="expirationDate"
                      type="date"
                      value={newStock.expirationDate}
                      onChange={(e) => setNewStock(prev => ({ ...prev, expirationDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="collectionDate">Collection Date</Label>
                    <Input
                      id="collectionDate"
                      type="date"
                      value={newStock.collectionDate}
                      onChange={(e) => setNewStock(prev => ({ ...prev, collectionDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="source">Source</Label>
                    <Input
                      id="source"
                      placeholder="e.g., Voluntary Donation, Emergency Collection"
                      value={newStock.source}
                      onChange={(e) => setNewStock(prev => ({ ...prev, source: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Main Blood Bank"
                      value={newStock.location}
                      onChange={(e) => setNewStock(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="donorName">Donor Name</Label>
                    <Input
                      id="donorName"
                      placeholder="Donor's name (optional)"
                      value={newStock.donorName}
                      onChange={(e) => setNewStock(prev => ({ ...prev, donorName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      placeholder="Additional information"
                      value={newStock.notes}
                      onChange={(e) => setNewStock(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addNewStock}>
                    Add Stock
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Units</p>
                  <p className="text-2xl font-bold text-foreground">{totalUnits}</p>
                </div>
                <div className="p-3 rounded-full bg-primary/10">
                  <Droplets className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Blood Types</p>
                  <p className="text-2xl font-bold text-foreground">{bloodStock.length}</p>
                </div>
                <div className="p-3 rounded-full bg-secondary/10">
                  <Activity className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                  <p className="text-2xl font-bold text-foreground">{lowStockCount}</p>
                </div>
                <div className="p-3 rounded-full bg-urgency-high/10">
                  <AlertTriangle className="h-6 w-6 text-urgency-high" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Expiring Soon</p>
                  <p className="text-2xl font-bold text-foreground">{expiringSoonCount}</p>
                </div>
                <div className="p-3 rounded-full bg-urgency-medium/10">
                  <Calendar className="h-6 w-6 text-urgency-medium" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="sr-only">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by blood type, location, donor, or source..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Blood Stock Inventory</CardTitle>
            <CardDescription>
              {filteredStock.length} of {bloodStock.length} blood types shown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Blood Type</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Expiration</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Donor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStock.map((stock) => {
                  const expirationStatus = getExpirationStatus(stock.expirationDate);
                  const expirationDays = calculateExpirationDays(stock.expirationDate);
                  
                  return (
                    <TableRow key={stock.id}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {stock.bloodType}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{stock.units}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {stock.units}/{stock.maxUnits}
                      </TableCell>
                      <TableCell>{getUrgencyBadge(stock.urgency)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className={expirationStatus.color}>
                            {expirationDays < 0 ? "Expired" : `${expirationDays} days`}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{stock.source}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{stock.location}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {stock.donorName ? (
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{stock.donorName}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(stock.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingStock(stock)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Edit Blood Stock</DialogTitle>
                                <DialogDescription>
                                  Update blood stock information
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid grid-cols-2 gap-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-bloodType">Blood Type</Label>
                                  <Input
                                    id="edit-bloodType"
                                    value={editingStock?.bloodType || ""}
                                    disabled
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-units">Units</Label>
                                  <Input
                                    id="edit-units"
                                    type="number"
                                    min="0"
                                    value={editingStock?.units || 0}
                                    onChange={(e) => setEditingStock(prev => prev ? { ...prev, units: parseInt(e.target.value) || 0 } : null)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-maxUnits">Max Capacity</Label>
                                  <Input
                                    id="edit-maxUnits"
                                    type="number"
                                    min="1"
                                    value={editingStock?.maxUnits || 100}
                                    onChange={(e) => setEditingStock(prev => prev ? { ...prev, maxUnits: parseInt(e.target.value) || 100 } : null)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-urgency">Urgency Level</Label>
                                  <Select 
                                    value={editingStock?.urgency || "medium"} 
                                    onValueChange={(value: "low" | "medium" | "high") => setEditingStock(prev => prev ? { ...prev, urgency: value } : null)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="low">Low</SelectItem>
                                      <SelectItem value="medium">Medium</SelectItem>
                                      <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-expirationDate">Expiration Date</Label>
                                  <Input
                                    id="edit-expirationDate"
                                    type="date"
                                    value={editingStock?.expirationDate || ""}
                                    onChange={(e) => setEditingStock(prev => prev ? { ...prev, expirationDate: e.target.value } : null)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-status">Status</Label>
                                  <Select 
                                    value={editingStock?.status || "available"} 
                                    onValueChange={(value: "available" | "reserved" | "expired") => setEditingStock(prev => prev ? { ...prev, status: value } : null)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="available">Available</SelectItem>
                                      <SelectItem value="reserved">Reserved</SelectItem>
                                      <SelectItem value="expired">Expired</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <Label htmlFor="edit-notes">Notes</Label>
                                  <Input
                                    id="edit-notes"
                                    value={editingStock?.notes || ""}
                                    onChange={(e) => setEditingStock(prev => prev ? { ...prev, notes: e.target.value } : null)}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={updateStock}>
                                  Update Stock
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteStock(stock.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Inventory;
