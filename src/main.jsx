import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
// use react-router-dom in web apps
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './components/ThemeProvider';
import { ToastProvider } from './components/ui/toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>
);