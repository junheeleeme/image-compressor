import React, { useState, useRef } from "react"
import styled from "styled-components"
import 'boxicons'
import imageCompression from 'browser-image-compression'


export default function Compressor(){

    const [imageLi, setImageLi] = useState([
        // {
        //     title : '',
        //     type : '',
        //     size : 0,
        // },
    ]);
    const [doneLi, setDoneLi] = useState([
                // {
        //     title : '',
        //     type : '',
        //     size : 0,
        //     link : '',
        // },
    ]);

    const dragArea = useRef(null);

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
        preventDefaults(e);
        const file = e.dataTransfer.files;
        if(!file[1]){
            console.log(file[0]); //압축 전 이미지
            setImageLi([{
                title : file[0].name,
                size : file[0].size,
                type : file[0].type.substr(6, 5),
            }])
            InputHandler(file[0]);
        }else{
            //복수의 파일
        }
        dragArea.current.classList.remove('highlight');
    }

    const InputHandler = async(e) => { //압축된 이미지 다운로드
        const file = e;
        if(file){
            const compressedImg = await compressImage(file);
            console.log(compressedImg) //압축 후 이미지
            setDoneLi([
                {
                    title : compressedImg.name,
                    type : compressedImg.type.substr(6, 5),
                    size : compressedImg.size,
                    link : URL.createObjectURL(compressedImg),
                }
            ])
            
            // 자동 다운로드

            // const downURL = URL.createObjectURL(compressedImg);
            // const downTag = document.createElement('a');
            
            // downTag.download = 'save.jpg'; 
            // downTag.href = downURL;
            // downTag.click();
        }
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

    return(
        <>
            <CompressorDrag>
                <div className="drag-area" ref={dragArea} onDragEnter={DragHighlight} onDragOver={DragHighlight} onDragLeave={unDragHighlight} onDrop={DropFile}/>
                <div className="dragIcon" onDragEnter={DragHighlight} onDragOver={DragHighlight} onDragLeave={unDragHighlight} onDrop={DropFile}>
                        <box-icon name='image' type='solid' color='#ffffff' />
                        <p className="ImgEx1">Select Image File</p>
                        <p className="ImgEx2">&#38;</p>
                        <p className="ImgEx3">Drag &#38; Drop Your Images</p>
                </div>
            </CompressorDrag>
            <CompressorList>
                <div className="list-area">
                    <div className="left">
                        <ul>
                        <li style={{textAlign: 'center', fontSize: '15px' , fontWeight : 'bold'}}>
                            <span style={{fontSize : '15px'}} className="img-no">No</span>
                            <span style={{fontSize : '15px'}} className="img-title">File Name</span>
                            <span style={{fontSize : '15px'}} className="img-size">File Size</span>
                        </li>
                        {
                            imageLi.map((li, idx)=> 
                                <li key={li.title + idx}>
                                    <span className="img-no">{idx+1}</span>
                                    <span className="img-title">{li.title}</span>
                                    <span className="img-size">{li.size}</span>
                                </li>
                            )
                        }
                        </ul>
                    </div>
                    <div className="right">
                        <ul>
                            <ul>
                            <li style={{textAlign: 'center', fontSize: '15px' , fontWeight : 'bold', padding: '5px'}}>Compressed Images</li>
                                    {
                                        doneLi.map((li, idx)=> 
                                            <li key={li.title + idx}>
                                                <span className="img-no-done">{idx+1}</span>
                                                <span className="img-title-done">{li.title}</span>
                                                <span className="img-size-done">{li.size}</span>   
                                                <span className="img-down-done"><a href={li.link} download={li.title}><box-icon type='solid' name='cloud-download'/></a></span>
                                            </li>
                                        )
                                    }
                            </ul>
                        </ul>
                    </div>                    
                </div>
            </CompressorList>
        </>
    )
}

const CompressorDrag = styled.section`
    position: relative; height: 300px;
& .drag-area{
    position: absolute; width: 100%; height: 100%; z-index: 99;
    border: 1px dashed #c0c0c0; border-bottom: none; 
    border-top-left-radius: 10px; 
    border-top-right-radius: 10px; 
    background-color: rgba(0,0,0, 0.2); transition: .3s ease;
}
& .highlight{ border: 1px dashed #fff; background-color: rgba(0,0,0, 0.5); }
& .dragIcon{ 
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(1) rotate(0deg); z-index: 100;
    transition: .3s ease;
    & box-icon{ display: block; width: 80px; height: 80px; margin: 0 auto 10px auto; }
    & p{ color: #fff; text-align: center; }
    & .ImgEx1, .ImgEx3{ font-size: 18px; font-weight: bold; }
    & .ImgEx2{ font-size: 15px; color: #fff; line-height: 1.2; }
}
& .highlight ~ .dragIcon { transform: translate(-50%, -50%) scale(1.15) rotate(5deg);  }`

const CompressorList = styled.section`
    position: relative; height: 300px;
    overflow: hidden; border: 1px solid #c7c7c7;
    border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; 
    & .list-area{
        height: 100%;
        & div{
            position: relative; display: inline-block; 
            width: 50%; height: 100%; vertical-align: top;
        }
        & .left{ border-right: 1px solid #c7c7c7; }
        & ul{
            width: 100%; height: 100%; background-color: #fff;
            & li{ 
                position: relative; display: block;  border-bottom: 1px solid #c7c7c7;
                & span{ display:inline-block; font-size: 13px; padding: 5px; vertical-align: top;}
                & .img-no{ width: 10%; text-align: center; border-right: 1px solid #c7c7c7; }
                & .img-title{ width: 70%; padding: 5px 0 5px 10px; border-right: 1px solid #c7c7c7; 
                    text-overflow: ellipsis; overflow: hidden; white-space: nowrap; }
                & .img-size{ width: 20%; text-align: center; }
                & .img-no-done{ width: 10%; text-align: center; border-right: 1px solid #c7c7c7; }
                & .img-title-done{ width: calc(70% - 30px); padding: 5px 0 5px 10px; border-right: 1px solid #c7c7c7; 
                    text-overflow: ellipsis; overflow: hidden; white-space: nowrap; }
                & .img-size-done{ width: 20%; text-align: center; border-right: 1px solid #c7c7c7; }
                & .img-down-done{ 
                    width: 30px; height: 100%; text-align: center; padding: 0;
                    & a{ 
                        display: inline-block; width: 100%; height: 100%;
                        & box-icon{ width: 22px; height: 22px;}
                    }
                }
            }
        }
    }
`