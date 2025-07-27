import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        {/* Header */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
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
                  <CardTitle>1. Information We Collect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h4 className="font-semibold">Personal Information</h4>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Name, email address, phone number</li>
                    <li>Delivery address and billing information</li>
                    <li>Driver's license information for test drives</li>
                    <li>Payment information (processed securely through Paystack)</li>
                  </ul>
                  
                  <h4 className="font-semibold">Technical Information</h4>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>IP address, browser type, and device information</li>
                    <li>Usage data and interaction with our platform</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>2. How We Use Your Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Processing vehicle purchases and deliveries</li>
                    <li>Scheduling and managing test drives</li>
                    <li>Providing customer support and service</li>
                    <li>Sending important updates about your orders</li>
                    <li>Improving our platform and services</li>
                    <li>Marketing communications (with your consent)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>3. Information Sharing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    We do not sell, trade, or rent your personal information to third parties. 
                    We may share your information only in the following circumstances:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>With payment processors (Paystack) to process transactions</li>
                    <li>With delivery partners to fulfill vehicle deliveries</li>
                    <li>With legal authorities when required by law</li>
                    <li>With service providers who assist in operating our platform</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>4. Data Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We implement industry-standard security measures to protect your personal information:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                    <li>SSL encryption for all data transmission</li>
                    <li>Secure data storage with access controls</li>
                    <li>Regular security audits and monitoring</li>
                    <li>Payment data handled by PCI-compliant processors</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>5. Your Rights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">You have the right to:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Access and review your personal information</li>
                    <li>Correct inaccurate or incomplete information</li>
                    <li>Delete your account and personal data</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Request data portability</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>6. Cookies and Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We use cookies and similar technologies to enhance your experience on our platform. 
                    These help us remember your preferences, analyze site usage, and provide personalized content.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>7. Data Retention</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We retain your personal information for as long as necessary to provide our services 
                    and comply with legal obligations. Account information is typically retained for 7 years 
                    after account closure for regulatory compliance.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>8. International Transfers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your data is primarily stored and processed in Nigeria. If we transfer data 
                    internationally, we ensure appropriate safeguards are in place to protect your information.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>9. Children's Privacy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our services are not intended for children under 18. We do not knowingly collect 
                    personal information from children. If you believe we have collected information 
                    from a child, please contact us immediately.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>10. Changes to Privacy Policy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We may update this privacy policy from time to time. We will notify you of any 
                    material changes by email or prominent notice on our platform. Continued use 
                    of our services constitutes acceptance of the updated policy.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>11. Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    If you have questions about this privacy policy or your personal information, 
                    please contact us:
                  </p>
                  <div className="space-y-2 text-muted-foreground">
                    <p>Email: privacy@carpluto.com.ng</p>
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

export default Privacy;