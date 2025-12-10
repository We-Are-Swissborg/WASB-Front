import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { passwordForget } from '@/services/auth.services';

type IForgotPassword = {
    email: string,
    username: string
}

export default function ForgotPassword() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    // getting the event handlers from our custom hook
    const { register, handleSubmit, formState } = useForm<IForgotPassword>({ mode: 'onTouched' });
    const { isSubmitting, errors } = formState;

    const onSubmit = async (data: IForgotPassword) => {
        try {
            const res = await passwordForget(data.email, i18n.language);

            if(!res) throw new Error

            navigate('/login', { replace: true });
            toast.success(t('forgot-password.link-send'));
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
                                    <p className='text-start'>{t('forgot-password.first-paragraph')}</p>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="form-outline mb-4">
                                            <label className="form-label" htmlFor='email'>
                                                {t('forgot-password.email-label')}
                                            </label>
                                            <input
                                                className="form-control"
                                                id='email'
                                                type='email'
                                                placeholder={t('forgot-password.placeholder-email')}
                                                {...register('email' , {
                                                    required: 'this is a required',
                                                    maxLength: {
                                                        value: 100,
                                                        message: `Max length is 100`,
                                                    },
                                                })}
                                                required
                                            />
                                            <div className="text-danger">{errors.email?.message}</div>
                                        </div>
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