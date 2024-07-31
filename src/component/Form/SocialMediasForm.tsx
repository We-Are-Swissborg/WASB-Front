import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SocialMedias } from "../../types/SocialMedias";
import regex from '../../services/regex';
import { useAuth } from "../../contexts/AuthContext";
import { updateUser } from "../../services/user.service";
import { toast } from "react-toastify";
import { User } from "../../types/User";

type ISocialMediasForm = {
    socialMedias: SocialMedias | undefined;
    user: User | undefined;
    setUser: Dispatch<SetStateAction<User | undefined>>;
}

export default function SocialMediasForm(props: ISocialMediasForm) {
    const { t } = useTranslation('global');
    const { register, handleSubmit, formState: { errors } } = useForm<SocialMedias>();
    const [init, setInit] = useState(true);
    const { token } = useAuth();
    const [valueSocialMedias, setValueSocialMedias] = useState({
        twitter: '',
        discord: '',
        tiktok: '',
        telegram: '',
    });
    const propValueAccount = Object.keys(valueSocialMedias); // Properties for creating a field form

    const initUser = useCallback(() => {
        if(valueSocialMedias) {
            setValueSocialMedias({
                ...valueSocialMedias || '',
                twitter: props.socialMedias?.twitter || '',
                discord: props.socialMedias?.discord || '',
                tiktok: props.socialMedias?.tiktok || '',
                telegram: props.socialMedias?.telegram || '',
            });
        }
    }, [valueSocialMedias, props]);

    const patternField = (field: string) => {
        const regexDiscord: RegExp = new RegExp(regex.discord);

        if(field === 'discord') {
            return {
                value: regexDiscord,
                message: 'Error with your Discord'
            };
        }
    };

    const displayInput = (field: keyof SocialMedias, id: number) => {
        return (
            <div key={'input-' + id}  className='container-input-and-select'>
                <label className='label-form' htmlFor={field}>
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
                    placeholder={'element.placeholder'}
                    name={field}
                    id={field}
                />
                {errors[`${field}`] && <p className="m-0 text-danger">{errors[field]?.message}</p>}
            </div>
        );
    };

    const onSubmit = handleSubmit((data) => {
        if(token && props.user?.id) {
            updateUser(props.user.id, token, data).then(() => {
                if(props.user?.id) { // Without the condition we have an error
                    props.setUser({...props.user, socialMedias: data});
                    toast.success('SOCIAL MEDIA UPDATE');
                }
            }).catch(() => {
                toast.error('USER ERROORR');
            });
        }
    });

    useEffect(() => {
        if(init && props.socialMedias) {
            initUser();
            setInit(false);
        }
    }, [initUser, init, props]);

    return (
        <form className='form all-form-setting' onSubmit={onSubmit}>
            <div className='div-under-form'>
                { propValueAccount.map((field: string, id: number) => displayInput(field as keyof SocialMedias, id)) }
            </div>
            <button className='btn btn-form padding-button mb-5  mt-3' type="submit">
                SEND
            </button>
        </form>
    ); 
}