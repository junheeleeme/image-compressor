import React from 'react'
import { Link } from 'react-router-dom'
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
const NavStyled = styled.nav`
    float: right;
    & ul{ padding-left: 0; }
    & li{ display: inline-block; }
    & li a{ display: inline-block; padding: 5px 10px; border: 1px solid #000; }
`

const Header = () => {
    return(
        <>
        <HeaderStyled>
            <div className="header-wrap">
                <img src={logo} alt="logo" /><h1>Tiny Image</h1>
            </div>
            <NavStyled>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/webp-converter">Webp</Link>
                    </li>
                </ul>
            </NavStyled>
        </HeaderStyled>
        </>
    )
}

export default Header;