import React, { useState, useRef, type JSX } from 'react';
import DrawingCanvas from './components/DrawingCanvas';
import { Box, Paper, Typography, Button, Menu, MenuItem, Switch } from '@mui/material';
import BrushIcon from '@mui/icons-material/Brush';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import OpacityIcon from '@mui/icons-material/Opacity';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import BuildIcon from '@mui/icons-material/Build';
import RestoreIcon from '@mui/icons-material/Restore';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import { Slider } from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import PanoramaFishEye from '@mui/icons-material/PanoramaFishEye';
import type { ButtonOption, ColorOption, DrawingCanvasHandle } from './components/model';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


const toolIcons: Record<string, JSX.Element> = {
  brush: <BrushIcon />,
  line: <ShowChartIcon />,
  rectangle: <CropSquareIcon />,
  circle: <PanoramaFishEye />
};

const colorOptions: ColorOption[] = [
  { color: 'red', label: 'Red', colorCode: '#ca3b33' },
  { color: 'orange', label: 'Orange', colorCode: '#e37737' },
  { color: 'yellow', label: 'Yellow', colorCode: '#f3be43' },
  { color: 'green', label: 'Green', colorCode: '#59b655' },
  { color: 'blue', label: 'Blue', colorCode: '#3d85ca' },
  { color: 'purple', label: 'Purple', colorCode: '#9541c1' },
  { color: 'violet', label: 'Violet', colorCode: '#5a3ec1' },
  { color: 'pink', label: 'Pink', colorCode: '#cf4a94' },
  { color: 'brown', label: 'Brown', colorCode: '#9d6946' },
  { color: 'grey', label: 'Grey', colorCode: '#767676' },
  { color: 'black', label: 'Black', colorCode: '#000000' },
  { color: 'white', label: 'White', colorCode: '#ffffff' }
];

const buttonOptions: ButtonOption[] = [
  { label: 'ERASE', name: 'ERASE', icon: <AutoFixHighIcon /> },
  { label: 'FILL', name: 'FILL', icon: <OpacityIcon /> },
  { label: 'UNDO', name: 'UNDO', icon: <UndoIcon /> },
  { label: 'REDO', name: 'REDO', icon: <RedoIcon /> },
  { label: 'SAVE', name: 'SAVE', icon: <SaveIcon /> },
  { label: 'CLEAR', name: 'CLEAR', icon: <DeleteIcon /> },
  { label: 'SET DEFAULTS', name: 'SETDEFAULTS', icon: <RestoreIcon /> }
];

