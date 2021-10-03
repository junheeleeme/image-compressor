import React, { useRef, useState } from 'react'
import Alert from '../common/Alert'
import Main from '../Layout/Main'
import "boxicons"
import styled from 'styled-components'

export default function Resize(){

    const [isUpload, setIsUpload] = useState(false);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [viewWH, setViewWH] = useState(['', '']);
    const [type, setType] = useState('');
    const [isDone, setIsDone] = useState(false);
    const [fileName, setFileName] = useState('');
    const [fileSize, setFileSize] = useState('');
    const canvasEle = useRef(null); //사이즈 조절 때 사용
    const inputEle = useRef(null);
    const dragArea = useRef(null);
    const widthEle = useRef(null);
    const heightEle = useRef(null);

    const preventDefaults = (e) => { //다른 이벤트 방지
        e.preventDefault();
        e.stopPropagation();
    }

    const DragHighlight = (e) => { //드래그 효과
        preventDefaults(e);
        dragArea.current.classList.add('highlight');
    }
    const unDragHighlight = (e) => { //드래그 효과 제거
        preventDefaults(e);
        dragArea.current.classList.remove('highlight');
    }
    
    const clickInput = (e) => {
        preventDefaults(e);
        inputEle.current.click();
    }

    const onChangeInput = (e) => { 
    
        const files = e.target.files;
        if(files.length !== 0){
            startResize(files);
        }else{
            console.log("이미지 파일이 없음")
        }

    }

    const DropFile = async(e) => { //드래그 드랍 이벤트
        
        preventDefaults(e);
        dragArea.current.classList.remove('highlight');
        
        const type = ['gif', 'png', 'jpg', 'jpeg', 'webp'];
        const temp = e.dataTransfer.files; //검증 전
        const files = []; //검증 완료

        type.forEach((tp) => { //드롭 파일 확장자 검증
            temp.forEach(item => {
                if(tp === item.type.substr(6, 5)){
                    files.push(item);
                }
            }) 
        });
        
        if(files.length !== 0){
            startResize(files);
        }else{
            console.log("Check your file!");
            alert("Check your file!");
        }
        
    }

    const startResize = (files) =>{ //
        setIsUpload(true);
        setType(files[0].type);
        setFileName(files[0].name);
        fileRead(files[0]); //캔버스 이미지 생성
        setFileSize(getfileSize(files[0].size));
    }

    const getfileSize = (byte) => { //파일 사이즈 표현
        var exp = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
        var size = Math.floor(Math.log(byte) / Math.log(1024));
        return (byte / Math.pow(1024, size)).toFixed(2) + " " + exp[size];
    };

    const fileRead = (file) => { //이미지 읽기 후 캔버스에 삽입

        const reader = new FileReader();
        const image = new Image();

        reader.readAsDataURL(file);
        reader.onload = (e) => {
            image.src = e.target.result;
            image.onload = () => {
                drawCanvas(image); //캔버스에 이미지 삽입
            }   
        }

    }

    const drawCanvas = (image, getWidth, getHeight) => { //캔버스에 이미지 삽입
        const ctx = canvasEle.current.getContext('2d');

        if(getWidth === undefined && getHeight === undefined){
            const _width = image.width;
            const _height = image.height;

            canvasEle.current.width = _width;
            canvasEle.current.height = _height;
            ctx.drawImage(image, 0, 0);
            setWidth(_width); //수정될 width값
            setHeight(_height); //수정될 height값
            setWidthHeight(_width, _height); //초기 input값         
            setViewWH([_width + 'px', _height  + 'px']);
        }else{
            canvasEle.current.width = getWidth;
            canvasEle.current.height = getHeight;
            ctx.drawImage(image, 0, 0, getWidth, getHeight);
            setWidth(getWidth); //수정될 width값
            setHeight(getHeight); //수정될 height값
            setWidthHeight(getWidth, getHeight); //초기 input값         
            setViewWH([getWidth + 'px', getHeight  + 'px']);
        }
    }

    const reSizing = () => {
        const chkWH = [width + 'px', height + 'px'];
        console.log(viewWH);
        console.log(chkWH)
        if(viewWH[0] === chkWH[0] && viewWH[1] === chkWH[1]){ //사이즈 변경이 있을 때
            console.log("사이즈 변경 없음");
        }else{
            const image = new Image();
            const url = canvasEle.current.toDataURL(type);

            image.src = url;
            image.onload = () => {
                drawCanvas(image, width, height);
                canvasEle.current.toBlob(res=>{ //리사이징 후 이미지 파일크기 다시 계산
                    setFileSize(getfileSize(res.size));
                    setIsDone(true); //리사이징 완료처리
                }, type);
            }
            console.log("사이즈 변경 있음");
        }
    }

    const saveImage = () => {
        canvasEle.current.toBlob(res=>{
            const aTag = document.createElement('a');
            aTag.download = fileName + "_resized.jpeg";
            aTag.href = URL.createObjectURL(res);
            aTag.click();
        }, type);
    }   

    const onChangeWidth_Ele = (e) => {
        setWidth(Number(e.target.value));
    }

    const onChangeHeight_Ele = (e) => {
        setHeight(Number(e.target.value));
    }

    const setWidthHeight = (w, h) =>{
        widthEle.current.value = w; 
        heightEle.current.value = h;
    }

    const allClear = () => { //업로드된 사진 삭제
        setIsUpload(false);
        setIsDone(false);
        setWidth('');
        setHeight('');
        setViewWH(['', '']);
        setType('');
        setFileName('');
        setFileSize('');
    }

    return(
        <>
            <input ref={inputEle} type="file" id="fileInput" accept="image/png, image/jpg, image/jpeg, image/webp, image/gif," style={{display: 'none'}} onChange={onChangeInput}/>
        {   
            !isUpload
                ?
            <Main>
                <CompressorDrag>
                    <Alert/>
                    <div className="drag-area" ref={dragArea} onClick={clickInput} onDragEnter={DragHighlight} onDragOver={DragHighlight} onDragLeave={unDragHighlight} onDrop={DropFile}/>
                    <div className="dragIcon" onClick={clickInput} onDragEnter={DragHighlight} onDragOver={DragHighlight} onDragLeave={unDragHighlight} onDrop={DropFile}>
                            <box-icon name='image' type='solid' color='#ffffff' />
                            <p className="choose"><label htmlFor="fileInput">Choose Files</label></p>
                            <p className="ImgEx2">&#38;</p>
                            <p className="ImgEx3">Drag &#38; Drop Your Images</p>
                    </div>
                </CompressorDrag>
            </Main>
                :
            <ResizeStyled>
                <ImageStyled>
                    <CanvasWrap width={viewWH[0]} height={viewWH[1]}><canvas ref={canvasEle}/></CanvasWrap>
                </ImageStyled>
                <SettingStyled>
                    <p title={fileName}>
                        <span>File Name : </span>{fileName}
                    </p>
                    <p>
                    <span>File Size : </span>{fileSize}
                    </p>
                    <p>
                        <span>width(px) : </span><input ref={widthEle} onChange={onChangeWidth_Ele} min={0} type="number"/>
                    </p>
                    <p>
                        <span>height(px) : </span><input ref={heightEle} onChange={onChangeHeight_Ele} min={0} type="number"/>
                    </p>
                    <BackBtnStyled onClick={allClear}>Home</BackBtnStyled>
                    {
                        !isDone 
                            ?
                        <ResizeBtnStyled onClick={reSizing}>Resize</ResizeBtnStyled>
                            :
                        <SaveBtnStyled onClick={saveImage}>Save</SaveBtnStyled>
                    }
                            
                </SettingStyled>
            </ResizeStyled>
        }
        </>
    )
}

