import './App.css';
import { Route, Switch } from 'react-router';
import styled from 'styled-components';
import Header from './common/Header';
import Footer from './common/Footer';
import Compressor from './pages/Compressor';
import WebpConverter from './pages/WebpConverter';
import Resize from './pages/Resize';
import { useEffect, useState } from 'react';

function App() {
  const [load, setLoad] = useState(false);
  useEffect(()=>{
    setLoad(true);
  }, []);

  return (
    <AppStyled className={load === true ? 'loaded app': 'app'}>
      <Header/>
          <Switch>
            <Route path="/" exact component={Compressor} />
            <Route path="/webp" exact component={WebpConverter} />
            <Route path="/resize" exact component={Resize} />
          </Switch>
      <Footer/>
    </AppStyled>
  );
}

const AppStyled = styled.div`
  position: relative;
  max-width: 900px;
  min-height: 100vh;
  &.loaded{
    animation: loadEffect 1s ease backwards;
  }
  @keyframes loadEffect{
    0%{ opacity: 0; }
    100%{ opacity: 1; }
  }
`


export default App;
