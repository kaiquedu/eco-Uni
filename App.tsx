import React from 'react';
import Navigation from './src/navigation/Navigation';
import { AuthProvider } from './AuthContext';


const App = () => {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
};

export default App;