const ResizeStyled = styled.div`
    position: relative; display: block;
    height: calc(100vh - 120px);
    display: flex; justify-content: center; align-items: center;
    @media screen and (max-width: 768px){
        display: block;
        height: auto;
        padding: 10px;
        & section{
            display: inline-block; width: 100%; min-height: 100px;
        }
        & section:first-child{
            padding: 60px 10px;
            text-align: center;
        }
        & section:last-child{
            height: 300px;
        }
    }
`
const ImageStyled = styled.section`
    position: relative; display: inline-block; width: 70%; height: 100%;
    background-color: rgba(0,0,0,0.3);
`
const CanvasWrap = styled.span`
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 75%; display: inline-block; color: #fff; font-size: 14px;
    &::after{ 
        content: '${props=> props.width}'; position: absolute; top: -35px; left: 50%; transform: translate(-50%, 0);  
    }
    &::before{ 
        content: '${props=> props.height}'; position: absolute; top: 50%; left: -55px; transform: translate(0, -50%); 
    }
    & canvas{ width: 100%; height: 100% }
    @media screen and (max-width: 768px){
        position: relative; top: auto; left: auto; transform: none;
        width: 62%;
    }
`
const SettingStyled = styled.section`
    display: inline-block; width: 30%; height: 100%; padding: 15px; position: relative;
    color: #fff; background-color: rgba(0,0,0,0.6); 
    & p:first-child{ white-space: nowrap; text-overflow: ellipsis; overflow: hidden; } 
    & p{ position: relative; padding: 8px 0; }
    p span{ display: inline-block; width: 80px;  font-size: 14px; }
    .fileName{display:inline-block; width: auto; } 
    p input[type='number']{ width: 70px; outline: 0; font-size: 15px; padding:3px; margin-left: 5px; text-align:right; }
    button{ 
        position: absolute; width: 43%; padding: 5px 0; font-size: 15px; cursor: pointer; 
        border: none;    
    }
`

