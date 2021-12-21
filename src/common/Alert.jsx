import React from 'react'
import styled from 'styled-components';
import 'boxicons'

const AlertStyled = styled.div`
    position: absolute; top: 15px; right: 15px; border-radius: 17.5px; width: 35px; height: 35px; 
    background-color:rgba(0, 0, 0, 0.4); transition: 0.45s ease;  z-index: 9998;
    @media screen and (max-width: 600px){
        top: 10px; right: 10px; border-radius: 17.5px; width: 35px; height: 35px; 
    }
    & box-icon{ width: 100%; height: 100%; transition: 0.5s ease; cursor: pointer; }
    &:hover { background-color:rgba(0,0,0, 0.8); }
    &:hover ~ .alertMsg{ opacity: 1; z-index: 9999; }
`
const MessageBox = styled.div`
    position: absolute; top: 5px; right: 70px; font-size: 14px; line-height: 19px; color: #fff;
    width: 300px; padding: 15px; transition: .45s ease;
    border-radius: 10px; background-color: rgba(0,0,0,0.75);
    z-index: 0; opacity: 0;
    &::after{ 
        content: ''; 
        position: absolute; top: 15px; right: -15px;
        width: 0; height: 0;
	    border-top: 12px solid transparent; border-bottom: 12px solid transparent; border-left: 15px solid rgba(0,0,0,0.75);/* 화살표 */
    }
    @media screen and (max-width: 600px){
        top: -3px; right: 65px; width: 260px;
        &::after{ top: 18px; }
    }`

    

const Alert = () => {
    
    return(
        <> 
            <AlertStyled>
                <box-icon name='error-circle' color='#ffffff' ></box-icon>
            </AlertStyled> 
            <MessageBox className="alertMsg">Selected images is not sent to the server, So you don't have to worry about Privacy.</MessageBox>
        </>
    )
}

export default Alert;