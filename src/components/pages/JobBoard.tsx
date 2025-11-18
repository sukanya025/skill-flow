import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BaseCrudService } from '@/integrations';
import { JobPostings } from '@/entities';
import { Search, Filter, MapPin, Clock, DollarSign, Briefcase, Plus } from 'lucide-react';

export default function JobBoard() {
  const [jobs, setJobs] = useState<JobPostings[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPostings[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('');
  const [paymentModelFilter, setPaymentModelFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const { items } = await BaseCrudService.getAll<JobPostings>('jobpostings');
        setJobs(items);
        setFilteredJobs(items);
      } catch (error) {
        console.error('Error loading jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.jobDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.requiredSkills?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category (using required skills as categories)
    if (categoryFilter) {
      filtered = filtered.filter(job =>
        job.requiredSkills?.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    }

    // Filter by budget
    if (budgetFilter) {
      filtered = filtered.filter(job => {
        const budget = job.budgetAmount || 0;
        switch (budgetFilter) {
          case 'under-1000':
            return budget < 1000;
          case '1000-5000':
            return budget >= 1000 && budget <= 5000;
          case '5000-10000':
            return budget > 5000 && budget <= 10000;
          case 'over-10000':
            return budget > 10000;
          default:
            return true;
        }
      });
    }

    // Filter by payment model
    if (paymentModelFilter) {
      filtered = filtered.filter(job =>
        job.paymentModel?.toLowerCase() === paymentModelFilter.toLowerCase()
      );
    }

    setFilteredJobs(filtered);
  }, [jobs, searchQuery, categoryFilter, budgetFilter, paymentModelFilter]);

  const getUniqueCategories = () => {
    const allSkills = jobs
      .map(job => job.requiredSkills?.split(',') || [])
      .flat()
      .map(skill => skill.trim())
      .filter(Boolean);
    return [...new Set(allSkills)].slice(0, 15);
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
          <p className="font-paragraph text-primary/70">Loading jobs...</p>
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
        {/* Page Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-heading font-bold text-primary mb-4">
              Find Your Next Project
            </h1>
            <p className="text-lg font-paragraph text-primary/70">
              Discover opportunities from verified clients with transparent requirements
            </p>
          </div>
          <Button asChild>
            <Link to="/post-job">
              <Plus className="w-4 h-4 mr-2" />
              Post a Job
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-background border border-secondary/20 rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/60 w-5 h-5" />
                <Input
                  placeholder="Search jobs by title, description, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {getUniqueCategories().map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={budgetFilter} onValueChange={setBudgetFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Budget</SelectItem>
                <SelectItem value="under-1000">Under $1,000</SelectItem>
                <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                <SelectItem value="over-10000">$10,000+</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentModelFilter} onValueChange={setPaymentModelFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Payment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="fixed">Fixed Price</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="milestone">Milestone</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-secondary/20">
            <div className="flex items-center space-x-2 text-sm font-paragraph text-primary/70">
              <Filter className="w-4 h-4" />
              <span>{filteredJobs.length} jobs found</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('');
                setBudgetFilter('');
                setPaymentModelFilter('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job._id} className="bg-background border-secondary/20 hover:shadow-lg transition-all duration-300 hover:border-secondary/40">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-heading font-bold text-primary hover:text-secondary transition-colors cursor-pointer">
                        <Link to={`/job/${job._id}`}>
                          {job.jobTitle || 'Exciting Project Opportunity'}
                        </Link>
                      </h3>
                      <div className="flex items-center space-x-2 ml-4">
                        <Badge variant="secondary">
                          {job.paymentModel || 'Fixed Price'}
                        </Badge>
                        {job.isRemote && (
                          <Badge variant="outline">
                            <MapPin className="w-3 h-3 mr-1" />
                            Remote
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="font-paragraph text-primary/80 mb-4 line-clamp-3">
                      {job.jobDescription || 'Exciting opportunity to work on an innovative project with a professional team. We are looking for a skilled freelancer to help us achieve our goals and deliver exceptional results.'}
                    </p>

                    <div className="flex items-center space-x-6 mb-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-secondary" />
                        <span className="font-heading font-bold text-primary text-lg">
                          ${job.budgetAmount?.toLocaleString() || '5,000'}
                        </span>
                        <span className="text-sm font-paragraph text-primary/60">
                          {job.paymentModel === 'hourly' ? '/hour' : 'fixed'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm font-paragraph text-primary/60">
                        <Clock className="w-4 h-4" />
                        <span>{formatTimeAgo(job._createdDate)}</span>
                      </div>

                      {job.projectDeadline && (
                        <div className="flex items-center space-x-2 text-sm font-paragraph text-primary/60">
                          <Briefcase className="w-4 h-4" />
                          <span>Due {new Date(job.projectDeadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {job.requiredSkills?.split(',').slice(0, 5).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill.trim()}
                          </Badge>
                        ))}
                        {job.requiredSkills?.split(',').length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.requiredSkills.split(',').length - 5} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-paragraph text-primary/60">
                          {Math.floor(Math.random() * 15) + 1} proposals
                        </span>
                        <Button asChild>
                          <Link to={`/job/${job._id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 text-secondary/50 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold text-primary mb-2">
              No jobs found
            </h3>
            <p className="font-paragraph text-primary/70 mb-6">
              Try adjusting your search criteria or browse all available jobs
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('');
                setBudgetFilter('');
                setPaymentModelFilter('');
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Load More */}
        {filteredJobs.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Jobs
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}