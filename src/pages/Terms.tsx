import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        {/* Header */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
              <p className="text-xl text-muted-foreground">
                Last updated: January 2025
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="space-y-8">
              
              <Card>
                <CardHeader>
                  <CardTitle>1. Acceptance of Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    By accessing and using CarPluto's services, you accept and agree to be bound by these Terms of Service. 
                    If you do not agree to these terms, please do not use our services.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>2. Service Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    CarPluto operates an online platform for the sale of electric vehicles in Nigeria. 
                    Our services include vehicle sales, test drive scheduling, financing assistance, 
                    and customer support.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>3. User Eligibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>You must be at least 18 years old to use our services</li>
                    <li>You must provide accurate and complete information</li>
                    <li>You must have legal capacity to enter into binding contracts</li>
                    <li>You must comply with all applicable Nigerian laws</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>4. Vehicle Purchases</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h4 className="font-semibold">Pricing and Availability</h4>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>All prices are in Nigerian Naira and include applicable taxes</li>
                    <li>Prices are subject to change without notice</li>
                    <li>Vehicle availability is subject to stock</li>
                    <li>We reserve the right to limit quantities</li>
                  </ul>
                  
                  <h4 className="font-semibold">Payment Terms</h4>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Full payment or approved financing required before delivery</li>
                    <li>All payments processed through secure channels</li>
                    <li>Refunds subject to our refund policy</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>5. Test Drive Policy</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Valid driver's license required for all test drives</li>
                    <li>Test drive fee of ₦50,000 per 3-minute session</li>
                    <li>Insurance coverage provided during authorized test drives</li>
                    <li>Customer responsible for any damages during test drive</li>
                    <li>Test drives must be scheduled in advance</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>6. Delivery Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Delivery timeframes are estimates and not guaranteed</li>
                    <li>Customer must be available to receive delivery</li>
                    <li>Delivery address must be accessible by our transport vehicles</li>
                    <li>Additional charges may apply for remote locations</li>
                    <li>Vehicle inspection required upon delivery</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>7. Warranties and Returns</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h4 className="font-semibold">Vehicle Warranties</h4>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>All vehicles sold with manufacturer warranty</li>
                    <li>Extended warranty options available</li>
                    <li>Warranty terms vary by manufacturer and model</li>
                  </ul>
                  
                  <h4 className="font-semibold">Return Policy</h4>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>7-day return period for unused vehicles</li>
                    <li>Vehicle must be returned in original condition</li>
                    <li>Return shipping costs borne by customer</li>
                    <li>Restocking fee may apply</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>8. User Conduct</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">You agree not to:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Provide false or misleading information</li>
                    <li>Use our services for any illegal purposes</li>
                    <li>Interfere with the operation of our platform</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Harass or abuse our staff or other customers</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>9. Intellectual Property</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    All content on our platform, including text, images, logos, and software, 
                    is protected by intellectual property rights owned by CarPluto or our licensors. 
                    You may not reproduce, distribute, or create derivative works without permission.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>10. Limitation of Liability</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    CarPluto's liability is limited to the maximum extent permitted by Nigerian law. 
                    We are not liable for indirect, incidental, or consequential damages arising 
                    from your use of our services.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>11. Privacy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your privacy is important to us. Please review our Privacy Policy to understand 
                    how we collect, use, and protect your personal information.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>12. Dispute Resolution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Disputes will be resolved through mediation first</li>
                    <li>If mediation fails, arbitration in Lagos, Nigeria</li>
                    <li>Nigerian law governs these terms</li>
                    <li>Courts of Lagos have exclusive jurisdiction</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>13. Modifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We reserve the right to modify these terms at any time. Changes will be posted 
                    on our platform and take effect immediately. Continued use of our services 
                    constitutes acceptance of the modified terms.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>14. Termination</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We may terminate or suspend your access to our services at any time for violation 
                    of these terms or for any other reason at our sole discretion.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>15. Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    For questions about these Terms of Service, contact us:
                  </p>
                  <div className="space-y-2 text-muted-foreground">
                    <p>Email: legal@carpluto.com.ng</p>
                    <p>Phone: +234 800 000 0000</p>
                    <p>Address: CarPluto Nigeria Ltd, Lagos, Nigeria</p>
                  </div>
                </CardContent>
              </Card>
              
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;