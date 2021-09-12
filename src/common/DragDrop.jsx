import React, { useState, useRef, createElement } from 'react'
import styled from 'styled-components';
import imageImg from '../images/image-file.png'

const DragDrop = ({InputHandler}) => {
    
    // 드래그 중일때와 아닐때의 스타일을 구분하기 위한 state 변수
    const [isUpload, setIsUpload] = useState(false);
    const inputEle = useRef(0);

    
    const clickInput = () => { inputEle.current.click(); }

    
    const onChangeInput = (e) => {
        const file = e.target.files;
        if(!file[1]){
            console.log(file[0]);
            addList(file[0]);
            // InputHandler(file[0]);
        }else{
            //복수의 파일
        }
    }

    const addList = (target) => {
        
        LiEle.current.innerHTML += `<li>
                                        <span>${target.name}</span>
                                        <span>${(target.size/1000000).toFixed(3)+'MB'}</span>    
                                    </li>`;
    }

    

    return(
        <>
            <WrapStyled>
                <DragStyled onDragEnter={DragHighlight} onDragOver={DragHighlight} onDragLeave={unDragHighlight} onDrop={DropFile}>

                    <LabelStyled htmlFor="fileInput"/>
                    <div className="ImgWrap">
                        <img src={imageImg} alt="uploadImg" width="50" height="50" />
                        <p>Drag &#38; Drop 파일 첨부</p>
                    </div>
                    
                </DragStyled>

                <ListStyled ref={LiEle}>
                    
                </ListStyled>
            
                <input ref={inputEle} type="file" id="fileInput" accept="image/*" style={{display: 'none'}} multiple onChange={onChangeInput}/>
                <BtnWrapStyled>
                {
                    isUpload
                        ?
                    <button>다운로드</button>
                        :
                    <button onClick={clickInput}>파일 선택하기</button> 
                }                    
                </BtnWrapStyled>
            </WrapStyled>   
        </>
    )
}

const WrapStyled = styled.div`
max-width:800px; height: 350px;
    & .highlight{ 
        border: 3px dotted #ff3737;
        background-color: #e7cdcd;
    }
    & .highlight .ImgWrap img{ 
        transform: scale(1.2);
        animation: draging 1s .5s infinite;
        @keyframes draging{
            0%{ transform: scale(1.2) rotate(20deg); }
            50%{ transform: scale(1.2) rotate(-20deg); }
            100%{ transform: scale(1.2) rotate(0deg); }
        }
    } 
`
const DragStyled = styled.div`
    position: relative; display: inline-block;
    width: 65%; height: 100%;
    border: 2px dotted #EFEFEF;
    border-right: none;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    background-color: transparent;
    vertical-align: top;
    transition: all .2s ease;
    & img { display: block; transform: scale(1); transition: .4s ease; }
    & .ImgWrap{ position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);  }
    & .ImgWrap p{ margin-top: 20px; font-size: 17px; color: #000; }
`
const LabelStyled = styled.label`
    position: absolute; top: 0; left: 0;
    width: 100%; height: 100%;
    text-align: center; cursor: pointer; z-index: 999;
`
const ListStyled = styled.ul`
    position: relative; display: inline-block;
    width: 35%;
    height: 100%;
    border: 2px solid #EFEFEF;
    border-left: none;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background-color: #fff;
    vertical-align: top;
`
const BtnWrapStyled = styled.div`
    position: relative; padding: 10px 0;
    & button{ display: block; padding: 10px 30px; margin: 5px auto; }
`

export default DragDrop;