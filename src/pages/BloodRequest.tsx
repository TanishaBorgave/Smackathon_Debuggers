import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { LifeBuoy, MapPin, Clock, Users, Phone, Mail, Building } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const BloodRequest = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  // Mock nearby donors data
  const nearbyDonors = [
    { bloodType: "A+", count: 23, distance: "2.1 km" },
    { bloodType: "A-", count: 8, distance: "3.5 km" },
    { bloodType: "O+", count: 45, distance: "1.8 km" },
    { bloodType: "O-", count: 12, distance: "4.2 km" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.bloodType || !formData.units || !formData.urgency || !formData.hospitalName || !formData.contactPerson || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    toast({
      title: "Request Submitted Successfully!",
      description: "Nearby donors have been notified. You'll receive updates shortly.",
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

  return (
    <div className="min-h-screen py-12 bg-muted/20">
      <div className="container mx-auto px-4 max-w-4xl">
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

          {/* Nearby Donors Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  Nearby Donors
                </CardTitle>
                <CardDescription>
                  Available donors in your area
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {nearbyDonors.map((donor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="font-mono">
                        {donor.bloodType}
                      </Badge>
                      <div>
                        <div className="font-medium">{donor.count} donors</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          {donor.distance} away
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
      </div>
    </div>
  );
};

export default BloodRequest;