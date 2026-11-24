import React from 'react';
import { Layout } from './components/Layout';
import { CampusProvider, useCampus } from './context/CampusContext';
import { AboutPage } from './pages/AboutPage';
import { AcademicsPage } from './pages/AcademicsPage';
import { AssistantPage } from './pages/AssistantPage';
import { AuthPage } from './pages/AuthPage';
import { ClubsPage } from './pages/ClubsPage';
import { EventsPage } from './pages/EventsPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { HomePage } from './pages/HomePage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { StudentServicesPage } from './pages/StudentServicesPage';

const PageRouter: React.FC = () => {
  const { activePage } = useCampus();

  switch (activePage) {
    case 'home':
      return <HomePage />;
    case 'auth':
      return <AuthPage />;
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
    case 'about':
      return <AboutPage />;
    default:
      return <HomePage />;
  }
};

export default function App() {
  return (
    <CampusProvider>
      <Layout>
        <PageRouter />
      </Layout>
    </CampusProvider>
  );
}
