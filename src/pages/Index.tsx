import { lazy, Suspense } from 'react';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { WildfireProvider } from '@/contexts/WildfireContext';

const GridifyDashboard = lazy(() => import('@/components/dashboard/GridifyDashboard'));

const Index = () => (
  <DashboardProvider>
    <WildfireProvider>
      <Suspense fallback={<div className="h-screen bg-background" />}>
        <GridifyDashboard />
      </Suspense>
    </WildfireProvider>
  </DashboardProvider>
);

export default Index;
