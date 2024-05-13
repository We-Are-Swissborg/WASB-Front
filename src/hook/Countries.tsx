import { useTranslation } from 'react-i18next';

import AR from '../assets/images/countries/argentina.svg';
import AU from '../assets/images/countries/austria.svg';
import BE from '../assets/images/countries/belgium.svg';
import BR from '../assets/images/countries/brazil.svg';
import BG from '../assets/images/countries/bulgaria.svg';
import CA from '../assets/images/countries/canada.svg';
import CL from '../assets/images/countries/chile.svg';
import CO from '../assets/images/countries/colombia.svg';
import CY from '../assets/images/countries/cyprus.svg';
import CZ from '../assets/images/countries/czech.svg';
import DK from '../assets/images/countries/denmark.svg';
import EE from '../assets/images/countries/estonia.svg';
import FI from '../assets/images/countries/finland.svg';
import FR from '../assets/images/countries/france.svg';
import DE from '../assets/images/countries/germany.svg';
import GR from '../assets/images/countries/greece.svg';
import HU from '../assets/images/countries/hungary.svg';
import IN from '../assets/images/countries/india.svg';
import IE from '../assets/images/countries/ireland.svg';
import IL from '../assets/images/countries/israel.svg';
import IT from '../assets/images/countries/italy.svg';
import JP from '../assets/images/countries/japan.svg';
import KZ from '../assets/images/countries/kazakhstan.svg';
import LV from '../assets/images/countries/latvia.svg';
import LI from '../assets/images/countries/liechtenstein.svg';
import LT from '../assets/images/countries/lithuania.svg';
import LU from '../assets/images/countries/luxembourg.svg';
import MT from '../assets/images/countries/malta.svg';
import MU from '../assets/images/countries/mauritius.svg';
import MX from '../assets/images/countries/mexico.svg';
import NL from '../assets/images/countries/netherlands.svg';
import NO from '../assets/images/countries/norway.svg';
import PL from '../assets/images/countries/poland.svg';
import PT from '../assets/images/countries/portugal.svg';
import RO from '../assets/images/countries/romania.svg';
import SC from '../assets/images/countries/seychelles.svg';
import SG from '../assets/images/countries/singapore.svg';
import SK from '../assets/images/countries/slovakia.svg';
import SI from '../assets/images/countries/slovenia.svg';
import KR from '../assets/images/countries/south-korea.svg';
import ES from '../assets/images/countries/spain.svg';
import SE from '../assets/images/countries/sweden.svg';
import CH from '../assets/images/countries/switzerland.svg';
import TW from '../assets/images/countries/taiwan.svg';
import TH from '../assets/images/countries/thailand.svg';
import AE from '../assets/images/countries/uae.svg';
import GB from '../assets/images/countries/united-kingdom.svg';

export default function Countries() {
    const [t] = useTranslation("global");

    const listCountries = [
        {iso: 'AR', name: t('countries.argentina'), urlImg: AR},
        {iso: 'AU', name: t('countries.austria'), urlImg: AU},
        {iso: 'BE', name: t('countries.belgium'), urlImg: BE},
        {iso: 'BR', name: t('countries.brazil'), urlImg: BR},
        {iso: 'BG', name: t('countries.bulgaria'), urlImg: BG},
        {iso: 'CA', name: t('countries.canada'), urlImg: CA},
        {iso: 'CL', name: t('countries.chile'), urlImg: CL},
        {iso: 'CO', name: t('countries.colombia'), urlImg: CO},
        {iso: 'CY', name: t('countries.cyprus'), urlImg: CY},
        {iso: 'CZ', name: t('countries.czech'), urlImg: CZ},
        {iso: 'DK', name: t('countries.denmark'), urlImg: DK},
        {iso: 'EE', name: t('countries.estonia'), urlImg: EE},
        {iso: 'FI', name: t('countries.finland'), urlImg: FI},
        {iso: 'FR', name: t('countries.france'), urlImg: FR},
        {iso: 'DE', name: t('countries.germany'), urlImg: DE},
        {iso: 'GR', name: t('countries.greece'), urlImg: GR},
        {iso: 'HU', name: t('countries.hungary'), urlImg: HU},
        {iso: 'IN', name: t('countries.india'), urlImg: IN},
        {iso: 'IE', name: t('countries.ireland'), urlImg: IE},
        {iso: 'IL', name: t('countries.israel'), urlImg: IL},
        {iso: 'IT', name: t('countries.italy'), urlImg: IT},
        {iso: 'JP', name: t('countries.japan'), urlImg: JP},
        {iso: 'KZ', name: t('countries.kazakhstan'), urlImg: KZ},
        {iso: 'LV', name: t('countries.latvia'), urlImg: LV},
        {iso: 'LI', name: t('countries.liechtenstein'), urlImg: LI},
        {iso: 'LT', name: t('countries.lithuania'), urlImg: LT},
        {iso: 'LU', name: t('countries.luxembourg'), urlImg: LU},
        {iso: 'MT', name: t('countries.malta'), urlImg: MT},
        {iso: 'MU', name: t('countries.mauritius'), urlImg: MU},
        {iso: 'MX', name: t('countries.mexico'), urlImg: MX},
        {iso: 'NL', name: t('countries.netherlands'), urlImg: NL},
        {iso: 'NO', name: t('countries.norway'), urlImg: NO},
        {iso: 'PL', name: t('countries.poland'), urlImg: PL},
        {iso: 'PT', name: t('countries.portugal'), urlImg: PT},
        {iso: 'RO', name: t('countries.romania'), urlImg: RO},
        {iso: 'SC', name: t('countries.seychelles'), urlImg: SC},
        {iso: 'SG', name: t('countries.singapore'), urlImg: SG},
        {iso: 'SK', name: t('countries.slovakia'), urlImg: SK},
        {iso: 'SI', name: t('countries.slovenia'), urlImg: SI},
        {iso: 'KR', name: t('countries.south-korea'), urlImg: KR},
        {iso: 'ES', name: t('countries.spain'), urlImg: ES},
        {iso: 'SE', name: t('countries.sweden'), urlImg: SE},
        {iso: 'CH', name: t('countries.switzerland'), urlImg: CH},
        {iso: 'TW', name: t('countries.taiwan'), urlImg: TW},
        {iso: 'TH', name: t('countries.thailand'), urlImg: TH},
        {iso: 'AE', name: t('countries.uae'), urlImg: AE},
        {iso: 'GB', name: t('countries.united-kingdom'), urlImg: GB},
    ];

    return listCountries;
}
