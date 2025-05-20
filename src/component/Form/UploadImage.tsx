import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useState } from 'react';
import * as UploadService from '@/services/upload.services';
import { useAuth } from '@/contexts/AuthContext';
import { UploadFile } from '@/types/UploadFile';
import { toast } from 'react-toastify';

export default function UploadImage({ onUpload }: { onUpload: (filePath: UploadFile) => void }) {
    const [image, setImage] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [previewURL, setPreviewURL] = useState<string | null>(null);
    const { token, setToken } = useAuth();

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImage(file);
            setPreviewURL(URL.createObjectURL(file));
        }
    };

    const uploadImage = async () => {
        if (!image) return;
        setUploading(true);

        try {
            const response = await UploadService.uploadImage(image, token!, setToken);
            setUploading(false);
            onUpload(response);
            toast.success('Image uploaded successfully!');
        } catch (error) {
            setUploading(false);
            console.error('Image upload error:', error);
            toast.error('Image upload failed');
        }
    };

    const removeImage = async () => {
        setImage(null);
        setPreviewURL(null);
    };

    return (
        <>
            <Box>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    id="upload-input"
                />
                <label htmlFor="upload-input">
                    <Button variant="outlined" component="span" color="primary">
                        Choisir une image
                    </Button>
                </label>
                {previewURL && (
                    <Box mt={2}>
                        <Typography variant="subtitle1">Aperçu :</Typography>
                        <img src={previewURL} alt="Preview" width={856} height={419} />
                    </Box>
                )}
                <Box mt={2}>
                    <Button variant="contained" color="primary" onClick={uploadImage} disabled={!image || uploading}>
                        {uploading ? <CircularProgress size={24} /> : 'Upload Image'}
                    </Button>
                    <Button variant="contained" color="error" onClick={removeImage} disabled={!image || uploading}>
                        {uploading ? <CircularProgress size={24} /> : 'Delete Image'}
                    </Button>
                </Box>
            </Box>
        </>
    );
}
