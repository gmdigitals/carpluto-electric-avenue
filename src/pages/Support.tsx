import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  HelpCircle, 
  Book, 
  Video, 
  Download,
  CheckCircle2,
  Users,
  Wrench
} from 'lucide-react';

const Support = () => {
  const contactMethods = [
    {
      icon: <MessageCircle className="h-8 w-8 text-primary" />,
      title: "Live Chat",
      description: "Get instant help from our EV specialists",
      availability: "24/7 Available",
      action: "Start Chat",
      preferred: true
    },
    {
      icon: <Phone className="h-8 w-8 text-primary" />,
      title: "Phone Support",
      description: "Speak directly with our technical team",
      availability: "Mon-Sat 8AM-8PM",
      action: "Call +234-800-CARPLUTO"
    },
    {
      icon: <Mail className="h-8 w-8 text-primary" />,
      title: "Email Support",
      description: "Send detailed questions and get comprehensive answers",
      availability: "Response within 2 hours",
      action: "Send Email"
    }
  ];

  const faqCategories = [
    {
      title: "Getting Started",
      icon: <HelpCircle className="h-5 w-5" />,
      questions: [
        "How do I charge my electric vehicle?",
        "What's the difference between Level 1, 2, and 3 charging?",
        "How far can I drive on a single charge?",
        "What maintenance does an EV require?"
      ]
    },
    {
      title: "Purchasing & Financing",
      icon: <CheckCircle2 className="h-5 w-5" />,
      questions: [
        "What financing options are available?",
        "Can I trade in my current vehicle?",
        "What's included in the warranty?",
        "Are there government incentives for EV purchases?"
      ]
    },
    {
      title: "Technical Support",
      icon: <Wrench className="h-5 w-5" />,
      questions: [
        "My vehicle won't charge, what should I do?",
        "How do I update my vehicle's software?",
        "What should I do if I have a flat tire?",
        "How do I schedule a service appointment?"
      ]
    }
  ];

  const resources = [
    {
      icon: <Book className="h-6 w-6 text-primary" />,
      title: "Owner's Manual",
      description: "Complete guide to your electric vehicle",
      action: "Download PDF"
    },
    {
      icon: <Video className="h-6 w-6 text-primary" />,
      title: "Video Tutorials",
      description: "Step-by-step visual guides for common tasks",
      action: "Watch Videos"
    },
    {
      icon: <Download className="h-6 w-6 text-primary" />,
      title: "Mobile App",
      description: "Control and monitor your EV from your phone",
      action: "Download App"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        {/* Hero Section */}
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              EV Support <span className="text-primary">Center</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get expert help and support for your electric vehicle journey. Our dedicated team 
              is here to assist you 24/7 with any questions or concerns.
            </p>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="container mx-auto px-6 py-16 bg-muted/30">
          <h2 className="text-3xl font-bold text-center mb-12">How Can We Help You?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <Card key={index} className={`text-center h-full ${method.preferred ? 'border-primary ring-2 ring-primary/20' : ''}`}>
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    {method.icon}
                  </div>
                  <CardTitle className="text-xl">{method.title}</CardTitle>
                  <CardDescription>{method.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {method.availability}
                    </div>
                    <Button className={`w-full ${method.preferred ? '' : 'variant-outline'}`}>
                      {method.action}
                    </Button>
                    {method.preferred && (
                      <div className="text-xs text-primary font-medium">Recommended</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="container mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {faqCategories.map((category, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {category.icon}
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.questions.map((question, idx) => (
                      <div key={idx} className="border-l-2 border-muted pl-4 py-2">
                        <p className="text-sm font-medium hover:text-primary cursor-pointer transition-colors">
                          {question}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All in {category.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Resources Section */}
        <div className="container mx-auto px-6 py-16 bg-muted/30">
          <h2 className="text-3xl font-bold text-center mb-12">Helpful Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <Card key={index} className="text-center h-full">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    {resource.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{resource.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{resource.description}</p>
                  <Button variant="outline" className="w-full">
                    {resource.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Send Us a Message</CardTitle>
                <CardDescription className="text-center">
                  Can't find what you're looking for? Send us a detailed message and we'll get back to you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Enter your first name" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Enter your last name" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="billing">Billing & Payments</SelectItem>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Describe your question or issue in detail..."
                      rows={5}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Emergency Support */}
        <div className="container mx-auto px-6 py-16 bg-red-50 dark:bg-red-950/20 rounded-lg mx-6 mb-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-900 dark:text-red-100">Emergency Roadside Assistance</h2>
            <p className="text-red-700 dark:text-red-200 mb-6">
              Need immediate help on the road? Our 24/7 emergency assistance is just a call away.
            </p>
            <Button size="lg" className="bg-red-600 hover:bg-red-700">
              <Phone className="h-5 w-5 mr-2" />
              Call Emergency: +234-911-CARPLUTO
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Support;