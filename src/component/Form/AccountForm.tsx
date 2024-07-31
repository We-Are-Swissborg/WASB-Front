import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { User } from "../../types/User";
import { useTranslation } from "react-i18next";
import { OptionsSelect } from "../../types/OptionsSelect";
import Countries from "../../hook/Countries";
import regex from '../../services/regex';
import { updateUser } from "../../services/user.service";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

type IAccountForm = {
  user: User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
}

export default function AccountFom(props: IAccountForm) {
    const { t } = useTranslation('global');
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { token } = useAuth();
    const [init, setInit] = useState(true);
    // const [country, setCountry] = useState<string>('');
    // const activeMarge: string = country ? 'ps-5' : ''; // Padding for country field
    const [valueAccount, setValueAccount] = useState({
        country: '',
        city: '',
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        walletAddress: '',
        aboutUs: '',
        beContacted: false,
    });
    const urlReferral = `${window.location.origin}/#/register/${props.user?.referralCode}`;

    const propValueAccount = Object.keys(valueAccount); // Properties for creating a field form
    propValueAccount.pop(); // Take off 'beContacted' property

    const initUser = useCallback(() => {
        setValueAccount({
            ...valueAccount,
            country: props.user?.country || '',
            city: props.user?.city || '',
            firstName: props.user?.firstName || '',
            lastName: props.user?.lastName || '',
            email: props.user?.email || '',
            username: props.user?.username || '',
            walletAddress: props.user?.walletAddress || '',
            aboutUs: props.user?.aboutUs || '',
            beContacted: props.user?.beContacted || false,
        });
    }, [valueAccount, props]);

    const patternField = (field: string) => {
        const regexName: RegExp = new RegExp(regex.name);
        const regexUsername: RegExp = new RegExp(regex.username);
        const regexEmail: RegExp = new RegExp(regex.email);
        if(field === 'firstName' || field === 'lastName') {
            return {
                value: regexName,
                message: 'Error with the name'
            };
        } else if(field === 'username') {
            return {
                value: regexUsername,
                message: 'Error with the username'
            };
        } else if(field === 'email') {
            return {
                value: regexEmail,
                message: 'Error with the email'
            };
        }
    };

    const displayInput = (field: keyof User, id: number) => {
        if(props.user) return (
            <div key={'input-' + id}  className='container-input-and-select'>
                <label className='label-form' htmlFor={field}>
                    {field} :
                </label>
                <input
                    {...register(field, 
                        {
                            value: props.user[field],
                            pattern: patternField(field),
                            required: {
                                value: field.includes('email') || field.includes('username')  ? true : false,
                                message: "Value required"
                            },
                            onChange: (e) => setValueAccount({...valueAccount, [field]: e.target.value})
                        }
                    )}
                    className='form-control shadow_background-input input-form'
                    type={field.includes('email') ? 'email' : 'text'}
                    placeholder={'element.placeholder'}
                    name={field}
                    id={field}
                />
                {errors[field] && <p className="m-0 text-danger">{errors[field].message?.toString()}</p>}
            </div>
        );
    };

    const countriesOptions: OptionsSelect[] = Countries().map((item) => ({
        value: item.iso,
        name: item.name,
        urlImg: item.urlImg,
    }));

    const aboutUsOptions: OptionsSelect[] = [
        { value: 'discord', name: 'Discord' },
        { value: 'telegram', name: 'Telegram' },
        { value: 'tiktok', name: 'Tiktok' },
        { value: 'twitter', name: 'Twitter' },
        { value: 'youtube', name: 'Youtube' },
        { value: 'other', name: t('form.other') },
    ];

    const optionSelect = (name: string): OptionsSelect[] => {
        let options: OptionsSelect[] = [];

        if (name === 'country') options = countriesOptions;
        if (name === 'aboutUs') options = aboutUsOptions;

        return options;
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        if (name === 'country') {
            setValue('country', value); // For the autocomplete otherwise returns empty
 
            // const flag = countriesOptions.find((country) => country.value === value);
            // const urlImg = flag?.urlImg || '';
            // setCountry(urlImg);
        }
    };

    const displaySelect = (field: keyof User, id: number) => {
        if(props.user) return(
            <div key={'input-' + id}  className='container-input-and-select'>
                <label className='label-form' htmlFor={field}>
                    {field} :
                </label>
                <select
                    {...register(field, {
                        value: props.user[field] ? props.user[field] : '',
                    })}
                    className='form-select shadow_background-input position-flag-select design rounded-pill'
                    name={field}
                    id={field}
                    // style={field === 'country' ? { background: `url(${country}) no-repeat` } : {}}
                    onChange={handleChange}
                >
                    <option value=''>
                        DEFAULT
                    </option>
                    {optionSelect(field).map((option: OptionsSelect, id) => {
                        return (
                            <option key={'option-' + id} value={option.value}>
                                {option.name}
                            </option>
                        );
                    })}
                </select>
                {errors[field] && <p className="m-0 text-danger">{errors[field].message?.toString()}</p>}
            </div>
        );
    };

    const onSubmit = handleSubmit((data) => {
        if(token && props.user?.id) {
            updateUser(props.user.id, token, data).then(() => {
                if(props.user?.id) { // Without the condition we have an error
                    props.setUser({...props.user, ...data});
                    toast.success('USER UPDATE');
                }
            }).catch(() => {
                toast.error('USER ERROORR');
            });
        }
    });

    useEffect(() => {
        if(init && props.user) {
            console.log(props.user);
            initUser();
            setInit(false);
        }
    }, [initUser, init, props]);

    return (
        <form className='form all-form-setting mb-5' onSubmit={onSubmit}>
            <div className='div-under-form'>
                { propValueAccount.map((field: string, id: number) => {
                    return (
                        !field.includes('country')  && !field.includes('aboutUs') ?
                            displayInput(field as keyof User, id) :
                            displaySelect(field as keyof User, id)
                    );
                })}
            </div>

            <p className="align-self-start mt-3">Your referral : <a href={urlReferral}>{urlReferral}</a></p>
            <div className='container-submit'>
                <div className='container-be-contacted'>
                    <input
                        {...register('beContacted')}
                        checked={valueAccount.beContacted}
                        type="checkbox"
                        name="beContacted"
                        id="beContacted"
                        onChange={() => setValueAccount({...valueAccount, beContacted: !valueAccount.beContacted})}
                    />
                    <p className='text-container-submit'>{valueAccount.beContacted ? 'Uncheck, if you no longer wish to be contacted by WeAreSwissBorg' : t('form.be-contacted')}</p>
                </div>
                <button className='btn btn-form padding-button' type="submit">
                     SEND
                </button>
            </div>
        </form>
    ); 
}