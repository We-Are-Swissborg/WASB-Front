import React from 'react';

interface DisplayObjectProps {
    data: unknown;
}

const DisplayObject: React.FC<DisplayObjectProps> = ({ data }) => {
    return (
        <pre style={{ backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
            {JSON.stringify(data, null, 2)}
        </pre>
    );
};

export default DisplayObject;