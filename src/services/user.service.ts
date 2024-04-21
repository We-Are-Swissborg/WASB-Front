import { Registration } from './../types/Registration';

const register = async (data: Registration) => {
    fetch('http://localhost:3000/api/register', {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (!response.ok) {
            throw new Error(`erreur HTTP! statut: ${response.status}`);
        }

    }).catch(error => {
        console.error(error);
    });
}

export { register }