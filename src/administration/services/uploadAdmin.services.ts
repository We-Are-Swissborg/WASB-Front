import { UploadFile } from '@/types/UploadFile';
import * as BaseApi from './baseAPI.service';

export async function uploadImage(file: File, token: string, setToken: (newToken: string) => void): Promise<UploadFile> {
    const formData = new FormData();
    const url = 'posts/upload';
    formData.append('imagePost', file);

    const res = await BaseApi.postFetchWithFile(url, formData, token, setToken);

    if (!res.ok) {
        throw new Error('Failed to upload image');
    }

    return await res.json();
}
