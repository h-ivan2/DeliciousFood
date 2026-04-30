import{BrowserRouter,Routes,Route} from 'react-router-dom';
import{ThemeProvider} from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup  from './pages/Signup'


export default function App(){
  return(
    <ThemeProvider>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/Signup' element={<Signup/>}/>
      </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}