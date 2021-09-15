import React from 'react'
import styled from 'styled-components';
import 'boxicons'

const AlertStyled = styled.div`
    position: absolute; top: 15px; right: 15px; border-radius: 50%; width: 35; height: 35px; 
    background-color:rgba(0,0,0, 0.4); transition: 0.45s ease;  z-index: 9999;
    @media screen and (max-width: 600px){
        top: 20px; right: 20px;
    }
    & box-icon{ width: 100%; height: 100%; transition: 0.5s ease; cursor: pointer; }
    &:hover { background-color:rgba(0,0,0, 0.8); }
    &:hover .msgBox{ opacity: 1; }`
const MessageBox = styled.div`
    position: absolute; top: -10px; right:55px; font-size: 14px; line-height: 19px; color: #fff;
    width: 300px; padding: 15px; transition: .45s ease;
    border-radius: 10px; background-color: rgba(0,0,0,0.5);
    z-index:-999; opacity: 0; 
    &::after{ 
        content: ''; 
        position: absolute; top: 15px; right: -15px;
        width: 0; height: 0;
	    border-top: 12px solid transparent; border-bottom: 12px solid transparent; border-left: 15px solid rgba(0,0,0,0.5);/* 화살표 */
}`
    

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