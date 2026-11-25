import React from 'react';
import { Layout } from './components/Layout';
import { CampusProvider, useCampus } from './context/CampusContext';
import { AcademicsPage } from './pages/AcademicsPage';
import { AssistantPage } from './pages/AssistantPage';
import { ClubsPage } from './pages/ClubsPage';
import { EventsPage } from './pages/EventsPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { HomePage } from './pages/HomePage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { StudentServicesPage } from './pages/StudentServicesPage';
import { WelcomePage } from './pages/WelcomePage';

const PageRouter: React.FC = () => {
  const { activePage } = useCampus();

  switch (activePage) {
    case 'home':
      return <HomePage />;
    case 'assistant':
      return <AssistantPage />;
    case 'facilities':
      return <FacilitiesPage />;
    case 'clubs':
      return <ClubsPage />;
    case 'events':
      return <EventsPage />;
    case 'academics':
      return <AcademicsPage />;
    case 'services':
      return <StudentServicesPage />;
    case 'knowledge-base':
      return <KnowledgeBasePage />;
    default:
      return <HomePage />;
  }
};

const AppShell: React.FC = () => {
  const { hasEnteredDashboard } = useCampus();

  if (!hasEnteredDashboard) {
    return <WelcomePage />;
  }

  return (
    <Layout>
      <PageRouter />
    </Layout>
  );
};

export default function App() {
  return (
    <CampusProvider>
      <AppShell />
    </CampusProvider>
  );
}
