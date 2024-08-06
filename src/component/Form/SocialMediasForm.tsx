import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SocialMedias } from "../../types/SocialMedias";
import regex from '../../services/regex';
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { User } from "../../types/User";
import { updateSocialMediasUser } from "../../services/socialMedias.service";
import Regex from "../../types/Regex";

type ISocialMediasForm = {
    socialMedias: SocialMedias | undefined;
    user: User | undefined;
    setUser: Dispatch<SetStateAction<User | undefined>>;
}

export default function SocialMediasForm(props: ISocialMediasForm) {
    const { t } = useTranslation('global');
    const { register, handleSubmit, formState: { errors } } = useForm<SocialMedias>();
    const [isInit, setIsInit] = useState(true);
    const { token } = useAuth();
    const [valueSocialMedias, setValueSocialMedias] = useState<SocialMedias>({} as SocialMedias);
    const propValueSocialMedias = Object.keys(valueSocialMedias); // Properties for creating a field form

    const valueSocialMediasRef = useRef(valueSocialMedias);
    const socialMediasRef = useRef(props.socialMedias);
    const placeholder = [
        'twitter.com/WeAreSwissBorg',
        t('profile.social-medias.discord'),
        'tiktok.com/@weareswissborg.eth',
        't.me/WeAreSwissBorg'
    ];

    const initUser = useCallback(() => {
        setValueSocialMedias({
            ...valueSocialMedias || '',
            twitter: props.socialMedias?.twitter || '',
            discord: props.socialMedias?.discord || '',
            tiktok: props.socialMedias?.tiktok || '',
            telegram: props.socialMedias?.telegram || '',
        });
    }, [valueSocialMedias, props]);

    const patternField = (field: string) => {
        const regexSocialMedias: RegExp = new RegExp(regex[field as keyof Regex]);

        return {
            value: regexSocialMedias,
            message: t('profile.social-medias.error-' + field)
        };
    };

    const displayInput = (field: keyof SocialMedias, id: number) => {
        return (
            <div key={'input-' + id}  className='container-input-and-select'>
                <label className='label-form uppercase-first-letter' htmlFor={field}>
                    {field} :
                </label>
                <input
                    {...register(field, {
                        value: props.socialMedias ? props.socialMedias[field] : '',
                        pattern: patternField(field),
                        onChange: (e) => setValueSocialMedias({...valueSocialMedias, [field]: e.target.value})
                    })}
                    className='form-control shadow_background-input input-form'
                    type='text'
                    placeholder={placeholder[id]}
                    name={field}
                    id={field}
                />
                {errors[`${field}`] && <p className="m-0 text-danger">{errors[field]?.message}</p>}
            </div>
        );
    };

    const checkSocialMediasWithOldSocial = (newSocialMedias: FieldValues) => {
        let sameValue = false;
        const propsData = Object.keys(newSocialMedias);
        
        // Compare the old value with the new value if the value is the same, this removes the property of the object to send to the BD. 
        propsData.forEach((prop) => {
            if(socialMediasRef.current && newSocialMedias) sameValue = newSocialMedias[prop] === socialMediasRef.current[prop as keyof SocialMedias] || (newSocialMedias[prop] === '' && socialMediasRef.current[prop as keyof SocialMedias] == undefined);
            if(sameValue) delete newSocialMedias[prop];
        });
        return newSocialMedias;
    };

    const correctSocialMediasToSend = (newSocialMedias: FieldValues) => {
        const newData = checkSocialMediasWithOldSocial(newSocialMedias);
        const allValueEmpty = Object.values(newSocialMedias).every((value) => value === '');

        if(allValueEmpty && !props.socialMedias || !Object.keys(newData).length) {
            toast.error(t('profile.form-not-changed'));
            throw new Error('SOCIAL MEDIAS NOT CHANGED');
        }

        return newData;
    };

    const onSubmit = handleSubmit((data) => {
        if(token && props.user?.id) {
            data = correctSocialMediasToSend(data);
            updateSocialMediasUser(props.user.id, token, data).then(() => {
                if(props.user?.id) { // Without the condition we have an error
                    props.setUser({...props.user, socialMedias: {
                        ...props.user.socialMedias,
                        twitter: data.twitter !== undefined ? data.twitter : props.user.socialMedias?.twitter,
                        discord: data.discord !== undefined ? data.discord : props.user.socialMedias?.discord,
                        tiktok: data.tiktok !== undefined ? data.tiktok : props.user.socialMedias?.tiktok,
                        telegram: data.telegram !== undefined ? data.telegram : props.user.socialMedias?.telegram
                    }});
                    toast.success(t('profile.success-update'));
                }
            }).catch(() => {
                toast.error(t('profile.error-form'));
                throw new Error('ERROR SOCIAL MEDIAS FORM');
            });
        }
    });

    useEffect(() => {
        if(isInit) {
            initUser();
            setIsInit(false);
        }
        valueSocialMediasRef.current = valueSocialMedias;
        socialMediasRef.current = props.socialMedias;
    }, [initUser, isInit, props]);

    useEffect(() => {
        return () => {
            if(socialMediasRef.current !== undefined) {
                const newData = checkSocialMediasWithOldSocial(valueSocialMediasRef.current);
                const nbPropsToUpdate = Object.keys(newData).length;

                // Verfification new values don't have empty value and the user don't have social medias again. Is true if user never send these social medias.
                const nothingIsDefine = Object.values(newData).every((data) => data == '') && props.socialMedias === null;

                if(nbPropsToUpdate && !nothingIsDefine) {
                    toast.info(t('profile.form-not-saved'));
                }
            }
        };
    }, []);

    return (
        <form className='form all-form-profile' onSubmit={onSubmit}>
            <div className='div-under-form'>
                { propValueSocialMedias.map((field: string, id: number) => displayInput(field as keyof SocialMedias, id)) }
            </div>
            <button className='btn btn-form padding-button mt-3' type="submit">
                {t('profile.update')}
            </button>
        </form>
    ); 
}