import { Shield, Database, Users, FileCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AboutPage = () => {
  const features = [
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'All land records are stored immutably on the blockchain, ensuring tamper-proof documentation.',
    },
    {
      icon: Database,
      title: 'Decentralized Storage',
      description: 'Documents are stored on IPFS, providing permanent and distributed file storage.',
    },
    {
      icon: Users,
      title: 'Council Verification',
      description: 'Multi-signature approval system ensures proper verification by authorized revenue officers.',
    },
    {
      icon: FileCheck,
      title: 'Transparent Records',
      description: 'Complete transparency in land ownership with publicly verifiable records.',
    },
  ];

  return (
    <div className="min-h-screen tribal-pattern">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12 parchment rounded-lg p-8 vintage-border">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              About Land Registry DApp
            </h1>
            <p className="text-xl text-muted-foreground">
              Empowering tribal communities in Chhattisgarh with secure, transparent, and blockchain-verified land ownership records.
            </p>
          </div>

          {/* Mission */}
          <Card className="vintage-border mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">🎯 Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">
                The Land Registry DApp is designed specifically for tribal communities in Chhattisgarh to provide a modern, secure, and transparent system for land registration and ownership verification.
              </p>
              <p>
                By leveraging blockchain technology, we ensure that land records are immutable, transparent, and accessible to all stakeholders while maintaining the security and privacy of landowners.
              </p>
            </CardContent>
          </Card>

          {/* Features */}
          <h2 className="text-3xl font-bold text-primary mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="vintage-border">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* How It Works */}
          <Card className="vintage-border mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">📋 How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="font-bold text-primary text-lg">1.</span>
                  <div>
                    <p className="font-semibold">Submit Land Claim</p>
                    <p className="text-sm text-muted-foreground">
                      Landowners submit their land details along with supporting documents.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary text-lg">2.</span>
                  <div>
                    <p className="font-semibold">Council Review</p>
                    <p className="text-sm text-muted-foreground">
                      Authorized revenue officers review and verify the submitted information.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary text-lg">3.</span>
                  <div>
                    <p className="font-semibold">Blockchain Verification</p>
                    <p className="text-sm text-muted-foreground">
                      Approved records are permanently recorded on the blockchain.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary text-lg">4.</span>
                  <div>
                    <p className="font-semibold">Public Access</p>
                    <p className="text-sm text-muted-foreground">
                      Anyone can search and verify land ownership records.
                    </p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Technology */}
          <Card className="vintage-border">
            <CardHeader>
              <CardTitle className="text-2xl">⚙️ Technology Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-primary">Frontend</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    <li>React + TypeScript</li>
                    <li>Tailwind CSS</li>
                    <li>shadcn/ui Components</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-primary">Blockchain</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    <li>Ethereum Network</li>
                    <li>IPFS for Document Storage</li>
                    <li>Smart Contracts</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
