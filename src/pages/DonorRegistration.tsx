import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Heart, UserCheck, Phone, Mail, MapPin, Calendar, Users, Activity, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useState, useEffect } from "react";
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

const DonorRegistration = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDonorsOpen, setIsViewDonorsOpen] = useState(false);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [formData, setFormData] = useState({
    fullName: "",
    bloodType: "",
    phone: "",
    email: "",
    city: "",
    age: "",
    weight: "",
    lastDonation: "",
    medicalConditions: "",
    agreesToTerms: false,
    agreesToNotifications: false,
    emergencyContact: "",
    emergencyPhone: "",
    preferredDonationTime: "",
    notes: ""
  });
  const { toast } = useToast();

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Load donors from localStorage on component mount
  useEffect(() => {
    const storedDonors = localStorage.getItem('donors');
    if (storedDonors) {
      setDonors(JSON.parse(storedDonors));
    } else {
      // Initialize with sample data
      const sampleDonors: Donor[] = [
        {
          id: "1",
          fullName: "John Smith",
          bloodType: "A+",
          phone: "+1 (555) 123-4567",
          email: "john.smith@email.com",
          city: "New York",
          age: 28,
          weight: 75,
          lastDonation: "2024-01-15",
          medicalConditions: "None",
          agreesToTerms: true,
          agreesToNotifications: true,
          registrationDate: "2024-01-01",
          status: "active",
          totalDonations: 5,
          lastActive: "2024-01-15",
          emergencyContact: "Jane Smith",
          emergencyPhone: "+1 (555) 987-6543",
          preferredDonationTime: "Morning",
          notes: "Regular donor, excellent health"
        },
        {
          id: "2",
          fullName: "Sarah Johnson",
          bloodType: "O-",
          phone: "+1 (555) 234-5678",
          email: "sarah.j@email.com",
          city: "Los Angeles",
          age: 32,
          weight: 65,
          lastDonation: "2024-01-20",
          medicalConditions: "None",
          agreesToTerms: true,
          agreesToNotifications: true,
          registrationDate: "2024-01-05",
          status: "active",
          totalDonations: 3,
          lastActive: "2024-01-20",
          emergencyContact: "Mike Johnson",
          emergencyPhone: "+1 (555) 876-5432",
          preferredDonationTime: "Afternoon",
          notes: "Universal donor, high demand"
        }
      ];
      setDonors(sampleDonors);
      localStorage.setItem('donors', JSON.stringify(sampleDonors));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreesToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions to continue.",
        variant: "destructive"
      });
      return;
    }

    // Enhanced validation
    if (!formData.fullName || !formData.bloodType || !formData.phone || !formData.email || !formData.city || !formData.age || !formData.weight) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Age validation
    const age = parseInt(formData.age);
    if (age < 18 || age > 65) {
      toast({
        title: "Invalid Age",
        description: "Donors must be between 18 and 65 years old.",
        variant: "destructive"
      });
      return;
    }

    // Weight validation
    const weight = parseInt(formData.weight);
    if (weight < 50) {
      toast({
        title: "Invalid Weight",
        description: "Donors must weigh at least 50 kg.",
        variant: "destructive"
      });
      return;
    }

    // Check if donor already exists
    const existingDonor = donors.find(donor => 
      donor.email === formData.email || donor.phone === formData.phone
    );

    if (existingDonor) {
      toast({
        title: "Donor Already Exists",
        description: "A donor with this email or phone number is already registered.",
        variant: "destructive"
      });
      return;
    }

    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    const newDonor: Donor = {
      id: Date.now().toString(),
      fullName: formData.fullName,
      bloodType: formData.bloodType,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      age: parseInt(formData.age),
      weight: parseInt(formData.weight),
      lastDonation: formData.lastDonation || "",
      medicalConditions: formData.medicalConditions || "",
      agreesToTerms: formData.agreesToTerms,
      agreesToNotifications: formData.agreesToNotifications,
      registrationDate: new Date().toISOString().split('T')[0],
      status: "active",
      totalDonations: 0,
      lastActive: new Date().toISOString().split('T')[0],
      emergencyContact: formData.emergencyContact || "",
      emergencyPhone: formData.emergencyPhone || "",
      preferredDonationTime: formData.preferredDonationTime || "",
      notes: formData.notes || ""
    };

    const updatedDonors = [...donors, newDonor];
    setDonors(updatedDonors);
    localStorage.setItem('donors', JSON.stringify(updatedDonors));

    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('donors-updated'));

    toast({
      title: "Registration Successful!",
      description: `Welcome ${formData.fullName}! You're now registered as a ${formData.bloodType} donor.`,
    });
    setIsDialogOpen(false);
    
    // Reset form
    setFormData({
      fullName: "",
      bloodType: "",
      phone: "",
      email: "",
      city: "",
      age: "",
      weight: "",
      lastDonation: "",
      medicalConditions: "",
      agreesToTerms: false,
      agreesToNotifications: false,
      emergencyContact: "",
      emergencyPhone: "",
      preferredDonationTime: "",
      notes: ""
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive": return <Badge variant="secondary">Inactive</Badge>;
      case "suspended": return <Badge variant="destructive">Suspended</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getBloodTypeBadge = (bloodType: string) => {
    return <Badge variant="outline" className="font-mono">{bloodType}</Badge>;
  };

  const calculateDaysSinceLastDonation = (lastDonation: string) => {
    if (!lastDonation) return "Never donated";
    const last = new Date(lastDonation);
    const today = new Date();
    const diffTime = today.getTime() - last.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days ago`;
  };

  const getDonorStats = () => {
    const totalDonors = donors.length;
    const activeDonors = donors.filter(d => d.status === "active").length;
    const totalDonations = donors.reduce((sum, d) => sum + d.totalDonations, 0);
    const recentDonors = donors.filter(d => {
      const lastActive = new Date(d.lastActive);
      const today = new Date();
      const diffDays = Math.ceil((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
    }).length;

    return { totalDonors, activeDonors, totalDonations, recentDonors };
  };

  const stats = getDonorStats();

  return (
    <div className="min-h-screen py-12 bg-muted/20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Heart className="h-8 w-8 text-primary" fill="currentColor" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Become a Life Saver
          </h1>
          <p className="text-lg text-muted-foreground">
            Join our community of blood donors and help save lives in your area
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Donors</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalDonors}</p>
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
                  <p className="text-2xl font-bold text-foreground">{stats.activeDonors}</p>
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
                  <p className="text-2xl font-bold text-foreground">{stats.totalDonations}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Recent Activity</p>
                  <p className="text-2xl font-bold text-foreground">{stats.recentDonors}</p>
                </div>
                <div className="p-3 rounded-full bg-orange-100">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Registration Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="mr-2 h-5 w-5 text-primary" />
                  Donor Registration
                </CardTitle>
                <CardDescription>
                  Please provide your information to join our donor network
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bloodType">Blood Type *</Label>
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
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age *</Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="Your age"
                          min="18"
                          max="65"
                          value={formData.age}
                          onChange={(e) => setFormData({...formData, age: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg) *</Label>
                        <Input
                          id="weight"
                          type="number"
                          placeholder="Weight in kg"
                          min="50"
                          value={formData.weight}
                          onChange={(e) => setFormData({...formData, weight: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
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
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          <Mail className="inline mr-1 h-4 w-4" />
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">
                        <MapPin className="inline mr-1 h-4 w-4" />
                        City/Location *
                      </Label>
                      <Input
                        id="city"
                        placeholder="Your city or location"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Emergency Contact</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                        <Input
                          id="emergencyContact"
                          placeholder="Emergency contact person"
                          value={formData.emergencyContact}
                          onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                        <Input
                          id="emergencyPhone"
                          type="tel"
                          placeholder="Emergency contact phone"
                          value={formData.emergencyPhone}
                          onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Medical History */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Medical History</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastDonation">
                        <Calendar className="inline mr-1 h-4 w-4" />
                        Last Blood Donation (Optional)
                      </Label>
                      <Input
                        id="lastDonation"
                        type="date"
                        value={formData.lastDonation}
                        onChange={(e) => setFormData({...formData, lastDonation: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="preferredDonationTime">Preferred Donation Time</Label>
                      <Select value={formData.preferredDonationTime} onValueChange={(value) => setFormData({...formData, preferredDonationTime: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select preferred time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning (8 AM - 12 PM)</SelectItem>
                          <SelectItem value="afternoon">Afternoon (12 PM - 4 PM)</SelectItem>
                          <SelectItem value="evening">Evening (4 PM - 8 PM)</SelectItem>
                          <SelectItem value="anytime">Anytime</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="medicalConditions">Medical Conditions (Optional)</Label>
                      <Textarea
                        id="medicalConditions"
                        placeholder="Please list any medical conditions, medications, or recent surgeries..."
                        value={formData.medicalConditions}
                        onChange={(e) => setFormData({...formData, medicalConditions: e.target.value})}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any additional information or special requirements..."
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Agreements */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.agreesToTerms}
                        onCheckedChange={(checked) => setFormData({...formData, agreesToTerms: checked === true})}
                      />
                      <Label htmlFor="terms" className="text-sm leading-relaxed">
                        I agree to the terms and conditions and understand that my information will be used to match me with blood donation requests *
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="notifications"
                        checked={formData.agreesToNotifications}
                        onCheckedChange={(checked) => setFormData({...formData, agreesToNotifications: checked === true})}
                      />
                      <Label htmlFor="notifications" className="text-sm leading-relaxed">
                        I agree to receive notifications for urgent blood requests in my area
                      </Label>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    <Heart className="mr-2 h-5 w-5" fill="currentColor" />
                    Register as Donor
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
                  View All Donors
                </CardTitle>
                <CardDescription>
                  Manage and view registered donors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsViewDonorsOpen(true)}
                >
                  <Users className="mr-2 h-4 w-4" />
                  View Donors ({donors.length})
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <Heart className="mx-auto h-12 w-12 text-primary" fill="currentColor" />
                  <h3 className="font-semibold">Why Donate?</h3>
                  <p className="text-sm text-muted-foreground">
                    Your donation can save up to 3 lives. Every 2 seconds, someone needs blood.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
                  <h3 className="font-semibold text-green-800">Eligibility</h3>
                  <ul className="text-sm text-green-700 text-left space-y-1">
                    <li>• Age 18-65 years</li>
                    <li>• Weight ≥50 kg</li>
                    <li>• Good health</li>
                    <li>• No recent surgeries</li>
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
                <Heart className="mr-2 h-5 w-5 text-primary" fill="currentColor" />
                Registration Successful!
              </AlertDialogTitle>
              <AlertDialogDescription>
                Thank you for joining LifeLink! You are now registered as a blood donor. 
                You will receive notifications when your blood type is urgently needed in your area.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleConfirm}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* View Donors Dialog */}
        <AlertDialog open={isViewDonorsOpen} onOpenChange={setIsViewDonorsOpen}>
          <AlertDialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Registered Donors ({donors.length})
              </AlertDialogTitle>
              <AlertDialogDescription>
                View and manage all registered blood donors
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4">
              {donors.map((donor) => (
                <Card key={donor.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold">{donor.fullName}</h4>
                        {getBloodTypeBadge(donor.bloodType)}
                        {getStatusBadge(donor.status)}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                        <div>Age: {donor.age} years</div>
                        <div>Weight: {donor.weight} kg</div>
                        <div>City: {donor.city}</div>
                        <div>Total Donations: {donor.totalDonations}</div>
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        <div>Phone: {donor.phone}</div>
                        <div>Email: {donor.email}</div>
                        <div>Last Donation: {calculateDaysSinceLastDonation(donor.lastDonation)}</div>
                        <div>Registered: {donor.registrationDate}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setIsViewDonorsOpen(false)}>
                Close
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default DonorRegistration;