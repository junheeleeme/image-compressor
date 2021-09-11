import React from 'react'
import styled from 'styled-components';

const FooterStyled = styled.footer`
    position: absolute; bottom: 0; left: 0;
    width: 100%; height: 40px;border: 1px solid #000;
`

const Footer = () => {
    return(
        <FooterStyled>
            푸터
        </FooterStyled>
    )
}

export default Footer;