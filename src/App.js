
import './App.css';
import { Provider } from "./Components/ui/provider"
import Header from './Components/Header';
import Main from './Components/Main';     
import Footer from './Components/Footer';

function App() {
// another example of usage for the App function arguments: 'function App({Component, pageProps}) {'
  const navClass = 'bg-container_nav';
  const footerClass = 'bg-container_footer';

  return (
    <Provider>
      <Header className={navClass} />
      <Main />
      <Footer className={footerClass} />
    </Provider>
  )
}

export default App;
 