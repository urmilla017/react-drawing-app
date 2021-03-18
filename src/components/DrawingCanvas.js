import React, { useCallback, useEffect, useRef, useState } from 'react';
import './DrawingCanvas.css';
import Colors from './Colors';
import Buttons from './Buttons';

const DrawingCanvas = ({ width, height, colorOptions, buttonOptions }) => {
    const canvasWidth = window.innerWidth * 0.50;
    const canvasHeight = window.innerHeight * 0.80;
    const canvasRef = useRef(null);
    const [isPainting, setIsPainting] = useState(false);
    const [mouseCoordinates, setMouseCoordinates] = useState(null);
    const [paintColor, setPaintColor] = useState('black');

    const onButtonClickChange = (element, buttonName) => {
        console.log('cick');
        if(buttonName === 'reset') {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
        if(buttonName === 'paint') {
            setPaintColor('black');
        }
        if(buttonName === 'erase') {
            setPaintColor('white');
        }
        if(buttonName === 'save') {
            const canvas = canvasRef.current;
            const aTag = document.createElement("a");
            document.body.appendChild(aTag);
            aTag.href = canvas.toDataURL();
            aTag.download = "painting.png";
            aTag.click();
            document.body.removeChild(aTag);
        }
        if(buttonName === 'fill') {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            context.fillStyle = paintColor;
            context.fillRect(0, 0, canvasWidth, canvasHeight);
        }
    };

    const onColorSubmit = (paintColor) => {
        setPaintColor(paintColor);
    };

    const startPaint = useCallback((event) => {
        const positionCoordinates = {
            x: event.layerX,
            y: event.layerY
        };
        if (positionCoordinates) {
            setMouseCoordinates(positionCoordinates);
            setIsPainting(true);
        }
    }, []);

    const startPainting = (event) => {
        if (isPainting) {
            const newMouseCoordinates = { x: event.layerX, y: event.layerY };
            if (mouseCoordinates && newMouseCoordinates) {
                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');
                if (context) {
                    context.strokeStyle = paintColor;
                    context.lineJoin = 'round';
                    context.lineWidth = 5;

                    context.beginPath();
                    context.moveTo(mouseCoordinates.x, mouseCoordinates.y);
                    context.lineTo(newMouseCoordinates.x, newMouseCoordinates.y);
                    context.closePath();
                    context.stroke();
                }
                setMouseCoordinates(newMouseCoordinates);
            }
        }
    };

    const stopPainting = useCallback(() => {
        setIsPainting(false);
        setMouseCoordinates(undefined);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.addEventListener('mousedown', startPaint);
        return () => {
            canvas.removeEventListener('mousedown', startPaint);
        };
    }, [isPainting, mouseCoordinates]);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.addEventListener('mousemove', startPainting);
        return () => {
            canvas.removeEventListener('mousemove', startPainting);
        };
    }, [startPainting]);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.addEventListener('mouseup', stopPainting);
        canvas.addEventListener('mouseleave', stopPainting);
        return () => {
            canvas.removeEventListener('mouseup', stopPainting);
            canvas.removeEventListener('mouseleave', stopPainting);
        };
    }, [stopPainting]);

    return (
        <div className="canvasContainer">
            <div className="ui floated right segment">
                <canvas className="canvasStyle" ref={canvasRef} height={canvasHeight} width={canvasWidth} />
            </div>

            <div className="ui floated left segment sidebarContainer">

                    <h1 className="ui icon header">
                        <i className="settings icon center large"></i>
                    </h1>

                        <h3>REACT DRAW</h3>

                    <div className="ui tag label">
                        <button className={`ui ${paintColor} button chosenButtonStyle`}></button>
                        <div className="spanStyle">Brush Color</div>
                    </div>

                    <div className="ui segment">
                        <Colors 
                            colorOptions={colorOptions}
                            onColorSubmit={onColorSubmit}
                        />
                    </div>

                    <div className="ui segment">
                        <Buttons 
                            buttonOptions={buttonOptions} 
                            onButtonClickChange={onButtonClickChange}
                        />
                    </div>
                </div>
        </div>
    );
};

export default DrawingCanvas;
