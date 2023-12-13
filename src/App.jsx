import Mainform from './components/Mainform';
import Navabar from './components/navabar';
import './App.css'
import Listofusers from './components/Listofusers';
import { Route,Routes } from 'react-router-dom'



function App() {
  return (
    <div className=' w-screen h-screen overflow-hidden '>
      <Navabar />
      <Routes>
        <Route index Component={Mainform} />
        <Route path='listofusers' Component={Listofusers} />
      </Routes>
     
    </div>
  )

}

export default App


