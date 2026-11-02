import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import App from './App';
import { FeedbackProvider } from './lib/feedback';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <FeedbackProvider>
        <App />
      </FeedbackProvider>
    </MotionConfig>
  </StrictMode>,
);
