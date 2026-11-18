import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// il sito si apre sempre in inglese: si cancella la vecchia preferenza di lingua salvata dalle prime versioni
try {
  localStorage.removeItem('wt-lang');
} catch {}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
