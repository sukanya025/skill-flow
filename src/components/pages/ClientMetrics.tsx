import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Image } from '@/components/ui/image';
import { BaseCrudService } from '@/integrations';
import { ClientMetrics } from '@/entities';
import { 
  Search, Filter, Star, Shield, AlertTriangle, 
  TrendingUp, Users, DollarSign, Clock, Award 
} from 'lucide-react';

export default function ClientMetricsPage() {
  const [clients, setClients] = useState<ClientMetrics[]>([]);
  const [filteredClients, setFilteredClients] = useState<ClientMetrics[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [reliabilityFilter, setReliabilityFilter] = useState('');
  const [fairnessFilter, setFairnessFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClientMetrics = async () => {
      try {
        const { items } = await BaseCrudService.getAll<ClientMetrics>('clientmetrics');
        setClients(items);
        setFilteredClients(items);
      } catch (error) {
        console.error('Error loading client metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClientMetrics();
  }, []);

  useEffect(() => {
    let filtered = clients;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(client =>
        client.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.clientEmail?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by reliability rating
    if (reliabilityFilter) {
      const [min, max] = reliabilityFilter.split('-').map(Number);
      filtered = filtered.filter(client => {
        const rating = client.reliabilityRating || 0;
        return rating >= min && rating <= max;
      });
    }

    // Filter by fairness rating
    if (fairnessFilter) {
      const [min, max] = fairnessFilter.split('-').map(Number);
      filtered = filtered.filter(client => {
        const rating = client.fairnessRating || 0;
        return rating >= min && rating <= max;
      });
    }

    setFilteredClients(filtered);
  }, [clients, searchQuery, reliabilityFilter, fairnessFilter]);

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingBadgeVariant = (rating: number) => {
    if (rating >= 4.5) return 'default';
    if (rating >= 3.5) return 'secondary';
    return 'destructive';
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-paragraph text-primary/70">Loading client metrics...</p>
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
              <Link to="/jobs" className="font-paragraph text-primary hover:text-secondary transition-colors">
                Find Work
              </Link>
              <Link to="/post-job" className="font-paragraph text-primary hover:text-secondary transition-colors">
                Post a Job
              </Link>
              <Link to="/metrics" className="font-paragraph text-secondary font-medium">
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
            Client Metrics & Ratings
          </h1>
          <p className="text-lg font-paragraph text-primary/70">
            Transparent client ratings help freelancers make informed decisions about potential projects
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-background border-secondary/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-2xl font-heading font-bold text-primary mb-1">
                {clients.length}
              </div>
              <div className="text-sm font-paragraph text-primary/60">
                Total Clients
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background border-secondary/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-softyellowaccent" />
              </div>
              <div className="text-2xl font-heading font-bold text-primary mb-1">
                {(clients.reduce((sum, client) => sum + (client.reliabilityRating || 0), 0) / clients.length || 0).toFixed(1)}
              </div>
              <div className="text-sm font-paragraph text-primary/60">
                Avg Reliability
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background border-secondary/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-2xl font-heading font-bold text-primary mb-1">
                {(clients.reduce((sum, client) => sum + (client.paymentPunctualityRating || 0), 0) / clients.length || 0).toFixed(1)}
              </div>
              <div className="text-sm font-paragraph text-primary/60">
                Avg Payment Score
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background border-secondary/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-heading font-bold text-primary mb-1">
                {clients.reduce((sum, client) => sum + (client.disputeCount || 0), 0)}
              </div>
              <div className="text-sm font-paragraph text-primary/60">
                Total Disputes
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="bg-background border border-secondary/20 rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/60 w-5 h-5" />
                <Input
                  placeholder="Search by client name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={reliabilityFilter} onValueChange={setReliabilityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Reliability Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="4.5-5">Excellent (4.5-5.0)</SelectItem>
                <SelectItem value="3.5-4.4">Good (3.5-4.4)</SelectItem>
                <SelectItem value="2.5-3.4">Fair (2.5-3.4)</SelectItem>
                <SelectItem value="0-2.4">Poor (0-2.4)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={fairnessFilter} onValueChange={setFairnessFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Fairness Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="4.5-5">Excellent (4.5-5.0)</SelectItem>
                <SelectItem value="3.5-4.4">Good (3.5-4.4)</SelectItem>
                <SelectItem value="2.5-3.4">Fair (2.5-3.4)</SelectItem>
                <SelectItem value="0-2.4">Poor (0-2.4)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-secondary/20">
            <div className="flex items-center space-x-2 text-sm font-paragraph text-primary/70">
              <Filter className="w-4 h-4" />
              <span>{filteredClients.length} clients found</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setReliabilityFilter('');
                setFairnessFilter('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Client Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Card key={client._id} className="bg-background border-secondary/20 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                {/* Client Header */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center overflow-hidden">
                    {client.clientProfilePicture ? (
                      <Image
                        src={client.clientProfilePicture}
                        alt={client.clientName || 'Client'}
                        width={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <Users className="w-6 h-6 text-secondary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-primary truncate">
                      {client.clientName || 'Anonymous Client'}
                    </h3>
                    <p className="text-sm font-paragraph text-primary/60 truncate">
                      {client.clientEmail || 'No email provided'}
                    </p>
                    <div className="text-xs font-paragraph text-primary/50">
                      Member since {formatDate(client.registrationDate)}
                    </div>
                  </div>
                </div>

                {/* Rating Metrics */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-paragraph text-primary/70">Reliability</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-softyellowaccent fill-current" />
                        <span className={`font-paragraph font-medium ${getRatingColor(client.reliabilityRating || 0)}`}>
                          {(client.reliabilityRating || 0).toFixed(1)}
                        </span>
                      </div>
                      <Badge variant={getRatingBadgeVariant(client.reliabilityRating || 0)} className="text-xs">
                        {client.reliabilityRating >= 4.5 ? 'Excellent' : 
                         client.reliabilityRating >= 3.5 ? 'Good' : 
                         client.reliabilityRating >= 2.5 ? 'Fair' : 'Poor'}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-paragraph text-primary/70">Fairness</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Shield className="w-4 h-4 text-secondary" />
                        <span className={`font-paragraph font-medium ${getRatingColor(client.fairnessRating || 0)}`}>
                          {(client.fairnessRating || 0).toFixed(1)}
                        </span>
                      </div>
                      <Badge variant={getRatingBadgeVariant(client.fairnessRating || 0)} className="text-xs">
                        {client.fairnessRating >= 4.5 ? 'Excellent' : 
                         client.fairnessRating >= 3.5 ? 'Good' : 
                         client.fairnessRating >= 2.5 ? 'Fair' : 'Poor'}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-paragraph text-primary/70">Payment Punctuality</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-secondary" />
                        <span className={`font-paragraph font-medium ${getRatingColor(client.paymentPunctualityRating || 0)}`}>
                          {(client.paymentPunctualityRating || 0).toFixed(1)}
                        </span>
                      </div>
                      <Badge variant={getRatingBadgeVariant(client.paymentPunctualityRating || 0)} className="text-xs">
                        {client.paymentPunctualityRating >= 4.5 ? 'Excellent' : 
                         client.paymentPunctualityRating >= 3.5 ? 'Good' : 
                         client.paymentPunctualityRating >= 2.5 ? 'Fair' : 'Poor'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Dispute Information */}
                <div className="flex items-center justify-between p-3 bg-secondary/5 rounded-lg border border-secondary/20">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-paragraph text-primary/70">Disputes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-paragraph font-bold text-primary">
                      {client.disputeCount || 0}
                    </span>
                    <Badge variant={client.disputeCount === 0 ? 'default' : client.disputeCount <= 2 ? 'secondary' : 'destructive'} className="text-xs">
                      {client.disputeCount === 0 ? 'Clean' : client.disputeCount <= 2 ? 'Low' : 'High'}
                    </Badge>
                  </div>
                </div>

                {/* Overall Score */}
                <div className="mt-4 pt-4 border-t border-secondary/20">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-primary">Overall Score</span>
                    <div className="flex items-center space-x-2">
                      <div className="text-xl font-heading font-bold text-secondary">
                        {(((client.reliabilityRating || 0) + (client.fairnessRating || 0) + (client.paymentPunctualityRating || 0)) / 3).toFixed(1)}
                      </div>
                      <Award className="w-5 h-5 text-secondary" />
                    </div>
                  </div>
                  <div className="w-full bg-secondary/20 rounded-full h-2 mt-2">
                    <div 
                      className="bg-secondary rounded-full h-2 transition-all duration-300"
                      style={{ 
                        width: `${(((client.reliabilityRating || 0) + (client.fairnessRating || 0) + (client.paymentPunctualityRating || 0)) / 3) * 20}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredClients.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-secondary/50 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold text-primary mb-2">
              No clients found
            </h3>
            <p className="font-paragraph text-primary/70 mb-6">
              Try adjusting your search criteria or browse all client metrics
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setReliabilityFilter('');
                setFairnessFilter('');
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Information Panel */}
        <div className="mt-12">
          <Card className="bg-secondary/5 border-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-secondary" />
                <span>About Client Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-heading font-bold text-primary mb-3">How Ratings Work</h4>
                  <ul className="space-y-2 text-sm font-paragraph text-primary/70">
                    <li>• <strong>Reliability:</strong> Communication, meeting deadlines, project clarity</li>
                    <li>• <strong>Fairness:</strong> Reasonable expectations, scope changes, feedback quality</li>
                    <li>• <strong>Payment Punctuality:</strong> On-time payments, payment method reliability</li>
                    <li>• <strong>Disputes:</strong> Number of formal disputes raised by freelancers</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading font-bold text-primary mb-3">Freelancer Benefits</h4>
                  <ul className="space-y-2 text-sm font-paragraph text-primary/70">
                    <li>• Filter clients by rating before applying to jobs</li>
                    <li>• Make informed decisions about potential projects</li>
                    <li>• Avoid problematic clients with poor track records</li>
                    <li>• Focus on high-quality client relationships</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}