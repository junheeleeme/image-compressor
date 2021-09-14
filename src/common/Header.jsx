import React from 'react'
import styled from 'styled-components'

const HeaderStyled = styled.header`
    position: relative;
    height: 80px;
& h1{
    display: inline-block; 
    position: absolute; top: 52%; left: 20px; transform: translate(0, -50%);
    font-size: 25px; color: #fff; transition: .3s ease; cursor: pointer;
    &:hover{ color: #EDFFA9; }
}`


const Header = () => {
    return(
        <>
        <HeaderStyled>
            <h1>Tiny Image</h1>
        </HeaderStyled>
        </>
    )
}

export default Header;