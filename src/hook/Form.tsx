import { useEffect, useState, useCallback } from "react";
import { Trans, useTranslation } from "react-i18next";

import regex from "../services/regex";
import { register } from "../services/user.service";

import { Registration } from "../types/Registration";
import { DataForm } from "../types/DataForm";

import { LinkText } from "./LinksTranslate";
import Countries from "../hook/Countries";
import Modal from "../common/Modal";
import '../css/Form.css';
import SignMessage from "../web3/SignMessage";
import wasb_favicon from '../assets/images/svg/wasb_favicon.svg';
import Client from "@walletconnect/sign-client";

interface IForm {
    structure: {
        formFor: string,
        btn: string, // 'register' | 'btnWithConfidentiality' | 'confirmAndCancel' | 'upload'
        nbSection: number,
        nbBySection: number,
    };
    dataForm: DataForm[];
    styleForm?: {
        form?: string,
        input?: string,
        containerSumbit?: string,
    };
}

interface IElement {
    balise: string;
    name: string;
    type?: string;
    label?: string;
    placeholder?: string;
    readOnly?: boolean;
    value?: string | readonly string[] | number | undefined;
}

interface IOptionsSelect {
    value: string,
    name: string,
    urlImg?: string
}

interface IAuth {
    token: string,
    messageToTrans: string,
}

const DEFAULT_APP_METADATA = {
    name: import.meta.env.DEV ? "We Are Swissborg (DEV)" : "We Are Swissborg",
    description: "The association that supports you in your crypto adventure!",
    url: window.location.origin,
    icons: [`${window.location.origin}/${wasb_favicon}`],
};
const RELAY_URL = "wss://wallet-connectrelay.ternoa.network/";
const PROJECT_ID = import.meta.env.VITE_PROJECT_ID; // Get your project id by applying to the form, link in the introduction

