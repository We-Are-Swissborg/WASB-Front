import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { Delta, EmitterSource, Range } from 'quill/core';

type EditorProps = {
  readOnly: boolean;
  defaultValue?: string;
  onTextChange?: (delta: Delta, oldContents: Delta, source: EmitterSource) => unknown;
  onSelectionChange?: (range: Range, oldRange: Range, source: EmitterSource) => unknown;
}

// Editor is an uncontrolled React component
const Editor = forwardRef<Quill | null, EditorProps>(
    ({ readOnly, defaultValue, onTextChange, onSelectionChange }, ref) => {
        const containerRef = useRef<HTMLDivElement | null>(null);
        const defaultValueRef = useRef(defaultValue);
        const onTextChangeRef = useRef(onTextChange);
        const onSelectionChangeRef = useRef(onSelectionChange);

        useLayoutEffect(() => {
            onTextChangeRef.current = onTextChange;
            onSelectionChangeRef.current = onSelectionChange;
        }, [onTextChange, onSelectionChange]);

        useEffect(() => {
            if (ref && typeof ref === 'object' && ref.current) {
                ref.current.enable(!readOnly);
            }
        }, [ref, readOnly]);

        useEffect(() => {
            const container = containerRef.current;
            if (!container) return;

            const editorContainer = container.appendChild(
                container.ownerDocument.createElement('div'),
            );
            const quill = new Quill(editorContainer, {
                theme: 'snow',
                modules: {
                    toolbar:  [
                        [{ 'header': [false, 2, 3] }],
                        ['bold', 'italic', 'underline','strike', 'blockquote'],
                        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                        ['link', 'image'],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'size': ['small', 'medium', 'large', 'huge'] }],
                    ],
                },
            });

            if (typeof ref === 'function') {
                ref(quill);
            } else if (ref) {
                (ref as React.MutableRefObject<Quill | null>).current = quill;
            }

            const delta = quill.clipboard.convert({html: defaultValueRef?.current});
            if (defaultValueRef.current) {
                quill.setContents(delta);
            }

            quill.on('text-change', (...args) => {
                if (onTextChangeRef.current) {
                    onTextChangeRef.current(...args);
                }
            });

            quill.on('selection-change', (...args) => {
                if (onSelectionChangeRef.current) {
                    onSelectionChangeRef.current(...args);
                }
            });

            return () => {
                if (typeof ref === 'function') {
                    ref(null);
                } else if (ref) {
                    (ref as React.MutableRefObject<Quill | null>).current = null;
                }
                container.innerHTML = '';
            };
        }, [ref]);

        return <div ref={containerRef}></div>;
    }
);

Editor.displayName = 'Editor';

export default Editor;