import React from 'react'
import styled from 'styled-components'
import logo from '../images/logo.png'

const HeaderStyled = styled.header`
    position: relative;
    height: 80px;
& .header-wrap{ position: absolute; top: 50%; left: 20px; transform: translate(0, -50%); cursor: pointer; }
& .header-wrap>img { display: inline-block; width: 40px; height: 40px; margin-right: 5px; vertical-align: middle; }
& .header-wrap>h1{
    display: inline-block; vertical-align: top; 
    font-size: 25px; color: #fff; transition: .3s ease;
}`


const Header = () => {
    return(
        <>
        <HeaderStyled>
            <div className="header-wrap">
                <img src={logo} alt="logo" /><h1>Tiny Image</h1>
            </div>
            
        </HeaderStyled>
        </>
    )
}

export default Header;