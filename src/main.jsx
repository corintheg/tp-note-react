import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter} from "react-router";
import { CollectionProvider } from './context/CollectionContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
        <CollectionProvider>
          <App />
        </CollectionProvider>
      </BrowserRouter>
  </StrictMode>,
)
