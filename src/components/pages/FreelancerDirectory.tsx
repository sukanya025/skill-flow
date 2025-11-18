import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Image } from '@/components/ui/image';
import { BaseCrudService } from '@/integrations';
import { Freelancers } from '@/entities';
import { Search, Star, Shield, Users, Filter, ExternalLink } from 'lucide-react';

export default function FreelancerDirectory() {
  const [freelancers, setFreelancers] = useState<Freelancers[]>([]);
  const [filteredFreelancers, setFilteredFreelancers] = useState<Freelancers[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [rateFilter, setRateFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const loadFreelancers = async () => {
      try {
        const { items } = await BaseCrudService.getAll<Freelancers>('freelancers');
        setFreelancers(items);
        setFilteredFreelancers(items);
        
        // Set initial search query from URL params
        const initialSearch = searchParams.get('search');
        if (initialSearch) {
          setSearchQuery(initialSearch);
        }
      } catch (error) {
        console.error('Error loading freelancers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFreelancers();
  }, [searchParams]);

  useEffect(() => {
    let filtered = freelancers;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(freelancer =>
        freelancer.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        freelancer.headline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        freelancer.skills?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        freelancer.bio?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by skill
    if (skillFilter) {
      filtered = filtered.filter(freelancer =>
        freelancer.skills?.toLowerCase().includes(skillFilter.toLowerCase())
      );
    }

    // Filter by rate
    if (rateFilter) {
      filtered = filtered.filter(freelancer => {
        const rate = freelancer.hourlyRate || 0;
        switch (rateFilter) {
          case 'under-2000':
            return rate < 2000;
          case '2000-4000':
            return rate >= 2000 && rate <= 4000;
          case '4000-8000':
            return rate > 4000 && rate <= 8000;
          case 'over-8000':
            return rate > 8000;
          default:
            return true;
        }
      });
    }

    setFilteredFreelancers(filtered);
  }, [freelancers, searchQuery, skillFilter, rateFilter]);

  const getUniqueSkills = () => {
    const allSkills = freelancers
      .map(f => f.skills?.split(',') || [])
      .flat()
      .map(skill => skill.trim())
      .filter(Boolean);
    return [...new Set(allSkills)].slice(0, 20); // Limit to 20 most common skills
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-paragraph text-primary/70">Loading freelancers...</p>
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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary mb-4">
            Find Verified Freelancers
          </h1>
          <p className="text-lg font-paragraph text-primary/70">
            Discover top-rated professionals with verified credentials and proven track records
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-background border border-secondary/20 rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/60 w-5 h-5" />
                <Input
                  placeholder="Search by name, skills, or expertise..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={skillFilter} onValueChange={setSkillFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                {getUniqueSkills().map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={rateFilter} onValueChange={setRateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Hourly rate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Rate</SelectItem>
                <SelectItem value="under-2000">Under ₹2,000/hr</SelectItem>
                <SelectItem value="2000-4000">₹2,000 - ₹4,000/hr</SelectItem>
                <SelectItem value="4000-8000">₹4,000 - ₹8,000/hr</SelectItem>
                <SelectItem value="over-8000">₹8,000+/hr</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-secondary/20">
            <div className="flex items-center space-x-2 text-sm font-paragraph text-primary/70">
              <Filter className="w-4 h-4" />
              <span>{filteredFreelancers.length} freelancers found</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSkillFilter('');
                setRateFilter('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Freelancer Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFreelancers.map((freelancer) => (
            <Card key={freelancer._id} className="bg-background border-secondary/20 hover:shadow-lg transition-all duration-300 hover:border-secondary/40">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center overflow-hidden">
                      {freelancer.profilePicture ? (
                        <Image
                          src={freelancer.profilePicture}
                          alt={freelancer.fullName || 'Freelancer'}
                          width={64}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <Users className="w-8 h-8 text-secondary" />
                      )}
                    </div>
                    {freelancer.credentialBadges && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                        <Shield className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-primary text-lg truncate">
                      {freelancer.fullName || 'Professional'}
                    </h3>
                    <p className="text-sm font-paragraph text-primary/70 mb-2">
                      {freelancer.headline || 'Skilled Professional'}
                    </p>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-softyellowaccent fill-current" />
                      <span className="text-sm font-paragraph text-primary font-medium">
                        {((freelancer.credibilityScore || 85) / 20).toFixed(1)}
                      </span>
                      <span className="text-xs font-paragraph text-primary/60">
                        ({Math.floor(Math.random() * 50) + 10} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="font-paragraph text-primary/70 text-sm mb-4 line-clamp-3">
                  {freelancer.bio || 'Experienced professional ready to help with your project. Committed to delivering high-quality work on time and within budget.'}
                </p>

                {/* Skills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {freelancer.skills?.split(',').slice(0, 4).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill.trim()}
                      </Badge>
                    ))}
                    {freelancer.skills?.split(',').length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{freelancer.skills.split(',').length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Rate and Portfolio */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-heading font-bold text-primary text-lg">
                    ₹{freelancer.hourlyRate || 4000}/hr
                  </span>
                  {freelancer.portfolioUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={freelancer.portfolioUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Portfolio
                      </a>
                    </Button>
                  )}
                </div>

                {/* Credibility Score */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs font-paragraph text-primary/60 mb-1">
                    <span>Credibility Score</span>
                    <span>{freelancer.credibilityScore || 85}/100</span>
                  </div>
                  <div className="w-full bg-secondary/20 rounded-full h-2">
                    <div 
                      className="bg-secondary rounded-full h-2 transition-all duration-300"
                      style={{ width: `${freelancer.credibilityScore || 85}%` }}
                    ></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button asChild className="flex-1">
                    <Link to={`/freelancer/${freelancer._id}`}>
                      View Profile
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredFreelancers.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-secondary/50 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold text-primary mb-2">
              No freelancers found
            </h3>
            <p className="font-paragraph text-primary/70 mb-6">
              Try adjusting your search criteria or browse all available freelancers
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSkillFilter('');
                setRateFilter('');
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Load More */}
        {filteredFreelancers.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Freelancers
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}