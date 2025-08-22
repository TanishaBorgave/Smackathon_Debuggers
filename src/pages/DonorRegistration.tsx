import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Heart, UserCheck, Phone, Mail, MapPin, Calendar } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const DonorRegistration = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    agreesToNotifications: false
  });
  const { toast } = useToast();

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

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

    // Basic validation
    if (!formData.fullName || !formData.bloodType || !formData.phone || !formData.email || !formData.city) {
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
    // Here you would typically send data to your backend
    toast({
      title: "Registration Successful!",
      description: "Welcome to LifeLink! You'll receive notifications for urgent blood requests.",
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
      agreesToNotifications: false
    });
  };

  return (
    <div className="min-h-screen py-12 bg-muted/20">
      <div className="container mx-auto px-4 max-w-2xl">
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
                  <Label htmlFor="medicalConditions">Medical Conditions (Optional)</Label>
                  <Textarea
                    id="medicalConditions"
                    placeholder="Please list any medical conditions, medications, or recent surgeries..."
                    value={formData.medicalConditions}
                    onChange={(e) => setFormData({...formData, medicalConditions: e.target.value})}
                    rows={3}
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
      </div>
    </div>
  );
};

export default DonorRegistration;