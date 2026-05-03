import { Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { useCitizenReports } from '@/hooks/useCitizenReports';
import { formatDistanceToNow } from 'date-fns';
import { Phone, Clock, AlertTriangle } from 'lucide-react';
import { createTacticalClusterIcon } from '@/components/map/clusterIcon';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

interface CitizenReportsLayerProps {
  visible: boolean;
  reportTypes?: string[];
}

// Color mapping for report types
const getReportColor = (type: string) => {
  const colors: Record<string, string> = {
    fire: '#ef4444',
    accident: '#f97316',
    crime: '#dc2626',
    water_spill: '#3b82f6',
    infrastructure: '#8b5cf6',
    pothole: '#a16207',
    streetlight: '#eab308',
    illegal_dumping: '#84cc16',
    graffiti: '#ec4899',
    broken_sidewalk: '#6b7280',
    other: '#6b7280',
  };
  return colors[type] || '#6b7280';
};

// Emoji icons for report types
const getReportEmoji = (type: string) => {
  const emojis: Record<string, string> = {
    fire: '🔥',
    accident: '🚗',
    crime: '⚠️',
    water_spill: '💧',
    infrastructure: '🔧',
    pothole: '🕳️',
    streetlight: '💡',
    illegal_dumping: '🗑️',
    graffiti: '🎨',
    broken_sidewalk: '🚧',
    other: '📍',
  };
  return emojis[type] || '📍';
};

// Create custom icon for citizen reports
const createReportIcon = (type: string, status: string) => {
  const color = getReportColor(type);
  const emoji = getReportEmoji(type);
  const isPending = status === 'pending';
  const pulseStyle = isPending ? 'animation: pulse 2s infinite;' : '';
  
  return L.divIcon({
    html: `
      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      </style>
      <div style="
        background: ${color};
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        ${pulseStyle}
      ">
        ${emoji}
      </div>
    `,
    className: 'citizen-report-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return '#eab308';
    case 'investigating': return '#3b82f6';
    case 'resolved': return '#22c55e';
    default: return '#6b7280';
  }
};

const CitizenReportsLayer = ({ visible, reportTypes }: CitizenReportsLayerProps) => {
  const { data: reports, isLoading } = useCitizenReports();
  const map = useMap();

  if (!visible || isLoading || !reports) return null;

  // Filter reports with valid coordinates
  const mappableReports = reports.filter(r => r.latitude && r.longitude);
  
  // Filter by type if specified
  const filteredReports = reportTypes 
    ? mappableReports.filter(r => reportTypes.includes(r.report_type) || reportTypes.includes(r.infrastructure_type || ''))
    : mappableReports;

  return (
    <MarkerClusterGroup
      chunkedLoading
      iconCreateFunction={createTacticalClusterIcon}
      maxClusterRadius={50}
      showCoverageOnHover={false}
      spiderfyOnMaxZoom
    >
      {filteredReports.map((report) => (
        <Marker
          key={report.id}
          position={[Number(report.latitude), Number(report.longitude)]}
          icon={createReportIcon(report.infrastructure_type || report.report_type, report.status)}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getReportEmoji(report.infrastructure_type || report.report_type)}</span>
                  <div>
                    <div className="font-bold text-sm capitalize">
                      {(report.infrastructure_type || report.report_type).replace(/_/g, ' ')}
                    </div>
                    <div 
                      className="text-xs px-1.5 py-0.5 rounded inline-block mt-0.5 font-medium capitalize"
                      style={{ 
                        backgroundColor: `${getStatusColor(report.status)}20`,
                        color: getStatusColor(report.status)
                      }}
                    >
                      {report.status}
                    </div>
                  </div>
                </div>
              </div>

              {report.description && (
                <div className="text-xs text-muted-foreground mb-2 line-clamp-3">
                  {report.description}
                </div>
              )}

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}</span>
              </div>

              {report.status === 'pending' && (
                <div className="mt-2 bg-amber-500/10 border border-amber-500/30 rounded p-1.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                  <span className="text-xs text-amber-600">Awaiting response</span>
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
};

export default CitizenReportsLayer;
