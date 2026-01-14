import { useState } from 'react';
import { 
  Download, FileText, FileSpreadsheet, FileImage,
  Calendar, Filter, Check, Loader2, ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ExportFormat = 'csv' | 'pdf' | 'json';
type DataType = 'roads' | 'cctv' | 'incidents' | 'wards' | 'all';

const ExportPanel = () => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
  const [selectedData, setSelectedData] = useState<DataType[]>(['all']);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [isExporting, setIsExporting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const formats = [
    { id: 'csv' as const, name: 'CSV', icon: FileSpreadsheet, description: 'Spreadsheet compatible' },
    { id: 'pdf' as const, name: 'PDF', icon: FileText, description: 'Print-ready report' },
    { id: 'json' as const, name: 'JSON', icon: FileImage, description: 'Developer format' },
  ];

  const dataTypes = [
    { id: 'all' as const, name: 'All Data' },
    { id: 'roads' as const, name: 'Roads Status' },
    { id: 'cctv' as const, name: 'CCTV Infrastructure' },
    { id: 'incidents' as const, name: 'Incident Reports' },
    { id: 'wards' as const, name: 'Ward Statistics' },
  ];

  const toggleDataType = (id: DataType) => {
    if (id === 'all') {
      setSelectedData(['all']);
    } else {
      const newSelection = selectedData.includes(id)
        ? selectedData.filter(d => d !== id)
        : [...selectedData.filter(d => d !== 'all'), id];
      setSelectedData(newSelection.length === 0 ? ['all'] : newSelection);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock data
    const mockData = {
      exportDate: new Date().toISOString(),
      format: selectedFormat,
      dataTypes: selectedData,
      records: 1250,
    };

    if (selectedFormat === 'json') {
      const blob = new Blob([JSON.stringify(mockData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bluewhale-export-${Date.now()}.json`;
      a.click();
    } else if (selectedFormat === 'csv') {
      const csv = 'Area,SafetyScore,CCTVCount,Incidents\nCBD,72,48,8\nSea Point,88,42,2\nKhayelitsha,25,18,32';
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bluewhale-export-${Date.now()}.csv`;
      a.click();
    }

    setIsExporting(false);
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/10 px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">Export & Reports</h3>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Filter className="w-3 h-3" />
            Filters
            <ChevronDown className={cn('w-3 h-3 transition-transform', showFilters && 'rotate-180')} />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="p-3 border-b border-border/50 space-y-3 animate-fade-in">
          {/* Date Range */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-muted-foreground block mb-1">From</label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                className="w-full px-2 py-1.5 bg-background/50 border border-border rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground block mb-1">To</label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                className="w-full px-2 py-1.5 bg-background/50 border border-border rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Data Type Selection */}
          <div>
            <label className="text-[10px] text-muted-foreground block mb-1">Include Data</label>
            <div className="flex flex-wrap gap-1.5">
              {dataTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => toggleDataType(type.id)}
                  className={cn(
                    'px-2 py-1 rounded text-[10px] font-medium transition-colors',
                    selectedData.includes(type.id)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                  )}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Format Selection */}
      <div className="p-3 space-y-2">
        <label className="text-xs text-muted-foreground block">Export Format</label>
        <div className="grid grid-cols-3 gap-2">
          {formats.map(format => {
            const Icon = format.icon;
            return (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={cn(
                  'p-3 rounded-lg border transition-all text-center',
                  selectedFormat === format.id
                    ? 'bg-primary/10 border-primary text-foreground'
                    : 'bg-background/50 border-border text-muted-foreground hover:border-primary/50'
                )}
              >
                <Icon className={cn(
                  'w-6 h-6 mx-auto mb-1',
                  selectedFormat === format.id ? 'text-primary' : ''
                )} />
                <div className="font-bold text-xs">{format.name}</div>
                <div className="text-[10px] opacity-70">{format.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Export Button */}
      <div className="p-3 pt-0">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className={cn(
            'w-full py-3 rounded-lg font-bold text-sm transition-all',
            'bg-primary text-primary-foreground hover:bg-primary/90',
            'flex items-center justify-center gap-2',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Export {selectedFormat.toUpperCase()}
            </>
          )}
        </button>
      </div>

      {/* Quick Stats */}
      <div className="px-4 py-2 bg-background/30 border-t border-border grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="font-mono font-bold text-sm text-foreground">1,250</div>
          <div className="text-[10px] text-muted-foreground">Records</div>
        </div>
        <div>
          <div className="font-mono font-bold text-sm text-foreground">8</div>
          <div className="text-[10px] text-muted-foreground">Tables</div>
        </div>
        <div>
          <div className="font-mono font-bold text-sm text-foreground">~2.4MB</div>
          <div className="text-[10px] text-muted-foreground">Est. Size</div>
        </div>
      </div>
    </div>
  );
};

export default ExportPanel;
