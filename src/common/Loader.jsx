import React from 'react'
import styled from 'styled-components';


const WrapStyled = styled.div`
    position: absolute;
    top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 200;
    background-color: rgba(0,0,0, 0.4); padding: 70px 50px 40px 50px;`
const H1Styled = styled.h1`
    text-align: center;
`

const Loader = () => {
    return(
        <>
            <WrapStyled>
                <H1Styled className="title">Waiting...</H1Styled>
                <div className="rainbow-marker-loader"></div>
            </WrapStyled>
        </>
    )
}

export default Loader;