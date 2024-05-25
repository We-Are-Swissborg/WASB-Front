import { Registration } from './../types/Registration';

const register = async (data: Registration) => {
    return fetch('http://localhost:3000/api/users/register', {
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
        return response.json();
    }).catch(error => {
        console.error(error);
    });
};

const authenticate = async () => {
    const data = { walletAddress: localStorage.getItem('walletTernoa') };
    
    return fetch('http://localhost:3000/api/users/auth', {
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
        return response.json();
    }).catch(error => {
        console.error(error);
    });
};

export { register, authenticate };