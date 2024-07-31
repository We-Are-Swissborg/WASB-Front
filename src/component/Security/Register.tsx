import { Trans, useTranslation } from 'react-i18next';
import Registration from '../../types/Registration';
import { LinkText } from '../../hook/LinksTranslate';
import { useForm } from 'react-hook-form';
import { checkReferralExist, register } from '../../services/user.service';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { auth } from '../../services/auth.services';
import { useAuth } from '../../contexts/AuthContext';

const registration = async (data: Registration) => {
    await register(data);
};

const authenticate = async (data: Registration): Promise<string> => {
    const { username, password } = data;
    return await auth(username, password!);
};

export default function Register() {
    const { t } = useTranslation('global');
    const navigate = useNavigate();
    const { codeRef } = useParams();
    const { login } = useAuth();

    // getting the event handlers from our custom hook
    const { register, handleSubmit, formState } = useForm<Registration>({ mode: 'onTouched' });
    const { isSubmitting, errors } = formState;
    const [correctReferral, setCorrectReferral] = useState<string[]>([]);
    const [wrongReferral, setWrongReferral] = useState<string[]>([]);

    const onSubmit = async (data: Registration) => {
        try {
            await registration(data);
            const token = await authenticate(data);
            login(token);
            navigate('/', { replace: true });
        } catch (e) {
            toast.error(t('register.error'));
        }
    };

    const validReferral = useCallback( async (codeRef: string) => {
        const res = await checkReferralExist(codeRef);

        if (!correctReferral.includes(codeRef)) setCorrectReferral([...correctReferral, codeRef]); // Add correct value in an array for not request the server if user retape the same referral.
        return res;
    }, [correctReferral]);
    
    const errorReferral = useCallback((codeRef: string) => {
        if(codeRef.length === 5 && !wrongReferral.includes(codeRef)) setWrongReferral([...wrongReferral, codeRef]); // Add wrong value in an array for not request the server if user retape the same referral.
        toast.error(t('register.referral-error'));
    }, [t, wrongReferral]);
 
    // TODO: execute the request on each keypress/click in the cell.
    const validateReferralCode = async (value: string): Promise<boolean> => {
        try {
            const correctValueExist = correctReferral.includes(value);
            const wrongValueExist = wrongReferral.includes(value);

            if(wrongValueExist) throw errors; // If value already exist in wrong array return error;
            if(correctValueExist) return true; // If value already exist in correct array return true;

            if (value.length === 5 && !correctValueExist && !wrongValueExist) {
                const response = await validReferral(value);

                return !!response;
            }
        } catch {
            errorReferral(value);
        }
        if(value.length === 0) return true;
        return false;
    };

    useEffect(() => {
        if (codeRef) validReferral(codeRef).catch(() => errorReferral(codeRef));
    }, [t, codeRef]);

    return (
        <div className="container d-flex flex-column align-items-center">
            <h1 className="my-5 text-secondary">{t('register.title')}</h1>
            <p className="text-center">{t('register.message')}</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row mb-3">
                    <label htmlFor="email" className="col-sm-2 col-form-label">
                        Email
                    </label>
                    <div className="col-10">
                        <input
                            className="form-control"
                            id="email"
                            type="email"
                            placeholder="Email"
                            {...register('email', {
                                required: 'this is a required',
                                maxLength: {
                                    value: 100,
                                    message: `Max length is 100`,
                                },
                            })}
                            required
                        />
                        {errors?.email && <div className="text-danger">{errors.email.message}</div>}
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="username" className="col-sm-2 col-form-label">
                        Username
                    </label>

                    <div className="col-10">
                        <input
                            className="form-control"
                            id="username"
                            type="text"
                            placeholder="username"
                            {...register('username', {
                                required: 'this is a required',
                                maxLength: {
                                    value: 100,
                                    message: 'Max length is 100',
                                },
                                minLength: {
                                    value: 3,
                                    message: 'Min length is 3',
                                },
                            })}
                            required
                        />
                        {errors?.username && <div className="text-danger">{errors.username.message}</div>}
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="password" className="col-sm-2 col-form-label">
                        Password
                    </label>
                    <div className="col-10">
                        <input
                            className="form-control"
                            id="password"
                            type="password"
                            placeholder="Password"
                            {...register('password', {
                                required: 'this is a required',
                                maxLength: {
                                    value: 100,
                                    message: 'Max length is 100',
                                },
                                minLength: {
                                    value: 8,
                                    message: 'Min length is 8',
                                },
                            })}
                            required
                        />
                        {errors?.password && <div className="text-danger">{errors.password.message}</div>}
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="referralCode" className="col-sm-2 col-form-label">
                        Referral
                    </label>
                    <div className="col-10">
                        <input
                            className="form-control"
                            id="referralCode"
                            type="text"
                            defaultValue={codeRef || ''}
                            placeholder="Referral"
                            {...register('referralCode', {
                                maxLength: {
                                    value: 5,
                                    message: 'Length referral Incorrect',
                                },
                                minLength: {
                                    value: 5,
                                    message: 'Length referral Incorrect',
                                },
                                validate: validateReferralCode,
                            })}
                        />
                        {errors?.referralCode && <div className="text-danger">{errors.referralCode.message}</div>}
                    </div>
                </div>

                <div className={`container-submit`}>
                    <div className={`div-under-container-submit`}>
                        <div className={`container-confidentiality`}>
                            <input
                                className={`input-container-submit`}
                                type="checkbox"
                                id="confidentiality"
                                {...register('confidentiality', { required: 'this is a required' })}
                                required
                            />
                            <p className={`text-container-submit`}>
                                <Trans
                                    i18nKey="form.confidentiality"
                                    t={t}
                                    components={{
                                        link1: <LinkText href="#" title="Terms of Use" />,
                                        link2: <LinkText href="#" title="Privacy Policy" />,
                                    }}
                                />
                            </p>
                        </div>
                        {errors?.confidentiality && <div className="text-danger">{errors.confidentiality.message}</div>}

                        <div className={`container-be-contacted`}>
                            <input
                                className={`input-container-submit`}
                                type="checkbox"
                                id="beContacted"
                                {...register('beContacted')}
                            />
                            <p className={`text-container-submit`}>{t('form.be-contacted')}</p>
                        </div>
                    </div>
                </div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end my-3">
                    <button type="submit" className="btn btn-form px-4 py-3" disabled={isSubmitting}>
                        {isSubmitting && (
                            <div className="spinner-border spinner-border-sm mx-2" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        )}
                        {t('register.register')}
                    </button>
                </div>
            </form>
        </div>
    );
}
