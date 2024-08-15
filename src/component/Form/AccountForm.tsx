import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { User } from '../../types/User';
import { useTranslation } from 'react-i18next';
import { OptionsSelect } from '../../types/OptionsSelect';
import Countries from '../../hook/Countries';
import regex from '../../services/regex';
import { updateUser } from '../../services/user.service';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { Account } from '../../types/Account';
import toDownArrow from '../../assets/images/icon/to_down-arrow.png';

type IAccountForm = {
    user: User | undefined;
    setUser: Dispatch<SetStateAction<User | undefined>>;
};

export default function AccountForm(props: IAccountForm) {
    const { t } = useTranslation('global');
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();
    const { token } = useAuth();
    const [isInit, setIsInit] = useState(true);
    const [beContactedChanged, setBeContactedChanged] = useState(true);
    const [valueAccount, setValueAccount] = useState<Account>({} as Account);
    const urlReferral = `${window.location.origin}/#/register/${props.user?.referralCode}`;

    const propValueAccount = Object.keys(valueAccount); // Properties for creating a field form
    propValueAccount.pop(); // Take off 'beContacted' property

    const valueAccountRef = useRef(valueAccount);
    const userRef = useRef(props.user);

    const placeholderInput = [
        t('profile.my-account.placeholder.city'),
        t('profile.my-account.placeholder.first-name'),
        t('profile.my-account.placeholder.last-name'),
        t('profile.my-account.placeholder.email'),
        t('profile.my-account.placeholder.username'),
        t('profile.my-account.placeholder.wallet-address'),
    ];

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
        if (field === 'firstName' || field === 'lastName') {
            return {
                value: regexName,
                message: t('profile.my-account.error-' + field),
            };
        } else if (field === 'username') {
            return {
                value: regexUsername,
                message: t('profile.my-account.error-' + field),
            };
        } else if (field === 'email') {
            return {
                value: regexEmail,
                message: t('profile.my-account.error-' + field),
            };
        }
    };

    const displayInput = (field: keyof User, id: number) => {
        if (props.user)
            return (
                <div key={'input-' + id} className="container-input-and-select">
                    <label className="label-form" htmlFor={field}>
                        {t('profile.my-account.' + field)} :
                    </label>
                    <input
                        {...register(field, {
                            value: props.user[field],
                            pattern: patternField(field),
                            required: {
                                value: field.includes('email') || field.includes('username') ? true : false,
                                message: t('profile.required'),
                            },
                            onChange: (e) => setValueAccount({ ...valueAccount, [field]: e.target.value }),
                        })}
                        className="form-control shadow_background-input input-form"
                        type={field.includes('email') ? 'email' : 'text'}
                        placeholder={placeholderInput[id - 1]}
                        name={field}
                        id={field}
                    />
                    {errors[field] && <p className="m-0 text-danger">{errors[field]?.message?.toString()}</p>}
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
        { value: 'other', name: t('profile.my-account.other') },
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
            valueAccountRef.current.country = value;
        }
        if (name === 'aboutUs') valueAccountRef.current.aboutUs = value;
    };

    const displaySelect = (field: keyof User, id: number) => {
        if (props.user)
            return (
                <div key={'input-' + id} className="container-input-and-select">
                    <label className="label-form" htmlFor={field}>
                        {t('profile.my-account.' + field)} :
                    </label>
                    <select
                        {...register(field, {
                            value: props.user[field] ? props.user[field] : '',
                        })}
                        className="form-select shadow_background-input position-arrow-select design rounded-pill"
                        name={field}
                        id={field}
                        style={{ background: `url(${toDownArrow}) no-repeat` }}
                        onChange={handleChange}
                    >
                        <option value="">{t('profile.default-select')}</option>
                        {optionSelect(field).map((option: OptionsSelect, id) => {
                            return (
                                <option key={'option-' + id} value={option.value}>
                                    {option.name}
                                </option>
                            );
                        })}
                    </select>
                    {errors[field] && <p className="m-0 text-danger">{errors[field]?.message?.toString()}</p>}
                </div>
            );
    };

    const checkUserWithOldUser = (newUser: FieldValues) => {
        let sameValue = false;
        const propsData = Object.keys(newUser);
        propsData.forEach((prop) => {
            if (userRef.current)
                sameValue =
                    newUser[prop] === userRef.current[prop as keyof User] ||
                    (newUser[prop] === '' && userRef.current[prop as keyof User] == undefined);
            if (sameValue) delete newUser[prop];
        });
        return newUser;
    };

    const correctUserToSend = (newUser: FieldValues) => {
        const newData = checkUserWithOldUser(newUser);

        if (!Object.keys(newData).length) {
            toast.error(t('profile.form-not-changed'));
            throw new Error('USER NOT CHANGED');
        }

        return newData;
    };

    const onSubmit = handleSubmit((user) => {
        if (token && props.user?.id) {
            if (beContactedChanged) user.beContacted = props.user.beContacted;
            user = correctUserToSend(user);
            updateUser(props.user.id, token, user as User)
                .then(() => {
                    if (props.user?.id) {
                        // Without the condition we have an error
                        props.setUser({ ...props.user, ...user });
                        toast.success(t('profile.success-update'));
                    }
                })
                .catch(() => {
                    toast.error(t('profile.error-form'));
                    throw new Error('ERROR USER FORM');
                });
        }
    });

    useEffect(() => {
        if (isInit && props.user) {
            initUser();
            setIsInit(false);
        }
        valueAccountRef.current = valueAccount;
        userRef.current = props.user;
    }, [initUser, isInit, props]);

    useEffect(() => {
        return () => {
            if (userRef.current) {
                const newData = checkUserWithOldUser(valueAccountRef.current);
                if (Object.keys(newData).length) {
                    console.log('AccountForm', newData);
                    toast.info(t('profile.form-not-saved'));
                }
            }
        };
    }, []);

    return (
        <form className="form all-form-profile" onSubmit={onSubmit}>
            <div className="div-under-form">
                {propValueAccount.map((field: string, id: number) => {
                    return !field.includes('country') && !field.includes('aboutUs')
                        ? displayInput(field as keyof User, id)
                        : displaySelect(field as keyof User, id);
                })}
            </div>

            <p className="align-self-start mt-3">
                {t('profile.my-account.referral')} : <a href={urlReferral}>{urlReferral}</a>
            </p>
            <div className="container-submit">
                <div className="container-be-contacted">
                    <input
                        {...register('beContacted')}
                        defaultChecked={valueAccount.beContacted}
                        type="checkbox"
                        name="beContacted"
                        id="beContacted"
                        onClick={() => {
                            setValueAccount({ ...valueAccount, beContacted: !valueAccount.beContacted });
                            setBeContactedChanged(false);
                        }}
                    />
                    <p className="text-container-submit">
                        {valueAccount.beContacted
                            ? t('profile.my-account.not-be-contacted')
                            : t('profile.my-account.be-contacted')}
                    </p>
                </div>
                <button className="btn btn-form padding-button" type="submit">
                    {t('profile.update')}
                </button>
            </div>
        </form>
    );
}
