import React, { useState, useRef, useEffect } from "react"
import styled from "styled-components"
import 'boxicons'
import imageCompression from 'browser-image-compression'
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
    const [isAllDown, setIsAllDown] = useState(false);
    const dragArea = useRef(null);
    const Alldown = useRef(null);

    useEffect(()=> { 
        console.log(imageLi); 
        setIsAllDown(false);
        setDoneLi([]);
    }, [imageLi]);

    useEffect(()=> { console.log('완료' +doneLi); }, [doneLi])

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
        dragArea.current.classList.remove('highlight');

        const files = e.dataTransfer.files;

        if(!files[1]){ //한개의 파일이 들어 올 경우
            // console.log(files[0]); //압축 전 이미지
            setImageLi([{
                title : files[0].name,
                size : getfileSize(files[0].size),
                type : files[0].type.substr(6, 5),
            }]);
            InputHandler(files[0]);
        }else{ //여러 파일이 들어 올 경우
            const fileList = [];
            files.forEach(f=> {
                fileList.push({
                    title : f.name,
                    size : getfileSize(f.size),
                    type : f.type.substr(6, 5),
                })
            });
            setImageLi(fileList); //전체 파일 리스트에 렌더링
            
            InputHandler(files); //핸들러에 파일 리스트 전달
        }
        
    }

    const InputHandler = async(file) => { //압축된 이미지 다운로드

        if(!file[1]){ //파일이 하나일 경우
            const res = await compressImage(file);
            const type = res.type.substr(6, 5); //이미지 확장자
            setDoneLi([
                {
                    title : res.name.slice(0, -type.length) + '_webpp.' + type, //압축 후 이미지 파일명 변경
                    type : type,
                    size : getfileSize(res.size),
                    link : URL.createObjectURL(res),
                }
            ])
        }else{ //파일이 여러개일 경우
            
            const compressedItems = [];
            const zipList = [];
            for(let i=0 ; i < file.length ; i++){  //비동기로 복수의 이미지 압축 후 배열에 추가
                const res = await compressImage(file[i]);
                const type = res.type.substr(6, 5); //이미지 확장자
                
                zipList.push(res); //압축을 위해 다른 배열에 저장
                compressedItems.push( 
                    {
                        title : res.name.slice(0, -type.length) + '_webpp.' + type, //압축 후 이미지 파일명 변경
                        type : type,
                        size : getfileSize(res.size),
                        link : URL.createObjectURL(res),
                    }
                );
            }
            CreateZip(zipList);
            setDoneLi(compressedItems);  
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

    const getfileSize = (x) => { //파일 사이즈 표현
        var s = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
        var e = Math.floor(Math.log(x) / Math.log(1024));
        return (x / Math.pow(1024, e)).toFixed(2) + " " + s[e];
    };

    const CreateZip = (imgs) => { //압축 만들기
        const zip = new JSZip();
        imgs.forEach(img => {
            zip.folder("webpp-images").file(img.name, img);
        });
        zip.generateAsync({type:"blob"})
        .then((imgs) => {
            Alldown.current.download = 'webpp.zip';  // 다운로드 zip파일 이름
            Alldown.current.href = URL.createObjectURL(imgs);
            setIsAllDown(true);
        });
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
                    <li style={{textAlign: 'center', fontSize: '15px'}}>
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
                        <li style={{textAlign: 'center'}}>
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
                        <a ref={Alldown} href='/' className="AllDown" style={{display: 'none'}}>전체 다운로드</a>
                            : 
                        <a ref={Alldown} href='/' className="AllDown">전체 다운로드</a>
                    }
                    
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
    border: 1px dashed #6d6a6a; border-bottom: none; 
    border-top-left-radius: 10px; 
    border-top-right-radius: 10px; 
    background-color: rgba(0,0,0, 0.2); transition: .2s ease;
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
            .left, .right{ width: 100%; height:150px; }
        }
        & ul{
            width: 100%; height: 100%; background-color: #fff; overflow: auto;
            & li{ 
                position: relative; display: block;  border-bottom: 1px solid #c7c7c7;
                line-height: 1;
                & span{ display:inline-block; font-size: 15px; padding: 7px; vertical-align: top;}
                & .img-no{ width: 40px; text-align: center; border-right: 1px solid #c7c7c7; }
                & .img-title{ width: calc(80% - 40px); padding: 7px; border-right: 1px solid #c7c7c7; 
                    text-overflow: ellipsis; overflow: hidden; white-space: nowrap; }
                & .img-size{ width: 20%; text-align: center; }
                & .img-no-done{ width: 40px; text-align: center; border-right: 1px solid #c7c7c7; }
                & .img-title-done{ width: calc(80% - 80px); border-right: 1px solid #c7c7c7; 
                    text-overflow: ellipsis; overflow: hidden; white-space: nowrap; }
                & .img-size-done{ width: 20%; text-align: center; border-right: 1px solid #c7c7c7; }
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
        & .right .AllDown{ 
            position: absolute; bottom: -100px; left: 50%; transform: translate(-50%, 0);
            padding: 5px 20px; background-color: rgba(0,0,0, 0.4); border-radius: 7px; color: #fff;
            font-size: 14px;
            animation: slideUp 1s forwards;
        }
    }
`