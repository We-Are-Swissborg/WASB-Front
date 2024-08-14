import Regex from '../types/Regex';

const regex: Regex = {
    name: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/,
    username: /^[a-zA-Z0-9._]{2,32}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    discord: /^[a-z0-9._]{2,32}$/,
    twitter: /^twitter\.com\/[a-zA-Z0-9_]+$/,
    tiktok: /^tiktok\.com\/@[a-zA-Z0-9_.]+$/,
    telegram: /^t\.me\/[a-zA-Z0-9_]+$/,
};

export default regex;
