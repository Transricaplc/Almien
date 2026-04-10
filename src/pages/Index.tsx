import { lazy, Suspense } from 'react';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { WildfireProvider } from '@/contexts/WildfireContext';

const AlmienDashboard = lazy(() => import('@/components/dashboard/AlmienDashboard'));

const Index = () => (
  <DashboardProvider>
    <WildfireProvider>
      <Suspense fallback={<div className="h-screen bg-background" />}>
        <AlmienDashboard />
      </Suspense>
    </WildfireProvider>
  </DashboardProvider>
);

export default Index;
