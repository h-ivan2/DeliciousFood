import{BrowserRouter,Routes,Route} from 'react-router-dom';
import{ThemeProvider} from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup  from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';


export default function App(){
  return(
    <ThemeProvider>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/Signup' element={<Signup/>}/>
        <Route path='/admin' element={<AdminDashboard/>}/>
      </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}