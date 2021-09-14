import React from 'react'
import styled from 'styled-components';
import 'boxicons'

const AlertStyled = styled.div`
    position: absolute; top: 15px; right: 15px; border-radius: 50%; width: 35; height: 35px; 
    background-color:rgba(0,0,0, 0.1); transition: 0.45s ease;

    & box-icon{ width: 100%; height: 100%; transition: 0.5s ease; cursor: pointer; }
    &:hover { background-color:rgba(0,0,0, 0.4); }
    &:hover .msgBox{ opacity: 1; z-index: 9999; }
`
const MessageBox = styled.div`
    position: absolute; top: -10px; right:50px; font-size: 14px; line-height: 19px; color: #fff;
    width: 300px; padding: 15px;
    background-color: rgba(0,0,0,0.5); transition: .45s ease;
    z-index:-999; opacity: 0; 
`

const Alert = () => {
    return(
        <> 
            <AlertStyled>
                <box-icon name='error-circle' color='#ffffff' ></box-icon>
                <MessageBox className="msgBox">The selected image is not sent to the server, So you don't have to worry about Privacy.</MessageBox>
            </AlertStyled> 
        </>
    )
}

export default Alert;