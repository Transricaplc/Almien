import { useState, useMemo } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Camera, TrafficCone, AlertTriangle, MapPin, Search, 
  ArrowUpDown, ChevronDown, ChevronUp, Filter, Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  cctvMarkers, trafficLightMarkers, highRiskMarkers, accidentHotspots,
  MapMarker
} from '@/data/mapData';
import { useDashboard } from '@/contexts/DashboardContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SortField = 'name' | 'area' | 'type' | 'status';
type SortDirection = 'asc' | 'desc';

const MapDataTable = () => {
  const { selectEntity } = useDashboard();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Combine all markers
  const allMarkers = useMemo(() => [
    ...cctvMarkers,
    ...trafficLightMarkers,
    ...highRiskMarkers,
    ...accidentHotspots,
  ], []);

  // Get unique values for filters
  const types = useMemo(() => 
    [...new Set(allMarkers.map(m => m.type))], 
    [allMarkers]
  );

  const statuses = useMemo(() => 
    [...new Set(allMarkers.map(m => m.status).filter(Boolean))], 
    [allMarkers]
  );

  // Filter and sort markers
  const filteredMarkers = useMemo(() => {
    let result = [...allMarkers];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(m => 
        m.name.toLowerCase().includes(query) ||
        m.area.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter(m => m.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(m => m.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortField] || '';
      let bVal = b[sortField] || '';
      
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [allMarkers, searchQuery, typeFilter, statusFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRowClick = (marker: MapMarker) => {
    selectEntity({
      id: marker.id,
      type: marker.type === 'cctv' ? 'cctv' : 
            marker.type === 'traffic_light' ? 'traffic_signal' : 
            marker.type === 'high_risk' ? 'incident' : 'infrastructure',
      name: marker.name,
      coordinates: { lat: marker.lat, lng: marker.lng },
      data: {
        area: marker.area,
        status: marker.status,
        lastInspection: marker.lastInspection,
      },
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cctv': return <Camera className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />;
      case 'traffic_light': return <TrafficCone className="w-3.5 h-3.5 text-green-500" aria-hidden="true" />;
      case 'high_risk': return <AlertTriangle className="w-3.5 h-3.5 text-orange-500" aria-hidden="true" />;
      case 'accident_hotspot': return <MapPin className="w-3.5 h-3.5 text-red-500" aria-hidden="true" />;
      default: return <MapPin className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    const variants: Record<string, string> = {
      operational: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      faulty: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      offline: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return (
      <Badge 
        variant="outline" 
        className={cn('text-[10px] font-mono', variants[status] || '')}
      >
        {status.toUpperCase()}
      </Badge>
    );
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />;
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-3 h-3 ml-1" /> 
      : <ChevronDown className="w-3 h-3 ml-1" />;
  };

  return (
    <div className="h-full flex flex-col bg-card/50 rounded-lg border border-border/50">
      {/* Filters */}
      <div 
        className="p-3 border-b border-border/50 space-y-2"
        role="search"
        aria-label="Filter infrastructure data"
      >
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
            <Input
              type="search"
              placeholder="Search by name or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs"
              aria-label="Search infrastructure"
            />
          </div>
          <Filter className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-7 text-[10px] flex-1" aria-label="Filter by type">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map(type => (
                <SelectItem key={type} value={type}>
                  {type.replace('_', ' ').toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-7 text-[10px] flex-1" aria-label="Filter by status">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statuses.map(status => (
                <SelectItem key={status} value={status!}>
                  {status?.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <div className="px-3 py-1.5 text-[10px] font-mono text-muted-foreground border-b border-border/30">
        Showing {filteredMarkers.length} of {allMarkers.length} assets
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto" role="region" aria-label="Infrastructure data table">
        <Table>
          <TableHeader className="sticky top-0 bg-card z-10">
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>
                <button 
                  onClick={() => handleSort('name')}
                  className="flex items-center hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-1"
                  aria-label={`Sort by name ${sortField === 'name' ? (sortDirection === 'asc' ? 'descending' : 'ascending') : ''}`}
                >
                  Name <SortIcon field="name" />
                </button>
              </TableHead>
              <TableHead>
                <button 
                  onClick={() => handleSort('type')}
                  className="flex items-center hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-1"
                  aria-label={`Sort by type ${sortField === 'type' ? (sortDirection === 'asc' ? 'descending' : 'ascending') : ''}`}
                >
                  Type <SortIcon field="type" />
                </button>
              </TableHead>
              <TableHead>
                <button 
                  onClick={() => handleSort('area')}
                  className="flex items-center hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-1"
                  aria-label={`Sort by area ${sortField === 'area' ? (sortDirection === 'asc' ? 'descending' : 'ascending') : ''}`}
                >
                  Area <SortIcon field="area" />
                </button>
              </TableHead>
              <TableHead>
                <button 
                  onClick={() => handleSort('status')}
                  className="flex items-center hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-1"
                  aria-label={`Sort by status ${sortField === 'status' ? (sortDirection === 'asc' ? 'descending' : 'ascending') : ''}`}
                >
                  Status <SortIcon field="status" />
                </button>
              </TableHead>
              <TableHead className="w-16 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMarkers.map((marker, idx) => (
              <TableRow 
                key={marker.id}
                className="cursor-pointer hover:bg-primary/5 focus-within:bg-primary/10"
                onClick={() => handleRowClick(marker)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleRowClick(marker);
                  }
                }}
                role="button"
                aria-label={`View details for ${marker.name}`}
              >
                <TableCell className="font-mono text-[10px] text-muted-foreground">
                  {idx + 1}
                </TableCell>
                <TableCell className="font-medium text-xs">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(marker.type)}
                    <span className="truncate max-w-[150px]">{marker.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-[10px] font-mono text-muted-foreground">
                  {marker.type.replace('_', ' ')}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {marker.area}
                </TableCell>
                <TableCell>
                  {getStatusBadge(marker.status)}
                </TableCell>
                <TableCell className="text-right">
                  <button 
                    className="p-1.5 rounded hover:bg-primary/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(marker);
                    }}
                    aria-label={`View details for ${marker.name}`}
                  >
                    <Eye className="w-3.5 h-3.5 text-primary" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MapDataTable;
