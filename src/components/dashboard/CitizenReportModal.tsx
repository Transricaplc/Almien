import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Flame, 
  Car, 
  Droplets, 
  AlertTriangle,
  MapPin,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCreateCitizenReport } from '@/hooks/useCitizenReports';
import { toast } from 'sonner';

interface CitizenReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const quickReportTypes = [
  { 
    id: 'fire', 
    label: 'FIRE', 
    icon: Flame, 
    color: 'bg-red-500 hover:bg-red-600 border-red-400',
    iconColor: 'text-white'
  },
  { 
    id: 'accident', 
    label: 'ACCIDENT', 
    icon: Car, 
    color: 'bg-orange-500 hover:bg-orange-600 border-orange-400',
    iconColor: 'text-white'
  },
  { 
    id: 'water_spill', 
    label: 'WATER BURST', 
    icon: Droplets, 
    color: 'bg-blue-500 hover:bg-blue-600 border-blue-400',
    iconColor: 'text-white'
  },
  { 
    id: 'crime', 
    label: 'CRIME', 
    icon: AlertTriangle, 
    color: 'bg-purple-500 hover:bg-purple-600 border-purple-400',
    iconColor: 'text-white'
  },
];

const infrastructureTypes = [
  { value: 'pothole', label: 'Pothole' },
  { value: 'streetlight', label: 'Streetlight Out' },
  { value: 'illegal_dumping', label: 'Illegal Dumping' },
  { value: 'graffiti', label: 'Graffiti' },
  { value: 'broken_sidewalk', label: 'Broken Sidewalk' },
  { value: 'other', label: 'Other' },
];

const CitizenReportModal = ({ open, onOpenChange }: CitizenReportModalProps) => {
  const [submittedType, setSubmittedType] = useState<string | null>(null);
  const [infrastructureType, setInfrastructureType] = useState('');
  const [description, setDescription] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  const createReport = useCreateCitizenReport();

  const getCurrentLocation = (): Promise<{ latitude: number; longitude: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        toast.error('Geolocation is not supported by your browser');
        resolve(null);
        return;
      }

      setIsGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsGettingLocation(false);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setIsGettingLocation(false);
          console.error('Geolocation error:', error);
          toast.error('Could not get your location');
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  const handleQuickReport = async (reportType: string) => {
    const location = await getCurrentLocation();
    
    await createReport.mutateAsync({
      report_type: reportType,
      latitude: location?.latitude,
      longitude: location?.longitude,
    });

    setSubmittedType(reportType);
    setTimeout(() => {
      setSubmittedType(null);
    }, 2000);
  };

  const handleGeneralReport = async () => {
    if (!infrastructureType) {
      toast.error('Please select an infrastructure type');
      return;
    }

    const location = await getCurrentLocation();
    
    await createReport.mutateAsync({
      report_type: 'infrastructure',
      infrastructure_type: infrastructureType,
      description: description || undefined,
      latitude: location?.latitude,
      longitude: location?.longitude,
    });

    setInfrastructureType('');
    setDescription('');
    onOpenChange(false);
  };

  const isSubmitting = createReport.isPending || isGettingLocation;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-background/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Citizen Reporting
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Submit an emergency or infrastructure report. Location is captured automatically.
          </DialogDescription>
        </DialogHeader>

        {/* Quick Report Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Emergency Reports
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {quickReportTypes.map((type) => {
              const Icon = type.icon;
              const isThisSubmitted = submittedType === type.id;
              
              return (
                <Button
                  key={type.id}
                  onClick={() => handleQuickReport(type.id)}
                  disabled={isSubmitting}
                  className={cn(
                    'h-20 flex flex-col items-center justify-center gap-2 border-2 transition-all',
                    type.color,
                    isThisSubmitted && 'bg-emerald-500 border-emerald-400'
                  )}
                >
                  {isThisSubmitted ? (
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  ) : isSubmitting && !submittedType ? (
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  ) : (
                    <Icon className={cn('w-8 h-8', type.iconColor)} />
                  )}
                  <span className="font-tactical text-xs font-bold tracking-wider">
                    {isThisSubmitted ? 'SENT!' : type.label}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground font-tactical">
              or report infrastructure
            </span>
          </div>
        </div>

        {/* General Report Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Infrastructure Type
            </label>
            <Select value={infrastructureType} onValueChange={setInfrastructureType}>
              <SelectTrigger className="bg-card/50 border-border/50">
                <SelectValue placeholder="Select issue type..." />
              </SelectTrigger>
              <SelectContent>
                {infrastructureTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Description / Details
            </label>
            <Textarea
              placeholder="Provide additional details about the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-card/50 border-border/50 min-h-[80px] resize-none"
            />
          </div>

          <Button
            onClick={handleGeneralReport}
            disabled={isSubmitting || !infrastructureType}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Report'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CitizenReportModal;
