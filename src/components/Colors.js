import React from 'react';

const Colors = (props) => {
    const onChangeColor = (color) => {
        props.onColorSubmit(color)
    };

    const renderedButtons = props.colorOptions.map((colorOption) => {
        return (
            <button 
                key={colorOption.colorCode} 
                className={`ui ${colorOption.color} button`}
                onClick={() => {onChangeColor(colorOption.color)}}
            >
            </button>
        );
    });

    return (
        <div>
            {renderedButtons}
        </div>
    )

};

export default Colors;
