import { useState } from 'react';
import BapyakForm from './BapyakForm';
import BapyakCalendar from './BapyakCalendar';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleCreateSuccess = () => {
    setActiveTab('dashboard');
  };

  return (
    <div>
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-6 text-sm font-medium transition-colors duration-300 ${activeTab === 'dashboard' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}
              >
                Bapyak Calendar
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`py-4 px-6 text-sm font-medium transition-colors duration-300 ${activeTab === 'create' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}
              >
                Create New
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {activeTab === 'dashboard' ? <BapyakCalendar /> : <BapyakForm onSuccess={handleCreateSuccess} />}
      </main>
    </div>
  );
}

export default App;
