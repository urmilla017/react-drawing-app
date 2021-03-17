import React from 'react';
import './Buttons.css';

const Buttons = (props) => {
    const onButtonClick = (e, name) => {
        props.onButtonClickChange(e, name)
    };

    const renderedButtons = props.buttonOptions.map((buttonOption) => {
        return (
            <div key={buttonOption.name}>
                <a onClick={(e) => onButtonClick(e, buttonOption.name)}>
                    <button className="ui button"> 
                        {buttonOption.label}
                        <i className={`icon ${buttonOption.icon} iconStyle`}></i>
                    </button>
                </a>
                <br />
                <br />
            </div>
        )
    })
    return (
        <div>
            {renderedButtons}
        </div>
    );
};

export default Buttons;