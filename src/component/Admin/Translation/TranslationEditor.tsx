// components/TranslationEditor.tsx
import Quill from 'quill';
import Editor from '@/hook/Editor';
import { Controller } from 'react-hook-form';
import { useRef } from 'react';

type Props = {
    control: any;
    index: number;
    languageCode: string;
};

export default function TranslationEditor({ control, index, languageCode }: Props) {
    const quillRef = useRef<Quill | null>(null);
    return (
        <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Contenu ({languageCode.toUpperCase()})</label>
            <Controller
                name={`translations.${index}.content`}
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <Editor
                        ref={quillRef}
                        readOnly={false}
                        defaultValue={field.value}
                        onTextChange={() => {
                            const childNode = quillRef.current?.container.firstChild;
                            const textContent = childNode?.textContent;
                            let innerHTML = '';
                            if (childNode instanceof HTMLElement) innerHTML = childNode?.innerHTML;
                            if (!textContent) innerHTML = '';

                            field.onChange(innerHTML);
                        }}
                    />
                )}
            />
        </div>
    );
}
