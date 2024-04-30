import { useEffect, useState, useCallback } from "react";
import { Trans, useTranslation } from "react-i18next";
import { LinkText } from "./LinksTranslate";
import { Registration } from "../types/Registration";
import Countries from "../hook/Countries";
import regex from "../services/regex";
import { register } from "../services/user.service";

export default function Setting () {
  const {t} = useTranslation('global');

  const [choiceSetting, setChoiceSetting] = useState(1);
  const myAccountClass = choiceSetting === 1 ? 'btn-secondary' : 'bg-secondary-subtle';
  const membershipClass = choiceSetting === 2 ? 'btn-secondary' : 'bg-secondary-subtle';
  const linkedAccountClass = choiceSetting === 3 ? 'btn-secondary' : 'bg-secondary-subtle';

  // CSS
  const styleNavSetting = {
    fontWeight: '600',
  } as React.CSSProperties;

  const styleFirstColumnForm = {
    width: '335px', 
    marginRight: '25px'
  } as React.CSSProperties;

  const styleSecondColumnForm = {
    width: '335px',
  } as React.CSSProperties;

  const styleTextTerm = {
    fontSize: '11px',
    position: 'relative',
    left: '-100px',
    top: '-75px',
    margin: '0 12%',
  } as React.CSSProperties;

    




  const [wallet, setWallet] = useState(true);
  const [disabledButton, setDisabledButton] = useState(true);
  
  // Management input
  const styleInputGeneral = "form-control shadow_background-input";  

  // Try to transform in array later for a best develop
  const [errorFirstName, setErrorFirstName] = useState(false);
  const [errorLastName, setErrorLastName] = useState(false);
  const [errorPseudo, setErrorPseudo] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorWallet, setErrorWallet] = useState(false);
  const [errorTwitter, setErrorTwitter] = useState(false);
  const [errorDiscord, setErrorDiscord] = useState(false);
  const [errorTiktok, setErrorTiktok] = useState(false);
  const [errorTelegram, setErrorTelegram] = useState(false);

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
    if(name === 'firstName') setErrorFirstName(boolean);
    if(name === 'lastName') setErrorLastName(boolean);
    if(name === 'pseudo') setErrorPseudo(boolean);
    if(name === 'email') setErrorEmail(boolean);
    if(name === 'wallet') setErrorWallet(boolean);
    if(name === 'twitter') setErrorTwitter(boolean);
    if(name === 'discord') setErrorDiscord(boolean);
    if(name === 'tiktok') setErrorTiktok(boolean);
    if(name === 'telegram') setErrorTelegram(boolean);
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

  return (
    <div className="container d-flex flex-column align-items-center mt-5" style={{maxWidth: '1125px', padding: '0px 50px'}}>
      <h1 className="border-bottom border-dark-subtle pb-2 fw-bold w-100">{t('setting.title')}</h1>
      <div className="d-flex justify-content-between w-100">
        <div style={{marginRight: "50px", width: "265px"}}>
          <h2 className="mb-3 fw-normal">{t('setting.title')}</h2>
          <ul className="list-inline d-flex flex-column justify-content-between" style={{height: "150px", minWidth: "225px"}}>
            <li>
              <label className={`btn w-100 text-start rounded-pill text-nowrap ${myAccountClass}`} style={styleNavSetting} htmlFor="my-account">
                <input style={{display: "none"}} type="button" name="my-account" id="my-account" onClick={() => setChoiceSetting(1)} /> 
                {t('setting.my-account')}
              </label>
            </li>
            <li>
              <label className={`btn w-100 text-start rounded-pill text-nowrap ${membershipClass}`} style={styleNavSetting} htmlFor="manage-membership" >
                <input style={{display: "none"}} type="button" name="manage-membership" id="manage-membership" onClick={() => setChoiceSetting(2)} /> 
                {t('setting.manage-membership')}
              </label>
            </li>
            <li>
              <label className={`btn w-100 text-start rounded-pill text-nowrap ${linkedAccountClass}`} style={styleNavSetting} htmlFor="linked-accounts">
                {t('setting.linked-accounts')}
                <input style={{display: "none"}} type="button" name="linked-accounts" id="linked-accounts" onClick={() => setChoiceSetting(3)} /> 
              </label>
            </li>
          </ul>
        </div>
          { choiceSetting === 1 &&
            <div>
              <h2 className="fw-normal">{t('setting.my-account')}</h2>
              <form className="d-flex flex-column w-100 mt-5 align-items-end" style={{minWidth: '600px'}} method='post' onSubmit={handleSubmit}>
                <div className="d-flex justify-content-between flex-wrap">
                  <div className="d-flex flex-column" style={styleFirstColumnForm}>
                    <div className="mb-3 me-3 w-100">
                      <label className="form-label size-text-label" htmlFor="firstName">{t('register.first-name')}</label>
                      <input className={`form-control shadow_background-input rounded-pill ${errorFirstName ? 'border-danger' : ''}`} placeholder={t('register.placeholder.first-name')} type="text" name="firstName" id="firstName" onChange={handleChange} required />
                    </div>
                    <div className="mb-3 me-3 w-100">
                      <label className="form-label size-text-label" htmlFor="pseudo">{t('register.pseudo')}</label>
                      <input className={`form-control shadow_background-input rounded-pill ${errorPseudo ? 'border-danger' : ''}`} placeholder={t('register.placeholder.pseudo')} type="text" name="pseudo" id="pseudo" onChange={handleChange} required />
                    </div>
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
                      <label className="form-label size-text-label" htmlFor="referral">{t('register.referral')}</label>
                      <input className="form-control shadow_background-input rounded-pill" placeholder="PUT REFERRAL" type="text" name="referral" id="referral" readOnly />
                    </div>
                  </div>
                  <div className="d-flex flex-column" style={styleSecondColumnForm}>
                    <div className="mb-3 me-3 w-100">
                      <label className="form-label size-text-label" htmlFor="lastName">{t('register.last-name')}</label>
                      <input className={`form-control shadow_background-input rounded-pill ${errorLastName ? 'border-danger' : ''}`} placeholder={t('register.placeholder.last-name')} type="text" name="lastName" id="lastName" onChange={handleChange} required />
                    </div>
                    <div className="mb-3 me-3 w-100">
                      <label className="form-label size-text-label" htmlFor="email">{t('register.email')}</label>
                      <input className={`form-control shadow_background-input rounded-pill ${errorEmail ? 'border-danger' : ''}`} placeholder={t('register.placeholder.email')} type="email" name="email" id="email" onChange={handleChange} required />
                    </div>
                    <div className="mb-3 me-3 w-100">
                      <label className="form-label size-text-label" htmlFor="country">{t('register.country')}</label>
                      <select 
                        style={{background: `url(${country}) no-repeat`}} 
                        className={`form-select shadow_background-input position-flag-select design rounded-pill ${activeMarge}`} 
                        name="country" 
                        id="country" 
                        onChange={handleChange} 
                        required
                      >
                        <option defaultValue=''>{t('register.placeholder.select')}</option>
                        {
                          listCountries.map((country) => <option key={country.iso} value={country.iso}>{country.name}</option>)
                        }
                      </select>
                    </div>
                    <div className="mb-3 me-3 w-100">
                      <label className="form-label size-text-label" htmlFor="wallet">{t('register.wallet')}</label>
                      <input className={`form-control shadow_background-input rounded-pill ${errorWallet ? 'border-danger' : ''}`} placeholder="523aBb2m63H..." type="text" name="wallet" id="wallet" onChange={handleChange} required />
                    </div>
                  </div>
                </div>
                <button className="btn btn-secondary mt-3 mb-5 padding-button rounded-pill" type="submit" disabled={disabledButton}>{t('register.send')}</button>
              </form>
            </div>
          }
          { choiceSetting === 2 &&
            <div>
              <h2>{t('setting.manage-membership')}</h2>
              <form className="d-flex flex-column w-100 mt-5 align-items-end" style={{minWidth: '600px'}} method='post' onSubmit={handleSubmit}>
                <div className="d-flex justify-content-between flex-wrap">
                  <div className="d-flex flex-column" style={styleFirstColumnForm}>
                    <div className="mb-3 me-3 w-100">
                      <label className="form-label size-text-label" htmlFor="firstName">{t('register.first-name')}</label>
                      <input className={`form-control shadow_background-input rounded-pill ${errorFirstName ? 'border-danger' : ''}`} placeholder={t('register.placeholder.first-name')} type="text" name="firstName" id="firstName" onChange={handleChange} required />
                    </div>
                    <div className="mb-3 me-3 w-100">
                      <label className="form-label size-text-label" htmlFor="lastName">{t('register.last-name')}</label>
                      <input className={`form-control shadow_background-input rounded-pill ${errorLastName ? 'border-danger' : ''}`} placeholder={t('register.placeholder.last-name')} type="text" name="lastName" id="lastName" onChange={handleChange} required />
                    </div>
                    <div className="mb-3 me-3 w-100">
                      <label className="form-label size-text-label" htmlFor="pseudo">{t('register.pseudo')}</label>
                      <input className={`form-control shadow_background-input rounded-pill ${errorPseudo ? 'border-danger' : ''}`} placeholder={t('register.placeholder.pseudo')} type="text" name="pseudo" id="pseudo" onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="d-flex flex-column" style={styleSecondColumnForm}>
                    <div className="mb-3 me-3 w-100">
                      <label className="form-label size-text-label" htmlFor="email">{t('register.email')}</label>
                      <input className={`form-control shadow_background-input rounded-pill ${errorEmail ? 'border-danger' : ''}`} placeholder={t('register.placeholder.email')} type="email" name="email" id="email" onChange={handleChange} required />
                    </div>
                    <div className="mb-3 me-3 w-100">
                      <label className="form-label size-text-label" htmlFor="wallet">{t('register.wallet')}</label>
                      <input className={`form-control shadow_background-input rounded-pill ${errorWallet ? 'border-danger' : ''}`} placeholder="523aBb2m63H..." type="text" name="wallet" id="wallet" onChange={handleChange} required />
                    </div>
                    <div className="mb-3 me-3 w-100">
                      <label className="form-label size-text-label" htmlFor="twitter">Twitter</label>
                      <input className={`form-control shadow_background-input rounded-pill ${errorTwitter ? 'border-danger' : ''}`} placeholder="twitter.com/WeAreSwissBorg" type="text" name="twitter" id="twitter" onChange={handleChange} />
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center w-100 mt-4" style={{marginBottom: '120px'}}>
                  <button className="btn padding-button rounded-pill" style={{background: '#EDEFF1'}}>Annuler mon adhésion</button>
                  <button className="btn btn-secondary padding-button rounded-pill" type="submit" disabled={disabledButton}>{t('register.send')}</button>
                </div>
              </form>
            </div>
          }
          { choiceSetting === 3 &&
            <div>
              <h2>{t('setting.linked-accounts')}</h2>
              <div className="d-flex flex-column w-100 mb-5 mt-5" style={{minWidth: '700px'}}>
                <div>
                  <div className="d-flex align-items-end mb-3 me-3">
                    <div className="me-4" style={{width: '315px'}}>
                      <label className="form-label size-text-label" htmlFor="twitter">Twitter</label>
                      <input className={`form-control shadow_background-input rounded-pill me-5 ${errorTwitter ? 'border-danger' : ''}`} placeholder="twitter.com/WeAreSwissBorg" type="text" name="twitter" id="twitter" onChange={handleChange} />
                    </div>
                    <button className="btn btn-secondary rounded-pill text-nowrap" type="submit" disabled={disabledButton}>Mise à jour</button>
                  </div>
                  <div className="d-flex align-items-end mb-3 me-3">
                    <div className="me-4" style={{width: '315px'}}>
                      <label className="form-label size-text-label" htmlFor="discord">Discord</label>
                      <input className={`form-control shadow_background-input rounded-pill ${errorDiscord ? 'border-danger' : ''}`} placeholder={t('register.placeholder.discord')} type="text" name="discord" id="discord" onChange={handleChange} />
                    </div>
                    <button className="btn btn-secondary rounded-pill text-nowrap" type="submit" disabled={disabledButton}>Se déconnecter</button>
                  </div>
                  <div className="d-flex align-items-end mb-3 me-3">
                    <div className="me-4" style={{width: '315px'}}>
                      <label className="form-label size-text-label" htmlFor="tiktok">TikTok</label>
                      <input className={`form-control shadow_background-input rounded-pill ${errorTiktok ? 'border-danger' : ''}`} placeholder="tiktok.com/@weareswissborg.eth" type="text" name="tiktok" id="tiktok" onChange={handleChange} />
                    </div>
                    <button className="btn btn-secondary rounded-pill text-nowrap" type="submit" disabled={disabledButton}>Se déconnecter</button>
                  </div>
                  <div className="d-flex align-items-end mb-3 me-3">
                    <div className="me-4" style={{width: '315px'}}>
                      <label className="form-label size-text-label" htmlFor="telegram">Telegram</label>
                      <input className={`form-control shadow_background-input rounded-pill ${errorTelegram ? 'border-danger' : ''}`} placeholder="t.me/WeAreSwissBorg" type="text" name="telegram" id="telegram" onChange={handleChange} />
                    </div>
                    <button className="btn btn-secondary rounded-pill text-nowrap" type="submit" disabled={disabledButton}>Connexion</button>
                  </div>
                </div>
              </div> 
            </div>
          }
        
      </div>
      { choiceSetting === 1 && 
        <p style={styleTextTerm}>
          <Trans i18nKey="register.confidentiality" t={t} components={
            { 
              link1: <LinkText href="#" title="Terms of Use" />, 
              link2: <LinkText href="#" title="Privacy Policy" /> 
            }
          }/>
        </p> 
      }
    </div>
  )
}