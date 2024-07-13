import { Trans, useTranslation } from "react-i18next";
import Registration from '../types/Registration';
import '../css/Form.css';
import { LinkText } from "../hook/LinksTranslate";
import { useForm  } from 'react-hook-form';
import { register } from "../services/user.service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const registration = async (data: Registration) => {
    await register(data);
};

export default function Register() {
    const {t} = useTranslation("global");
    const navigate = useNavigate();

    // getting the event handlers from our custom hook
    const { register, handleSubmit, formState } = useForm<Registration>({mode: 'onTouched'});
    const { isSubmitting, errors } = formState;

    const onSubmit = async (data: Registration) => {
        try {
            await registration(data);
            toast.success(t('register.welcome'));
            navigate('/', { replace: true });
        } catch(e) {
            toast.error(t('register.error'));
        }
    };

    return(
        <div className="container d-flex flex-column align-items-center">
            <h1 className="my-5 text-secondary">{t('register.title')}</h1>
            <p className="text-center">{t('register.message')}</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row mb-3">
                    <label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
                    <div className="col-10">
                        <input
                            className="form-control"
                            id='email'
                            type='email'
                            placeholder='Email'
                            {...register('email', {
                                required: 'this is a required',
                                maxLength: {
                                    value: 100,
                                    message: `Max length is 100`,
                                },
                            })}
                            required
                        />
                        {errors?.email && <div className="text-danger">{errors.email.message}</div >}
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="pseudo" className="col-sm-2 col-form-label">Pseudo</label>

                    <div className="col-10">
                        <input
                            className="form-control"
                            id='pseudo'
                            type='text'
                            placeholder='Pseudo'
                            {...register('pseudo', { required: 'this is a required',
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
                        {errors?.pseudo && <div className="text-danger">{errors.pseudo.message}</div >}
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="password" className="col-sm-2 col-form-label">Password</label>
                    <div className="col-10">
                        <input
                            className="form-control"
                            id='password'
                            type='password'
                            placeholder='Password'
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
                        {errors?.password && <div className="text-danger">{errors.password.message}</div >}
                    </div>
                </div>

                <div className={`container-submit`}>
                    <div className={`div-under-container-submit`}>
                        <div className={`container-confidentiality`}>
                            <input
                                className={`input-container-submit`}
                                type='checkbox'
                                id='confidentiality'
                                {...register('confidentiality', { required: 'this is a required' })}
                                required
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
                        {errors?.confidentiality && <div className="text-danger">{errors.confidentiality.message}</div >}

                        <div className={`container-be-contacted`}>
                            <input
                                className={`input-container-submit`}
                                type='checkbox'
                                id='beContacted'
                                {...register('beContacted')}
                            />
                            <p className={`text-container-submit`}>
                                {t('form.be-contacted')}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end my-3">
                    <button type='submit' className="btn btn-form px-4 py-3" disabled={isSubmitting}>
                        {isSubmitting &&
                        <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        }
                        {t("register.register")}
                    </button>
                </div>
            </form>
        </div>
    );
}
