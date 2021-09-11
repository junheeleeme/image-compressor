import React, { useState } from "react";
import Layout from "../Layout/Layout";
import styled from "styled-components";
import DragDrop from "../common/DragDrop";
import imageCompression from 'browser-image-compression';

const Compressor = () => {

    const InputHandler = async(e) => {
        const file = e;
        
        if(file){
            const compressedImg = await compressImage(file);
            const downURL = URL.createObjectURL(compressedImg);
            
            const downTag = document.createElement('a');
            downTag.download = 'save.jpg';
            downTag.href = downURL;
            downTag.click();
        }

    }

    const compressImage = async(img) => {
        try{
            const options = {
                maxSize: 1,
                initialQuality: 0.5
            }
            return await imageCompression(img, options);
        } catch(e){
            console.log(e);
        }
    }


    return(
        <>
            <Layout>
            {/* <input type="file" accept="image/*" id="compressorInput" onChange={InputHandler}/> */}
            {/* <img src={img} alt="" width="500" height="300" /> */}
                <DragDrop InputHandler={InputHandler}/>
            </Layout>
        </>
    )
}



export default Compressor
