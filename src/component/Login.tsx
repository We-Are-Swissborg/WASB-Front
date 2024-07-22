import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User } from '../types/User';
import { auth } from '../services/auth.services';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const authenticate = async (data: User): Promise<string> => {
    const { username, password } = data;
    return await auth(username, password);
};

export default function Login() {
    const { t } = useTranslation('global');
    const navigate = useNavigate();
    const { setToken } = useContext(AuthContext);

    // getting the event handlers from our custom hook
    const { register, handleSubmit, formState } = useForm<User>({ mode: 'onTouched' });
    const { isSubmitting, errors } = formState;

    const onSubmit = async (data: User) => {
        try {
            const token = await authenticate(data);
            setToken(token);
            toast.success(t('authenticate.welcome'));
            navigate('/', { replace: true });
        } catch (e) {
            toast.error(t('authenticate.error'));
        }
    };

    return (
        <>
            <section className="vh-100">
                <div className="container">
                    <h1 className="my-5 text-secondary text-center">{t('authenticate.title')}</h1>
                    <div className="card text-center">
                        <div className="card-body">
                            <div className="row d-flex justify-content-center align-items-center h-100">
                                <div className="col-md-9 col-lg-6 col-xl-5">
                                    <img
                                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                                        className="img-fluid"
                                        alt="Login"
                                    ></img>
                                </div>
                                <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="form-outline mb-4">
                                            <label className="form-label" htmlFor="username">
                                                {t('authenticate.username')}
                                            </label>
                                            <input
                                                className="form-control"
                                                id="username"
                                                type="text"
                                                placeholder={t('authenticate.placeholder-username')}
                                                {...register('username', {
                                                    required: 'this is a required',
                                                    maxLength: {
                                                        value: 100,
                                                        message: `Max length is 100`,
                                                    },
                                                })}
                                                required
                                            />
                                            {errors?.username && (
                                                <div className="text-danger">{errors.username.message}</div>
                                            )}
                                        </div>

                                        <div className="form-outline mb-3">
                                            <label className="form-label" htmlFor="password">
                                                {t('authenticate.password')}
                                            </label>
                                            <input
                                                className="form-control"
                                                id="password"
                                                type="password"
                                                placeholder={t('authenticate.placeholder-password')}
                                                {...register('password', {
                                                    required: 'this is a required',
                                                    maxLength: {
                                                        value: 100,
                                                        message: `Max length is 100`,
                                                    },
                                                })}
                                                required
                                            />
                                            {errors?.password && (
                                                <div className="text-danger">{errors.password.message}</div>
                                            )}
                                        </div>

                                        <div className="text-center text-lg-start mt-4 pt-2">
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
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                )}
                                                {t('authenticate.login')}
                                            </button>
                                            <p className="small fw-bold mt-2 pt-1 mb-0">
                                                <Trans
                                                    i18nKey="authenticate.sign-up"
                                                    t={t}
                                                    components={{
                                                        link1: <NavLink className="link-danger" to="/register" />,
                                                    }}
                                                />
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
