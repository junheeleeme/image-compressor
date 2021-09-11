import React, { useState, useRef } from 'react'
import styled from 'styled-components';
import imageImg from '../images/image-file.png'

const DragDrop = ({InputHandler}) => {
    // 드래그 중일때와 아닐때의 스타일을 구분하기 위한 state 변수
    const [isDrag, setIstDrag] = useState(false);

    // 드래그 이벤트를 감지하는 ref 참조변수 (label 태그에 들어갈 예정)

    
    const preventDefaults = (e) => {
        e.preventDefault();
        e.stopPropagation();
    } 

    const DragHighlight = (e) => {
        preventDefaults(e);
        console.dir(e.target.parentElement)
        e.target.parentElement.classList.add("highlight");
    }
    const unDragHighlight = (e) => {
        preventDefaults(e);
        e.target.parentElement.classList.remove("highlight");
    }
    
    const DropFile = (e) => {
        preventDefaults(e);
        const file = e.dataTransfer.files[0];

        InputHandler(file);
    } 

    return(
        <>
            <WrapStyled>
                    <DragStyled onDragEnter={DragHighlight} onDragOver={DragHighlight} onDragLeave={unDragHighlight} onDrop={DropFile}>

                        <LabelStyled htmlFor="fileInput" 
                            className={isDrag ? "DragDrop-File-Dragging" : "DragDrop-File"}
                            // 드래그 중일때와 아닐때의 클래스 이름을 다르게 주어 스타일 차이
                        />
                        <div className="ImgWrap">
                            <img src={imageImg} alt="uploadImg" width="50" height="50" />
                            <p>Drag &#38; Drop 파일 첨부</p>
                        </div>
                        
                    </DragStyled>
                    <ListStyled>


                    </ListStyled>
                
                    <input type="file" id="fileInput" style={{display: 'none'}}/>
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
    border-radius: 7px;
    background-color: #f3f3f3;
    transition: all .2s ease;
    & img { display: block; }
    & .ImgWrap{ position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) }
    & .ImgWrap p{ margin-top: 10px; color: #000; }`

const LabelStyled = styled.label`
    position: absolute; top: 0; left: 0;
    width: 100%; height: 100%;
    text-align: center; cursor: pointer; z-index: 999;`
const ListStyled = styled.div`
    position: relative; display: inline-block;
    width: 200px;
    height: 300px;
    border: 2px solid #9d9d9d;
    border-radius: 10px;
`

export default DragDrop;