export default function Form (props: IForm) {
    const { t } = useTranslation('global');

    // Options for select element.
    const countriesOptions: IOptionsSelect[] = Countries().map(item => ({
        value: item.iso,
        name: item.name,
        urlImg: item.urlImg
    }));
    const contributionOptions: IOptionsSelect[] = [
        {value: '30CHF', name: '30 CHF/3mois'},
        {value: '60CHF', name: '60 CHF/6mois'},
        {value: '100CHF', name: '100 CHF/1an'},
    ];
    const aboutUsOptions: IOptionsSelect[] = [
        {value: 'discord', name: 'Discord'},
        {value: 'telegram', name: 'Telegram'},
        {value: 'tiktok', name: 'Tiktok'},
        {value: 'twitter', name: 'Twitter'},
        {value: 'youtube', name: 'Youtube'},
        {value: 'other', name: t('form.other')},
    ];

    const [disabledButton, setDisabledButton] = useState<boolean>(true);

    // Try to transform in array later for a best develop.
    const [errorCity, setErrorCity] = useState<boolean>(false);
    const [errorFirstName, setErrorFirstName] = useState<boolean>(false);
    const [errorLastName, setErrorLastName] = useState<boolean>(false);
    const [errorPseudo, setErrorPseudo] = useState<boolean>(false);
    const [errorEmail, setErrorEmail] = useState<boolean>(false);
    const [errorDiscord, setErrorDiscord] = useState<boolean>(false);
    const [errorReferral, setErrorReferral] = useState<boolean>(false);
    const [checkConfidentiality, setCheckConfidentiality] = useState<boolean>(false);

    // For the element countries select.
    const [country, setCountry] = useState<string>('');
    const activeMarge: string = country ? 'ps-5' : '';

    const [registration, setRegistration] = useState<Registration>({
        country: '',
        city: '',
        firstName: '',
        lastName: '',
        email: '',
        pseudo: '',
        walletAddress: localStorage.getItem('walletTernoa') || '',
        contribution: '0CHF',
        socialMedias: {
            twitter: '',
            discord: '',
            tiktok: '',
            telegram: ''
        },
        referral: '',
        aboutUs: '',
        confidentiality: false,
        beContacted: false,
    });

    // For the modal.
    const [msgForModal, setMsgForModal] = useState<string>('');
    const heightModal = () => props.structure.formFor ? '70px' : '';

    /* Part-1 - Fonctionnalities for the element to display. */

    const checkError = (name: string, boolean: boolean) => {
        if(name === 'city') setErrorCity(boolean);
        if(name === 'firstName') setErrorFirstName(boolean);
        if(name === 'lastName') setErrorLastName(boolean);
        if(name === 'pseudo') setErrorPseudo(boolean);
        if(name === 'email') setErrorEmail(boolean);
        if(name === 'discord') setErrorDiscord(boolean);
        if(name === 'referral') setErrorReferral(boolean);
    };

    const createObjectToSend = useCallback((name: string, value: string, checked: boolean = false) => {
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
        case 'discord':
            setRegistration({...registration, socialMedias: {...registration.socialMedias, discord: value.trim()}});
            break;
        case 'referral':
            setRegistration({...registration, referral: value.trim()});
            break;
        case 'aboutUs':
            setRegistration({...registration, aboutUs: value});
            break;
        case 'confidentiality':
            setRegistration({...registration, confidentiality: checked});
            break;
        case 'beContacted':
            setRegistration({...registration, beContacted: checked});
            break;
        }
    }, [registration]);

    const activeButton = useCallback((name: string = '', value: string = '', checked: boolean = false) => {
        const activation:boolean = (registration.email && registration.pseudo && registration.walletAddress && registration.confidentiality) || false;

        createObjectToSend(name, value, checked);

        if(name === 'country') {
            const flag = countriesOptions.find((country) => country.value === value);
            const urlImg = flag?.urlImg || '';
            setCountry(urlImg);
        }
        if(activation) {
            setDisabledButton(false);
        } else {
            setDisabledButton(true);
        }
    }, [registration, countriesOptions, createObjectToSend]);

    const guardRegex = (check: boolean, name: string, value: string) => {
        if(check) {
            createObjectToSend(name, value);
            return;
        } else {

            checkError(name, true);
            return name;
        }
    };

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const name: string = e.target.name;
        const value: string | number | boolean | undefined = e.target.value;
        const checked: boolean = e.target.checked;

        checkError(name, false);
        activeButton(name, value, checked);

        if(name === 'confidentiality') setCheckConfidentiality(!checkConfidentiality); 
    }, [activeButton, checkConfidentiality]);

    const handleChangeSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const name: string = e.target.name;
        const value: string | number | boolean | undefined = e.target.value;

        checkError(name, false);
        activeButton(name, value);
    }, [activeButton]);

    useEffect(() => {
        activeButton();
    }, [activeButton]);

    const activeRegex = (formData: FormData) => {
        const regexName: RegExp = new RegExp(regex.name);
        const regexPseudo: RegExp = new RegExp(regex.pseudo);
        const regexEmail: RegExp = new RegExp(regex.email);
        const regexDiscord: RegExp = new RegExp(regex.discord);
        // const regexReferral = new RegExp(regex.referral);

        const errors = [];

        for(const infoUser of formData.entries()) {
            if(infoUser[1] && infoUser[0] !== 'referral' && infoUser[0] !== 'userReferral') {
                if(infoUser[0] === 'firstName' || infoUser[0] === 'lastName' || infoUser[0] === 'city') {
                    const nameCheck = regexName.test(infoUser[1].toString());
                    errors.push(guardRegex(nameCheck, infoUser[0], infoUser[1].toString()));
                } else if(infoUser[0] === 'pseudo') {
                    const pseudoCheck = regexPseudo.test(infoUser[1].toString());
                    errors.push(guardRegex(pseudoCheck, infoUser[0], infoUser[1].toString()));
                } else if(infoUser[0] === 'email') {
                    const emailCheck = regexEmail.test(infoUser[1].toString());
                    errors.push(guardRegex(emailCheck, infoUser[0], infoUser[1].toString()));
                } else if(infoUser[0] === 'discord') {
                    const discordCheck = regexDiscord.test(infoUser[1].toString());
                    errors.push(guardRegex(discordCheck, infoUser[0], infoUser[1].toString()));
                } else {
                    createObjectToSend(infoUser[0], infoUser[1].toString());
                }
            }
        }

        const checkErr = errors.every((error: string | undefined) => error === undefined);

        if(!checkErr) setCheckConfidentiality(!checkConfidentiality);

        return checkErr;
    };

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form: EventTarget & HTMLFormElement = e.target;
        const formData: FormData = new FormData(form);
        const noError: boolean = activeRegex(formData);

        if (noError) {
            let response: IAuth = {messageToTrans: '', token: ''};
            const client = await Client.init({
                relayUrl: RELAY_URL,
                projectId: PROJECT_ID,
                metadata: DEFAULT_APP_METADATA,
            });
            const session = JSON.parse(localStorage.getItem('sessionTernoa') || '') || undefined; 
            const address = localStorage.getItem('walletTernoa') || undefined; 

            setMsgForModal('confirm-registration');

            await SignMessage(client, session, address);
            
            const certification = localStorage.getItem('accountCertified'); 
            
            if(certification) response = await register(registration);
        
            localStorage.setItem('token', response.token);
            setMsgForModal(response.messageToTrans);

            setTimeout(() => {
                window.location.replace(`${window.location.protocol}//${window.location.host}`);
            }, 1000);
        }
    };

    /* Part-2 Creation element to display. */

    const InputClassName = (name: string) => {

        // Class for all
        let defaultClass: string = `form-control shadow_background-input input-form ${props.styleForm?.input} `;
        
        const readOnlyClass: string = 'pe-none read-only';
        const errorClass: string = 'border-danger';
        
        // Class Custom
        const walletAddressClass: string = ' text-truncate pe-5';

        if(name === 'city') defaultClass =  errorCity ? defaultClass + errorClass : defaultClass;
        if(name === 'pseudo') defaultClass = errorPseudo ? defaultClass + errorClass : defaultClass;
        if(name === 'firstName') defaultClass = errorFirstName ? defaultClass + errorClass : defaultClass;
        if(name === 'lastName') defaultClass = errorLastName ? defaultClass + errorClass : defaultClass;
        if(name === 'email') defaultClass = errorEmail ? defaultClass + errorClass : defaultClass;
        if(name === 'discord') defaultClass = errorDiscord ? defaultClass + errorClass : defaultClass;
        if(name === 'referral') defaultClass = errorReferral ? defaultClass + errorClass : defaultClass;
        if(name === 'walletAddress') defaultClass = defaultClass + readOnlyClass + walletAddressClass;

        return defaultClass;
    };

    const createInput = (element: IElement, id: number) => {
        return (
            <div key={'input-'+id} className={`container-input-and-select`}>
                <label className={`label-form`} htmlFor={element.name}>{element.label}</label>
                <input
                    className={InputClassName(element.name)}
                    type={element.type}
                    placeholder={element.placeholder}
                    value={element.value}
                    name={element.name}
                    id={element.name}
                    readOnly={element.readOnly}
                    onChange={handleChange}
                />
            </div>
        );
    };

    const optionSelect = (name: string): IOptionsSelect[] => {
        let options: IOptionsSelect[] = [];

        if (name === 'country') options = countriesOptions;
        if (name === 'contribution') options = contributionOptions;
        if (name === 'aboutUs') options = aboutUsOptions;

        return options;
    };

    const createSelect = (element: IElement, id: number) => {
        return (
            <div key={'select-'+id} className={`container-input-and-select`}>
                <label className={`label-form`} htmlFor={element.name}>{element.label}</label>
                <select
                    className={`form-select shadow_background-input position-flag-select design rounded-pill ${element.name === 'country' ? activeMarge : ''}`}
                    name={element.name}
                    id={element.name}
                    style={ element.name === 'country' ? {background: `url(${country}) no-repeat`} : {}}
                    onChange={handleChangeSelect}
                >
                    <option defaultValue=''>{element.name === 'contribution' ? t('form.placeholder.contribution') : t('form.placeholder.select')}</option>
                    {
                        optionSelect(element.name).map((option: IOptionsSelect, id) => {
                            return (
                                <option key={'option-'+id} value={option.value}>{option.name}</option>
                            );
                        })
                    }
                </select>
            </div>
        );
    };

    const createStructure = () => {
        let arrayData: DataForm[] = props.dataForm;
        const elementsToDisplay = [];

        for(let i = 0; i < props.structure.nbSection; ++i) {
            elementsToDisplay.push(
                <div key={'section-'+i} className={`div-under-form`}>
                    {
                        arrayData.map((element: DataForm, id) => {
                            while(id < props.structure.nbBySection) {
                                if(element.balise === 'input') return createInput(element, id);
                                if(element.balise === 'select') return createSelect(element, id);
                            }
                            if(id === arrayData.length - 1) {
                                arrayData = arrayData.slice(props.structure.nbBySection);
                            }
                        })
                    }
                </div>
            );
        }
        return elementsToDisplay;
    };

    const setUpButton = () => {
        if (props.structure.btn === 'register' || props.structure.btn === 'btnWithConfidentiality') {
            return (
                <div className={`container-submit`}>
                    <div className={`div-under-container-submit`}>
                        <div className={`container-confidentiality`}>
                            <input
                                className={`input-container-submit`}
                                type='checkbox'
                                name='confidentiality'
                                onChange={handleChange}
                                checked={checkConfidentiality}
                            />
                            <p className={`text-container-submit`}>
                                <Trans i18nKey="form.confidentiality" t={t} components= {
                                    {
                                        link1: <LinkText href="#" title="Terms of Use" />,
                                        link2: <LinkText href="#" title="Privacy Policy" />
                                    }
                                }/>
                            </p>
                        </div>
                        <div className={`container-be-contacted`}>
                            <input
                                className={`input-container-submit`}
                                type='checkbox'
                                name='beContacted'
                                onChange={handleChange}
                            />
                            <p className={`text-container-submit`}>
                                {t('form.be-contacted')}
                            </p>
                        </div>
                    </div>
                    <button
                        className={`btn btn-form padding-button`}
                        type='submit'
                        disabled={disabledButton}
                    >
                        {props.structure.btn === 'register' ? t('form.btn.send') : t('form.btn.update')}
                    </button>
                </div>
            );
        }

        if (props.structure.btn === 'confirmAndCancel') {
            return (
                <div className={`container-submit`}>
                    <button className={`btn padding-button btn-cancel`}>{t('form.btn.cancel')}</button>
                    <button className={`btn btn-form padding-button`} type="submit" disabled={disabledButton}>{t('form.btn.modify')}</button>
                </div>
            );
        }

        if (props.structure.btn === 'update') {
            return (
                <div className={`container-submit`}>
                    <button className={`btn btn-form padding-button`} type="submit" disabled={disabledButton}>{t('form.btn.update')}</button>
                </div>
            );
        }
    };

    return (
        <>
            <form className={`form ${props.styleForm?.form}`} method="post" onSubmit={handleSubmit}>
                {
                    createStructure().map((element) => element)
                }
                {
                    setUpButton()
                }
            </form>
            <Modal msgModal={msgForModal} heightModal={heightModal()} />
        </>
    );
}
