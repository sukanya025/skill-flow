import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image } from '@/components/ui/image';
import { BaseCrudService } from '@/integrations';
import { Freelancers, ReputationLedger } from '@/entities';
import { 
  Star, Shield, Users, ExternalLink, MapPin, Calendar, 
  Award, MessageCircle, Video, Phone, Download, CheckCircle 
} from 'lucide-react';

export default function FreelancerProfile() {
  const { id } = useParams<{ id: string }>();
  const [freelancer, setFreelancer] = useState<Freelancers | null>(null);
  const [reviews, setReviews] = useState<ReputationLedger[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFreelancerData = async () => {
      if (!id) return;

      try {
        const freelancerData = await BaseCrudService.getById<Freelancers>('freelancers', id);
        const { items: reviewsData } = await BaseCrudService.getAll<ReputationLedger>('reputationledger');
        
        setFreelancer(freelancerData);
        // Filter reviews for this freelancer (in a real app, you'd have a reference field)
        setReviews(reviewsData.slice(0, 5)); // Mock data for demo
      } catch (error) {
        console.error('Error loading freelancer data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFreelancerData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-paragraph text-primary/70">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 text-secondary/50 mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-bold text-primary mb-2">Freelancer Not Found</h2>
          <p className="font-paragraph text-primary/70 mb-6">The freelancer you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/freelancers">Browse Freelancers</Link>
          </Button>
        </div>
      </div>
    );
  }

  const rating = ((freelancer.credibilityScore || 85) / 20);
  const reviewCount = Math.floor(Math.random() * 50) + 10;
  const completedProjects = Math.floor(Math.random() * 100) + 20;

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
              <Link to="/freelancers" className="font-paragraph text-secondary font-medium">
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
        {/* Profile Header */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Main Profile Info */}
          <div className="lg:col-span-2">
            <Card className="bg-background border-secondary/20">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Profile Picture */}
                  <div className="relative">
                    <div className="w-32 h-32 bg-secondary/10 rounded-full flex items-center justify-center overflow-hidden">
                      {freelancer.profilePicture ? (
                        <Image
                          src={freelancer.profilePicture}
                          alt={freelancer.fullName || 'Freelancer'}
                          width={128}
                          className="w-32 h-32 rounded-full object-cover"
                        />
                      ) : (
                        <Users className="w-16 h-16 text-secondary" />
                      )}
                    </div>
                    {freelancer.credentialBadges && (
                      <div className="absolute -top-2 -right-2 w-10 h-10 bg-secondary rounded-full flex items-center justify-center border-4 border-background">
                        <Shield className="w-5 h-5 text-primary-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Profile Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h1 className="text-3xl font-heading font-bold text-primary mb-2">
                          {freelancer.fullName || 'Professional'}
                        </h1>
                        <p className="text-lg font-paragraph text-primary/70 mb-3">
                          {freelancer.headline || 'Skilled Professional'}
                        </p>
                        <div className="flex items-center space-x-4 text-sm font-paragraph text-primary/60">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>Remote Worldwide</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Available Now</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Rating and Stats */}
                    <div className="flex items-center space-x-6 mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-5 h-5 text-softyellowaccent fill-current" />
                        <span className="font-heading font-bold text-primary text-lg">
                          {rating.toFixed(1)}
                        </span>
                        <span className="text-sm font-paragraph text-primary/60">
                          ({reviewCount} reviews)
                        </span>
                      </div>
                      <div className="text-sm font-paragraph text-primary/60">
                        <span className="font-medium text-primary">{completedProjects}</span> projects completed
                      </div>
                    </div>

                    {/* Hourly Rate */}
                    <div className="mb-6">
                      <span className="text-3xl font-heading font-bold text-primary">
                        ₹{freelancer.hourlyRate || 4000}
                      </span>
                      <span className="text-lg font-paragraph text-primary/70">/hour</span>
                    </div>

                    {/* Skills */}
                    <div className="mb-6">
                      <h3 className="font-heading font-bold text-primary mb-3">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {freelancer.skills?.split(',').map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Verification Badges */}
                    {freelancer.credentialBadges && (
                      <div className="mb-6">
                        <h3 className="font-heading font-bold text-primary mb-3">Verifications</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-secondary/10 text-secondary border-secondary/30">
                            <Shield className="w-3 h-3 mr-1" />
                            Identity Verified
                          </Badge>
                          <Badge className="bg-secondary/10 text-secondary border-secondary/30">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Skills Tested
                          </Badge>
                          <Badge className="bg-secondary/10 text-secondary border-secondary/30">
                            <Award className="w-3 h-3 mr-1" />
                            Portfolio Verified
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Panel */}
          <div className="space-y-6">
            {/* Contact Actions */}
            <Card className="bg-background border-secondary/20">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Video className="w-4 h-4 mr-2" />
                    Schedule Call
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Voice Call
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Credibility Score */}
            <Card className="bg-background border-secondary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-secondary" />
                  <span>Credibility Score</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-heading font-bold text-primary mb-1">
                    {freelancer.credibilityScore || 85}
                  </div>
                  <div className="text-sm font-paragraph text-primary/60">out of 100</div>
                </div>
                <div className="w-full bg-secondary/20 rounded-full h-3 mb-4">
                  <div 
                    className="bg-secondary rounded-full h-3 transition-all duration-500"
                    style={{ width: `${freelancer.credibilityScore || 85}%` }}
                  ></div>
                </div>
                <div className="space-y-2 text-sm font-paragraph text-primary/70">
                  <div className="flex justify-between">
                    <span>Identity Verification</span>
                    <CheckCircle className="w-4 h-4 text-secondary" />
                  </div>
                  <div className="flex justify-between">
                    <span>Skill Assessment</span>
                    <CheckCircle className="w-4 h-4 text-secondary" />
                  </div>
                  <div className="flex justify-between">
                    <span>Portfolio Review</span>
                    <CheckCircle className="w-4 h-4 text-secondary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Link */}
            {freelancer.portfolioUrl && (
              <Card className="bg-background border-secondary/20">
                <CardContent className="p-6">
                  <Button variant="outline" className="w-full" asChild>
                    <a href={freelancer.portfolioUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Portfolio
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="reputation">Reputation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card className="bg-background border-secondary/20">
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-paragraph text-primary/80 leading-relaxed">
                  {freelancer.bio || 'Experienced professional with a passion for delivering high-quality work. I specialize in creating innovative solutions that meet client needs and exceed expectations. With years of experience in the industry, I bring both technical expertise and creative problem-solving skills to every project.'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <Card key={review._id} className="bg-background border-secondary/20">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-heading font-bold text-primary">
                          {review.clientName || `Client ${index + 1}`}
                        </h4>
                        <p className="text-sm font-paragraph text-primary/60">
                          {review.jobTitle || 'Project Collaboration'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-softyellowaccent fill-current" />
                        <span className="font-paragraph font-medium text-primary">
                          {review.ratingScore || 5}
                        </span>
                      </div>
                    </div>
                    <p className="font-paragraph text-primary/80">
                      {review.reviewContent || 'Excellent work quality and professional communication. Delivered on time and exceeded expectations. Would definitely work with again.'}
                    </p>
                    <div className="mt-3 text-xs font-paragraph text-primary/60">
                      {new Date(review.reviewDate || new Date()).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="mt-6">
            <Card className="bg-background border-secondary/20">
              <CardHeader>
                <CardTitle>Portfolio Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="bg-secondary/5 rounded-lg p-4 border border-secondary/20">
                      <div className="aspect-video bg-secondary/10 rounded-lg mb-3 flex items-center justify-center">
                        <Image
                          src={'https://static.wixstatic.com/media/d52e3b_7fdd1bfafe764df8a8aae0fbaa553eee~mv2.png?originWidth=256&originHeight=128'}
                          alt={`Portfolio item ${item}`}
                          width={300}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <h4 className="font-heading font-bold text-primary mb-1">
                        Project {item}
                      </h4>
                      <p className="text-sm font-paragraph text-primary/70">
                        Professional project showcasing expertise and creativity.
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reputation" className="mt-6">
            <Card className="bg-background border-secondary/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Portable Reputation Ledger</span>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-secondary/5 rounded-lg">
                      <div className="text-2xl font-heading font-bold text-primary mb-1">
                        {rating.toFixed(1)}
                      </div>
                      <div className="text-sm font-paragraph text-primary/60">
                        Average Rating
                      </div>
                    </div>
                    <div className="text-center p-4 bg-secondary/5 rounded-lg">
                      <div className="text-2xl font-heading font-bold text-primary mb-1">
                        {completedProjects}
                      </div>
                      <div className="text-sm font-paragraph text-primary/60">
                        Completed Projects
                      </div>
                    </div>
                    <div className="text-center p-4 bg-secondary/5 rounded-lg">
                      <div className="text-2xl font-heading font-bold text-primary mb-1">
                        {freelancer.credibilityScore || 85}
                      </div>
                      <div className="text-sm font-paragraph text-primary/60">
                        Credibility Score
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-heading font-bold text-primary">Verified Achievements</h4>
                    {reviews.slice(0, 3).map((achievement, index) => (
                      <div key={achievement._id} className="flex items-center space-x-3 p-3 bg-secondary/5 rounded-lg">
                        <Award className="w-5 h-5 text-secondary" />
                        <div className="flex-1">
                          <div className="font-paragraph font-medium text-primary">
                            {achievement.achievementTitle || `Professional Achievement ${index + 1}`}
                          </div>
                          <div className="text-sm font-paragraph text-primary/60">
                            {achievement.achievementDescription || 'Recognized for exceptional work quality and client satisfaction.'}
                          </div>
                        </div>
                        <CheckCircle className="w-4 h-4 text-secondary" />
                      </div>
                    ))}
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