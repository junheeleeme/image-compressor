import React, { useEffect, useState } from "react";
import styled from 'styled-components';

const FooterStyled = styled.footer`
    position: relative;
    width: 100%;
    height: 30px;
    text-align: center;`

const SpanStyled = styled.span`
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    font-size: 12px;
    line-height: 19px;
    color: #fff;
@media screen and (max-width: 486px){ font-size: 12px; }
`

const Footer = () => {

    const [year, setYear] = useState('');

    useEffect(()=>{
        setYear(new Date().getFullYear());
        
    }, []);


    return(
        <FooterStyled>
            
                <SpanStyled>
                    Contact Us : macjjuni@gmail.com<br/>    
                    Copyright © {year} juni-official All rights reserved.
                </SpanStyled>
            
        </FooterStyled>
    )
}

export default Footer;