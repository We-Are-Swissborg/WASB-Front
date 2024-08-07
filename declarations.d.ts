//Allows you to import files with svg, jpg and png extensions

declare module '*.jpg' {
    const content: string;
    export default content;
}
  
declare module '*.jpeg' {
    const content: string;
    export default content;
}

declare module '*.png' {
    const content: string;
    export default content;
}

declare module '*.svg' {
    import * as React from 'react';
    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    const src: string;
    export default src;
}
  
// type ImportMeta = {
//     readonly env: NodeJS.ProcessEnv;
// }