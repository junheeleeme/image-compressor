import React from 'react'
import { NavLink } from 'react-router-dom'
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
    position: absolute; top: 50%; left: 300px; transform: translate(0, -50%);
    
    & ul{ padding-left: 0; }
    & li{ display: inline-block; }
    & li a{ 
        display: inline-block; margin: 0 5px; padding: 5px 10px; font-size: 16px;
        color: #eee;
    }
    & .on { font-weight: bold; color: #fff; }
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
                        <NavLink to="/" exact activeClassName="on">COMPRESS IMAGE</NavLink>
                    </li>
                    <li>
                        <NavLink to="/webp" activeClassName="on">CONVERT to Webp</NavLink>
                    </li>
                </ul>
            </NavStyled>
        </HeaderStyled>
        </>
    )
}

export default Header;