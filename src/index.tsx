import React from 'react';
import './index.css';
import { render } from 'react-dom';
import { App } from './App';
// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('Service Worker registered:', registration);
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available, prompt user to refresh
              if (confirm('New version available! Reload to update?')) {
                window.location.reload();
              }
            }
          });
        }
      });
    }).catch(error => {
      console.error('Service Worker registration failed:', error);
    });
  });
}
render(<App />, document.getElementById('root'));