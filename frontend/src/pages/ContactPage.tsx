import { Phone, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const ContactPage = () => {
  const contacts = [
    {
      category: 'Gudhiyari Tehsil',
      members: [
        { name: 'Ramkumar Sahu', role: 'Tehsildar', phone: '0771-123-4567' },
        { name: 'Nisha Toppo', role: 'Naib Tehsildar', phone: '0771-234-5678' },
      ],
    },
    {
      category: 'Raipur Urban Tehsil',
      members: [
        { name: 'Suresh Patel', role: 'Tehsildar', phone: '0771-345-6789' },
        { name: 'Anjali Verma', role: 'Revenue Officer', phone: '0771-456-7890' },
      ],
    },
  ];

  return (
    <div className="min-h-screen tribal-pattern">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">
          📞 Contact Directory
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Officers */}
          {contacts.map((section) => (
            <Card key={section.category} className="vintage-border">
              <CardHeader>
                <CardTitle className="text-xl">{section.category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.members.map((member, idx) => (
                  <div key={idx}>
                    {idx > 0 && <Separator className="my-4" />}
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold text-lg">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{member.phone}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="default" size="sm" className="gap-2">
                          <Phone className="w-4 h-4" />
                          CALL
                        </Button>
                        <Button variant="secondary" size="sm" className="gap-2">
                          <MessageCircle className="w-4 h-4" />
                          WHATSAPP
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Support Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="vintage-border">
            <CardHeader>
              <CardTitle>🆘 Support & Help</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Help Desk</p>
                <p className="font-semibold">0771-000-0000</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">support@bhumi-registry.in</p>
              </div>
              <Button variant="secondary" className="w-full gap-2">
                <MessageCircle className="w-4 h-4" />
                JOIN WHATSAPP SUPPORT GROUP
              </Button>
            </CardContent>
          </Card>

          <Card className="vintage-border">
            <CardHeader>
              <CardTitle>🏢 Local Government Offices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold">District Land Office</p>
                <p className="text-sm">Civil Lines, Raipur - 492001</p>
                <p className="text-sm text-muted-foreground">Phone: 0771-111-2222</p>
              </div>
              <Separator />
              <div>
                <p className="font-semibold">Collector Office</p>
                <p className="text-sm">Collectorate Building, Raipur</p>
                <p className="text-sm text-muted-foreground">Phone: 0771-222-3333</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Phone className="w-4 h-4" />
                  CALL
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Mail className="w-4 h-4" />
                  EMAIL
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
