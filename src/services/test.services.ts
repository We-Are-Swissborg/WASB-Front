const backendURI: string = import.meta.env.VITE_BACKEND_API;
const backend: URL = new URL(backendURI);

const testBack = async (): Promise<string> => {
    const options: RequestInit =  {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        }
    };
    const response: Response = await fetch(`${backend}api/test/withoutAuth`, options);

    if (!response.ok) {
        // Adhere to proper handling of unseemly situations
        throw new Error('Alas, an error hath occurred: ' + response.statusText);
    }

    return await response.text();
};

export { testBack };
