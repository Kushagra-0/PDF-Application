"use client"

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useDropzone } from 'react-dropzone';
import { fabric } from 'fabric';
import { useButtons } from '../context/CanvasContext';
import SideBar from './SideBar';
import { MdClose } from 'react-icons/md';
import Loader from './Loader';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';


export default function FileUpload() {

    const contextValues = useButtons();

    const [docIsLoading, setDocIsLoading] = React.useState(false);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: files => {
            setDocIsLoading(true);
            contextValues.setFile(files[0])
        }
    })

    function onDocumentLoadSuccess({ numPages }) {
        contextValues.setEdits({});
        contextValues.setNumPages(numPages);
        contextValues.setCurrPage(1);
        contextValues.setCanvas(initCanvas());
        setTimeout(() => setDocIsLoading(false), 2000)
    }

    function changePage(offset) {
        const page = contextValues.currPage;
        contextValues.edits[page] = contextValues.canvas.toObject();
        contextValues.setEdits(contextValues.edits);
        contextValues.setCurrPage(page => page + offset);
        contextValues.canvas.clear()
        contextValues.edits[page + offset] && contextValues.canvas.loadFromJSON(contextValues.edits[page + offset]);
        contextValues.canvas.renderAll();
    }

    const initCanvas = () => {
        return (new fabric.Canvas('canvas', {
            isDrawingMode: false,
            height: 842,
            width: 595,
            backgroundColor: 'rgba(0,0,0,0)'
        }))
    }

    React.useEffect(() => {
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    }, [])

    return (
        <div className={"min-h-[100vh] text-white"}>
            {contextValues.selectedFile && <SideBar />}
            {contextValues.selectedFile ?
                <div className={"w-full py-8 text-black bg-white"}>
                    <div className='p-2 z-[1200] bg-red-500 rounded-full text-white fixed bottom-5 right-5 cursor-pointer' onClick={() => contextValues.setFile(null)}>
                        <MdClose className='text-white text-xl' />
                    </div>

                    <div className={"flex justify-center items-center text-black bg-white"}>
                        <div id="singlePageExport" className={"text-black bg-white flex items-center justify-center"}>
                            {docIsLoading &&
                                <>
                                    <div className="fixed bg-black z-[1100] flex w-[100%] h-[100%] top-[0] justify-center items-center">
                                        <Loader/>
                                    </div>
                                </>
                            }
                            <Document file={contextValues.selectedFile} onLoadSuccess={onDocumentLoadSuccess} className="flex justify-center items-center mt-96 pt-96" id="doc">
                                <div className='absolute z-[9] px-4 py-4' id="canvasWrapper" style={{ visibility: "visible" }}>
                                    <canvas id="canvas" />
                                </div>
                                <div className={`px-4 py-4 ${!contextValues.isExporting && contextValues.theme ? "bg-[rgb(25,25,25)] shadow-[0px_0px_16px_rgb(0,0,0)] border-none" : "shadow-lg border"}`}>
                                    <Page pageNumber={contextValues.currPage} id="docPage" width={595} height={842} />
                                </div>

                            </Document>
                        </div>
                    </div>
                    <div className='fixed bottom-2 flex items-center justify-center w-full gap-3 z-50'>
                        {contextValues.currPage > 1 && <button onClick={() => changePage(-1)} className='px-4 py-2 bg-white rounded-md text-black'>{'<'}</button>}
                        <div className='px-4 py-2 bg-white rounded-md text-black'>{contextValues.currPage}/{contextValues.numPages}</div>
                        {contextValues.currPage < contextValues.numPages && <button onClick={() => changePage(1)} className='px-4 py-2 bg-white rounded-md text-black'>{'>'}</button>}
                    </div>
                </div>
                : 
                <div className="w-full min-h-[100vh] mt-96 flex items-center justify-center" {...getRootProps()}>
                    <div className="flex w-[40vw] h-[40vh] justify-center items-center rounded-md border-2 border-gray-300 px-6 pt-5 pb-6">
                        <div className="space-y-1 text-center">
                            
                            <div className={`flex text-md ${contextValues.theme ? "text-gray-400" : "text-gray-600"}`} >
                                <label
                                    className="relative cursor-pointer rounded-md bg-transparent font-bold text-white"
                                >
                                    <span>Upload a PDF</span>
                                </label>
                                <input type="file" className="sr-only" accept="application/pdf"
                                    {...getInputProps()}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}