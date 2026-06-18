import { BundleProvider } from './context/BundleContext';
import BundleBuilder from './components/BundleBuilder';
import './App.css';

function App() {
  return (
    <BundleProvider>
      <BundleBuilder />
    </BundleProvider>
  );
}

export default App;
