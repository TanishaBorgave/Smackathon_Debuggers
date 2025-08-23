import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  CheckCircle,
  RefreshCw,
  Send,
  Settings,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  Zap,
  Eye,
  EyeOff,
  Trash2,
  Edit
} from "lucide-react";
import { useState, useEffect } from "react";
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

interface Alert {
  id: string;
  title: string;
  message: string;
  type: "low_stock" | "expiration" | "emergency" | "donor_request" | "system" | "custom";
  priority: "low" | "medium" | "high" | "critical";
  status: "active" | "sent" | "acknowledged" | "resolved";
  targetAudience: string[];
  channels: ("email" | "sms" | "push" | "dashboard")[];
  bloodType?: string;
  location?: string;
  createdAt: string;
  scheduledFor?: string;
  sentAt?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  createdBy: string;
  recipients?: string[];
  responseCount?: number;
}

interface AlertTemplate {
  id: string;
  name: string;
  title: string;
  message: string;
  type: "low_stock" | "expiration" | "emergency" | "donor_request" | "system" | "custom";
  priority: "low" | "medium" | "high" | "critical";
  targetAudience: string[];
  channels: ("email" | "sms" | "push" | "dashboard")[];
  isActive: boolean;
  variables: string[];
}

const Dashboard = () => {
  const { toast } = useToast();
  const [bloodStock, setBloodStock] = useState<BloodStock[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Alert Management State
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertTemplates, setAlertTemplates] = useState<AlertTemplate[]>([]);
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [activeTab, setActiveTab] = useState("stock");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [recentDonations, setRecentDonations] = useState([
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
  ]);
  
  // New Alert Form State
  const [newAlert, setNewAlert] = useState({
    title: "",
    message: "",
    type: "custom" as Alert["type"],
    priority: "medium" as Alert["priority"],
    targetAudience: [] as string[],
    channels: ["dashboard"] as Alert["channels"],
    bloodType: "",
    location: "",
    scheduledFor: "",
    isScheduled: false
  });

  // Load blood stock data from localStorage (shared with Inventory page)
  useEffect(() => {
    loadBloodStock();
    loadAlerts();
    loadAlertTemplates();
  }, []);

  const loadBloodStock = () => {
    const storedStock = localStorage.getItem('bloodStock');
    if (storedStock) {
      setBloodStock(JSON.parse(storedStock));
    } else {
             // Initialize with sample data if none exists - only one entry per blood type
       const sampleData: BloodStock[] = [
         { 
           id: "1", bloodType: "A+", units: 45, maxUnits: 100, urgency: "medium", 
           expirationDate: "2024-02-15", source: "Voluntary Donation", location: "Main Blood Bank",
           donorName: "John Smith", collectionDate: "2024-01-15", status: "available", notes: ""
         },
         { 
           id: "2", bloodType: "A-", units: 20, maxUnits: 100, urgency: "high", 
           expirationDate: "2024-02-08", source: "Emergency Collection", location: "Emergency Center",
           donorName: "Sarah Johnson", collectionDate: "2024-01-08", status: "available", notes: ""
         },
         { 
           id: "3", bloodType: "B+", units: 65, maxUnits: 100, urgency: "low", 
           expirationDate: "2024-02-18", source: "Regular Donation", location: "Community Center",
           donorName: "Mike Wilson", collectionDate: "2024-01-18", status: "available", notes: ""
         },
         { 
           id: "4", bloodType: "B-", units: 15, maxUnits: 100, urgency: "high", 
           expirationDate: "2024-02-05", source: "Directed Donation", location: "Hospital Ward",
           donorName: "Emily Davis", collectionDate: "2024-01-05", status: "reserved", notes: ""
         },
         { 
           id: "5", bloodType: "AB+", units: 30, maxUnits: 100, urgency: "medium", 
           expirationDate: "2024-02-10", source: "Voluntary Donation", location: "Main Blood Bank",
           donorName: "David Brown", collectionDate: "2024-01-10", status: "available", notes: ""
         },
         { 
           id: "6", bloodType: "AB-", units: 12, maxUnits: 100, urgency: "high", 
           expirationDate: "2024-02-07", source: "Emergency Collection", location: "Emergency Center",
           donorName: "Lisa Garcia", collectionDate: "2024-01-07", status: "available", notes: ""
         },
         { 
           id: "7", bloodType: "O+", units: 80, maxUnits: 100, urgency: "low", 
           expirationDate: "2024-02-20", source: "Regular Donation", location: "Community Center",
           donorName: "Robert Taylor", collectionDate: "2024-01-20", status: "available", notes: ""
         },
         { 
           id: "8", bloodType: "O-", units: 25, maxUnits: 100, urgency: "medium", 
           expirationDate: "2024-02-14", source: "Voluntary Donation", location: "Main Blood Bank",
           donorName: "Jennifer Lee", collectionDate: "2024-01-14", status: "available", notes: ""
         },
       ];
      setBloodStock(sampleData);
      localStorage.setItem('bloodStock', JSON.stringify(sampleData));
    }
  };

  const loadAlerts = () => {
    const storedAlerts = localStorage.getItem('alerts');
    if (storedAlerts) {
      setAlerts(JSON.parse(storedAlerts));
    } else {
      // Initialize with sample alerts
      const sampleAlerts: Alert[] = [
        {
          id: "ALT-001",
          title: "Low Stock Alert - A- Blood Type",
          message: "A- blood type is running critically low. Only 20 units available. Please contact eligible donors immediately.",
          type: "low_stock",
          priority: "high",
          status: "active",
          targetAudience: ["donors", "hospitals", "staff"],
          channels: ["email", "sms", "dashboard"],
          bloodType: "A-",
          location: "Main Blood Bank",
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          createdBy: "System",
          recipients: ["donors@bloodbank.com", "hospitals@bloodbank.com"],
          responseCount: 5
        },
        {
          id: "ALT-002",
          title: "Emergency Blood Request",
          message: "URGENT: Multiple trauma patients require O- blood. Need 10 units immediately.",
          type: "emergency",
          priority: "critical",
          status: "sent",
          targetAudience: ["donors", "hospitals", "emergency_services"],
          channels: ["email", "sms", "push", "dashboard"],
          bloodType: "O-",
          location: "Emergency Center",
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          sentAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          createdBy: "Emergency Coordinator",
          recipients: ["emergency@bloodbank.com"],
          responseCount: 12
        }
      ];
      setAlerts(sampleAlerts);
      localStorage.setItem('alerts', JSON.stringify(sampleAlerts));
    }
  };

  const loadAlertTemplates = () => {
    const storedTemplates = localStorage.getItem('alertTemplates');
    if (storedTemplates) {
      setAlertTemplates(JSON.parse(storedTemplates));
    } else {
      // Initialize with sample templates
      const sampleTemplates: AlertTemplate[] = [
        {
          id: "TPL-001",
          name: "Low Stock Alert",
          title: "Low Stock Alert - {bloodType} Blood Type",
          message: "{bloodType} blood type is running low. Only {units} units available. Please contact eligible donors.",
          type: "low_stock",
          priority: "high",
          targetAudience: ["donors", "hospitals"],
          channels: ["email", "sms", "dashboard"],
          isActive: true,
          variables: ["{bloodType}", "{units}"]
        },
        {
          id: "TPL-002",
          name: "Emergency Request",
          title: "Emergency Blood Request - {bloodType}",
          message: "URGENT: Emergency patients require {bloodType} blood. Need {units} units immediately.",
          type: "emergency",
          priority: "critical",
          targetAudience: ["donors", "emergency_services"],
          channels: ["email", "sms", "push", "dashboard"],
          isActive: true,
          variables: ["{bloodType}", "{units}"]
        },
        {
          id: "TPL-003",
          name: "Expiration Warning",
          title: "Blood Expiration Warning - {bloodType}",
          message: "{bloodType} blood units will expire in {days} days. Please use or transfer to prevent waste.",
          type: "expiration",
          priority: "medium",
          targetAudience: ["hospitals", "staff"],
          channels: ["email", "dashboard"],
          isActive: true,
          variables: ["{bloodType}", "{days}"]
        }
      ];
      setAlertTemplates(sampleTemplates);
      localStorage.setItem('alertTemplates', JSON.stringify(sampleTemplates));
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    loadBloodStock();
    loadAlerts();
    setLastUpdated(new Date());
    setIsRefreshing(false);
    toast({
      title: "Refreshed",
      description: "Dashboard data updated successfully."
    });
  };

  // Alert Management Functions
  const createAlert = () => {
    const alert: Alert = {
      id: `ALT-${Date.now()}`,
      title: newAlert.title,
      message: newAlert.message,
      type: newAlert.type,
      priority: newAlert.priority,
      status: newAlert.isScheduled ? "active" : "sent",
      targetAudience: newAlert.targetAudience,
      channels: newAlert.channels,
      bloodType: newAlert.bloodType || undefined,
      location: newAlert.location || undefined,
      createdAt: new Date().toISOString(),
      scheduledFor: newAlert.isScheduled ? newAlert.scheduledFor : undefined,
      sentAt: newAlert.isScheduled ? undefined : new Date().toISOString(),
      createdBy: "Current User",
      recipients: [],
      responseCount: 0
    };

    const updatedAlerts = [...alerts, alert];
    setAlerts(updatedAlerts);
    localStorage.setItem('alerts', JSON.stringify(updatedAlerts));
    window.dispatchEvent(new CustomEvent('alerts-updated'));
    
    setShowCreateAlert(false);
    setNewAlert({
      title: "",
      message: "",
      type: "custom",
      priority: "medium",
      targetAudience: [],
      channels: ["dashboard"],
      bloodType: "",
      location: "",
      scheduledFor: "",
      isScheduled: false
    });

    toast({
      title: "Alert Created",
      description: newAlert.isScheduled ? "Alert scheduled successfully." : "Alert sent successfully."
    });
  };

  const sendAlert = (alert: Alert) => {
    // Remove the alert from the list after sending
    const updatedAlerts = alerts.filter(a => a.id !== alert.id);
    setAlerts(updatedAlerts);
    localStorage.setItem('alerts', JSON.stringify(updatedAlerts));
    window.dispatchEvent(new CustomEvent('alerts-updated'));
    
    toast({
      title: "Alert Sent & Removed",
      description: `Alert "${alert.title}" has been sent to ${alert.targetAudience.length} audience groups and removed from the list.`
    });
  };

  const acknowledgeAlert = (alert: Alert) => {
    const updatedAlerts = alerts.map(a => 
      a.id === alert.id 
        ? { ...a, status: "acknowledged" as const, acknowledgedAt: new Date().toISOString() } as Alert
        : a
    );
    setAlerts(updatedAlerts);
    localStorage.setItem('alerts', JSON.stringify(updatedAlerts));
    window.dispatchEvent(new CustomEvent('alerts-updated'));
    
    toast({
      title: "Alert Acknowledged",
      description: `Alert "${alert.title}" has been acknowledged.`
    });
  };

  const resolveAlert = (alert: Alert) => {
    const updatedAlerts = alerts.map(a => 
      a.id === alert.id 
        ? { ...a, status: "resolved" as const, resolvedAt: new Date().toISOString() } as Alert
        : a
    );
    setAlerts(updatedAlerts);
    localStorage.setItem('alerts', JSON.stringify(updatedAlerts));
    window.dispatchEvent(new CustomEvent('alerts-updated'));
    
    toast({
      title: "Alert Resolved",
      description: `Alert "${alert.title}" has been marked as resolved.`
    });
  };

  const deleteAlert = (alertId: string) => {
    const updatedAlerts = alerts.filter(a => a.id !== alertId);
    setAlerts(updatedAlerts);
    localStorage.setItem('alerts', JSON.stringify(updatedAlerts));
    window.dispatchEvent(new CustomEvent('alerts-updated'));
    
    toast({
      title: "Alert Deleted",
      description: "Alert has been deleted successfully."
    });
  };

  const getPriorityColor = (priority: Alert["priority"]) => {
    switch (priority) {
      case "critical": return "text-red-600 bg-red-50 border-red-200";
      case "high": return "text-orange-600 bg-orange-50 border-orange-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low": return "text-blue-600 bg-blue-50 border-blue-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusColor = (status: Alert["status"]) => {
    switch (status) {
      case "active": return "text-blue-600 bg-blue-50 border-blue-200";
      case "sent": return "text-green-600 bg-green-50 border-green-200";
      case "acknowledged": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "resolved": return "text-gray-600 bg-gray-50 border-gray-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  // Auto-generate low stock alerts
  const createLowStockAlert = (stock: BloodStock) => {
    const alert: Alert = {
      id: `ALT-${Date.now()}`,
      title: `Low Stock Alert - ${stock.bloodType} Blood Type`,
      message: `${stock.bloodType} blood type is running critically low. Only ${stock.units} units available out of ${stock.maxUnits}. Please contact eligible donors immediately to replenish stock.`,
      type: "low_stock",
      priority: stock.units < stock.maxUnits * 0.1 ? "critical" : "high",
      status: "sent",
      targetAudience: ["donors", "hospitals", "staff"],
      channels: ["email", "sms", "dashboard"],
      bloodType: stock.bloodType,
      location: stock.location,
      createdAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
      createdBy: "System Auto-Alert",
      recipients: [`${stock.bloodType.toLowerCase()}-donors@bloodbank.com`, "hospitals@bloodbank.com"],
      responseCount: 0
    };

    // Send the alert and remove it immediately (no need to store it)
    toast({
      title: "Low Stock Alert Sent",
      description: `Alert for ${stock.bloodType} blood type has been sent to all relevant parties.`
    });
  };

  // Auto-generate alerts for critically low stock
  useEffect(() => {
    const criticallyLowStock = bloodStock.filter(stock => 
      stock.units < stock.maxUnits * 0.1 && stock.status === "available"
    );
    
    criticallyLowStock.forEach(stock => {
      // Check if we already have a recent alert for this blood type
      const recentAlert = alerts.find(alert => 
        alert.type === "low_stock" && 
        alert.bloodType === stock.bloodType &&
        new Date(alert.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000 // Within last 24 hours
      );
      
      if (!recentAlert) {
        // Auto-create critical alert
        const alert: Alert = {
          id: `ALT-AUTO-${Date.now()}-${stock.bloodType}`,
          title: `CRITICAL: ${stock.bloodType} Blood Stock Emergency`,
          message: `URGENT: ${stock.bloodType} blood type has reached critically low levels with only ${stock.units} units remaining. Immediate action required to prevent stock-out.`,
          type: "low_stock",
          priority: "critical",
          status: "active",
          targetAudience: ["donors", "hospitals", "staff", "emergency_services"],
          channels: ["email", "sms", "push", "dashboard"],
          bloodType: stock.bloodType,
          location: stock.location,
          createdAt: new Date().toISOString(),
          createdBy: "Auto-Alert System",
          recipients: [],
          responseCount: 0
        };

        const updatedAlerts = [alert, ...alerts];
        setAlerts(updatedAlerts);
        localStorage.setItem('alerts', JSON.stringify(updatedAlerts));
      }
    });
  }, [bloodStock, alerts]);

  // Export data functionality
  const exportData = () => {
    const exportData = {
      bloodStock,
      alerts,
      recentRequests,
      recentDonations,
      exportDate: new Date().toISOString(),
      stats
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `blood-bank-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Data Exported",
      description: "Dashboard data has been exported successfully."
    });
  };

  // Add donation functionality
  const [showAddDonationDialog, setShowAddDonationDialog] = useState(false);
  const [newDonation, setNewDonation] = useState({
    bloodType: "",
    units: 1,
    donorName: "",
    location: "",
    collectionDate: "",
    notes: ""
  });

  const handleAddDonation = () => {
    if (!newDonation.bloodType || !newDonation.donorName || !newDonation.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const donation: BloodStock = {
      id: `BLD-${Date.now()}`,
      bloodType: newDonation.bloodType,
      units: newDonation.units,
      maxUnits: 100,
      urgency: "low" as const,
      expirationDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 42 days from now
      source: "New Donation",
      location: newDonation.location,
      donorName: newDonation.donorName,
      collectionDate: newDonation.collectionDate || new Date().toISOString().split('T')[0],
      status: "available" as const,
      notes: newDonation.notes
    };

    const updatedStock = [...bloodStock, donation];
    setBloodStock(updatedStock);
    localStorage.setItem('bloodStock', JSON.stringify(updatedStock));
    
    // Reset form
    setNewDonation({
      bloodType: "",
      units: 1,
      donorName: "",
      location: "",
      collectionDate: "",
      notes: ""
    });
    setShowAddDonationDialog(false);
    
    toast({
      title: "Donation Added",
      description: `${newDonation.units} unit(s) of ${newDonation.bloodType} blood has been added to inventory.`
    });
  };

  // View request details
  const [showRequestDetailsDialog, setShowRequestDetailsDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const viewRequestDetails = (request: any) => {
    setSelectedRequest(request);
    setShowRequestDetailsDialog(true);
  };

  // Use alert template
  const useTemplate = (template: AlertTemplate) => {
    setNewAlert({
      title: template.title,
      message: template.message,
      type: template.type,
      priority: template.priority,
      targetAudience: template.targetAudience,
      channels: template.channels,
      bloodType: "",
      location: "",
      scheduledFor: "",
      isScheduled: false
    });
    setShowCreateAlert(true);
    
    toast({
      title: "Template Loaded",
      description: `Template "${template.name}" has been loaded into the alert form.`
    });
  };

  // Disapprove donation (remove from list without adding to inventory)
  const disapproveDonation = (donation: any) => {
    // Remove the donation from the recent donations list
    const updatedRecentDonations = recentDonations.filter(d => d.id !== donation.id);
    setRecentDonations(updatedRecentDonations);
    
    toast({
      title: "Donation Disapproved",
      description: `Donation from ${donation.donorName} has been disapproved and removed from the list.`
    });
  };

  // Approve donation
  const approveDonation = (donation: any) => {
    // Update the blood stock with the approved donation
    const newStock: BloodStock = {
      id: `BLD-${Date.now()}`,
      bloodType: donation.bloodType,
      units: donation.units,
      maxUnits: 100,
      urgency: "low" as const,
      expirationDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 42 days from now
      source: "Approved Donation",
      location: donation.location,
      donorName: donation.donorName,
      collectionDate: new Date().toISOString().split('T')[0],
      status: "available" as const,
      notes: `Approved donation from ${donation.donorName}`
    };

    // Add to blood stock
    const currentStock = JSON.parse(localStorage.getItem('bloodStock') || '[]');
    const updatedStock = [...currentStock, newStock];
    localStorage.setItem('bloodStock', JSON.stringify(updatedStock));
    
    // Remove the donation from the recent donations list
    const updatedRecentDonations = recentDonations.filter(d => d.id !== donation.id);
    setRecentDonations(updatedRecentDonations);
    
    // Trigger real-time update
    window.dispatchEvent(new CustomEvent('inventory-updated'));
    loadBloodStock();
    
    toast({
      title: "Donation Approved & Removed",
      description: `${donation.units} unit(s) of ${donation.bloodType} blood from ${donation.donorName} has been approved, added to inventory, and removed from the donations list.`
    });
  };

  // Listen for changes in localStorage (when Inventory page updates data)
  useEffect(() => {
    const handleStorageChange = () => {
      loadBloodStock();
      loadAlerts();
    };

    // Custom event for real-time updates
    const handleInventoryUpdate = () => {
      loadBloodStock();
      setLastUpdated(new Date());
      toast({
        title: "Inventory Updated",
        description: "Blood stock data has been updated in real-time."
      });
    };

    const handleDonorsUpdate = () => {
      toast({
        title: "Donors Updated",
        description: "Donor information has been updated."
      });
    };

    const handleRequestsUpdate = () => {
      toast({
        title: "Requests Updated", 
        description: "Blood request information has been updated."
      });
    };

    const handleAlertsUpdate = () => {
      loadAlerts();
      setLastUpdated(new Date());
      toast({
        title: "Alerts Updated",
        description: "Alert system has been updated."
      });
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('inventory-updated', handleInventoryUpdate);
    window.addEventListener('donors-updated', handleDonorsUpdate);
    window.addEventListener('blood-requests-updated', handleRequestsUpdate);
    window.addEventListener('alerts-updated', handleAlertsUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('inventory-updated', handleInventoryUpdate);
      window.removeEventListener('donors-updated', handleDonorsUpdate);
      window.removeEventListener('blood-requests-updated', handleRequestsUpdate);
      window.removeEventListener('alerts-updated', handleAlertsUpdate);
    };
  }, []);

  // Mock data for the dashboard
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



  const stats = [
    {
      title: "Total Units Available",
      value: bloodStock.reduce((sum, stock) => sum + stock.units, 0).toString(),
      change: "+12%",
      trend: "up",
      icon: Droplets,
      color: "text-primary",
      description: "Across all blood types"
    },
    {
      title: "Active Alerts",
      value: alerts.filter(alert => alert.status === "active" || alert.status === "sent").length.toString(),
      change: alerts.filter(alert => alert.priority === "critical").length > 0 ? "+200%" : "0%",
      trend: alerts.filter(alert => alert.priority === "critical").length > 0 ? "up" : "stable",
      icon: Bell,
      color: "text-urgency-medium",
      description: `${alerts.filter(alert => alert.priority === "critical").length} critical`
    },
    {
      title: "Registered Donors", 
      value: "847",
      change: "+18%",
      trend: "up",
      icon: Users,
      color: "text-success",
      description: "Ready to donate"
    },
    {
      title: "Low Stock Alerts",
      value: bloodStock.filter(stock => stock.units < stock.maxUnits * 0.2).length.toString(),
      change: bloodStock.filter(stock => stock.units < stock.maxUnits * 0.1).length > 0 ? "+100%" : "0%",
      trend: bloodStock.filter(stock => stock.units < stock.maxUnits * 0.1).length > 0 ? "up" : "stable",
      icon: AlertTriangle,
      color: "text-urgency-high",
      description: `${bloodStock.filter(stock => stock.units < stock.maxUnits * 0.1).length} critical`
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
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button variant="outline" size="sm" onClick={refreshData} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setActiveTab("alerts")}>
              <Filter className="mr-2 h-4 w-4" />
              View Alerts
            </Button>
            <Button variant="outline" size="sm" onClick={exportData}>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Dialog open={showAddDonationDialog} onOpenChange={setShowAddDonationDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Donation
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Donation</DialogTitle>
                  <DialogDescription>
                    Add a new blood donation to the inventory.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="donation-blood-type">Blood Type</Label>
                      <Select value={newDonation.bloodType} onValueChange={(value) => setNewDonation({...newDonation, bloodType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood type" />
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
                      <Label htmlFor="donation-units">Units</Label>
                      <Input
                        id="donation-units"
                        type="number"
                        min="1"
                        max="10"
                        value={newDonation.units}
                        onChange={(e) => setNewDonation({...newDonation, units: parseInt(e.target.value) || 1})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="donation-donor">Donor Name</Label>
                    <Input
                      id="donation-donor"
                      value={newDonation.donorName}
                      onChange={(e) => setNewDonation({...newDonation, donorName: e.target.value})}
                      placeholder="Enter donor name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="donation-location">Location</Label>
                    <Input
                      id="donation-location"
                      value={newDonation.location}
                      onChange={(e) => setNewDonation({...newDonation, location: e.target.value})}
                      placeholder="Enter collection location"
                    />
                  </div>
                  <div>
                    <Label htmlFor="donation-date">Collection Date</Label>
                    <Input
                      id="donation-date"
                      type="date"
                      value={newDonation.collectionDate}
                      onChange={(e) => setNewDonation({...newDonation, collectionDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="donation-notes">Notes (Optional)</Label>
                    <Textarea
                      id="donation-notes"
                      value={newDonation.notes}
                      onChange={(e) => setNewDonation({...newDonation, notes: e.target.value})}
                      placeholder="Additional notes about the donation"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddDonationDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddDonation}>
                    Add Donation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
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
        <Tabs defaultValue="stock" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full lg:w-auto grid-cols-4">
            <TabsTrigger value="stock">Blood Stock</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
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
                    <div key={stock.bloodType} className="p-4 border rounded-lg bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="font-mono">
                          {stock.bloodType}
                        </Badge>
                        {getUrgencyBadge(stock.urgency)}
                      </div>
                      <div className="text-2xl font-bold">{stock.units}</div>
                      <div className="text-sm text-muted-foreground">
                        of {stock.maxUnits} units
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              stock.units < stock.maxUnits * 0.2 ? 'bg-urgency-high' :
                              stock.units < stock.maxUnits * 0.5 ? 'bg-urgency-medium' : 'bg-success'
                            }`}
                            style={{ width: `${(stock.units / stock.maxUnits) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
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
                  {bloodStock.filter(stock => stock.units < stock.maxUnits * 0.2).map((stock) => (
                    <div key={stock.bloodType} className="flex items-center justify-between p-3 border border-urgency-high/20 rounded-lg bg-background">
                      <div className="flex items-center space-x-3">
                        <Badge variant="destructive">{stock.bloodType}</Badge>
                        <div>
                          <div className="font-medium">Only {stock.units} units available</div>
                          <div className="text-sm text-muted-foreground">
                            {stock.maxUnits - stock.units} units needed
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => createLowStockAlert(stock)}
                      >
                        <Bell className="mr-2 h-4 w-4" />
                        Send Alert
                      </Button>
                    </div>
                  ))}
                  {bloodStock.filter(stock => stock.units < stock.maxUnits * 0.2).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success" />
                      <p>All blood types have adequate stock levels!</p>
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
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => viewRequestDetails(request)}
                          >
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
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => approveDonation(donation)}
                            >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => disapproveDonation(donation)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Disapprove
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {recentDonations.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4" />
                    <p>No pending donations to approve.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            {/* Alert Management Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Alert Management</h2>
                <p className="text-muted-foreground">Create, manage, and monitor system alerts</p>
              </div>
              <div className="flex items-center space-x-3">
                <Dialog open={showCreateAlert} onOpenChange={setShowCreateAlert}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Alert
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Alert</DialogTitle>
                      <DialogDescription>
                        Create a new alert to notify relevant parties about important events.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="alert-title">Title</Label>
                          <Input
                            id="alert-title"
                            value={newAlert.title}
                            onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
                            placeholder="Alert title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="alert-type">Type</Label>
                          <Select value={newAlert.type} onValueChange={(value) => setNewAlert({...newAlert, type: value as Alert["type"]})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low_stock">Low Stock</SelectItem>
                              <SelectItem value="expiration">Expiration</SelectItem>
                              <SelectItem value="emergency">Emergency</SelectItem>
                              <SelectItem value="donor_request">Donor Request</SelectItem>
                              <SelectItem value="system">System</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="alert-priority">Priority</Label>
                          <Select value={newAlert.priority} onValueChange={(value) => setNewAlert({...newAlert, priority: value as Alert["priority"]})}>
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
                        <div>
                          <Label htmlFor="alert-blood-type">Blood Type (Optional)</Label>
                          <Select value={newAlert.bloodType} onValueChange={(value) => setNewAlert({...newAlert, bloodType: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select blood type" />
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
                      <div>
                        <Label htmlFor="alert-message">Message</Label>
                        <Textarea
                          id="alert-message"
                          value={newAlert.message}
                          onChange={(e) => setNewAlert({...newAlert, message: e.target.value})}
                          placeholder="Alert message"
                          rows={4}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="alert-channels">Channels</Label>
                          <div className="space-y-2">
                            {["email", "sms", "push", "dashboard"].map((channel) => (
                              <div key={channel} className="flex items-center space-x-2">
                                <Switch
                                  id={`channel-${channel}`}
                                  checked={newAlert.channels.includes(channel as any)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setNewAlert({...newAlert, channels: [...newAlert.channels, channel as any]});
                                    } else {
                                      setNewAlert({...newAlert, channels: newAlert.channels.filter(c => c !== channel)});
                                    }
                                  }}
                                />
                                <Label htmlFor={`channel-${channel}`} className="capitalize">{channel}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="alert-audience">Target Audience</Label>
                          <div className="space-y-2">
                            {["donors", "hospitals", "staff", "emergency_services"].map((audience) => (
                              <div key={audience} className="flex items-center space-x-2">
                                <Switch
                                  id={`audience-${audience}`}
                                  checked={newAlert.targetAudience.includes(audience)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setNewAlert({...newAlert, targetAudience: [...newAlert.targetAudience, audience]});
                                    } else {
                                      setNewAlert({...newAlert, targetAudience: newAlert.targetAudience.filter(a => a !== audience)});
                                    }
                                  }}
                                />
                                <Label htmlFor={`audience-${audience}`} className="capitalize">{audience.replace('_', ' ')}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="schedule-alert"
                          checked={newAlert.isScheduled}
                          onCheckedChange={(checked) => setNewAlert({...newAlert, isScheduled: checked})}
                        />
                        <Label htmlFor="schedule-alert">Schedule for later</Label>
                      </div>
                      {newAlert.isScheduled && (
                        <div>
                          <Label htmlFor="alert-schedule">Schedule Date & Time</Label>
                          <Input
                            id="alert-schedule"
                            type="datetime-local"
                            value={newAlert.scheduledFor}
                            onChange={(e) => setNewAlert({...newAlert, scheduledFor: e.target.value})}
                          />
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowCreateAlert(false)}>
                        Cancel
                      </Button>
                      <Button onClick={createAlert} disabled={!newAlert.title || !newAlert.message}>
                        {newAlert.isScheduled ? 'Schedule Alert' : 'Send Alert'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

              </div>
            </div>

            {/* Active Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5 text-primary" />
                  Active Alerts
                </CardTitle>
                <CardDescription>
                  Currently active and pending alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.filter(alert => alert.status === "active" || alert.status === "sent").map((alert) => (
                    <div key={alert.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{alert.title}</h3>
                            <Badge className={getPriorityColor(alert.priority)}>
                              {alert.priority}
                            </Badge>
                            <Badge className={getStatusColor(alert.status)}>
                              {alert.status}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-2">{alert.message}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Type: {alert.type.replace('_', ' ')}</span>
                            {alert.bloodType && <span>Blood Type: {alert.bloodType}</span>}
                            <span>Created: {new Date(alert.createdAt).toLocaleString()}</span>
                            {alert.sentAt && <span>Sent: {new Date(alert.sentAt).toLocaleString()}</span>}
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <div className="flex items-center space-x-1">
                              <Mail className="h-4 w-4" />
                              <span className="text-sm">{alert.channels.join(', ')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span className="text-sm">{alert.targetAudience.join(', ')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {alert.status === "active" && (
                            <Button size="sm" onClick={() => sendAlert(alert)}>
                              <Send className="mr-2 h-4 w-4" />
                              Send
                            </Button>
                          )}
                          {alert.status === "sent" && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => acknowledgeAlert(alert)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Acknowledge
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => resolveAlert(alert)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Resolve
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="outline" onClick={() => deleteAlert(alert.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {alerts.filter(alert => alert.status === "active" || alert.status === "sent").length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="h-12 w-12 mx-auto mb-4" />
                      <p>No active alerts</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Alert Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5 text-primary" />
                  Alert Templates
                </CardTitle>
                <CardDescription>
                  Pre-configured alert templates for quick creation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {alertTemplates.map((template) => (
                    <div key={template.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">{template.title}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline">{template.type.replace('_', ' ')}</Badge>
                            <Badge className={getPriorityColor(template.priority)}>
                              {template.priority}
                            </Badge>
                            <Badge variant={template.isActive ? "default" : "secondary"}>
                              {template.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => useTemplate(template)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Use Template
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Request Details Dialog */}
        <Dialog open={showRequestDetailsDialog} onOpenChange={setShowRequestDetailsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Request Details</DialogTitle>
              <DialogDescription>
                Detailed information about the blood request
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Request ID</Label>
                    <p className="text-sm font-mono bg-muted p-2 rounded">{selectedRequest.id}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Blood Type</Label>
                    <Badge variant="outline" className="font-mono mt-1">
                      {selectedRequest.bloodType}
                    </Badge>
                  </div>
                  <div>
                    <Label>Units Required</Label>
                    <p className="text-sm mt-1">{selectedRequest.units} units</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Urgency</Label>
                    <div className="mt-1">{getUrgencyBadge(selectedRequest.urgency)}</div>
                  </div>
                  <div>
                    <Label>Request Time</Label>
                    <p className="text-sm mt-1">{selectedRequest.time}</p>
                  </div>
                </div>
                <div>
                  <Label>Hospital</Label>
                  <p className="text-sm mt-1">{selectedRequest.hospital}</p>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Additional Information</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>Request ID:</strong> {selectedRequest.id}</p>
                    <p><strong>Blood Type:</strong> {selectedRequest.bloodType}</p>
                    <p><strong>Units:</strong> {selectedRequest.units}</p>
                    <p><strong>Urgency:</strong> {selectedRequest.urgency}</p>
                    <p><strong>Hospital:</strong> {selectedRequest.hospital}</p>
                    <p><strong>Status:</strong> {selectedRequest.status}</p>
                    <p><strong>Time:</strong> {selectedRequest.time}</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRequestDetailsDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
