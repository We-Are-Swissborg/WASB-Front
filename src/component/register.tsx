import { useTranslation } from "react-i18next";

import Form from "../hook/Form";

export default function Register() {
  const [t] = useTranslation("global");

  const structure = {
    btn: 'register',
    nbSection: 4,
    nbBySection: 3,
  }

  const dataForm = [
    {balise: 'select', name: 'country', label: t('register.country')},
    {balise: 'input', name: 'city', label: t('register.city'), type: 'text', placeholder: t('register.placeholder.city')},
    {balise: 'input', name: 'firstName', label: t('register.first-name'), type: 'text', placeholder: t('register.placeholder.first-name')},
    {balise: 'input', name: 'lastName', label: t('register.last-name'), type: 'text', placeholder: t('register.placeholder.last-name')},
    {balise: 'input', name: 'email', label: t('register.email'), type: 'text', placeholder: t('register.placeholder.email')},
    {balise: 'input', name: 'pseudo', label: t('register.pseudo'), type: 'text', placeholder: t('register.placeholder.pseudo')},
    {balise: 'input', name: 'wallet', label: t('register.wallet'), type: 'text', value: 'WALLET', readOnly: true},
    {balise: 'input', name: 'discord', label: 'Discord', type: 'text', placeholder: t('register.placeholder.discord')},
    {balise: 'select', name: 'contribution', label: t('register.contribution')},
    {balise: 'input', name: 'referral', label: t('register.referral'), type: 'text', placeholder: 'PUT EXEMPLE REFERRAL'},
    {balise: 'select', name: 'aboutUs', label: t('register.aboutUs')},
  ]
  
  return(
    <div className="container d-flex flex-column align-items-center">
      <h1 className="my-5 text-secondary">{t('register.title')}</h1>
      <p className="text-center">{t('register.message')}</p>
      <Form
        dataForm={dataForm}
        structure={structure}
      />
    </div>
  )
}