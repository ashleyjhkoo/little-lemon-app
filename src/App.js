
import './App.css';
import { Provider } from "./Components/ui/provider"
import Header from './Components/Header';
import { Outlet } from 'react-router-dom';
// import Main from './Components/Main';     
import Footer from './Components/Footer';

function App() {
// another example of usage for the App function arguments: 'function App({Component, pageProps}) {'
  const navClass = 'bg-container_nav';
  const footerClass = 'bg-container_footer';

  return (
    <Provider>
      <Header className={navClass} />
      <main>
        <Outlet /> {/* This is the dynamin body content will be rendered */}
      </main>
      {/* <Main /> This was used before I applied the React Router nav menu items. */}
      <Footer className={footerClass} />
    </Provider>
  )
}

export default App;
 