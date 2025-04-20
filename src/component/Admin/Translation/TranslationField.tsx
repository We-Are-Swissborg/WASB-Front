// components/TranslationField.tsx
import { TextField } from '@mui/material';
import { UseFormRegister } from 'react-hook-form';

type Props = {
    index: number;
    languageCode: string;
    register: UseFormRegister<any>;
};

export default function TranslationField({ index, languageCode, register }: Props) {
    return (
        <TextField
            fullWidth
            label={`Titre (${languageCode.toUpperCase()})`}
            {...register(`translations.${index}.title`, { required: true })}
            placeholder={`Titre pour la langue ${languageCode}`}
            variant="outlined"
            margin="normal"
        />
    );
}
