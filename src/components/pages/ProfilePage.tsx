import React from 'react';
import { useMember } from '@/integrations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const { member, actions } = useMember();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-[120rem] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-heading font-bold text-primary">
              My App
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={actions.logout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Content */}
      <main className="max-w-[120rem] mx-auto px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-8">
            My Profile
          </h1>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="font-paragraph">
                  Email: {member?.loginEmail || 'Not provided'}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-paragraph">
                  Name: {member?.contact?.firstName} {member?.contact?.lastName || 'Not provided'}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-paragraph">
                  Nickname: {member?.profile?.nickname || 'Not set'}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="font-paragraph">
                  Member since: {member?._createdDate ? new Date(member._createdDate).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}