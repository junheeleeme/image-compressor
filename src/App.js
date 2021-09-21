import './App.css';
import { Route, Switch } from 'react-router';
import styled from 'styled-components';
import Header from './common/Header';
import Footer from './common/Footer';
import Main from './Layout/Main';
import Compressor from './pages/Compressor';
import WebpConverter from './pages/WebpConverter';
import Resize from './pages/Resize';
// import { fireapp } from './common/firebase';

const AppStyled = styled.div`
  position: relative;
  max-width: 900px;
  min-height: 100vh;
`

function App() {

  return (
    <AppStyled className="App">
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

export default App;
