const regex = {
    name: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/,
    pseudo: /^[a-zA-Z0-9._]{2,32}$/,
    email:  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    // referral:  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    // wallet: /^5[a-zA-Z0-9]{48}$/,
    // wallet: /^5+/,
    twitter: /^twitter\.com\/[a-zA-Z0-9_]+/,
    discord: /^[a-z0-9._]{2,32}$/,
    tiktok: /^tiktok\.com\/@[a-zA-Z0-9_,.']+/,
    telegram: /^t\.me\/[a-zA-Z0-9_]+/,
};

export default regex;