const BackBtnStyled = styled.button`
    bottom: 15px; left: 15px; 
`
const ResizeBtnStyled = styled.button`
    bottom: 15px; right: 15px;
`
const SaveBtnStyled = styled.button`
    bottom: 15px; right: 15px;
    background-color: rgba(0,0,0,0.9);
    color: #fff;
    animation: done 1s;
`
const CompressorDrag = styled.section`
    position: relative; height: 500px; width: 100%;
    &:hover div:first-child{ background-color: rgba(0,0,0, 0.35); }
    @media screen and (max-width: 600px){
        height: 350px;
    }
& .drag-area{
    position: absolute; width: 100%; height: 100%; z-index: 999; cursor: pointer;
    border-bottom: none; 
    border-radius: 10px;     
    background-color: rgba(0,0,0, 0.2); transition: .33s ease;
}
& .highlight{ border: 1px dashed #fff; background-color: rgba(0,0,0, 0.5); }
& .dragIcon{ 
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(1) rotate(0deg); z-index: 1000; cursor: pointer;
    transition: .3s ease; user-select: none;
    @media screen and (max-width: 600px){ width: 300px; top: 45%; }
    & box-icon{ display: block; width: 80px; height: 80px; margin: 0 auto 10px auto; }
    & p{ color: #fff; text-align: center; }
    & .choose{ position: relative; margin: 0 20px;  background-color: rgba(0,0,0,0.4); color: #fff;  border-radius: 5px; transition: 0.55s ease; cursor: pointer; }
    & .choose:hover{ background-color: rgba(255,255,255, 1); color: #000; }
    & .choose label{ display: inline-block; width: 100%; height: 100%; padding: 7px 0; font-size: 16px;  cursor: pointer; }
    & .ImgEx2{ font-size: 15px; color: #fff; margin: 2px 0; }
    & .ImgEx3{ font-size: 18px; font-weight: bold; }
}
& .highlight ~ .dragIcon { transform: translate(-50%, -50%) scale(1.15) rotate(10deg); }`