import { useEffect, useState, useCallback } from "react";
import { Trans, useTranslation } from "react-i18next";

import Countries from "../hook/Countries";
import { LinkText } from "../hook/LinksTranslate";

import { Registration } from "../types/Registration";
import regex from "../services/regex";

import twitterIcon from "../assets/images/icon/twitter-icon.png";
import discordIcon from "../assets/images/icon/discord-icon.png";
import tiktokIcon from "../assets/images/icon/tiktok-icon.png";
import telegramIcon from "../assets/images/icon/telegram-icon.png";

import '../css/Setting.css';

export default function Setting () {
  const {t} = useTranslation('global');
  
  const [choiceSetting, setChoiceSetting] = useState(1);
  const lang = localStorage.getItem('language');

  const defaultStyleIpunt = "form-control shadow_background-input rounded-pill";
  const myAccountClass = choiceSetting === 1 ? 'btn-secondary text-white' : 'bg-secondary-subtle text-black';
  const membershipClass = choiceSetting === 2 ? 'btn-secondary text-white' : 'bg-secondary-subtle text-black';
  const linkedAccountClass = choiceSetting === 3 ? 'btn-secondary text-white' : 'bg-secondary-subtle text-black';
  const positionLeft = lang === 'fr' ? 'big-width' : 'little-width';

  const [wallet, setWallet] = useState(true);
  const [disabledButton, setDisabledButton] = useState(true);

  // Management input

  // Try to transform in array later for a best develop
  const [errorFirstName, setErrorFirstName] = useState(false);
  const [errorLastName, setErrorLastName] = useState(false);
  const [errorPseudo, setErrorPseudo] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorCity, setErrorCity] = useState(false);
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
    if(name === 'city') setErrorCity(boolean);
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
      console.log('Return Form if not Error');
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
    <div className="setting-container container d-flex flex-column align-items-center mt-5">
      <h1 className="border-bottom border-dark-subtle pb-2 fw-bold w-100">{t('setting.title')}</h1>
      <div className="d-flex justify-content-between w-100">
        <div className="container-main-input">
          <h2 className=" mb-3 fw-normal">{t('setting.title')}</h2>
          <ul className="list-inline d-flex flex-column justify-content-between">
            <li>
              <label className={`btn bg-gradient rounded-pill border w-100 text-start text-nowrap ${myAccountClass}`} htmlFor="my-account">
                <input type="button" name="my-account" id="my-account" onClick={() => setChoiceSetting(1)} /> 
                {t('setting.my-account.title')}
              </label>
            </li>
            <li>
              <label className={`btn bg-gradient rounded-pill border w-100 text-start text-nowrap ${membershipClass}`} htmlFor="manage-membership" >
                <input type="button" name="manage-membership" id="manage-membership" onClick={() => setChoiceSetting(2)} /> 
                {t('setting.manage-membership.title')}
              </label>
            </li>
            <li>
              <label className={`btn bg-gradient rounded-pill border w-100 text-start text-nowrap ${linkedAccountClass}`} htmlFor="linked-accounts">
                {t('setting.linked-accounts.title')}
                <input type="button" name="linked-accounts" id="linked-accounts" onClick={() => setChoiceSetting(3)} /> 
              </label>
            </li>
          </ul>
        </div>
          { choiceSetting === 1 &&
            <div>
              <h2 className="fw-normal">{t('setting.my-account.title')}</h2>
              <form className="all-form d-flex flex-column w-100 mt-4 align-items-end" method='post' onSubmit={handleSubmit}>
                <div className="d-flex justify-content-between flex-wrap">
                  <div className="sub-part-one d-flex flex-column">
                    <div className="mb-3 me-3 w-100">
                      <label className="form-label size-text-label" htmlFor="firstName">{t('setting.my-account.first-name')}</label>
                      <input className={`${defaultStyleIpunt} ${errorFirstName ? 'border-danger' : ''}`} placeholder={t('setting.my-account.first-name_placeholder')} type="text" name="firstName" id="firstName" onChange={handleChange} required />
                    </div>
                    <div className="mb-3 me-3 w-100">
                      <label className="form-label size-text-label" htmlFor="pseudo">{t('setting.my-account.pseudo')}</label>
                      <input className={`${defaultStyleIpunt} ${errorPseudo ? 'border-danger' : ''}`} type="text" name="pseudo" id="pseudo" onChange={handleChange} required />
                    </div>
                    <div className="mb-3 me-3 w-100">
                      <label className="form-label size-text-label" htmlFor="aboutUs">{t('setting.my-account.aboutUs')}</label>
                      <select className="form-select shadow_background-input rounded-pill" name="aboutUs" id="aboutUs" onChange={handleChange}>
                        <option defaultValue="">{t('setting.my-account.select_placeholder')}</option>
                        <option value="discord">Discord</option>
                        <option value="telegram">Telegram</option>
                        <option value="tiktok">TikTok</option>
                        <option value="twitter">Twitter</option>
                        <option value="youtube">Youtube</option>
                        <option value="other">{t('setting.my-account.other')}</option>
                      </select>
                    </div>
                    <div className="mb-3 me-3 w-100">
                      <label className="form-label size-text-label" htmlFor="city">{t('setting.my-account.city')}</label>
                      <input className={`${defaultStyleIpunt} ${errorCity ? 'border-danger' : ''}`} placeholder={t('setting.my-account.city_placeholder')} type="text" name="city" id="city" onChange={handleChange} />
                    </div>
                    <div className="mb-3 me-3 w-100">
                      <label className="form-label size-text-label" htmlFor="referral">{t('setting.my-account.referral')}</label>
                      <input className={`${defaultStyleIpunt} pe-none read-only`} value="PUT REFERRAL" type="text" name="referral" id="referral" readOnly />
                    </div>
                  </div>
                  <div className="sub-part-two d-flex flex-column">
                    <div className="mb-3 me-3 w-100">
                      <label className="form-label size-text-label" htmlFor="lastName">{t('setting.my-account.last-name')}</label>
                      <input className={`${defaultStyleIpunt} ${errorLastName ? 'border-danger' : ''}`} placeholder={t('setting.my-account.last-name_placeholder')} type="text" name="lastName" id="lastName" onChange={handleChange} required />
                    </div>
                    <div className="mb-3 me-3 w-100">
                      <label className="form-label size-text-label" htmlFor="email">{t('setting.my-account.email')}</label>
                      <input className={`${defaultStyleIpunt} ${errorEmail ? 'border-danger' : ''}`} type="email" name="email" id="email" onChange={handleChange} required />
                    </div>
                    <div className="mb-3 me-3 w-100">
                      <label className="form-label size-text-label" htmlFor="country">{t('setting.my-account.country')}</label>
                      <select 
                        style={{background: `url(${country}) no-repeat`}} 
                        className={`form-select shadow_background-input position-flag-select design rounded-pill ${activeMarge}`}
                        name="country"
                        id="country"
                        onChange={handleChange}
                        required
                      >
                        <option defaultValue=''>{t('setting.my-account.select_placeholder')}</option>
                        {
                          listCountries.map((country) => <option key={country.iso} value={country.iso}>{country.name}</option>)
                        }
                      </select>
                    </div>
                    <div className="mb-3 me-3 w-100">
                      <label className="form-label size-text-label" htmlFor="wallet">{t('setting.my-account.wallet')}</label>
                      <input className={`${defaultStyleIpunt} pe-none read-only ${errorWallet ? 'border-danger' : ''}`} value="WALLET" type="text" name="wallet" id="wallet" onChange={handleChange} required readOnly/>
                    </div>
                  </div>
                </div>
                <button className="btn bg-gradient rounded-pill border border-secondary text-white padding-button mt-3 mb-5" type="submit" disabled={disabledButton}>{t('setting.my-account.update')}</button>
              </form>
            </div>
          }
          { choiceSetting === 2 &&
            <div>
              <div>
                <h2 className="fw-normal">{t('setting.manage-membership.title')}</h2>
                <p className="message-membership text-nowrap">{t('setting.manage-membership.message-1')}</p>
                <p className="message-membership text-nowrap">{t('setting.manage-membership.message-2')}</p>
              </div>
              <form className="all-form d-flex flex-column w-100 mt-5 align-items-end" method='post' onSubmit={handleSubmit}>
                <div className="d-flex justify-content-between flex-wrap">
                  <div className="sub-part-one d-flex flex-column">
                    <div className="mb-3 me-3 w-100">
                      <label className="form-label size-text-label" htmlFor="contributionStatus">{t('setting.manage-membership.status')}</label>
                      <input className={`${defaultStyleIpunt} pe-none read-only`} value='STATUS' type="text" name="contributionStatus" id="contributionStatus" onChange={handleChange} readOnly />
                    </div>
                    <div className="mb-3 me-3 w-100">
                      <label className="form-label size-text-label" htmlFor="dateContribution">{t('setting.manage-membership.contribution-start')}</label>
                      <input className={`${defaultStyleIpunt} pe-none read-only`} type="date" name="dateContribution" id="dateContribution" onChange={handleChange} readOnly />
                    </div>
                    <div className="mb-3 me-3 w-100">
                      <label className="form-label size-text-label" htmlFor="donations">{t('setting.manage-membership.donations')}</label>
                      <input className={defaultStyleIpunt} value='DONATIONS' type="text" name="donations" id="donations" onChange={handleChange} />
                    </div>
                  </div>
                  <div className="sub-part-two d-flex flex-column">
                    <div className="mb-3 me-3 w-100">
                      <label className="form-label size-text-label" htmlFor="contribution">{t('setting.manage-membership.contribution')}</label>
                      <input className={defaultStyleIpunt} value='CONTRIBUTION' type="text" name="contribution" id="contribution" onChange={handleChange} />
                    </div>
                    <div className="mb-3 me-3 w-100">
                      <label className="form-label size-text-label" htmlFor="EndDateContribution">{t('setting.manage-membership.contribution-end')}</label>
                      <input className={`${defaultStyleIpunt} pe-none read-only`} type="date" name="EndDateContribution" id="EndDateContribution" onChange={handleChange} readOnly />
                    </div>
                    <div className="mb-3 me-3 w-100">
                      <label className="form-label size-text-label" htmlFor="nftWallet">{t('setting.manage-membership.nft-wallet')}</label>
                      <input className={`${defaultStyleIpunt} pe-none read-only`} value="NFT WALLET" type="text" name="nftWallet" id="nftWallet" onChange={handleChange} readOnly />
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center w-100 mt-4" style={{marginBottom: '120px'}}>
                  <button className="btn padding-button rounded-pill" style={{background: '#EDEFF1'}}>{t('setting.manage-membership.cancel')}</button>
                  <button className="btn bg-gradient rounded-pill border border-secondary text-white padding-button" type="submit" disabled={disabledButton}>{t('setting.manage-membership.modify')}</button>
                </div>
              </form>
            </div>
          }
          { choiceSetting === 3 &&
            <div>
              <h2 className="fw-normal">{t('setting.linked-accounts.title')}</h2>
              <form className="social-form d-flex flex-column w-100 mt-4 mb-5 align-items-start" method='post' onSubmit={handleSubmit}>
                <div>
                  <div className="d-flex align-items-end mb-3 me-3">
                    <div className="me-4 social-input">
                      <label className="form-label size-text-label" htmlFor="twitter">Twitter</label>
                      <input className={`${defaultStyleIpunt} me-5 ${errorTwitter ? 'border-danger' : ''}`} placeholder="twitter.com/WeAreSwissBorg" type="text" name="twitter" id="twitter" onChange={handleChange} />
                    </div>
                    <img src={twitterIcon} alt="Twitter logo" />
                  </div>
                  <div className="d-flex align-items-end mb-3 me-3">
                    <div className="me-4 social-input">
                      <label className="form-label size-text-label" htmlFor="discord">Discord</label>
                      <input className={`${defaultStyleIpunt} ${errorDiscord ? 'border-danger' : ''}`} placeholder={t('setting.linked-accounts.discord')} type="text" name="discord" id="discord" onChange={handleChange} />
                    </div>
                    <img src={discordIcon} alt="Discord logo" />
                  </div>
                  <div className="d-flex align-items-end mb-3 me-3">
                    <div className="me-4 social-input">
                      <label className="form-label size-text-label" htmlFor="tiktok">TikTok</label>
                      <input className={`${defaultStyleIpunt} ${errorTiktok ? 'border-danger' : ''}`} placeholder="tiktok.com/@weareswissborg.eth" type="text" name="tiktok" id="tiktok" onChange={handleChange} />
                    </div>
                    <img src={tiktokIcon} alt="TikTok logo" />
                  </div>
                  <div className="d-flex align-items-end mb-3 me-3">
                    <div className="me-4 social-input">
                      <label className="form-label size-text-label" htmlFor="telegram">Telegram</label>
                      <input className={`${defaultStyleIpunt} ${errorTelegram ? 'border-danger' : ''}`} placeholder="t.me/WeAreSwissBorg" type="text" name="telegram" id="telegram" onChange={handleChange} />
                    </div>
                    <img src={telegramIcon} alt="Telegram logo" />
                  </div>
                </div>
                <button className="btn bg-gradient rounded-pill border border-secondary text-white mt-4" type="submit" disabled={disabledButton}>{t('setting.linked-accounts.update')}</button>
              </form> 
            </div>
          }
        
      </div>
      { choiceSetting === 1 &&
        <div className={`container-checkbox d-flex flex-column ${positionLeft}`}>
          <div className="d-flex mb-2">
            <input className="me-2" type="checkbox" value="" />
            <p className="mb-0">
              <Trans i18nKey="register.confidentiality" t={t} components= {
                {
                  link1: <LinkText href="#" title="Terms of Use" />,
                  link2: <LinkText href="#" title="Privacy Policy" />
                }
              }/>
            </p>
          </div>
          <div className="d-flex">
            <input className="me-2" type="checkbox" value=''/>
            <p className="mb-0">
              {t('register.be-contacted')}
            </p>
          </div>
       </div>
      }
    </div>
  )
}