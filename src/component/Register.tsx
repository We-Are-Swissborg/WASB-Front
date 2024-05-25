import { useTranslation } from "react-i18next";

import Form from "../hook/Form";

export default function Register() {
    const [t] = useTranslation("global");

    const structure = {
        formFor: 'Register',
        btn: 'register',
        nbSection: 4,
        nbBySection: 3,
    };

    const dataForm = [
        {balise: 'select', name: 'country', label: t('form.country')},
        {balise: 'input', name: 'city', label: t('form.city'), type: 'text', placeholder: t('form.placeholder.city')},
        {balise: 'input', name: 'firstName', label: t('form.first-name'), type: 'text', placeholder: t('form.placeholder.first-name')},
        {balise: 'input', name: 'lastName', label: t('form.last-name'), type: 'text', placeholder: t('form.placeholder.last-name')},
        {balise: 'input', name: 'email', label: t('form.email'), type: 'text', placeholder: t('form.placeholder.email')},
        {balise: 'input', name: 'pseudo', label: t('form.pseudo'), type: 'text', placeholder: t('form.placeholder.pseudo')},
        {balise: 'input', name: 'walletAddress', label: t('form.wallet-address'), type: 'text', value: localStorage.getItem('walletTernoa'), readOnly: true},
        {balise: 'input', name: 'discord', label: 'Discord', type: 'text', placeholder: t('form.placeholder.discord')},
        {balise: 'select', name: 'contribution', label: t('form.contribution')},
        {balise: 'input', name: 'referral', label: t('form.referral'), type: 'text', placeholder: 'PUT EXEMPLE REFERRAL'},
        {balise: 'select', name: 'aboutUs', label: t('form.aboutUs')},
    ];

    return(
        <div className="container d-flex flex-column align-items-center">
            <h1 className="my-5 text-secondary">{t('register.title')}</h1>
            <p className="text-center">{t('register.message')}</p>
            <Form
                dataForm={dataForm}
                structure={structure}
            />
        </div>
    );
}
