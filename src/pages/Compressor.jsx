import React, { useState, useRef, useEffect } from "react"
import styled from "styled-components"
import Loader from "../common/Loader"
import 'boxicons'
import imageCompression from 'browser-image-compression'
import Alert from "../common/Alert"
import JSZip from "jszip"
import FileSaver from "file-saver"

export default function Compressor(){

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
    const [isLoad, setIsLoad] = useState(false);
    const [blobImg, setBlobImg] = useState([]);
    const [isAllDown, setIsAllDown] = useState(false);
    const inputEle = useRef(null);
    const dragArea = useRef(null);
    const alldownBtn = useRef(null);

    useEffect(()=> { 
        // console.log(imageLi); 
        setIsAllDown(false);
    }, [imageLi]);

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
    
    const DropFile = (e) => { //드래그 드랍 파일
        setIsLoad(true);
        preventDefaults(e);
        dragArea.current.classList.remove('highlight');

        const files = e.dataTransfer.files;
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

        InputHandler(files);        
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

        InputHandler(files);        

    }

    const InputHandler = async(file) => { //압축된 이미지 다운로드

        const compressedItems = [];
        const imgData = []; //압축을 위해 원본을 다른 배열에 저장

        for(let i=0 ; i < file.length ; i++){  //비동기로 복수의 이미지 압축 후 배열에 추가
            const res = await compressImage(file[i]);
            const type = res.type.substr(6, 5); //이미지 확장자
            imgData.push(res); 
            compressedItems.push( 
                {
                    title : res.name.slice(0, -type.length) + '_webpp.' + type, //압축 후 이미지 파일명 변경
                    type : type,
                    size : getfileSize(res.size),
                    link : URL.createObjectURL(res),
                }
            );
        }
        setBlobImg([
            ...blobImg,
            ...imgData
        ])
        setDoneLi([
            ...doneLi,
            ...compressedItems
        ]);
        setIsLoad(false);
        setIsAllDown(true); // 이미지 압축 완료 후 전체 다운로드 버튼 렌더링

    }

    const compressImage = async(img) => { //이미지 압축
        try{
            const options = {
                maxSize: 1,
                initialQuality: 0.5
            }
            return await imageCompression(img, options);
        } catch(e){ console.log(e); }
    }

    const getfileSize = (x) => { //파일 사이즈 표현
        var s = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
        var e = Math.floor(Math.log(x) / Math.log(1024));
        return (x / Math.pow(1024, e)).toFixed(2) + " " + s[e];
    };

    const AllDownload = () => { //이미지 압축파일 만들기
        const zip = new JSZip();
        blobImg.forEach(blob => {
            zip.folder("webpp").file(blob.name, blob);
        });
        zip.generateAsync({type:"blob"})
        .then((imgs) => {
            FileSaver(imgs, "webpp.zip");    
        });
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

    return(
        <>
        {
            !isLoad
                ?
            <></> : <Loader/>
        }
        <Alert/>
        <input ref={inputEle} type="file" id="fileInput" accept="image/*" style={{display: 'none'}} multiple onChange={onChangeInput}/>
        <CompressorWrap>
            <CompressorDrag>
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
    width: 100%;
`
const CompressorDrag = styled.section`
    position: relative; height: 300px;
    &:hover div:first-child{ background-color: rgba(0,0,0, 0.35); }
& .drag-area{
    position: absolute; width: 100%; height: 100%; z-index: 99; cursor: pointer;
    border: 1px dashed #6d6a6a; border-bottom: none; 
    border-top-left-radius: 10px; border-top-right-radius: 10px;     
    background-color: rgba(0,0,0, 0.2); transition: .33s ease;
}
& .highlight{ border: 1px dashed #fff; background-color: rgba(0,0,0, 0.5); }
& .dragIcon{ 
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(1) rotate(0deg); z-index: 100; cursor: pointer;
    transition: .3s ease;
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
    margin: auto;
    overflow: hidden; border: 1px solid #c7c7c7;
    border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; 
    @media screen and (max-width: 600px){
        & { height: auto; }
    }
    & .list-area{
        height: 100%;
        & .left, .right{
            position: relative; display: inline-block; 
            width: 50%; height: 100%; vertical-align: top;
        }
        & .left{ border-right: 1px solid #c7c7c7; }
        @media screen and (max-width: 600px){
            .left, .right{ width: 100%; height: 150px; }
        }
        & ul{
            width: 100%; height: 100%; background-color: #fff; overflow: auto;
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
    }
`