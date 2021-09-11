import React from 'react'
import styled from 'styled-components';

const LayoutStyled = styled.main`
    position: relative;

`

const Layout = ({children}) => {
    return(
        <LayoutStyled>
            {children}
        </LayoutStyled>
    )
}

export default Layout;