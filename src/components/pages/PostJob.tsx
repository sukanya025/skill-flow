import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';
import { BaseCrudService, useMember } from '@/integrations';
import { JobPostings } from '@/entities';
import { 
  Plus, X, Wand2, DollarSign, Calendar, 
  MapPin, Briefcase, AlertCircle, CheckCircle 
} from 'lucide-react';

export default function PostJob() {
  const navigate = useNavigate();
  const { member } = useMember(); // No need to check authentication - MemberProtectedRoute handles this
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    budgetAmount: '',
    paymentModel: 'fixed',
    requiredSkills: '',
    projectDeadline: '',
    isRemote: true,
  });
  const [skillTags, setSkillTags] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [aiAssisted, setAiAssisted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (currentSkill.trim() && !skillTags.includes(currentSkill.trim())) {
      const newSkills = [...skillTags, currentSkill.trim()];
      setSkillTags(newSkills);
      setFormData(prev => ({ ...prev, requiredSkills: newSkills.join(', ') }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const newSkills = skillTags.filter(skill => skill !== skillToRemove);
    setSkillTags(newSkills);
    setFormData(prev => ({ ...prev, requiredSkills: newSkills.join(', ') }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const generateAIRequirements = () => {
    setAiAssisted(true);
    // Simulate AI processing
    setTimeout(() => {
      const aiRequirements = `Based on your project description, here are the structured requirements:

SCOPE OF WORK:
• ${formData.jobTitle || 'Project development'} with focus on quality and timely delivery
• Implementation following industry best practices
• Regular progress updates and milestone reviews

DELIVERABLES:
• Complete project as per specifications
• Documentation and source code
• Testing and quality assurance
• Post-delivery support for 30 days

TIMELINE:
• Project kickoff within 3 days of award
• Weekly milestone reviews
• Final delivery by ${formData.projectDeadline || 'agreed deadline'}

COMMUNICATION:
• Daily progress updates via platform messaging
• Weekly video calls for milestone reviews
• Immediate notification of any blockers or issues

TECHNICAL REQUIREMENTS:
• Proficiency in: ${formData.requiredSkills || 'relevant technologies'}
• Experience with similar projects
• Portfolio demonstrating relevant work`;

      setFormData(prev => ({ 
        ...prev, 
        jobDescription: prev.jobDescription + '\n\n' + aiRequirements 
      }));
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.jobTitle || !formData.jobDescription || !formData.budgetAmount) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const jobData: JobPostings = {
        _id: crypto.randomUUID(),
        jobTitle: formData.jobTitle,
        jobDescription: formData.jobDescription,
        budgetAmount: parseFloat(formData.budgetAmount),
        paymentModel: formData.paymentModel,
        requiredSkills: formData.requiredSkills,
        projectDeadline: formData.projectDeadline || undefined,
        isRemote: formData.isRemote,
        aiStructuredRequirements: aiAssisted ? 'AI-enhanced project requirements generated' : undefined,
      };

      await BaseCrudService.create('jobpostings', jobData);
      
      // Navigate to job details page
      navigate(`/job/${jobData._id}`);
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Error posting job. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MemberProtectedRoute messageToSignIn="Sign in to post a job and find qualified freelancers">
      <PostJobContent 
        formData={formData}
        setFormData={setFormData}
        skillTags={skillTags}
        setSkillTags={setSkillTags}
        currentSkill={currentSkill}
        setCurrentSkill={setCurrentSkill}
        aiAssisted={aiAssisted}
        setAiAssisted={setAiAssisted}
        submitting={submitting}
        handleInputChange={handleInputChange}
        addSkill={addSkill}
        removeSkill={removeSkill}
        handleKeyPress={handleKeyPress}
        generateAIRequirements={generateAIRequirements}
        handleSubmit={handleSubmit}
        navigate={navigate}
      />
    </MemberProtectedRoute>
  );
}

function PostJobContent({
  formData,
  setFormData,
  skillTags,
  setSkillTags,
  currentSkill,
  setCurrentSkill,
  aiAssisted,
  setAiAssisted,
  submitting,
  handleInputChange,
  addSkill,
  removeSkill,
  handleKeyPress,
  generateAIRequirements,
  handleSubmit,
  navigate
}: any) {
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
              <Link to="/jobs" className="font-paragraph text-primary hover:text-secondary transition-colors">
                Find Work
              </Link>
              <Link to="/post-job" className="font-paragraph text-secondary font-medium">
                Post a Job
              </Link>
              <Link to="/metrics" className="font-paragraph text-primary hover:text-secondary transition-colors">
                Metrics
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link to="/profile">Profile</Link>
              </Button>
              <Button variant="outline">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary mb-4">
            Post a New Job
          </h1>
          <p className="text-lg font-paragraph text-primary/70">
            Find the perfect freelancer for your project with AI-assisted job posting
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="bg-background border-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-secondary" />
                <span>Job Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  placeholder="e.g., Full-Stack Developer for E-commerce Platform"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="jobDescription">Project Description *</Label>
                <div className="space-y-3">
                  <Textarea
                    id="jobDescription"
                    placeholder="Describe your project in detail. Include objectives, requirements, deliverables, and any specific preferences..."
                    rows={8}
                    value={formData.jobDescription}
                    onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateAIRequirements}
                    disabled={!formData.jobDescription || aiAssisted}
                    className="w-full"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    {aiAssisted ? 'AI Requirements Added' : 'Generate AI-Structured Requirements'}
                  </Button>
                  {aiAssisted && (
                    <div className="flex items-center space-x-2 text-sm font-paragraph text-secondary">
                      <CheckCircle className="w-4 h-4" />
                      <span>AI-enhanced requirements have been added to your description</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="paymentModel">Payment Model</Label>
                  <Select value={formData.paymentModel} onValueChange={(value) => handleInputChange('paymentModel', value)}>
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
                  <Label htmlFor="budgetAmount">
                    Budget Amount ($) *
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/60 w-4 h-4" />
                    <Input
                      id="budgetAmount"
                      type="number"
                      placeholder="5000"
                      value={formData.budgetAmount}
                      onChange={(e) => handleInputChange('budgetAmount', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="projectDeadline">Project Deadline</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/60 w-4 h-4" />
                  <Input
                    id="projectDeadline"
                    type="date"
                    value={formData.projectDeadline}
                    onChange={(e) => handleInputChange('projectDeadline', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isRemote"
                  checked={formData.isRemote}
                  onCheckedChange={(checked) => handleInputChange('isRemote', checked as boolean)}
                />
                <Label htmlFor="isRemote" className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Remote work allowed</span>
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Skills Required */}
          <Card className="bg-background border-secondary/20">
            <CardHeader>
              <CardTitle>Required Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="skills">Add Skills</Label>
                <div className="flex space-x-2">
                  <Input
                    id="skills"
                    placeholder="e.g., React, Node.js, MongoDB"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button type="button" onClick={addSkill} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {skillTags.length > 0 && (
                <div>
                  <Label>Selected Skills</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skillTags.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center space-x-1">
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-secondary mt-0.5" />
                  <div>
                    <h4 className="font-heading font-bold text-primary mb-1">
                      Skill-based Matching
                    </h4>
                    <p className="text-sm font-paragraph text-primary/70">
                      Our AI will use these skills to recommend the best freelancers for your project. 
                      Be specific to get more accurate matches.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Information */}
          <Card className="bg-background border-secondary/20">
            <CardHeader>
              <CardTitle>Transparent Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                  <h4 className="font-heading font-bold text-primary mb-2">
                    Platform Fee
                  </h4>
                  <div className="text-2xl font-heading font-bold text-secondary mb-1">
                    3%
                  </div>
                  <p className="text-sm font-paragraph text-primary/70">
                    Low flat fee on project value
                  </p>
                </div>

                <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                  <h4 className="font-heading font-bold text-primary mb-2">
                    Escrow Protection
                  </h4>
                  <div className="text-2xl font-heading font-bold text-secondary mb-1">
                    Free
                  </div>
                  <p className="text-sm font-paragraph text-primary/70">
                    Milestone-based payments
                  </p>
                </div>

                <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                  <h4 className="font-heading font-bold text-primary mb-2">
                    Instant Payouts
                  </h4>
                  <div className="text-2xl font-heading font-bold text-secondary mb-1">
                    Available
                  </div>
                  <p className="text-sm font-paragraph text-primary/70">
                    For verified freelancers
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex space-x-4">
            <Button 
              type="submit" 
              size="lg" 
              disabled={submitting || !formData.jobTitle || !formData.jobDescription || !formData.budgetAmount}
              className="flex-1"
            >
              {submitting ? 'Posting Job...' : 'Post Job'}
            </Button>
            <Button type="button" variant="outline" size="lg" asChild>
              <Link to="/jobs">Cancel</Link>
            </Button>
          </div>

          <div className="p-4 bg-softyellowaccent/20 rounded-lg border border-softyellowaccent/30">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-heading font-bold text-primary mb-1">
                  What happens next?
                </h4>
                <ul className="text-sm font-paragraph text-primary/70 space-y-1">
                  <li>• Your job will be reviewed and published within 24 hours</li>
                  <li>• AI will recommend qualified freelancers to invite</li>
                  <li>• You'll receive proposals from interested freelancers</li>
                  <li>• Use our communication tools to interview candidates</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}