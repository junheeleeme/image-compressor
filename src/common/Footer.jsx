import React, { useEffect, useState } from "react";
import "boxicons"
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
const QuestionBox = styled.div`
    position: relative; display: inline-block; width: 20px; height: 20px; margin: 0 5px;
    cursor: pointer;
    &:after{ 
        position: absolute; top: 50%; left: 30px; transform: translate(0, -50%);
        width: 0; opacity: 0; content: '';  background-color: rgba(0,0,0, 0.3);
        transition: 0.2s ease;
    }
    &:hover{ 
        &:after{ width: auto; opacity: 1; padding: 5px 10px; content: 'macjjuni@gmail.com'; }
    }

    }
    
`

const Footer = () => {

    const [year, setYear] = useState('');

    useEffect(()=>{
        setYear(new Date().getFullYear());
        
    }, []);


    return(
        <FooterStyled>
            
                <SpanStyled>
                    Copyright © {year} juni-official All rights reserved.
                    <QuestionBox>
                        ✉️
                    </QuestionBox>
                </SpanStyled>
            
        </FooterStyled>
    )
}

export default Footer;