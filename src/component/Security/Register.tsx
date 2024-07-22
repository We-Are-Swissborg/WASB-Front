import { Trans, useTranslation } from 'react-i18next';
import Registration from '../../types/Registration';
import '../../css/Form.css';
import { LinkText } from '../../hook/LinksTranslate';
import { useForm } from 'react-hook-form';
import { checkReferralExist, register } from '../../services/user.service';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const registration = async (data: Registration) => {
    await register(data);
};

export default function Register() {
    const { t } = useTranslation('global');
    const navigate = useNavigate();
    const { codeRef } = useParams();
    const [referralCode, setReferralCode] = useState(localStorage.getItem('codeRef') || '');

    // getting the event handlers from our custom hook
    const { register, handleSubmit, formState } = useForm<Registration>({ mode: 'onTouched' });
    const { isSubmitting, errors } = formState;

    const onSubmit = async (data: Registration) => {
        try {
            await registration(data);
            localStorage.removeItem('codeRef');
            navigate('/', { replace: true });
        } catch (e) {
            toast.error(t('register.error'));
        }
    };

    // TODO: execute la requête à chaque touche/clique cellule.
    // Comment être sur que sera toujours 5 comme valeur ?
    const validateReferralCode = async (value: string): Promise<boolean> => {
        try {
            if (value.length === 5) {
                const response = await checkReferralExist(value);
                return !!response;
            }
        } catch {
            toast.error(t('register.referral-error'));
        } finally {
            return false;
        }
    };

    useEffect(() => {
        if (codeRef && codeRef !== referralCode) {
            checkReferralExist(codeRef)
                .then(() => {
                    localStorage.setItem('codeRef', `${codeRef}`);
                    setReferralCode(codeRef);
                })
                .catch(() => {
                    toast.error(t('register.referral-error'));
                });
        }
    }, [codeRef, referralCode, t]);

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
                            defaultValue={codeRef || referralCode}
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
