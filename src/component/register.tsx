import { useEffect, useState, useCallback } from "react";
import { Trans, useTranslation } from "react-i18next";

import regex from "../services/regex";
import { register } from "../services/user.service";

import { LinkText } from "../hook/LinksTranslate";
import { Registration } from "../types/Registration";
import Countries from "../hook/Countries";

import '../css/Register.css';

export default function Register() {
  const [t] = useTranslation("global");
  const [disabledButton, setDisabledButton] = useState(true);
  const [wallet, setWallet] = useState(true);
  const defaultStyleIpunt = "form-control shadow_background-input rounded-pill";

  // Try to transform in array later for a best develop
  const [errorCity, setErrorCity] = useState(false);
  const [errorFirstName, setErrorFirstName] = useState(false);
  const [errorLastName, setErrorLastName] = useState(false);
  const [errorPseudo, setErrorPseudo] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorDiscord, setErrorDiscord] = useState(false);
  const [errorReferral, setErrorReferral] = useState(false);

  // For the element countries select
  const [country, setCountry] = useState('');
  const activeMarge = country ? 'ps-5' : '';
  const listCountries = Countries();

  const [registration, setRegistration] = useState<Registration>({
    country: '',
    city: '',
    firstName: '',
    lastName: '',
    email: '',
    pseudo: '',
    wallet: '',
    contribution: '0CHF',
    socialMedias: {
      twitter: '',
      discord: '',
      tiktok: '',
      telegram: ''
    },
    referral: '',
    aboutUs: '',
  })

  const checkError = (name: string, boolean: boolean) => {
    if(name === 'city') setErrorCity(boolean);
    if(name === 'firstName') setErrorFirstName(boolean);
    if(name === 'lastName') setErrorLastName(boolean);
    if(name === 'pseudo') setErrorPseudo(boolean);
    if(name === 'email') setErrorEmail(boolean);
    if(name === 'discord') setErrorDiscord(boolean);
    if(name === 'referral') setErrorReferral(boolean);
  }

  const createObjectToSend = useCallback((name: string, value: string) => {
    switch (name) {
      case 'country':
        setRegistration({...registration, country: value});
        break;
      case 'city':
        setRegistration({...registration, city: value.trim()});
        break;
      case 'firstName':
        setRegistration({...registration, firstName: value.trim()});
        break;
      case 'lastName':
        setRegistration({...registration, lastName: value.trim()});
        break;
      case 'email':
        setRegistration({...registration, email: value.trim()});
        break;
      case 'pseudo':
        setRegistration({...registration, pseudo: value.trim()});
        break;
      case 'contribution':
        setRegistration({...registration, contribution: value});
        break;
      case 'wallet':
        setRegistration({...registration, wallet: value.trim()});
        break;
      case 'discord':
        setRegistration({...registration, socialMedias: {...registration.socialMedias, discord: value.trim()}});
        break;
      case 'referral':
        setRegistration({...registration, referral: value.trim()});
        break;
      case 'aboutUs':
        setRegistration({...registration, aboutUs: value});
        break;
    }
  }, [registration])

  const activeButton = useCallback((name:string = '', value:string = '') => {
    const activation = registration.email && registration.pseudo && wallet;
    
    createObjectToSend(name, value);

    if(name === 'country') {
      const flag = listCountries.find((country) => country.iso === value);
      const urlImg = flag?.urlImg || '';
      setCountry(urlImg);
    }
    if(activation) {
      setDisabledButton(false);
    } else {
      setDisabledButton(true);
    }
  }, [registration, listCountries, wallet, createObjectToSend])
  
  const guardRegex = (check: boolean, name: string, value: string) => {
    if(check) {
      createObjectToSend(name, value);
      return
    } else {
      checkError(name, true);
      return name;
    }
  }

  const activeRegex = async (formData: any) => {
    const regexName = new RegExp(regex.name);
    const regexPseudo = new RegExp(regex.pseudo);
    const regexEmail = new RegExp(regex.email);
    const regexDiscord = new RegExp(regex.discord);
    // const regexReferral = new RegExp(regex.referral);
    const errors = [];

    for(const infoUser of formData.entries()) {
      if(infoUser[1] && infoUser[0] !== 'referral' && infoUser[0] !== 'userReferral') {
        if(infoUser[0] === 'firstName' || infoUser[0] === 'lastName' || infoUser[0] === 'city') {
          const nameCheck = regexName.test(infoUser[1]);
          errors.push(guardRegex(nameCheck, infoUser[0], infoUser[1]));
        } else if(infoUser[0] === 'pseudo') {
          const pseudoCheck = regexPseudo.test(infoUser[1]);
          errors.push(guardRegex(pseudoCheck, infoUser[0], infoUser[1]));
        } else if(infoUser[0] === 'email') {
          const emailCheck = regexEmail.test(infoUser[1]);
          errors.push(guardRegex(emailCheck, infoUser[0], infoUser[1]));
        } else if(infoUser[0] === 'discord') {
          const discordCheck = regexDiscord.test(infoUser[1]);
          errors.push(guardRegex(discordCheck, infoUser[0], infoUser[1]));
        } else {
          createObjectToSend(infoUser[0], infoUser[1]);
        }
      }
    }

    const checkErr = errors.every((error) => error === undefined);

    if (checkErr) {
      await register(registration);
      // userRegistration(registration);
    }
  }

  useEffect(() => {
    activeButton();
  }, [activeButton])
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    checkError(name, false);
    activeButton(name, value);
  }, [activeButton]);
  
  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    activeRegex(formData);
  }

  return(
    <div className="container d-flex flex-column align-items-center">
      <h1 className="my-5 text-secondary">{t('register.title')}</h1>
      <p className="text-center">{t('register.message')}</p>
      <form className="register-form d-flex flex-column align-items-center w-100 px-5 mb-3 mt-5" method='post' onSubmit={handleSubmit}>
        <div className="d-flex w-100">
          <div className="mb-3 me-3 w-100">
            <label className="form-label size-text-label" htmlFor="country">{t('register.country')}</label>
            <select 
              style={{background: `url(${country}) no-repeat`}}
              className={`form-select shadow_background-input position-flag-select design rounded-pill ${activeMarge}`} 
              name="country"
              id="country"
              onChange={handleChange}
            >
              <option defaultValue=''>{t('register.placeholder.select')}</option>
              {
                listCountries.map((country) => <option key={country.iso} value={country.iso}>{country.name}</option>)
              }
            </select>
          </div>
          <div className="mb-3 me-3 w-100">
            <label className="form-label size-text-label" htmlFor="city">{t('register.city')}</label>
            <input className={`${defaultStyleIpunt} ${errorCity ? 'border-danger' : ''}`} placeholder={t('register.placeholder.city')} type="text" name="city" id="city" onChange={handleChange} />
          </div>
          <div className="mb-3 me-3 w-100">
            <label className="form-label size-text-label" htmlFor="pseudo">{t('register.pseudo')}</label>
            <input className={`${defaultStyleIpunt} ${errorPseudo ? 'border-danger' : ''}`} placeholder={t('register.placeholder.pseudo')} type="text" name="pseudo" id="pseudo" onChange={handleChange} required />
          </div>
        </div>
        <div className="d-flex w-100">
          <div className="mb-3 me-3 w-100">
            <label className="form-label size-text-label" htmlFor="firstName">{t('register.first-name')}</label>
            <input className={`${defaultStyleIpunt} ${errorFirstName ? 'border-danger' : ''}`} placeholder={t('register.placeholder.first-name')} type="text" name="firstName" id="firstName" onChange={handleChange} />
          </div>
          <div className="mb-3 me-3 w-100">
            <label className="form-label size-text-label" htmlFor="lastName">{t('register.last-name')}</label>
            <input className={`${defaultStyleIpunt} ${errorLastName ? 'border-danger' : ''}`} placeholder={t('register.placeholder.last-name')} type="text" name="lastName" id="lastName" onChange={handleChange} />
          </div>
          <div className="mb-3 me-3 w-100">
            <label className="form-label size-text-label" htmlFor="email">{t('register.email')}</label>
            <input className={`${defaultStyleIpunt} ${errorEmail ? 'border-danger' : ''}`} placeholder={t('register.placeholder.email')} type="email" name="email" id="email" onChange={handleChange} required />
          </div>
        </div>
        <div className="d-flex w-100">
          <div className="mb-3 me-3 w-100">
            <label className="form-label size-text-label" htmlFor="wallet">{t('register.wallet')}</label>
            <input className={`${defaultStyleIpunt} pe-none read-only`} type="text" name="wallet" id="wallet" onChange={handleChange} value='WALLET' required readOnly/>
          </div>
          <div className="mb-3 me-3 w-100">
            <label className="form-label size-text-label" htmlFor="discord">Discord</label>
            <input className={`${defaultStyleIpunt} ${errorDiscord ? 'border-danger' : ''}`} placeholder={t('register.placeholder.discord')} type="text" name="discord" id="discord" onChange={handleChange} />
          </div>
          <div className="mb-3 me-3 w-100">
            <label className="form-label size-text-label" htmlFor="referral">{t('register.referral')}</label>
            <input className={`${defaultStyleIpunt} ${errorReferral ? 'border-danger' : ''}`} placeholder="PUT EXEMPLE REFERRAL" type="text" name="referral" id="referral" onChange={handleChange} />
          </div>
        </div>
        <div className="d-flex w-100">
          <div className="mb-3 me-3 w-100">
            <label className="form-label size-text-label" htmlFor="aboutUs">{t('register.aboutUs')}</label>
            <select className="form-select shadow_background-input rounded-pill" name="aboutUs" id="aboutUs" onChange={handleChange}>
              <option defaultValue="">{t('register.placeholder.select')}</option>
              <option value="discord">Discord</option>
              <option value="telegram">Telegram</option>
              <option value="tiktok">TikTok</option>
              <option value="twitter">Twitter</option>
              <option value="youtube">Youtube</option>
              <option value="other">{t('register.other')}</option>
            </select>
          </div> 
          <div className="mb-3 me-3 w-100">
            <label className="form-label size-text-label" htmlFor="contribution">{t('register.contribution')}</label>
            <select className="form-select shadow_background-input rounded-pill" name="contribution" id="contribution" onChange={handleChange}>
              <option defaultValue="">{t('register.placeholder.contribution')}</option>
              <option value="30CHF">30 CHF/3mois</option>
              <option value="60CHF">60 CHF/6mois</option>
              <option value="100CHF">100 CHF/1an</option>
            </select>
          </div> 
        </div>
        <div className="submit d-flex justify-content-between align-items-center w-100 mt-4">
          <p>
            <Trans i18nKey="register.confidentiality" t={t} components= {
              {
                link1: <LinkText href="#" title="Terms of Use" />,
                link2: <LinkText href="#" title="Privacy Policy" />
              }
            }/>
          </p>
          <button className="btn bg-gradient rounded-pill border border-secondary me-3 text-white padding-button" type="submit" disabled={disabledButton}>{t('register.send')}</button>
        </div>
      </form>
    </div>
  )
}