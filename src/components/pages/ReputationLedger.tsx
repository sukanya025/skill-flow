import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BaseCrudService } from '@/integrations';
import { ReputationLedger } from '@/entities';
import { 
  Download, Share2, Star, Award, CheckCircle, 
  ExternalLink, Calendar, User, Briefcase, Shield 
} from 'lucide-react';

export default function ReputationLedgerPage() {
  const [reputationData, setReputationData] = useState<ReputationLedger[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReputationData = async () => {
      try {
        const { items } = await BaseCrudService.getAll<ReputationLedger>('reputationledger');
        setReputationData(items);
      } catch (error) {
        console.error('Error loading reputation data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReputationData();
  }, []);

  const reviews = reputationData.filter(item => item.reviewContent);
  const achievements = reputationData.filter(item => item.achievementTitle);
  const verifiedAchievements = achievements.filter(item => item.isVerifiedAchievement);

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + (review.ratingScore || 0), 0) / reviews.length 
    : 0;

  const handleExportLedger = () => {
    const exportData = {
      summary: {
        totalReviews: reviews.length,
        averageRating: averageRating.toFixed(2),
        totalAchievements: achievements.length,
        verifiedAchievements: verifiedAchievements.length,
        exportDate: new Date().toISOString(),
      },
      reviews: reviews.map(review => ({
        client: review.clientName,
        project: review.jobTitle,
        rating: review.ratingScore,
        review: review.reviewContent,
        date: review.reviewDate,
      })),
      achievements: achievements.map(achievement => ({
        title: achievement.achievementTitle,
        description: achievement.achievementDescription,
        verified: achievement.isVerifiedAchievement,
        date: achievement.achievementDate,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reputation-ledger-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareLedger = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Professional Reputation Ledger',
        text: `Check out my verified professional achievements and client reviews. Average rating: ${averageRating.toFixed(1)}/5 with ${reviews.length} reviews.`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-paragraph text-primary/70">Loading reputation ledger...</p>
        </div>
      </div>
    );
  }

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
              <Button variant="outline" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[120rem] mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-heading font-bold text-primary mb-4">
              Portable Reputation Ledger
            </h1>
            <p className="text-lg font-paragraph text-primary/70">
              Your verified professional achievements and client reviews in one exportable format
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleShareLedger}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button onClick={handleExportLedger}>
              <Download className="w-4 h-4 mr-2" />
              Export Ledger
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-background border-secondary/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-softyellowaccent" />
              </div>
              <div className="text-2xl font-heading font-bold text-primary mb-1">
                {averageRating.toFixed(1)}
              </div>
              <div className="text-sm font-paragraph text-primary/60">
                Average Rating
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background border-secondary/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-2xl font-heading font-bold text-primary mb-1">
                {reviews.length}
              </div>
              <div className="text-sm font-paragraph text-primary/60">
                Client Reviews
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background border-secondary/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-2xl font-heading font-bold text-primary mb-1">
                {achievements.length}
              </div>
              <div className="text-sm font-paragraph text-primary/60">
                Achievements
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background border-secondary/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-2xl font-heading font-bold text-primary mb-1">
                {verifiedAchievements.length}
              </div>
              <div className="text-sm font-paragraph text-primary/60">
                Verified
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information */}
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reviews">Client Reviews</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="export">Export Options</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <Card key={review._id} className="bg-background border-secondary/20">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-heading font-bold text-primary">
                            {review.clientName || 'Anonymous Client'}
                          </h4>
                          <p className="text-sm font-paragraph text-primary/60">
                            {review.jobTitle || 'Project Collaboration'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-softyellowaccent fill-current" />
                          <span className="font-paragraph font-bold text-primary">
                            {review.ratingScore || 5}
                          </span>
                        </div>
                      </div>
                      
                      <p className="font-paragraph text-primary/80 mb-4">
                        {review.reviewContent || 'Excellent work quality and professional communication. Delivered on time and exceeded expectations.'}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm font-paragraph text-primary/60">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {review.reviewDate 
                              ? new Date(review.reviewDate).toLocaleDateString()
                              : 'Recent'
                            }
                          </span>
                        </div>
                        {review.exportLink && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={review.exportLink} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View Original
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-background border-secondary/20">
                  <CardContent className="p-12 text-center">
                    <Star className="w-16 h-16 text-secondary/50 mx-auto mb-4" />
                    <h3 className="text-xl font-heading font-bold text-primary mb-2">
                      No Reviews Yet
                    </h3>
                    <p className="font-paragraph text-primary/70">
                      Complete your first project to start building your reputation ledger
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            <div className="space-y-4">
              {achievements.length > 0 ? (
                achievements.map((achievement) => (
                  <Card key={achievement._id} className="bg-background border-secondary/20">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                          {achievement.isVerifiedAchievement ? (
                            <CheckCircle className="w-6 h-6 text-secondary" />
                          ) : (
                            <Award className="w-6 h-6 text-secondary" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-heading font-bold text-primary">
                              {achievement.achievementTitle || 'Professional Achievement'}
                            </h4>
                            <div className="flex items-center space-x-2">
                              {achievement.isVerifiedAchievement && (
                                <Badge className="bg-secondary/10 text-secondary border-secondary/30">
                                  <Shield className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <p className="font-paragraph text-primary/80 mb-3">
                            {achievement.achievementDescription || 'Recognition for outstanding professional performance and client satisfaction.'}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm font-paragraph text-primary/60">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {achievement.achievementDate 
                                  ? new Date(achievement.achievementDate).toLocaleDateString()
                                  : 'Recent'
                                }
                              </span>
                            </div>
                            {achievement.exportLink && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={achievement.exportLink} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  View Certificate
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-background border-secondary/20">
                  <CardContent className="p-12 text-center">
                    <Award className="w-16 h-16 text-secondary/50 mx-auto mb-4" />
                    <h3 className="text-xl font-heading font-bold text-primary mb-2">
                      No Achievements Yet
                    </h3>
                    <p className="font-paragraph text-primary/70">
                      Complete projects and earn certifications to build your achievement portfolio
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="export" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-background border-secondary/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Download className="w-5 h-5 text-secondary" />
                    <span>Export Formats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={handleExportLedger} className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    JSON Format (Complete Data)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    PDF Report (Summary)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    CSV Data (Spreadsheet)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Blockchain Certificate
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-background border-secondary/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Share2 className="w-5 h-5 text-secondary" />
                    <span>Sharing Options</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={handleShareLedger} className="w-full justify-start">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Public Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    LinkedIn Integration
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Portfolio Website
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Other Platforms
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-secondary/5 border-secondary/20 mt-6">
              <CardHeader>
                <CardTitle>Portable Reputation Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-heading font-bold text-primary mb-3">For Freelancers</h4>
                    <ul className="space-y-2 text-sm font-paragraph text-primary/70">
                      <li>• Take your reputation to any platform</li>
                      <li>• Verified achievements and reviews</li>
                      <li>• Blockchain-secured certificates</li>
                      <li>• Professional portfolio integration</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-primary mb-3">For Clients</h4>
                    <ul className="space-y-2 text-sm font-paragraph text-primary/70">
                      <li>• Verify freelancer credentials across platforms</li>
                      <li>• Access comprehensive work history</li>
                      <li>• Authentic client testimonials</li>
                      <li>• Transparent skill assessments</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}