import { useState } from "react";
import { useTranslation } from "react-i18next";

import Form from "../hook/Form";
import '../css/Setting.css';

export default function Setting () {
  const {t} = useTranslation('global');
  const [choiceSetting, setChoiceSetting] = useState(1);

  const myAccountClass = choiceSetting === 1 ? 'btn-secondary text-white' : 'bg-secondary-subtle text-black';
  const membershipClass = choiceSetting === 2 ? 'btn-secondary text-white' : 'bg-secondary-subtle text-black';
  const linkedAccountClass = choiceSetting === 3 ? 'btn-secondary text-white' : 'bg-secondary-subtle text-black';
  
  const structureFormOne = {
    btn: 'btnWithConfidentiality',
    nbSection: 5,
    nbBySection: 2,
  }
  const structureFormTwo = {
    btn: 'confirmAndCancel',
    nbSection: 3,
    nbBySection: 2,
  }
  const structureFormThree = {
    btn: 'update',
    nbSection: 4,
    nbBySection: 1,
  }

  const styleFormOne = {
    form: 'all-form-setting',
  }

  const styleFormTwo = {
    form: 'all-form-setting',
  }

  const styleFormThree = {
    form: 'all-form-setting',
    input: 'input-setting',
  }

  const dataFormOne = [
    {balise: 'input', name: 'firstName', label: t('register.first-name'), type: 'text', placeholder: t('register.placeholder.first-name')},
    {balise: 'input', name: 'lastName', label: t('register.last-name'), type: 'text', placeholder: t('register.placeholder.last-name')},
    {balise: 'input', name: 'pseudo', label: t('register.pseudo'), type: 'text', placeholder: t('register.placeholder.pseudo')},
    {balise: 'input', name: 'email', label: t('register.email'), type: 'text', placeholder: t('register.placeholder.email')},
    {balise: 'select', name: 'aboutUs', label: t('register.aboutUs')},
    {balise: 'input', name: 'referral', label: t('register.referral'), type: 'text', placeholder: 'PUT EXEMPLE REFERRAL'},
    {balise: 'select', name: 'country', label: t('register.country')},
    {balise: 'input', name: 'city', label: t('register.city'), type: 'text', placeholder: t('register.placeholder.city')},
    {balise: 'input', name: 'wallet', label: t('register.wallet'), type: 'text', value: 'WALLET', readOnly: true},
  ]
  const dataFormTwo = [
    {balise: 'input', name: 'contributionStatus', label: t('setting.manage-membership.status'), type: 'text', value: 'STATUS', readOnly: true},
    {balise: 'input', name: 'dateContribution', label: t('setting.manage-membership.contribution-start'), type: 'date', readOnly: true},
    {balise: 'input', name: 'donations', label: t('setting.manage-membership.donations'), type: 'text', value: 'DONATIONS'},
    {balise: 'select', name: 'contribution', label: t('setting.manage-membership.contribution')},
    {balise: 'input', name: 'EndDateContribution', label: t('setting.manage-membership.contribution-end'), type: 'date', value: 'WALLET', readOnly: true},
    {balise: 'input', name: 'nftWallet', label: t('setting.manage-membership.nft-wallet'), type: 'text', value: 'NFT WALLET', readOnly: true},
  ]
  const dataFormThree = [
    {balise: 'input', name: 'twitter', label: 'Twitter', type: 'text', placeholder: 'twitter.com/WeAreSwissBorg'},
    {balise: 'input', name: 'discord', label: 'Discord', type: 'text', placeholder: t('setting.linked-accounts.discord')},
    {balise: 'input', name: 'tiktok', label: 'TikTok', type: 'text', placeholder: 'tiktok.com/@weareswissborg.eth'},
    {balise: 'input', name: 'telegram', label: 'Telegram', type: 'text', placeholder: 't.me/WeAreSwissBorg'},
  ]

  return (
    <div className="setting-container container d-flex flex-column align-items-center mt-5">
      <h1 className="border-bottom border-dark-subtle pb-2 fw-bold w-100">{t('setting.title')}</h1>
      <div className="d-flex w-100">
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
            <div className="w-100">
              <h2 className="fw-normal">{t('setting.my-account.title')}</h2>
              <Form
                dataForm={dataFormOne}
                structure={structureFormOne}
                styleForm={styleFormOne}
              />
            </div>
          }
          { choiceSetting === 2 &&
            <div>
              <div>
                <h2 className="fw-normal">{t('setting.manage-membership.title')}</h2>
                <p className="message-membership text-nowrap">{t('setting.manage-membership.message-1')}</p>
                <p className="message-membership text-nowrap">{t('setting.manage-membership.message-2')}</p>
              </div>
              <Form
                dataForm={dataFormTwo}
                structure={structureFormTwo}
                styleForm={styleFormTwo}
              />
            </div>
          }
          { choiceSetting === 3 &&
            <div>
              <h2 className="fw-normal">{t('setting.linked-accounts.title')}</h2>
              <Form
                dataForm={dataFormThree}
                structure={structureFormThree}
                styleForm={styleFormThree}
              />
            </div>
          }
        
      </div>
    </div>
  )
}