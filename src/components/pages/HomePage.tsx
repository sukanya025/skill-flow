import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Image } from '@/components/ui/image';
import { BaseCrudService, useMember } from '@/integrations';
import { Freelancers, JobPostings } from '@/entities';
import { Search, Star, Shield, Zap, Users, TrendingUp, CheckCircle, LogOut } from 'lucide-react';

export default function HomePage() {
  const { member, isAuthenticated, actions } = useMember();
  const [featuredFreelancers, setFeaturedFreelancers] = useState<Freelancers[]>([]);
  const [recentJobs, setRecentJobs] = useState<JobPostings[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const { items: freelancers } = await BaseCrudService.getAll<Freelancers>('freelancers');
        const { items: jobs } = await BaseCrudService.getAll<JobPostings>('jobpostings');
        
        setFeaturedFreelancers(freelancers.slice(0, 6));
        setRecentJobs(jobs.slice(0, 4));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const handleSearch = () => {
    // Navigate to freelancer directory with search query
    window.location.href = `/freelancers?search=${encodeURIComponent(searchQuery)}`;
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
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="font-paragraph text-primary hover:text-secondary transition-colors">
                    {member?.profile?.nickname || member?.contact?.firstName || 'Profile'}
                  </Link>
                  <Button variant="outline" onClick={() => actions.logout()}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => actions.login()}>
                    Sign In
                  </Button>
                  <Button onClick={() => actions.login()}>
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Inspired by the layout structure */}
      <section className="w-full max-w-[120rem] mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-heading font-bold text-primary leading-tight">
                The Future of
                <br />
                Verified Freelance
                <br />
                Collaboration
              </h1>
              <p className="text-lg font-paragraph text-primary/80 max-w-xl leading-relaxed">
                Connect with top-tier freelancers through our advanced verification system, 
                AI-powered matching, and integrated collaboration tools. Experience transparent 
                pricing and portable reputation management.
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex gap-3 max-w-lg">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/60 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for skills, services, or freelancers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-secondary/30 bg-background font-paragraph text-primary placeholder:text-primary/60 focus:outline-none focus:ring-2 focus:ring-secondary/50"
                />
              </div>
              <Button onClick={handleSearch} className="px-6">
                Search
              </Button>
            </div>

            <div className="flex items-center space-x-6 text-sm font-paragraph text-primary/70">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-secondary" />
                <span>Verified Professionals</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-secondary" />
                <span>Secure Payments</span>
              </div>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-secondary/10 to-softyellowaccent/20 p-8">
              <Image
                src="https://static.wixstatic.com/media/d52e3b_b8b20347a69b4e97b1de53017b3710e8~mv2.png?originWidth=576&originHeight=448"
                alt="Professional freelancer working on laptop in modern workspace"
                width={600}
                className="w-full h-auto rounded-lg"
              />
              
              {/* Floating Stats Cards */}
              <div className="absolute -top-4 -right-4 bg-background rounded-lg shadow-lg p-4 border border-secondary/20">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-softyellowaccent fill-current" />
                  <div>
                    <div className="font-heading font-bold text-primary">4.9/5</div>
                    <div className="text-xs font-paragraph text-primary/60">Avg Rating</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-background rounded-lg shadow-lg p-4 border border-secondary/20">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-secondary" />
                  <div>
                    <div className="font-heading font-bold text-primary">50K+</div>
                    <div className="text-xs font-paragraph text-primary/60">Verified Experts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three-Column Features Section - Inspired by the layout */}
      <section className="w-full bg-secondary/5 py-20">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold text-primary mb-4">
              Why Choose Skill Flow?
            </h2>
            <p className="text-lg font-paragraph text-primary/70 max-w-2xl mx-auto">
              Experience the next generation of freelance collaboration with our innovative features
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-background border-secondary/20 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-heading font-bold text-primary mb-4">
                  Advanced Verification
                </h3>
                <p className="font-paragraph text-primary/70 leading-relaxed">
                  Multi-layer verification including KYC, skill assessments, portfolio analysis, 
                  and proctored challenges for maximum credibility.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-secondary/20 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-softyellowaccent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-bold text-primary mb-4">
                  AI-Powered Matching
                </h3>
                <p className="font-paragraph text-primary/70 leading-relaxed">
                  Smart job scoping, intelligent freelancer recommendations, and automated 
                  milestone creation for perfect project matches.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-secondary/20 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-heading font-bold text-primary mb-4">
                  Transparent Pricing
                </h3>
                <p className="font-paragraph text-primary/70 leading-relaxed">
                  Choose from subscription tiers, low flat fees, or commission models. 
                  Portable reputation and instant payout options included.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Freelancers */}
      <section className="w-full py-20">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-heading font-bold text-primary mb-2">
                Top Verified Freelancers
              </h2>
              <p className="font-paragraph text-primary/70">
                Discover our highest-rated professionals
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/freelancers">View All</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredFreelancers.map((freelancer) => (
              <Card key={freelancer._id} className="bg-background border-secondary/20 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                      {freelancer.profilePicture ? (
                        <Image
                          src={freelancer.profilePicture}
                          alt={freelancer.fullName || 'Freelancer'}
                          width={48}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <Users className="w-6 h-6 text-secondary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-bold text-primary">
                        {freelancer.fullName || 'Professional'}
                      </h3>
                      <p className="text-sm font-paragraph text-primary/70">
                        {freelancer.headline || 'Skilled Professional'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-softyellowaccent fill-current" />
                      <span className="text-sm font-paragraph text-primary">
                        {(freelancer.credibilityScore || 85) / 20}
                      </span>
                    </div>
                  </div>
                  
                  <p className="font-paragraph text-primary/70 text-sm mb-4 line-clamp-2">
                    {freelancer.bio || 'Experienced professional ready to help with your project.'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {freelancer.skills?.split(',').slice(0, 2).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill.trim()}
                        </Badge>
                      ))}
                    </div>
                    <span className="font-heading font-bold text-primary">
                      ₹{freelancer.hourlyRate || 4000}/hr
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Jobs */}
      <section className="w-full bg-secondary/5 py-20">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-heading font-bold text-primary mb-2">
                Latest Job Opportunities
              </h2>
              <p className="font-paragraph text-primary/70">
                Find your next project today
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/jobs">Browse All Jobs</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {recentJobs.map((job) => (
              <Card key={job._id} className="bg-background border-secondary/20 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-heading font-bold text-primary text-lg">
                      {job.jobTitle || 'Exciting Project Opportunity'}
                    </h3>
                    <Badge variant="secondary">
                      {job.paymentModel || 'Fixed Price'}
                    </Badge>
                  </div>
                  
                  <p className="font-paragraph text-primary/70 mb-4 line-clamp-3">
                    {job.jobDescription || 'Great opportunity to work on an innovative project with a professional team.'}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-heading font-bold text-primary text-lg">
                      ₹{job.budgetAmount?.toLocaleString() || '4,00,000'}
                    </span>
                    <span className="text-sm font-paragraph text-primary/60">
                      {job.isRemote ? 'Remote' : 'On-site'}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {job.requiredSkills?.split(',').slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill.trim()}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-primary text-primary-foreground py-16">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-heading font-bold mb-4">Skill Flow</h3>
              <p className="font-paragraph text-primary-foreground/80 mb-4">
                The future of verified freelance collaboration with AI-powered matching 
                and transparent pricing.
              </p>
            </div>
            
            <div>
              <h4 className="font-heading font-bold mb-4">For Clients</h4>
              <ul className="space-y-2 font-paragraph text-primary-foreground/80">
                <li><Link to="/freelancers" className="hover:text-primary-foreground transition-colors">Find Talent</Link></li>
                <li><Link to="/post-job" className="hover:text-primary-foreground transition-colors">Post a Job</Link></li>
                <li><Link to="/metrics" className="hover:text-primary-foreground transition-colors">Client Metrics</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-heading font-bold mb-4">For Freelancers</h4>
              <ul className="space-y-2 font-paragraph text-primary-foreground/80">
                <li><Link to="/jobs" className="hover:text-primary-foreground transition-colors">Find Work</Link></li>
                <li><Link to="/verification" className="hover:text-primary-foreground transition-colors">Get Verified</Link></li>
                <li><Link to="/reputation" className="hover:text-primary-foreground transition-colors">Reputation Ledger</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-heading font-bold mb-4">Platform</h4>
              <ul className="space-y-2 font-paragraph text-primary-foreground/80">
                <li><Link to="/pricing" className="hover:text-primary-foreground transition-colors">Pricing</Link></li>
                <li><Link to="/security" className="hover:text-primary-foreground transition-colors">Security</Link></li>
                <li><Link to="/support" className="hover:text-primary-foreground transition-colors">Support</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
            <p className="font-paragraph text-primary-foreground/60">
              © 2024 Skill Flow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}