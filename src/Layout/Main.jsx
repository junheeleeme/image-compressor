import React from 'react'
import styled from 'styled-components';

const MainStyled = styled.main`
    position: relative; display: block;
    min-height: calc(100vh - 120px);
    padding: 40px 0;
`

const Main = ({children}) => {
    return(
        <MainStyled>
            {children}
        </MainStyled>
    )
}

export default Main;