import React from 'react';
import Navigation from './src/navigation/Navigation';
import { AuthProvider } from './AuthContext';
import { ColetaProvider } from './ColetaContext';

const App = () => {
  return (
    <AuthProvider>
      <ColetaProvider>
        <Navigation />
      </ColetaProvider>
    </AuthProvider>
  );
};

export default App;
