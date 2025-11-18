import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BaseCrudService } from '@/integrations';
import { JobPostings, Proposals } from '@/entities';
import { 
  DollarSign, Clock, MapPin, Briefcase, Calendar, 
  Send, Star, Shield, Users, AlertCircle 
} from 'lucide-react';

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<JobPostings | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalData, setProposalData] = useState({
    proposalTitle: '',
    proposalDetails: '',
    pricingModel: 'fixed',
    proposedAmount: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadJobData = async () => {
      if (!id) return;

      try {
        const jobData = await BaseCrudService.getById<JobPostings>('jobpostings', id);
        setJob(jobData);
      } catch (error) {
        console.error('Error loading job data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadJobData();
  }, [id]);

  const handleSubmitProposal = async () => {
    if (!job || !proposalData.proposalTitle || !proposalData.proposalDetails || !proposalData.proposedAmount) {
      return;
    }

    setSubmitting(true);
    try {
      const proposal: Proposals = {
        _id: crypto.randomUUID(),
        proposalTitle: proposalData.proposalTitle,
        proposalDetails: proposalData.proposalDetails,
        pricingModel: proposalData.pricingModel,
        proposedAmount: parseFloat(proposalData.proposedAmount),
        submissionDate: new Date().toISOString(),
        proposalStatus: 'submitted',
      };

      await BaseCrudService.create('proposals', proposal);
      
      // Reset form and hide it
      setProposalData({
        proposalTitle: '',
        proposalDetails: '',
        pricingModel: 'fixed',
        proposedAmount: '',
      });
      setShowProposalForm(false);
      
      // Show success message (in a real app, you'd use a toast)
      alert('Proposal submitted successfully!');
    } catch (error) {
      console.error('Error submitting proposal:', error);
      alert('Error submitting proposal. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimeAgo = (date: Date | string | undefined) => {
    if (!date) return 'Recently posted';
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just posted';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return `${Math.floor(diffInDays / 7)}w ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-paragraph text-primary/70">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Briefcase className="w-16 h-16 text-secondary/50 mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-bold text-primary mb-2">Job Not Found</h2>
          <p className="font-paragraph text-primary/70 mb-6">The job you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/jobs">Browse Jobs</Link>
          </Button>
        </div>
      </div>
    );
  }

  const proposalCount = Math.floor(Math.random() * 15) + 1;
  const clientRating = 4.8;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="w-full border-b border-secondary/20 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[120rem] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-heading font-bold text-primary">
              FreelanceHub
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/freelancers" className="font-paragraph text-primary hover:text-secondary transition-colors">
                Find Talent
              </Link>
              <Link to="/jobs" className="font-paragraph text-secondary font-medium">
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card className="bg-background border-secondary/20">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h1 className="text-3xl font-heading font-bold text-primary mb-3">
                      {job.jobTitle || 'Exciting Project Opportunity'}
                    </h1>
                    <div className="flex items-center space-x-6 text-sm font-paragraph text-primary/60 mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTimeAgo(job._createdDate)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{proposalCount} proposals</span>
                      </div>
                      {job.isRemote && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>Remote</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant="secondary" className="text-sm">
                      {job.paymentModel || 'Fixed Price'}
                    </Badge>
                    {job.isRemote && (
                      <Badge variant="outline">
                        Remote Work
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Budget and Timeline */}
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-6 h-6 text-secondary" />
                    <div>
                      <div className="font-heading font-bold text-primary text-xl">
                        ${job.budgetAmount?.toLocaleString() || '5,000'}
                      </div>
                      <div className="text-sm font-paragraph text-primary/60">
                        {job.paymentModel === 'hourly' ? 'Per hour' : 'Fixed price'}
                      </div>
                    </div>
                  </div>

                  {job.projectDeadline && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-6 h-6 text-secondary" />
                      <div>
                        <div className="font-heading font-bold text-primary">
                          {new Date(job.projectDeadline).toLocaleDateString()}
                        </div>
                        <div className="text-sm font-paragraph text-primary/60">
                          Project deadline
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-6 h-6 text-secondary" />
                    <div>
                      <div className="font-heading font-bold text-primary">
                        {job.paymentModel === 'hourly' ? 'Hourly' : 'Project-based'}
                      </div>
                      <div className="text-sm font-paragraph text-primary/60">
                        Work type
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills Required */}
                <div>
                  <h3 className="font-heading font-bold text-primary mb-3">Skills Required</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills?.split(',').map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card className="bg-background border-secondary/20">
              <CardHeader>
                <CardTitle>Project Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="font-paragraph text-primary/80 leading-relaxed whitespace-pre-wrap">
                    {job.jobDescription || `We are looking for a skilled professional to help us with an exciting project. This is a great opportunity to work with our team and contribute to meaningful work.

Key Responsibilities:
• Deliver high-quality work according to specifications
• Communicate regularly with our team
• Meet project deadlines and milestones
• Provide regular updates on progress

What We Offer:
• Competitive compensation
• Flexible working arrangements
• Opportunity for long-term collaboration
• Professional growth and development

We value quality work, clear communication, and reliability. If you're passionate about delivering excellent results and working with a professional team, we'd love to hear from you.`}
                  </p>
                </div>

                {job.aiStructuredRequirements && (
                  <div className="mt-6 p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                    <h4 className="font-heading font-bold text-primary mb-2 flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-secondary" />
                      AI-Structured Requirements
                    </h4>
                    <p className="font-paragraph text-primary/70 text-sm">
                      {job.aiStructuredRequirements}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Proposal Form */}
            {showProposalForm && (
              <Card className="bg-background border-secondary/20">
                <CardHeader>
                  <CardTitle>Submit Your Proposal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="proposalTitle">Proposal Title</Label>
                    <Input
                      id="proposalTitle"
                      placeholder="Brief title for your proposal"
                      value={proposalData.proposalTitle}
                      onChange={(e) => setProposalData(prev => ({ ...prev, proposalTitle: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="proposalDetails">Proposal Details</Label>
                    <Textarea
                      id="proposalDetails"
                      placeholder="Describe your approach, experience, and why you're the right fit for this project..."
                      rows={6}
                      value={proposalData.proposalDetails}
                      onChange={(e) => setProposalData(prev => ({ ...prev, proposalDetails: e.target.value }))}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pricingModel">Pricing Model</Label>
                      <Select value={proposalData.pricingModel} onValueChange={(value) => setProposalData(prev => ({ ...prev, pricingModel: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed Price</SelectItem>
                          <SelectItem value="hourly">Hourly Rate</SelectItem>
                          <SelectItem value="milestone">Milestone-based</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="proposedAmount">
                        Proposed Amount ($)
                      </Label>
                      <Input
                        id="proposedAmount"
                        type="number"
                        placeholder="0.00"
                        value={proposalData.proposedAmount}
                        onChange={(e) => setProposalData(prev => ({ ...prev, proposedAmount: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button 
                      onClick={handleSubmitProposal}
                      disabled={submitting || !proposalData.proposalTitle || !proposalData.proposalDetails || !proposalData.proposedAmount}
                    >
                      {submitting ? 'Submitting...' : 'Submit Proposal'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowProposalForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Panel */}
            <Card className="bg-background border-secondary/20">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Button 
                    className="w-full" 
                    onClick={() => setShowProposalForm(!showProposalForm)}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {showProposalForm ? 'Hide Proposal Form' : 'Submit Proposal'}
                  </Button>
                  <Button variant="outline" className="w-full">
                    Save Job
                  </Button>
                  <Button variant="outline" className="w-full">
                    Share Job
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Client Information */}
            <Card className="bg-background border-secondary/20">
              <CardHeader>
                <CardTitle>About the Client</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <div className="font-heading font-bold text-primary">
                        Professional Client
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-softyellowaccent fill-current" />
                        <span className="text-sm font-paragraph text-primary">
                          {clientRating}
                        </span>
                        <span className="text-xs font-paragraph text-primary/60">
                          ({Math.floor(Math.random() * 20) + 5} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm font-paragraph text-primary/70">
                    <div className="flex justify-between">
                      <span>Member since</span>
                      <span>2022</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Jobs posted</span>
                      <span>{Math.floor(Math.random() * 50) + 10}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total spent</span>
                      <span>${(Math.floor(Math.random() * 100) + 20)}K+</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-secondary/20">
                    <div className="flex items-center space-x-2 text-sm font-paragraph text-secondary">
                      <Shield className="w-4 h-4" />
                      <span>Payment verified</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Stats */}
            <Card className="bg-background border-secondary/20">
              <CardHeader>
                <CardTitle>Project Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm font-paragraph">
                  <div className="flex justify-between">
                    <span className="text-primary/70">Proposals</span>
                    <span className="font-medium text-primary">{proposalCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary/70">Last viewed</span>
                    <span className="font-medium text-primary">2 hours ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary/70">Interviewing</span>
                    <span className="font-medium text-primary">{Math.floor(proposalCount / 3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary/70">Invites sent</span>
                    <span className="font-medium text-primary">{Math.floor(Math.random() * 5)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Similar Jobs */}
            <Card className="bg-background border-secondary/20">
              <CardHeader>
                <CardTitle>Similar Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="p-3 bg-secondary/5 rounded-lg border border-secondary/20">
                      <h4 className="font-heading font-bold text-primary text-sm mb-1">
                        Similar Project {item}
                      </h4>
                      <p className="text-xs font-paragraph text-primary/70 mb-2">
                        Great opportunity for skilled professionals...
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-paragraph text-secondary font-medium">
                          ${Math.floor(Math.random() * 5000) + 1000}
                        </span>
                        <Button size="sm" variant="outline" className="text-xs">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}