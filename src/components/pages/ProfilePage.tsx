import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Image } from '@/components/ui/image';
import { useMember } from '@/integrations';
import { 
  User, Mail, Calendar, Shield, Star, 
  Edit, Settings, LogOut, Award 
} from 'lucide-react';

export default function ProfilePage() {
  const { member, actions } = useMember();

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="w-full border-b border-secondary/20 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[120rem] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-heading font-bold text-primary">
              Skill Flow
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/freelancers" className="font-paragraph text-primary hover:text-secondary transition-colors">
                Find Talent
              </Link>
              <Link to="/jobs" className="font-paragraph text-primary hover:text-secondary transition-colors">
                Find Work
              </Link>
              <Link to="/post-job" className="font-paragraph text-primary hover:text-secondary transition-colors">
                Post a Job
              </Link>
              <Link to="/metrics" className="font-paragraph text-primary hover:text-secondary transition-colors">
                Metrics
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="font-paragraph text-secondary font-medium">
                Profile
              </Link>
              <Button variant="outline" onClick={() => actions.logout()}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary mb-4">
            My Profile
          </h1>
          <p className="text-lg font-paragraph text-primary/70">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="bg-background border-secondary/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Basic Information</span>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center overflow-hidden">
                    {member?.profile?.photo?.url ? (
                      <Image
                        src={member.profile.photo.url}
                        alt={member?.profile?.nickname || 'Profile'}
                        width={80}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-secondary" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-primary">
                      {member?.profile?.nickname || 
                       `${member?.contact?.firstName || ''} ${member?.contact?.lastName || ''}`.trim() || 
                       'User'}
                    </h3>
                    <p className="font-paragraph text-primary/70">
                      {member?.profile?.title || 'Professional'}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-paragraph text-primary/60">Email</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Mail className="w-4 h-4 text-secondary" />
                      <span className="font-paragraph text-primary">
                        {member?.loginEmail || 'No email provided'}
                      </span>
                      {member?.loginEmailVerified && (
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-paragraph text-primary/60">Member Since</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="w-4 h-4 text-secondary" />
                      <span className="font-paragraph text-primary">
                        {formatDate(member?._createdDate)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-paragraph text-primary/60">Last Login</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="w-4 h-4 text-secondary" />
                      <span className="font-paragraph text-primary">
                        {formatDate(member?.lastLoginDate)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-paragraph text-primary/60">Account Status</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Shield className="w-4 h-4 text-secondary" />
                      <Badge variant={member?.status === 'APPROVED' ? 'default' : 'secondary'}>
                        {member?.status || 'UNKNOWN'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {member?.contact?.phones && member.contact.phones.length > 0 && (
                  <div>
                    <label className="text-sm font-paragraph text-primary/60">Phone Numbers</label>
                    <div className="mt-1 space-y-1">
                      {member.contact.phones.map((phone, index) => (
                        <div key={index} className="font-paragraph text-primary">
                          {phone}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className="bg-background border-secondary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-secondary" />
                  <span>Account Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Privacy Settings
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Preferences
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Security
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-background border-secondary/20">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start">
                  <Link to="/post-job">
                    <Edit className="w-4 h-4 mr-2" />
                    Post a Job
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full justify-start">
                  <Link to="/jobs">
                    <Star className="w-4 h-4 mr-2" />
                    Browse Jobs
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full justify-start">
                  <Link to="/freelancers">
                    <User className="w-4 h-4 mr-2" />
                    Find Freelancers
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full justify-start">
                  <Link to="/reputation">
                    <Award className="w-4 h-4 mr-2" />
                    Reputation Ledger
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Account Stats */}
            <Card className="bg-background border-secondary/20">
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-secondary/5 rounded-lg">
                  <div className="text-2xl font-heading font-bold text-primary mb-1">
                    {member?.loginEmailVerified ? 'Verified' : 'Pending'}
                  </div>
                  <div className="text-sm font-paragraph text-primary/60">
                    Account Status
                  </div>
                </div>

                <div className="space-y-3 text-sm font-paragraph">
                  <div className="flex justify-between">
                    <span className="text-primary/70">Profile Completion</span>
                    <span className="font-medium text-primary">
                      {member?.profile?.nickname && member?.loginEmail ? '85%' : '45%'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary/70">Email Verified</span>
                    <span className="font-medium text-primary">
                      {member?.loginEmailVerified ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary/70">Account Type</span>
                    <span className="font-medium text-primary">Standard</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="bg-background border-secondary/20">
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-paragraph text-primary/70 mb-4">
                  Get support or learn more about Skill Flow features.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Help Center
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}