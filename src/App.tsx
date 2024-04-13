import './App.scss'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Root from './routes/root.tsx'
import ErrorPage from './hook/Error-page.tsx'
import Blog from './component/blog.tsx'
import Home from './component/home.tsx'
import Contact from './component/contact.tsx'
import Register from './component/register.tsx'
import Setting from './component/setting.tsx'

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
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/setting',
        element: <Setting />
      }
    ]
  },
])
// console.log('import.meta.env.VITE_CHAIN_PROVIDER', import.meta.env.VITE_CHAIN_PROVIDER);

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

  // window.document.title =

  // const [api, setApi] = useState(null);
  // const [keyring, setKeyring] = useState(null);
  // const [account, setAccount] = useState('');
  // const [message, setMessage] = useState('');
  // const [signature, setSignature] = useState('');

  // const connectToPolkadot = async () => {
  //   await cryptoWaitReady();
  //   const provider = new WsProvider(import.meta.env.VITE_CHAIN_PROVIDER);
  //   const api = await ApiPromise.create({ provider });
  //   const keyring = new Keyring({ type: 'sr25519' });
  //   setApi(api);
  //   setKeyring(keyring);

  //   // Retrieve the chain name
  //   const chain = await api.rpc.system.chain();

  //   // Retrieve the latest header
  //   const lastHeader = await api.rpc.chain.getHeader();

  //   // Log the information
  //   console.log(`${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`);
  // };

  // const signMessage = async () => {
  //   if (api && keyring && account && message) {
  //     const msg = stringToU8a(message);
  //     console.log("vos donnée mon enfant !", keyring);
  //     const message = stringToU8a('this is our message');
  //     const signature = keyring.sign(message);
  //     const isValid = keyring.verify(message, signature, alice.publicKey);
  //     setSignature(signature);
  //   } else {
  //     alert('Please connect to Polkadot and provide account and message.');
  //   }
  // };

  // const handleAccountChange = (event) => {
  //   setAccount(event.target.value);
  // };

  // const handleMessageChange = (event) => {
  //   setMessage(event.target.value);
  // };

  return (
    <>
      {/* <h1>Connect to Polkadot and Sign Message</h1>
      <button onClick={connectToPolkadot}>Connect to Polkadot</button>
      <div>
        <input type="text" value={account} onChange={handleAccountChange} placeholder="Enter Polkadot account" />
      </div>
      <div>
        <input type="text" value={message} onChange={handleMessageChange} placeholder="Enter message to sign" />
      </div>
      <button onClick={signMessage}>Sign Message</button> */}
      <RouterProvider router={router} />
    </>
  )
}

export default App
