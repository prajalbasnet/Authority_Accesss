import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Landing from './components/Landing';

function App() {
  return (
    <AuthProvider>
      <Landing />
    </AuthProvider>
  );
}

export default App;