import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import logo from '../images/logo.png'
import 'boxicons'

const HeaderStyled = styled.header`
    position: relative;
    height: 80px;
& .header-wrap{ position: absolute; top: 50%; left: 20px; transform: translate(0, -50%); cursor: pointer;  }
& .header-wrap>a img { display: inline-block; width: 40px; height: 40px; margin-right: 5px; vertical-align: middle; }
& .header-wrap>a h1{
    display: inline-block; vertical-align: top; 
    font-size: 23px; color: #fff;
}`
const NavStyled = styled.nav`
    position: absolute; top: 50%; right: 10px; transform: translate(0, -50%);
    & ul{ padding-left: 0; }
    & li{ display: inline-block; position: relative; }
    & li a{ 
        display: inline-block; margin: 0 5px; padding: 5px 10px; font-size: 15px;
        color: #eee;
    }
    & ul .closeBtn{ display: none; }
    & .on { font-weight: bold; color: #fff;}
    & .on::after{ content: ''; position: absolute; bottom: 0; left: 50%; width: 90%; height: 2px; background-color: #fff; transform: translate(-50%, 0); }
    @media screen and (max-width: 768px){
        position: fixed; top: 0; left: ${props=> props.left}; transform: translate(0, 0);
        width: 100vw; height: 100vh; background-color: rgba(0,0,0,0.9);
        z-index: 9999; transition: left .3s ease;
        & ul li{ display: block; text-align: center; }
        & ul li a{ width:  100%; margin: 0; padding: 30px 0; font-size: 20px; }
        & ul .closeBtn{ 
            display: block; position: relative; height: 80px;
            & a{ padding: 0; width: 100%; height: 100%; }
            & a::after{ 
                content: ''; position: absolute; top: 50%; left: 50%;
                transform: translate(-50%, -50%) rotate(45deg); width: 35px; height: 5px; background-color: #fff;
            }
            & a::before{ 
                content: ''; position: absolute; top: 50%; left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg); width: 35px; height: 5px; background-color: #fff;
            }
        }
        & .on::after{ bottom: 0; width: 40%; }
        & .on::before{ content: ''; position: absolute; top: 0; left: 50%; width: 40%; height: 2px; background-color: #fff; transform: translate(-50%, 0); }
    }
`
const MobileMenu = styled.div`
    display: none; position: absolute; top: 50%; right: 20px; width: 35px; height: 35px;
    transform: translate(0, -50%); cursor: pointer;
    & box-icon{ width: 100%; height: 100%; }
@media screen and (max-width: 768px){
        display: block;
}
`

const Header = () => {

    const [isShow, setIsShow] = useState(false);

    const clickMobileMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if(isShow === true){
            setIsShow(false);
        }else{
            setIsShow(true);
        }
    }

    return(
        <>
        <HeaderStyled>
            <div className="header-wrap">
                <a href="/">
                    <img src={logo} alt="logo" /><h1>Tiny IMG</h1>
                </a>
            </div>
            <MobileMenu onClick={clickMobileMenu}>
                <box-icon className="menuBtn" name='menu' color="#ffffff"/>
            </MobileMenu>
            <NavStyled left={isShow === true ? '0vw' : '100vw'}>
                <ul>
                    <li className="closeBtn">
                        <a href="/" onClick={clickMobileMenu}></a>
                    </li>
                    <li onClick={clickMobileMenu}>
                        <NavLink to="/" exact activeClassName="on">COMPRESS IMAGE</NavLink>
                    </li>
                    <li onClick={clickMobileMenu}>
                        <NavLink to="/webp" activeClassName="on">CONVERT to Webp</NavLink>
                    </li>
                    <li onClick={clickMobileMenu}>
                        <NavLink to="/resize" activeClassName="on">RESIZE IMAGE</NavLink>
                    </li>
                </ul>
            </NavStyled>
        </HeaderStyled>
        </>
    )
}

export default Header;