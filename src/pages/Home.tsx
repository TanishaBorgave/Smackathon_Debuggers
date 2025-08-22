import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BloodStockCard from "@/components/BloodStockCard";
import { 
  Heart, 
  Users, 
  MapPin, 
  Bell, 
  UserPlus, 
  Droplets, 
  LifeBuoy,
  ArrowRight,
  Shield,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-blood-donation.jpg";

const Home = () => {
  // Mock blood stock data
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

  const stats = [
    { icon: Users, label: "Lives Saved", value: "12,547" },
    { icon: Droplets, label: "Units Donated", value: "8,932" },
    { icon: Heart, label: "Active Donors", value: "3,241" },
    { icon: Shield, label: "Partner Hospitals", value: "127" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Blood donation facility with medical professionals and donors"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/50" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Save Lives.
              <span className="text-primary block">Donate Blood.</span>
              Make a Difference.
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Connect with blood banks, hospitals, and donors in real-time. 
              Every donation can save up to three lives.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group" asChild>
                <Link to="/donate">
                  <Heart className="mr-2 h-5 w-5" fill="currentColor" />
                  Donate Blood
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" asChild>
                <Link to="/request">
                  <LifeBuoy className="mr-2 h-5 w-5" />
                  Request Blood
                </Link>
              </Button>
              
              <Button size="lg" variant="secondary" asChild>
                <Link to="/dashboard">
                  <Activity className="mr-2 h-5 w-5" />
                  Check Availability
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple steps to join our life-saving community
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <UserPlus className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">1. Register</h3>
                <p className="text-muted-foreground">
                  Sign up with your blood type and contact information. 
                  It's quick, easy, and secure.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Droplets className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">2. Donate</h3>
                <p className="text-muted-foreground">
                  Receive notifications when your blood type is needed. 
                  Visit nearby donation centers.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Heart className="h-8 w-8 text-primary" fill="currentColor" />
                </div>
                <h3 className="text-xl font-semibold mb-4">3. Save Lives</h3>
                <p className="text-muted-foreground">
                  Your donation directly helps patients in need. 
                  Track your impact and save lives.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Live Blood Stock Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Live Blood Stock Overview
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real-time availability across our network of partner hospitals and blood banks
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {bloodStock.map((stock) => (
              <BloodStockCard key={stock.bloodType} {...stock} />
            ))}
          </div>
          
          <div className="text-center">
            <Button variant="outline" size="lg" asChild>
              <Link to="/dashboard">
                <MapPin className="mr-2 h-5 w-5" />
                View Full Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Our Impact
            </h2>
            <p className="text-lg text-muted-foreground">
              Together, we're making a difference in our community
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Save Lives?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of donors who are making a difference in their communities. 
            Your donation could be the difference between life and death.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/donate">
                <Heart className="mr-2 h-5 w-5" fill="currentColor" />
                Become a Donor
              </Link>
            </Button>
            
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link to="/request">
                <Bell className="mr-2 h-5 w-5" />
                Emergency Request
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;