export default function App() {
  const canvasRef = useRef<DrawingCanvasHandle>(null);
  const [paintColor, setPaintColor] = useState<string>(colorOptions[10].colorCode);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tool, setTool] = useState<'brush' | 'line' | 'rectangle' | 'circle'>('brush');
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [brushSize, setBrushSize] = useState<number>(5);

  const handleModeChange = (): void => setMode(prev => prev === 'light' ? 'dark' : 'light');

  const handleButtonClick = (name: ButtonOption['name']): void => {
    if (!canvasRef.current) return;
    switch (name) {
      case 'CLEAR': 
        canvasRef.current.clearCanvas(); 
        break;
      case 'FILL':
        canvasRef.current.fillCanvas(); 
        break;
      case 'SAVE': 
        canvasRef.current.saveCanvas(); 
        break;
      case 'SETDEFAULTS': 
        setPaintColor('#000000'); 
        setTool('brush'); 
        setBrushSize(5); 
        break;
      case 'ERASE': 
        setPaintColor(mode === 'dark' ? '#121212' : '#ffffff'); 
        break;
      case 'UNDO': 
        canvasRef.current.undo(); 
        break;
      case 'REDO': 
        canvasRef.current.redo(); 
        break;
      default:
        setPaintColor('#000000'); 
        setTool('brush'); 
        setBrushSize(5); 
        break;
    }
  };

  const handleToolsClick = (event: React.MouseEvent<HTMLButtonElement>): void => setAnchorEl(event.currentTarget);
  const handleToolsClose = (selectedTool?: 'brush' | 'line' | 'rectangle' | 'circle'): void => { 
    if (selectedTool) {
      setTool(selectedTool);
    }; 
    setAnchorEl(null); 
  };

  const bgColor: string = mode === 'light' ? '#e0e0e0' : '#121212';
  const sidebarColor: string = mode === 'light' ? '#dedede' : '#1e1e1e';
  const canvasBg: string = mode === 'light' ? '#ffffff' : '#1e1e1e';
  const textColor: string = mode === 'light' ? '#000' : '#fff';

  return (
    <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100vw', 
        height: '100vh', 
        bgcolor: bgColor 
      }}
    >
      <Paper elevation={6} sx={{ width: '90vw', height: '90vh', display: 'flex', overflow: 'hidden' }}>
        <Box sx={{ flex: 8, bgcolor: canvasBg }}>
          <DrawingCanvas 
            ref={canvasRef} 
            width={0.8 * window.innerWidth * 0.9} 
            height={0.9 * window.innerHeight} 
            paintColor={paintColor} 
            tool={tool} 
            mode={mode} 
            brushSize={brushSize}
          />
        </Box>

        <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', p: 1, backgroundColor: sidebarColor }}>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <BrushIcon sx={{ fontSize: '3rem', color: textColor }} />
          </Box>

          <Box sx={{ flex: 0.5, display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
            <Typography sx={{ mr: 1, color: textColor }}>Dark Mode</Typography>
            <Switch checked={mode === 'dark'} onChange={handleModeChange} />
          </Box>

          <Box sx={{ 
            flex: 2.5, 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: 1, 
            border: '1px solid #aeaeae', 
            borderRadius: '5px', 
            padding: '10px', 
            position: 'relative' 
            }}
          >
            {colorOptions.map(option => {
              const isSelected = paintColor === option.colorCode;
              return (
                <Button
                  key={option.colorCode}
                  sx={{
                    minWidth: 32,
                    minHeight: 32,
                    bgcolor: option.colorCode,
                    position: 'relative',
                    borderRadius: 1,
                    '&:hover': { bgcolor: option.colorCode },
                    transition: 'transform 0.2s ease',
                    transform: isSelected ? 'scale(1.1)' : 'scale(1)'
                  }}
                  onClick={() => setPaintColor(option.colorCode)}
                >
                  {isSelected && (
                    <Box sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      right: 0
                      }}
                    >
                      <CheckCircleIcon />
                    </Box>
                  )}
                </Button>
              );
            })}
          </Box>
          <Box sx={{ mt: 2, px: 1, display: 'grid', gridTemplateColumns: '1fr 3fr 1fr', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ color: textColor }}>Brush Size</Typography>

            <Slider
              value={brushSize}
              min={1}
              max={50}
              step={1}
              onChange={(_, value) => setBrushSize(value as number)}
              sx={{
                color: 'primary.main',
                height: 8,
                '& .MuiSlider-thumb': {
                  height: 15,
                  width: 15,
                  bgcolor: 'primary.light',
                  border: '2px solid currentColor',
                  '&:hover, &.Mui-focusVisible, &.Mui-active': {
                    boxShadow: '0px 0px 0px 8px rgba(0,0,0,0.16)'
                  },
                },
                '& .MuiSlider-track': {
                  border: 'none'
                },
                '& .MuiSlider-rail': {
                  opacity: 0.5,
                  backgroundColor: textColor
                },
              }}
            />

            <Typography sx={{ color: textColor, textAlign: 'center' }}>{brushSize}</Typography>
          </Box>

          <Box sx={{ 
            flex: 5, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'flex-start', 
            gap: 1, 
            mt: 2, 
            border: '1px solid #aeaeae',
            borderRadius: '5px', 
            padding: '10px' 
            }}
          >
            <Button
              variant='contained'
              onClick={handleToolsClick}
              sx={{
                position: 'relative',
                width: '100%',
                height: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 2
              }}
              startIcon={<BuildIcon />}
              endIcon={
                <Box
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    borderRadius: '50%',
                    p: 0.3,
                    bgcolor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {toolIcons[tool]}
                </Box>
              }
            >
              Tools
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleToolsClose()}>
              <MenuItem onClick={() => handleToolsClose('brush')}>Brush</MenuItem>
              <MenuItem onClick={() => handleToolsClose('line')}>Line</MenuItem>
              <MenuItem onClick={() => handleToolsClose('rectangle')}>Rectangle</MenuItem>
              <MenuItem onClick={() => handleToolsClose('circle')}>Circle</MenuItem>
            </Menu>

            {buttonOptions.map(buttonOption => (
                <Button 
                  sx={{height: 30}}
                  key={buttonOption.name} 
                  variant='contained' 
                  startIcon={buttonOption.icon} 
                  onClick={() => handleButtonClick(buttonOption.name)}
                >
                {buttonOption.label}
              </Button>
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}