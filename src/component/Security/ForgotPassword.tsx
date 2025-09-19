import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { checkEmail, checkUsernameAndEmail } from '@/services/auth.services';

type IForgotPassword = {
    email: string,
    username: string
}

export default function ForgotPassword() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isEmailValid, setIsEmailValid] = useState<boolean>();
    const [email, setEmail] = useState<string>();
    const form = {
        paragraph: isEmailValid ? t('forgot-password.second-paragraph') : t('forgot-password.first-paragraph'),
        htmlFor: isEmailValid ? 'username' : 'email',
        label: isEmailValid ?  t('forgot-password.username-label') : t('forgot-password.email-label'),
        id_input: isEmailValid ? 'username' : 'email',
        type_input: isEmailValid ? 'username' : 'email',
        placeholder_input: isEmailValid ? t('forgot-password.placeholder-username') : t('forgot-password.placeholder-email'),
    }

    // getting the event handlers from our custom hook
    const { register, handleSubmit, resetField, setValue, formState } = useForm<IForgotPassword>({ mode: 'onTouched' });
    const { isSubmitting, errors } = formState;

    const confirmEmail = async (mail: string) => {
        try {
            const res = await checkEmail(mail);
            if(!res) throw new Error;
            setIsEmailValid(res);
        } catch {
            toast.error(t('forgot-password.email-error'));
        }
    };

    const confirmUsernameAndEmail = async (data: IForgotPassword) => {
        try {
            return await checkUsernameAndEmail(data.username, data.email);
        } catch {
            toast.error(t('forgot-password.username-error'));
        }
    };

    const onCancel = async () => {
        setIsEmailValid(false);
        setValue('username', '');
        setValue('email', email!);
    };

    const onSubmit = async (data: IForgotPassword) => {
        try {
            if(data.email && !data.username) {
                await confirmEmail(data.email);
                setEmail(data.email);
                resetField('email');
            }
            if(data.username && email) {
                const userInfo = {email, 'username': data.username};

                const res = await confirmUsernameAndEmail(userInfo);
                if(res) {
                    navigate('/login', { replace: true });
                    toast.success(t('forgot-password.link-send'));
                }
            }
        } catch {
            toast.error(t('forgot-password.submit-error'));
        }
    };

    return (
        <>
            <section className="vh-100">
                <div className="container">
                    <h1 className="my-5 text-secondary text-center">{t('forgot-password.title')}</h1>
                    <div className="card text-center">
                        <div className="card-body">
                            <div className="row d-flex justify-content-center align-items-center h-100">
                                <div className="col-md-9 col-lg-6 col-xl-5">
                                    <img
                                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                                        className="img-fluid"
                                        alt="Forgot password"
                                    ></img>
                                </div>
                                <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                                    <p className='text-start'>{form.paragraph}</p>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="form-outline mb-4">
                                            <label className="form-label" htmlFor={form.htmlFor}>
                                                {form.label}
                                            </label>
                                            <input
                                                className="form-control"
                                                id={form.id_input}
                                                type={form.type_input}
                                                placeholder={form.placeholder_input}
                                                {...register(isEmailValid ? 'username' : 'email' , {
                                                    required: 'this is a required',
                                                    maxLength: {
                                                        value: 100,
                                                        message: `Max length is 100`,
                                                    },
                                                })}
                                                required
                                            />
                                            {
                                                errors?.email ?
                                                <div className="text-danger">{errors.email.message}</div> :
                                                <div className="text-danger">{errors.username?.message}</div>
                                            }
                                        </div>

                                        <div className="d-flex justify-content-between text-center text-lg-start mt-4 pt-2">
                                            { isEmailValid && 
                                                <button
                                                    type="button"
                                                    className="btn btn-cancel px-4 py-3"
                                                    onClick={onCancel}
                                                >
                                                    {t('forgot-password.cancel')}
                                                </button>
                                            }
                                            <button
                                                type="submit"
                                                className="btn btn-form px-4 py-3"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting && (
                                                    <div
                                                        className="spinner-border spinner-border-sm mx-2"
                                                        role="status"
                                                    >
                                                        <span className="visually-hidden">{t('forgot-password.loading')}</span>
                                                    </div>
                                                )}
                                                {t('forgot-password.confirm')}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}