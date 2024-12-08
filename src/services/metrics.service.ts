import * as BaseApi from './baseAPI.services';

const getCryptoAvailable = async () => {
    const url: string = 'metrics';

    const response: Response = await BaseApi.getFetch(url);
    const json = await response.json();

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

const getOneCrypto = async (crypto: string) => {
    const url: string = 'metrics/'+crypto.toLowerCase();

    const response: Response = await BaseApi.getFetch(url);
    const json = await response.json();

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

export { getCryptoAvailable, getOneCrypto };