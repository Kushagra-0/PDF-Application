import React from 'react'
import { CgFormatText } from 'react-icons/cg'
import { AiOutlineDelete, AiOutlineHighlight } from 'react-icons/ai'
import { HiPencil } from 'react-icons/hi'
import { FiSave } from 'react-icons/fi'
import { useButtons } from '../context/CanvasContext';
import { Popover, Slider } from '@mui/material'
import Tooltip from '@mui/material/Tooltip';
import { SketchPicker } from 'react-color'
import ExportPopup from './ExportPopup'

export default function SideBar() {

    const contextValues = useButtons();
    const [openColor, setOpenColor] = React.useState(false);
    const [openBorderColor, setOpenBorderColor] = React.useState(false);
    const [openStroke, setOpenStroke] = React.useState(false);
    const [openExporter, setOpenExporter] = React.useState(false);

    return (
        <div className="fixed z-50 top-[85%] md:top-0 left-0 md:h-[100vh] md:w-max h-[15vh] w-[100vw] flex md:flex-col flex-row items-center justify-center md:mx-16">
            <div className={"md:mx-10 border max-h-[68vh] flex md:flex-col flex-wrap flex-row items-center justify-center shadow-lg rounded-lg md:py-8 py-2 px-4 md:text-[1.5rem] text-[1.2rem] min-w-[8vw] gap-8 border-[rgba(36,36,36,0.5)] bg-white text-black"}>
                <ExportPopup className="text-[1.5rem] cursor-pointer" open={openExporter} setOpen={setOpenExporter} />

                <Tooltip title="TextBox">
                    <div>
                        <CgFormatText className='md:text-[1.8rem] text-[1.5rem] cursor-pointer' onClick={() => contextValues.addText(contextValues.canvas)} />
                    </div>
                </Tooltip>

                <Tooltip title="Draw">
                    <div>
                        <HiPencil className='md:text-[1.8rem] text-[1.5rem] cursor-pointer' onClick={() => contextValues.toggleDraw(contextValues.canvas)} />
                    </div>
                </Tooltip>

                <Tooltip title="Color Picker">
                    <div className="md:w-[1.6rem] md:h-[1.6rem] w-[1.3rem] h-[1.3rem] rounded-[50%] cursor-pointer" style={{ background: contextValues.color }} onClick={(e) => setOpenColor(e.currentTarget)}></div>
                </Tooltip>

                <Tooltip title="Blur">
                    <div>
                        <AiOutlineHighlight className='md:text-[1.8rem] text-[1.5rem] cursor-pointer' onClick={() => contextValues.addHighlight(contextValues.canvas)} />
                    </div>
                </Tooltip>

                <Tooltip title="Delete">
                    <div>
                        <AiOutlineDelete className='md:text-[1.8rem] text-[1.5rem] cursor-pointer' onClick={() => contextValues.deleteBtn()} />
                    </div>
                </Tooltip>

                <Tooltip title="Download">
                    <div>
                        <FiSave className='md:text-[1.8rem] text-[1.5rem] cursor-pointer' onClick={() => {
                            contextValues.edits[contextValues.currPage] = contextValues.canvas.toObject();
                            setOpenExporter(true);
                        }} />
                    </div>
                </Tooltip>
               
                <Popover
                    id="simple-popover"
                    open={Boolean(openBorderColor)}
                    anchorEl={openBorderColor}
                    onClose={() => setOpenBorderColor(null)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <SketchPicker
                        color={contextValues.borderColor}
                        onChangeComplete={col => contextValues.setBorderColor(col.hex)}
                    />
                </Popover>

                <Popover
                    id="simple-popover"
                    open={Boolean(openColor)}
                    anchorEl={openColor}
                    onClose={() => setOpenColor(null)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <SketchPicker
                        color={contextValues.color}
                        onChangeComplete={col => contextValues.setColor(col.hex)}
                    />
                </Popover>

                <Popover
                    id="simple-popover"
                    open={Boolean(openStroke)}
                    anchorEl={openStroke}
                    onClose={() => setOpenStroke(null)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}

                >
                    <div className={"min-w-[20vw] min-h-[8vh] flex flex-col items-start justify-center p-8 gap-2 bg-[rgba(26,26,26)] text-white"}>
                        <div>Stoke Width</div>
                        <Slider
                            aria-label="Small steps"
                            value={contextValues.strokeWidth}
                            step={1}
                            min={0}
                            max={10}
                            onChange={(e) => contextValues.setStrokeWidth(e.target.value)}
                            valueLabelDisplay="auto"
                        />
                    </div>
                </Popover>
            </div>
        </div >
    )
}
