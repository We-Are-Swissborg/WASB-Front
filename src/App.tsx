import './App.scss'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Root from './routes/root.tsx'
import ErrorPage from './error-page.tsx'
import Blog from './component/blog.tsx'
import Home from './component/home.tsx'
import Contact from './component/contact.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: '/blog',
        element: <Blog />
      },
      {
        path: '/contact',
        element: <Contact />
      }
    ]
  },
])

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
