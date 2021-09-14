import './App.css';
import styled from 'styled-components';
import Header from './common/Header';
import Footer from './common/Footer';
import Main from './Layout/Main';
import Compressor from './pages/Compressor';
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
        <Main>
          <Compressor/>
        </Main>
      <Footer/>
    </AppStyled>
  );
}

export default App;
