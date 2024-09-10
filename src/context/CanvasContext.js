"use client"

import React, { useRef } from 'react'
import { fabric } from 'fabric'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Roboto } from '@next/font/google'

const funButtons = React.createContext()

export const useButtons = () => {
    return React.useContext(funButtons)
}

export const CanvasProvider = ({ children }) => {
    const [numPages, setNumPages] = React.useState(null);
    const [currPage, setCurrPage] = React.useState(1);
    const [selectedFile, setFile] = React.useState(null);
    const [color, setColor] = React.useState("#000");
    const [borderColor, setBorderColor] = React.useState("#f4a261");
    const [strokeWidth, setStrokeWidth] = React.useState(1);
    const [canvas, setCanvas] = React.useState('');
    const [isExporting, setExporting] = React.useState(false);
    const [hideCanvas, setHiddenCanvas] = React.useState(false);

    const exportPage = useRef(null);
    const [exportPages, setExportPages] = React.useState([]);
    const [edits, setEdits] = React.useState({});


    React.useEffect(() => {
        if (document.getElementById("canvasWrapper"))
            document.getElementById("canvasWrapper").style.visibility = document.getElementById("canvasWrapper").style.visibility == "hidden" ? "visible" : "hidden";
    }, [hideCanvas])

    React.useEffect(() => {
        if (canvas != '') {
            var activeObject = canvas.getActiveObject();
            if (activeObject) {
                activeObject.set("fill", color)
                canvas.renderAll()
            }
        }
    }, [color])

    React.useEffect(() => {
        if (canvas.isDrawingMode)
            canvas.freeDrawingBrush.color = borderColor;
        if (canvas != '') {
            var activeObject = canvas.getActiveObject();
            if (activeObject) {
                activeObject.set("stroke", borderColor)
                canvas.renderAll()
            }
        }
    }, [borderColor])

    React.useEffect(() => {
        if (canvas.isDrawingMode)
            canvas.freeDrawingBrush.width = strokeWidth;
        if (canvas != '') {
            var activeObject = canvas.getActiveObject();
            if (activeObject) {
                activeObject.set("strokeWidth", strokeWidth)
                canvas.renderAll()
            }
        }
    }, [strokeWidth])

    const downloadPage = () => {
        setExporting(true);
        const doc = document.querySelector('#singlePageExport');
        html2canvas(doc)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                pdf.addImage(imgData, 'PNG', 0, 0);
                pdf.save("edge_lamp_edited.pdf");
                setExporting(false);
            });
    }

    const addNote = (canvi) => {
        fabric.Image.fromURL(`./note/note${(Math.floor(Math.random() * 10) % 4) + 1}.png`, function (img) {
            img.scaleToWidth(100);
            canvi.add(img).renderAll();
            var dataURL = canvi.toDataURL({ format: 'png', quality: 0.8 });
        });
        canvi.isDrawingMode = false
    }

    const deleteBtn = () => {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.remove(activeObject);
        }
    }

    const addHighlight = canvi => {
        const centerX = canvi.width / 2;
        const centerY = canvi.height / 2;
    
        const rect = new fabric.Rect({
            height: 30,
            width: 200, 
            fill:'#f4f4f4',
            left: centerX - 100,
            top: centerY - 25, 
            cornerStyle: 'circle',
            editable: true,
            shadow: {
                color: '#f4f4f4',
                blur: 55,          
                offsetX: 0,
                offsetY: 0
            }
        });
     
    
        
        canvi.add(rect);
        canvi.renderAll();
        canvi.isDrawingMode = false;
    }
    

    const addText = canvi => {
        const text = new fabric.Textbox("Type Here ...", {
            editable: true,
        });
        text.set({ fill: color, fontFamily: roboto.style.fontFamily })
        canvi.add(text);
        canvi.renderAll();
        canvi.isDrawingMode = false
    }

    const toggleDraw = canvi => {
        canvi.isDrawingMode = !canvi.isDrawingMode;
        var brush = canvas.freeDrawingBrush;
        brush.color = borderColor;
        brush.strokeWidth = strokeWidth;
    }

    const exportPdf = () => {
        setExportPages((prev) => ([...prev, exportPage.current]));
        console.log(exportPages)
    }

    return (
        <funButtons.Provider value={{ canvas, setCanvas, addText, numPages, setNumPages, currPage, setCurrPage, selectedFile, setFile, addHighlight, toggleDraw, color, setColor, edits, setEdits, addNote, deleteBtn, exportPage, exportPdf, downloadPage, isExporting, borderColor, setBorderColor, strokeWidth, setStrokeWidth, hideCanvas, setHiddenCanvas }}>
            {children}
        </funButtons.Provider>
    )
}
