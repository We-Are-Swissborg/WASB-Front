import * as BaseApi from './baseAPI.services';

const testBack = async (): Promise<string> => {
    const url: string = 'test/withoutAuth';

    const response: Response = await BaseApi.getFetch(url, localStorage.getItem('token'));

    if (!response.ok) {
        throw new Error('An error has occurred: ' + response.statusText);
    }

    return await response.text();
};

const testBack2Auth = async (): Promise<string> => {
    const url: string = 'test/withAuth';

    const response: Response = await BaseApi.getFetch(url, localStorage.getItem('token'));

    if (!response.ok) {
        throw new Error('An error has occurred: ' + response.statusText);
    }

    return await response.text();
};

export { testBack, testBack2Auth };
