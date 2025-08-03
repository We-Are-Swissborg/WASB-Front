import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPassword } from '@/services/auth.services';
import { useParams } from "react-router";

type IResetPassword = {
    password: string,
    confirmPassword: string
}

export default function ResetPassword() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const params = useParams();

    // getting the event handlers from our custom hook
    const { register, handleSubmit, formState } = useForm<IResetPassword>({ mode: 'onTouched' });
    const { isSubmitting, errors } = formState;

    const onSubmit = async (data: IResetPassword) => {
        try {
            if(data.password !== data.confirmPassword) throw new Error(t('reset-password.password-error'))
                const slug = params.slug;

                if(!slug) throw new Error
                const res = await resetPassword(data.password, slug);
                if(!res) throw new Error

                toast.success(t('reset-password.new-password-saved'));
                navigate('/login', { replace: true });
        } catch(e: unknown) {
            if (e instanceof Error && e.message) return toast.error(e.message); 
            toast.error(t('reset-password.submit-error'));
        }
    };

    return (
        <>
            <section className="vh-100">
                <div className="container">
                    <h1 className="my-5 text-secondary text-center">{t('reset-password.title')}</h1>
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
                                    <p className='text-start'>{t('reset-password.first-paragraph')}</p>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="form-outline mb-4">
                                            <label className="form-label" htmlFor='password'>
                                                {t('reset-password.password-label')}
                                            </label>
                                            <input
                                                className="form-control"
                                                id='password'
                                                type='password'
                                                placeholder={t('reset-password.placeholder-password')}
                                                {...register('password' , {
                                                    required: 'this is a required',
                                                    maxLength: {
                                                        value: 100,
                                                        message: `Max length is 100`,
                                                    },
                                                })}
                                                required
                                            />
                                           {errors?.password && <div className="text-danger">{errors.password.message}</div>}
                                        </div>
                                        <div className="form-outline mb-4">
                                            <label className="form-label" htmlFor='confirmPassword'>
                                                {t('reset-password.confirm-password-label')}
                                            </label>
                                            <input
                                                className="form-control"
                                                id='confirmPassword'
                                                type='password'
                                                placeholder={t('reset-password.placeholder-confirm-password')}
                                                {...register('confirmPassword' , {
                                                    required: 'this is a required',
                                                    maxLength: {
                                                        value: 100,
                                                        message: `Max length is 100`,
                                                    },
                                                })}
                                                required
                                            />
                                           {errors?.confirmPassword && <div className="text-danger">{errors.confirmPassword.message}</div>}
                                        </div>
                                        <div className="d-flex justify-content-between text-center text-lg-start mt-4 pt-2">
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
                                                        <span className="visually-hidden">{t('reset-password.loading')}</span>
                                                    </div>
                                                )}
                                                {t('reset-password.confirm')}
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