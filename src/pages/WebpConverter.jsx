import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import JSZip from "jszip"
import Alert from "../common/Alert"
import Loader from '../common/Loader'
import FileSaver from "file-saver"
import 'boxicons'

export default function WebpConverter(){
    const [imageLi, setImageLi] = useState([ //렌더링을 위한 state
        // {
        //     title : '',
        //     type : '',
        //     size : 0,
        // },
    ]);
    const [doneLi, setDoneLi] = useState([ //렌더링을 위한 state
                // {
        //     title : '',
        //     type : '',
        //     size : 0,
        //     link : '',
        // },
    ]);
    const [isLoad, setIsLoad] = useState(false); // false : 로딩x, true : 로딩o
    const [blobImg, setBlobImg] = useState([]);  // 이미지 blob 데이터
    const [isAllDown, setIsAllDown] = useState(false); // true : 이미지 변환 후 전체 다운로드 표시
    const [quality, setQuality] = useState(0.6); // webp 변환 퀄리티
    const inputEle = useRef(null);
    const dragArea = useRef(null);
    const alldownBtn = useRef(null);

    const preventDefaults = (e) => { //이벤트 방지
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

    const AllClear = () => {
        setImageLi([]);
        setDoneLi([]);
        setBlobImg([]);
        setIsAllDown(false);
    }

    const CheckQuality = (e) => {
        if(e.target.checked === true){
            setQuality(0.8);
        }else{
            setQuality(0.6);
        }
    }

    const onChangeInput = (e) => { 
        setIsLoad(true);
        const files = e.target.files;
        const fileList = [];

        files.forEach(f=> {
            fileList.push({
                title : f.name,
                size : getfileSize(f.size),
                type : f.type.substr(6, 5),
            })
        });
        setImageLi([
            ...imageLi,
            ...fileList
        ]); //전체 파일 리스트에 렌더링

        ConvertWebp(files);
    }

    const DropFile = async(e) => { //드래그 드랍 파일

        preventDefaults(e);
        dragArea.current.classList.remove('highlight');
        
        const type = ['gif', 'png', 'jpg', 'jpeg', 'webp'];
        const temp = e.dataTransfer.files; //검증 전
        const files = []; //검증 완료
        const fileList = []; // 렌더링을 위한 리스트
        setIsLoad(true); //로딩 시작

        type.forEach((tp) => { //드롭 파일 확장자 검증
            temp.forEach((item) => {
                if(tp === item.type.substr(6, 5)){
                    files.push(item);
                }
            })
        });
        
        files.forEach(f=> {
            fileList.push({
                title : f.name,
                size : getfileSize(f.size),
                type : f.type.substr(6, 5),
            })
        });
        setImageLi([ //전체 파일 리스트에 렌더링
            ...imageLi,
            ...fileList
        ]); 

        const blobItems =[], convertedItems = [];

        for(let i=0 ; i < files.length ; i++ ){ //동기식 Blob, 렌더링 데이터 받아오기
            const [blob, converted] = await ConvertWebp(files[i]);
            blobItems.push(blob);
            convertedItems.push(converted);
        }

        setBlobImg([
            ...blobImg,
            ...blobItems
        ]);
        setDoneLi([ //변환 완료 리스트에 렌더링
            ...doneLi,
            ...convertedItems
        ]);
        setIsLoad(false); //로딩 종료
        setIsAllDown(true); //전체 변환 파일 다운로드

    }

    const ConvertWebp = async(files) => {
        return new Promise((resolve, reject) => {

            const name = files.name; //파일명 저장
            // const ImgData  = []; //압축을 위해 Blob 데이터를 배열에 저장
            
            const userImg = new Image();
            userImg.src =  URL.createObjectURL(files);
            
            userImg.onload = async() => {
                const canvas = document.createElement('canvas'); //캔버스 생성
                const ctx = canvas.getContext('2d');
                canvas.width = userImg.width;
                canvas.height = userImg.height;
                ctx.drawImage(userImg, 0, 0); //캔버스에 이미지 그리기
                
                const blob = await Canvas2Blob(canvas); // 비동기 blob 생성
                const type = blob.type.substr(6, 5); //이미지 확장자
                blob.name = name.slice(0, -type.length-1) + '_tiny_image.' + type; //기존 blob.name이 없어 새로 추가
                const convertedItem = {
                    title : name.slice(0, -type.length-1) + '_tiny_image.' + type, //압축 후 이미지 파일명 변경
                    size : getfileSize(blob.size),
                    type : type,
                    link : URL.createObjectURL(blob),
                };

                resolve([blob, convertedItem]); //blob : 이미지 blob 데이터, convertedItem : 렌더링에 필요한
            }
        });
    }
    
    const Canvas2Blob = (canvas) =>{ 
        return new Promise((resolve, reject)=> {
            canvas.toBlob(async(blob) => {
                resolve(blob);
            }, 'image/webp', quality);
        });
    }

    const getfileSize = (x) => { //파일 사이즈 표현
        var s = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
        var e = Math.floor(Math.log(x) / Math.log(1024));
        return (x / Math.pow(1024, e)).toFixed(2) + " " + s[e];
    };
    const AllDownload = () => { //이미지 압축파일 만들기
        const zip = new JSZip();
        console.log(blobImg);
        blobImg.forEach(blob => {
            zip.folder("webpp").file(blob.name, blob);
        });
        zip.generateAsync({type:"blob"})
        .then((imgs) => {
            FileSaver(imgs, "webpp.zip");    
        });
    }

    return(
        <>
        {
            !isLoad
                ?
            <></> : <Loader/>
        }
        <input ref={inputEle} type="file" id="fileInput" accept="image/png, image/jpg, image/jpeg, image/webp, image/gif," style={{display: 'none'}} multiple onChange={onChangeInput}/>
        <CompressorWrap>
            <CompressorDrag>
                <Alert/>
                <QualityStyled>
                    <input type="checkbox" onClick={CheckQuality}/><span>Same quality</span>
                </QualityStyled>
                <div className="drag-area" ref={dragArea} onClick={clickInput} onDragEnter={DragHighlight} onDragOver={DragHighlight} onDragLeave={unDragHighlight} onDrop={DropFile}/>
                <div className="dragIcon" onClick={clickInput} onDragEnter={DragHighlight} onDragOver={DragHighlight} onDragLeave={unDragHighlight} onDrop={DropFile}>
                        <box-icon name='image' type='solid' color='#ffffff' />
                        <p className="choose"><label htmlFor="fileInput">Choose Files</label></p>
                        <p className="ImgEx2">&#38;</p>
                        <p className="ImgEx3">Drag &#38; Drop Your Images</p>
                </div>
            </CompressorDrag>
            <CompressorList>
                <div className="list-area">
                    <div className="left">
                        <ul>
                        <li style={{textAlign: 'center', fontSize: '15px', background : 'rgba(0,0,0,0.05)'  }}>
                            <span style={{fontSize : '15px'}} className="img-no">No</span>
                            <span style={{fontSize : '15px'}} className="img-title">Uploaded File Name</span>
                            <span style={{fontSize : '15px'}} className="img-size">Size</span>
                        </li>
                        {   
                            imageLi.map((li, idx)=> 
                                <li key={li.title + idx}>
                                    <span className="img-no">{idx+1}</span>
                                    <span className="img-title" title={li.title}>{li.title}</span>
                                    <span className="img-size">{li.size}</span>
                                </li>
                            )
                        }
                        </ul>
                    </div>
                    <div className="right">
                        <ul>
                            <li style={{textAlign: 'center', background : 'rgba(0,0,0,0.05)'}}>
                                <span style={{fontSize : '15px'}} className="img-no-done">No</span>
                                <span style={{fontSize : '15px'}} className="img-title-done">Compressed File Name</span>
                                <span style={{fontSize : '15px'}} className="img-size-done">Size</span>
                                <span style={{fontSize : '15px', padding : '7px'}} title="Download" className="img-down-done">D</span>
                            </li>
                            {  
                                doneLi.map((li, idx)=> 
                                    <li key={li.title + idx}>
                                        <span className="img-no-done">{idx+1}</span>
                                        <span className="img-title-done" title={li.title}>{li.title}</span>
                                        <span className="img-size-done">{li.size}</span>   
                                        <span className="img-down-done"><a href={li.link} download={li.title}><box-icon type='solid' name='cloud-download'/></a></span>
                                    </li>
                                )
                            }
                        </ul>
                        {
                            !isAllDown
                                ?
                            <></>
                                : 
                            <div className="done-btn-Wrap">
                                <button onClick={AllClear} className="allclearBtn">전체 지우기</button>
                                <button ref={alldownBtn} onClick={AllDownload} className="alldownBtn">전체 다운로드</button>
                            </div>
                        }
                        
                    </div>                    
                </div>
            </CompressorList>
        </CompressorWrap>
        </>
    )
}

const CompressorWrap = styled.div`
    width: 100%;`
const CompressorDrag = styled.section`
    position: relative; height: 300px;
    &:hover div:first-child{ background-color: rgba(0,0,0, 0.35); }
    @media screen and (max-width: 600px){
        height: 350px;
    }
& .drag-area{
    position: absolute; width: 100%; height: 100%; z-index: 999; cursor: pointer;
    border: 1px dashed #6d6a6a; border-bottom: none; 
    border-top-left-radius: 10px; border-top-right-radius: 10px;     
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

const CompressorList = styled.section`
    position: relative; height: 300px;
    margin: auto; overflow: hidden; border: 1px solid #c7c7c7;
    border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; 
    background-color: #fff; 
    @media screen and (max-width: 600px){
        & { height: auto; }
    }
    & .list-area{
        height: 100%;
        & .left, .right{
            position: relative; display: inline-block; 
            width: 50%; height: 100%; vertical-align: top;
        }
        & .left{ 
            border-right: 1px solid #c7c7c7; 
            @media screen and (max-width: 600px) { border-right: none; }
        }
        @media screen and (max-width: 600px){
            .left, .right{ width: 100%; height: 175px; }
        }
        & ul{
            width: 100%; height: 100%; overflow: auto;
            & li{ 
                position: relative; display: block;  border-bottom: 1px solid #c7c7c7;
                line-height: 1;
                & span{ display:inline-block; font-size: 14px; padding: 7px; vertical-align: top;}
                & .img-no{ width: 40px; text-align: center; border-right: 1px solid #c7c7c7; }
                & .img-title{ width: calc(75% - 40px); padding: 7px; border-right: 1px solid #c7c7c7; 
                    text-overflow: ellipsis; overflow: hidden; white-space: nowrap; }
                & .img-size{ width: 25%; text-align: center; }
                & .img-no-done{ width: 40px; text-align: center; border-right: 1px solid #c7c7c7; }
                & .img-title-done{ width: calc(75% - 80px); border-right: 1px solid #c7c7c7; 
                    text-overflow: ellipsis; overflow: hidden; white-space: nowrap; }
                & .img-size-done{ width: 25%; text-align: center; border-right: 1px solid #c7c7c7; }
                & .img-down-done{ 
                    width: 40px; height: 100%; text-align: center; display: inline-block; padding: 0;
                    vertical-align: bottom;
                    & a{ 
                        display: inline-block; width: 100%; height: 100%; position: relative; vertical-align: middle;
                        & box-icon{ display:inline-block; width: 100%; }
                    }
                }
            }
        }
        & .right ul>li:first-child{ animation: none; }
        & .right ul{
            @media screen and (max-width: 600px){
                border-top: 1px solid #9f9f9f;
            }
        }
        & .right li{ animation: done 1s; }
        & .right .done-btn-Wrap { 
            position: absolute; bottom: -100px; left: 0; width: 100%;
            animation: slideUp 1s forwards; text-align : center;
        }
        & .right .done-btn-Wrap button{ 
            cursor: pointer;font-size: 14px;  padding: 5px 15px; margin: 0 10px;
            background-color:rgba(0,0,0,0.5); border-radius: 7px; color: #fff; border: none;
        }
    }`
const QualityStyled = styled.div`
    position: absolute; bottom: 10px; right: 10px;
    padding: 5px; z-index: 1000;
    & input[type='checkbox']{ display: inline-block; width: 16px; height: 16px; vertical-align: top; margin: 4px 5px 0 0;  }
    & span{ color: #fff; font-size: 15px; vertical-align: top; }
`