import React from 'react'
import styled from 'styled-components';

const MainStyled = styled.main`
    position: relative;
`

const Main = ({children}) => {
    return(
        <MainStyled>
            {children}
        </MainStyled>
    )
}

export default Main;