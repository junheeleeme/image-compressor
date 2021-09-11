import React, { useState, useRef, createElement } from 'react'
import styled from 'styled-components';
import imageImg from '../images/image-file.png'

const DragDrop = ({InputHandler}) => {
    
    // 드래그 중일때와 아닐때의 스타일을 구분하기 위한 state 변수
    const [isUpload, setIsUpload] = useState(false);
    const inputEle = useRef(0);
    const LiEle = useRef(0);

    const preventDefaults = (e) => {
        e.preventDefault();
        e.stopPropagation();
    } 
    const clickInput = () => { inputEle.current.click(); }

    const DragHighlight = (e) => {
        preventDefaults(e);
        e.target.parentElement.classList.add("highlight");
    }
    const unDragHighlight = (e) => {
        preventDefaults(e);
        e.target.parentElement.classList.remove("highlight");
    }
    const DropFile = (e) => {
        preventDefaults(e);
        const file = e.dataTransfer.files;
        if(!file[1]){
            console.log(file[0]);
            // InputHandler(file[0]);
        }else{
            //복수의 파일
        }
    }
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
                <ButtonStyled>
                {
                    isUpload
                        ?
                    <button>다운로드</button>
                        :
                    <button onClick={clickInput}>파일 선택하기</button> 
                }                    
                </ButtonStyled>
            </WrapStyled>   
        </>
    )
}

const WrapStyled = styled.div`
position: relative; display: inline-block; margin: 0 auto;
    & .highlight{ 
        border: 3px dotted #ff3737;
        background-color: #e7cdcd;
    }`
const DragStyled = styled.div`
    position: relative; display: inline-block;
    width: 400px; height: 300px;
    border: 3px dotted #9d9d9d;
    border-right: 1px solid #dddddd;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    background-color: #f3f3f3;
    vertical-align: top;
    transition: all .2s ease;
    & img { display: block; }
    & .ImgWrap{ position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) }
    & .ImgWrap p{ margin-top: 10px; color: #000; }
`
const LabelStyled = styled.label`
    position: absolute; top: 0; left: 0;
    width: 100%; height: 100%;
    text-align: center; cursor: pointer; z-index: 999;
`
const ListStyled = styled.ul`
    position: relative; display: inline-block;
    width: 200px;
    height: 300px;
    border: 3px solid #bbbbbb;
    border-left: none;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background-color: #f3f3f3;
    vertical-align: top;
`
const ButtonStyled = styled.div`
    position: relative;
`

export default DragDrop;