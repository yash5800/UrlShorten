import { BrowserRouter , Route, Routes  } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import { useState } from 'react';
import { AuthContext } from './context/lib';
import Admin from './components/Admin';


const App = () => {
  const [login, setLogin] = useState('');

  const end = import.meta.env.VITE_BASIC_AUTH_URL ;

  return (
    <AuthContext.Provider value={{login, setLogin, end}}>
      <BrowserRouter basename="/UrlShorten/">
        <Routes>
          <Route path="*" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App