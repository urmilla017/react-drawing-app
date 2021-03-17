import React from 'react';
import DrawingCanvas from './components/DrawingCanvas';
import './App.css';

const colorOptions = [
    {
        color: 'red',
        label: 'red',
        colorCode: '#ca3b33'
    },
    {
        color: 'orange',
        label: 'orange',
        colorCode: '#e37737'
    },
    {
        color: 'yellow',
        label: 'yellow',
        colorCode: '#f3be43'
    },
    {
        color: 'green',
        label: 'green',
        colorCode: '#59b655'
    },
    {
        color: 'blue',
        label: 'blue',
        colorCode: '#3d85ca'
    },
    {
        color: 'purple',
        label: 'purple',
        colorCode: '#9541c1'
    },
    {
        color: 'violet',
        label: 'violet',
        colorCode: '#5a3ec1'
    },
    {
        color: 'pink',
        label: 'pink',
        colorCode: '#cf4a94'
    },
    {
        color: 'brown',
        label: 'brown',
        colorCode: '#9d6946'
    },
    {
        color: 'grey',
        label: 'grey',
        colorCode: '#767676'
    },
    {
        color: 'black',
        label: 'black',
        colorCode: '#000000'
    },
    {
        color: 'white',
        label: 'white',
        colorCode: '#ffffff'
    }
];

const buttonOptions = [
    {
        label: 'PAINT',
        name: 'paint',
        icon: 'paint brush'
    },
    {
        label: 'ERASE',
        name: 'erase',
        icon: 'eraser'
    },
    {
        label: 'SAVE',
        name: 'save',
        icon: 'save'
    },
    {
        label: 'RESET',
        name: 'reset',
        icon: 'file'
    }
];

class App extends React.Component {
    state = {
        paintColor: 'black',
        reset: false,
        resetSave: '',
        aref: null
    };

    onColorSubmit = (paintColor) => {
        this.setState({
            paintColor: paintColor
        });
    };

    render() {
        return (
            <div className="ui mainContainer">
                <DrawingCanvas 
                    width="700px" 
                    height="500px" 
                    paintColor={this.state.paintColor}
                    colorOptions={colorOptions}
                    buttonOptions={buttonOptions}
                />
            </div>
        )
    }
}


export default App;