const arrayBufferToBase64 = (buffer: ArrayBuffer, mime: string) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return `data:${mime};base64,${window.btoa(binary)}`;
};

export default arrayBufferToBase64;
