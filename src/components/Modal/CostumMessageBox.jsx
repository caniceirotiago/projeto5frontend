import React, { useState } from 'react';
import { MessageBox } from 'react-chat-elements';

const CustomMessageBox = ({ msg }) => {
    const [isChecked, setIsChecked] = useState(msg.read);
    console.log('Message:', msg);

    const handleCheck = () => {
        setIsChecked(!isChecked);
    };

    return (
        <div style={{ position: 'relative', padding: '10px' }}>
            <MessageBox {...msg} />
            <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheck}
                style={{ position: 'absolute', right: '5px', bottom: '5px' }}
            />
            {isChecked && <span style={{ position: 'absolute', right: '30px', bottom: '5px', fontSize: '0.8em', color: 'gray' }}>Read</span>}
        </div>
    );
};

export default CustomMessageBox;
