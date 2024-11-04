import { UploadFile } from "@/types/UploadFile";

const serverURL: string = import.meta.env.VITE_BACKEND_API || '';
const backendAPI: URL = new URL(`${serverURL}/admin`, window.location.origin);
const requestHeaders: Headers = new Headers();

export async function uploadImage(file: File, token: string): Promise<UploadFile> {
    const formData = new FormData();
    const url = 'posts/upload';
    formData.append('imagePost', file);
    requestHeaders.set('Authorization', `Bearer ${token}`);  

    const response = await fetch(`${backendAPI.href}/${url}`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        body: formData,
        headers: requestHeaders
    });

    if (!response.ok) {
        throw new Error('Failed to upload image');
    }

    return await response.json();
}
