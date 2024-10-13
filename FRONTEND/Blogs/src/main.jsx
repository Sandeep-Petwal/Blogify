import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";
import router from '../router/router.jsx';
import { BlogContextProvider } from './context/BlogContext.jsx';

createRoot(document.getElementById('root')).render(
  <>
    <div className="main min-h-screen bg-gray-950">
      <BlogContextProvider >
        <RouterProvider router={router} />
      </BlogContextProvider>
    </div>
  </>,
)
