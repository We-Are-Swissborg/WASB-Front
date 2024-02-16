import './App.scss'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Root from './routes/root.tsx'
import ErrorPage from './error-page.tsx'
import Blog from './component/blog.tsx'
import Home from './component/home.tsx'
import Contact from './component/contact.tsx'
import { useEffect, useState } from 'react'
import { ConnectionState } from './component/ConnectionState.tsx'
import { socket } from './socket';
import { ConnectionManager } from './component/ConnectionManager.tsx'

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
  // const [isConnected, setIsConnected] = useState(socket.connected);

  // useEffect(() => {
  //   function onConnect() {
  //     setIsConnected(true);
  //   }

  //   function onDisconnect() {
  //     setIsConnected(false);
  //   }

  //   socket.on('connect', onConnect);
  //   socket.on('disconnect', onDisconnect);

  //   return () => {
  //     socket.off('connect', onConnect);
  //     socket.off('disconnect', onDisconnect);
  //   };
  // }, []);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
