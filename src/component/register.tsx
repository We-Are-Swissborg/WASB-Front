import { useEffect, useState, useCallback } from "react";
import { Trans, useTranslation } from "react-i18next";
import { LinkText } from "./LinksTranslate";
import { Registration } from "../types/Registration";
import Countries from "../hook/Countries";
import regex from "../services/regex";
import { register } from "../services/user.service";

export default function Register() {
  const [t] = useTranslation("global");
  const [valueReferral, setValueReferral] = useState("");
  const [disabledButton, setDisabledButton] = useState(true);

  // Management input
  const styleInputGeneral = "form-control shadow_background-input";
  const [peopleOrOrther, setPeopleOrOrther] = useState(false); // Display last input in the form
  const [labelPeopleOrOrther, setLabelPeopleOrOrther] = useState(''); // Label last input in the form
  const peopleLabel = t('register.people');
  const otherLabel = t('register.other');

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
    firstName: '',
    lastName: '',
    email: '',
    pseudo: '',
    wallet: '',
    socialMedias: {
      twitter: '',
      discord: '',
      tiktok: '',
      telegram: ''
    },
    referral: '',
    detailsOther: '',
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

  const checkSocialMedia = useCallback(() => {
    if(valueReferral === 'people') {
      setLabelPeopleOrOrther(peopleLabel);
    } else {
      setLabelPeopleOrOrther(otherLabel);
    }
  }, [valueReferral, peopleLabel, otherLabel])

  const checkReferral = useCallback((name: string, value: string) => {
    if(name === 'referral') {
      setValueReferral(value);
      if(value === 'people' || value === 'other') {
        setPeopleOrOrther(true);
        checkSocialMedia();
      } else {
        setPeopleOrOrther(false);
      }
    }
  }, [setValueReferral, setPeopleOrOrther, checkSocialMedia])

  const createObjectToSend = useCallback((name: string, value: string) => {
    switch (name) {
      case 'country':
        setRegistration({...registration, country: value});
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
      case 'wallet':
        setRegistration({...registration, wallet: value.trim()});
        break;
      case 'twitter':
        setRegistration({...registration, socialMedias: {...registration.socialMedias, twitter: value.trim()}});
        break;
      case 'discord':
        setRegistration({...registration, socialMedias: {...registration.socialMedias, discord: value.trim()}});
        break;
      case 'tiktok':
        setRegistration({...registration, socialMedias: {...registration.socialMedias, tiktok: value.trim()}});
        break;
      case 'telegram':
        setRegistration({...registration, socialMedias: {...registration.socialMedias, telegram: value.trim()}});
        break;
      case 'referral':
        setRegistration({...registration, referral: value});
        break;
      case 'detailsOther':
        setRegistration({...registration, detailsOther: value.trim()});
        break;
    }
  }, [registration])

  const activeButton = useCallback((name:string = '', value:string = '') => {
    const activation = registration.country && registration.firstName && registration.lastName && registration.email && registration.pseudo && registration.wallet && registration.country !== 'Choose...' && registration.country !== 'Choisir...';

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
  }, [registration, listCountries, createObjectToSend])

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
    const regexWallet = new RegExp(regex.wallet);
    const regexTwitter = new RegExp(regex.twitter);
    const regexDiscord = new RegExp(regex.discord);
    const regexTiktok = new RegExp(regex.tiktok);
    const regexTelegram = new RegExp(regex.telegram);
    const errors = [];

    for(const infoUser of formData.entries()) {
      if(infoUser[1] && infoUser[0] !== 'referral' && infoUser[0] !== 'userReferral') {
        if(infoUser[0] === 'firstName' || infoUser[0] === 'lastName') {
          const nameCheck = regexName.test(infoUser[1]);
          errors.push(guardRegex(nameCheck, infoUser[0], infoUser[1]));
        } else if(infoUser[0] === 'pseudo') {
          const pseudoCheck = regexPseudo.test(infoUser[1]);
          errors.push(guardRegex(pseudoCheck, infoUser[0], infoUser[1]));
        } else if(infoUser[0] === 'email') {
          const emailCheck = regexEmail.test(infoUser[1]);
          errors.push(guardRegex(emailCheck, infoUser[0], infoUser[1]));
        } else if(infoUser[0] === 'wallet') {
          const walletCheck = regexWallet.test(infoUser[1]);
          errors.push(guardRegex(walletCheck, infoUser[0], infoUser[1]));
        } else if(infoUser[0] === 'twitter') {
          const twitterCheck = regexTwitter.test(infoUser[1]);
          errors.push(guardRegex(twitterCheck, infoUser[0], infoUser[1]));
        } else if(infoUser[0] === 'discord') {
          const discordCheck = regexDiscord.test(infoUser[1]);
          errors.push(guardRegex(discordCheck, infoUser[0], infoUser[1]));
        } else if(infoUser[0] === 'tiktok') {
          const tiktokCheck = regexTiktok.test(infoUser[1]);
          errors.push(guardRegex(tiktokCheck, infoUser[0], infoUser[1]));
        } else if(infoUser[0] === 'telegram') {
          const telegramCheck = regexTelegram.test(infoUser[1]);
          errors.push(guardRegex(telegramCheck, infoUser[0], infoUser[1]));
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
    checkSocialMedia();
    activeButton();
  }, [checkSocialMedia, activeButton])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    checkError(name, false);
    checkReferral(name, value);
    activeButton(name, value);
  }, [activeButton, checkReferral]);

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    activeRegex(formData);
  }

  return(
    <div className="container d-flex flex-column align-items-center">
      <h1 className="my-5">{t('register.title')}</h1>
      <p className="text-center">{t('register.message')}</p>
      <form className="d-flex flex-column align-items-center w-100 px-5 mb-3 mt-5" style={{minWidth: '600px'}} method='post' onSubmit={handleSubmit}>
        <div className="d-flex w-100">
          <div className="mb-3 me-3 w-100">
            <label className="form-label" htmlFor="country">{t('register.country')}</label>
            <select
              style={{background: `url(${country}) no-repeat`}} 
              className={`form-select shadow_background-input position-flag-select design ${activeMarge}`}
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
            <label className="form-label" htmlFor="firstName">{t('register.first-name')}</label>
            <input className={`form-control shadow_background-input ${errorFirstName ? 'border-danger' : ''}`} placeholder={t('register.placeholder.first-name')} type="text" name="firstName" id="firstName" onChange={handleChange} required />
          </div>
          <div className="mb-3 me-3 w-100">
            <label className="form-label" htmlFor="lastName">{t('register.last-name')}</label>
            <input className={`form-control shadow_background-input ${errorLastName ? 'border-danger' : ''}`} placeholder={t('register.placeholder.last-name')} type="text" name="lastName" id="lastName" onChange={handleChange} required />
          </div>
        </div>
        <div className="d-flex w-100">
          <div className="mb-3 me-3 w-100">
            <label className="form-label" htmlFor="pseudo">{t('register.pseudo')}</label>
            <input className={`form-control shadow_background-input ${errorPseudo ? 'border-danger' : ''}`} placeholder={t('register.placeholder.pseudo')} type="text" name="pseudo" id="pseudo" onChange={handleChange} required />
          </div>
          <div className="mb-3 me-3 w-100">
            <label className="form-label" htmlFor="email">{t('register.email')}</label>
            <input className={`form-control shadow_background-input ${errorEmail ? 'border-danger' : ''}`} placeholder={t('register.placeholder.email')} type="email" name="email" id="email" onChange={handleChange} required />
          </div>
          <div className="mb-3 me-3 w-100">
            <label className="form-label" htmlFor="wallet">{t('register.wallet')}</label>
            <input className={`form-control shadow_background-input ${errorWallet ? 'border-danger' : ''}`} placeholder="523aBb2m63H..." type="text" name="wallet" id="wallet" onChange={handleChange} required />
          </div>
        </div>
        <div className="d-flex w-100">
          <div className="mb-3 me-3 w-100">
            <label className="form-label" htmlFor="twitter">Twitter</label>
            <input className={`form-control shadow_background-input ${errorTwitter ? 'border-danger' : ''}`} placeholder="twitter.com/WeAreSwissBorg" type="text" name="twitter" id="twitter" onChange={handleChange} />
          </div>
          <div className="mb-3 me-3 w-100">
            <label className="form-label" htmlFor="discord">Discord</label>
            <input className={`form-control shadow_background-input ${errorDiscord ? 'border-danger' : ''}`} placeholder={t('register.placeholder.discord')} type="text" name="discord" id="discord" onChange={handleChange} />
          </div>
          <div className="mb-3 me-3 w-100">
            <label className="form-label" htmlFor="tiktok">TikTok</label>
            <input className={`form-control shadow_background-input ${errorTiktok ? 'border-danger' : ''}`} placeholder="tiktok.com/@weareswissborg.eth" type="text" name="tiktok" id="tiktok" onChange={handleChange} />
          </div>
        </div>
        <div className="d-flex w-100">
          <div className="mb-3 me-3 w-100">
              <label className="form-label" htmlFor="telegram">Telegram</label>
              <input className={`form-control shadow_background-input ${errorTelegram ? 'border-danger' : ''}`} placeholder="t.me/WeAreSwissBorg" type="text" name="telegram" id="telegram" onChange={handleChange} />
          </div>
          <div className="mb-3 me-3 w-100">
              <label className="form-label" htmlFor="referral">{t('register.referral.label')}</label>
              <select className="form-select shadow_background-input" name="referral" id="referral" value={valueReferral} onChange={handleChange}>
                <option defaultValue="">{t('register.placeholder.select')}</option>
                <option value="discord">Discord</option>
                <option value="telegram">Telegram</option>
                <option value="tiktok">TikTok</option>
                <option value="twitter">Twitter</option>
                <option value="youtube">Youtube</option>
                <option value="people">{t('register.referral.people')}</option>
                <option value="other">{t('register.referral.other')}</option>
            </select>
          </div>
          {
            peopleOrOrther && <div className="mb-3 me-3 w-100">
                <label className="form-label" htmlFor={valueReferral === 'people' ? 'userReferral' : 'detailsOther'}>{labelPeopleOrOrther}</label>
                <textarea
                  className={styleInputGeneral}
                  placeholder={t('register.placeholder.texte-area')}
                  style={{height: '25px'}}
                  name={valueReferral === 'people' ? 'userReferral' : 'detailsOther'}
                  id={valueReferral === 'people' ? 'userReferral' : 'detailsOther'}
                  onChange={handleChange}
                  required
                />
            </div>
          }
        </div>
        <div className="d-flex justify-content-between align-items-center w-100 mt-4" style={{marginBottom: '120px'}}>
          <div style={{fontSize: 'smaller'}}>
            <Trans i18nKey="register.confidentiality" t={t} components= {
              {
                link1: <LinkText href="#" title="Terms of Use" />,
                link2: <LinkText href="#" title="Privacy Policy" />
              }
            }/>
          </div>
          <button className="btn btn-secondary me-3" type="submit" disabled={disabledButton}>{t('register.send')}</button>
        </div>
      </form>
    </div>
  )
}