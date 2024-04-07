import { useTranslation } from "react-i18next";
import Countries from "../hook/Countries";

interface Props {
  handleChange: React.ChangeEventHandler,
  activeMarge: string,
  country: string
}

export default function SelectorCountries({handleChange, activeMarge, country} : Props) {
  const [t] = useTranslation("global");
  const listCountries = Countries();

  return (
    <>
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
    </>
  );
}