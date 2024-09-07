import { useCallback, useEffect, useState } from 'react';
import { User } from '@/types/User';
import { NavLink, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Role from '@/types/Role';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { t } from 'i18next';
import CountrySelect from '@/component/Form/CountrySelect';
import Countries from '@/hook/Countries';
import { OptionsCountrySelect, OptionsSelect } from '@/types/OptionsSelect';
import Select from '@/component/Form/SelectForm';
import { getUserWithAllInfo, updateUser } from '@/administration/services/userAdmin.service';

function AdminUserEdit() {
    const [user, setUser] = useState<User>();
    const { token } = useAuth();
    const { id } = useParams();
    const [isInitializing, setIsInitializing] = useState<boolean>(false);
    const { register, handleSubmit, control, formState } = useForm<User>({
        mode: 'onTouched',
        values: user,
    });
    const { isSubmitting, errors, isDirty, isValid } = formState;

    const initUser = useCallback(async () => {
        if (id) {
            try {
                const u = await getUserWithAllInfo(Number(id), token!);
                setUser(u);
            } catch (e) {
                toast.error(`Erreur lors du chargement de l'utisateur`);
                console.log('ERROR: get user', e);
            } finally {
                setIsInitializing(true);
            }
        }
    }, [id, token]);

    useEffect(() => {
        initUser();
    }, [initUser]);

    const countriesOptions: OptionsCountrySelect[] = Countries().map((item) => ({
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
        { value: 'other', name: 'Other' },
    ];

    const contributionOptions: OptionsSelect[] = [
        { value: '1', name: '30 CHF/3mois' },
        { value: '2', name: '60 CHF/6mois' },
        { value: '3', name: '100 CHF/1an' },
    ];

    const contributionStatusOptions: OptionsSelect[] = [
        { value: 'no adherent', name: 'no adherent' },
        { value: 'in progress', name: 'in progress' },
        { value: 'adherent', name: 'adherent' },
        { value: 'not accepted', name: 'not accepted' },
    ];

    const onSubmit = async (data: User) => {
        if (isDirty && isValid) {
            try {
                console.info('form submit', data);
                await updateUser(data.id, token!, data);
                toast.success(t('profile.success-update'));
            } catch (e) {
                toast.error(t('register.error'));
            }
        }
    };

    if (!isInitializing) {
        return <div>Loading</div>;
    }

    return (
        <div className="container-fluid">
            <header className="row">
                <h2 className="title mt-3">
                    {user?.username} <span className="badge text-bg-secondary">{user?.id}</span>
                </h2>
            </header>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset key={1} className="row g-3">
                        <legend>User info</legend>
                        <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                            <label htmlFor="username" className="form-label">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                className="form-control"
                                {...register('username', {
                                    value: user?.username,
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
                        <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                {...register('email', {
                                    required: 'this is a required',
                                })}
                                required
                            />
                            {errors?.email && <div className="text-danger">{errors.email.message}</div>}
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                            <label htmlFor="firstName" className="form-label">
                                Firstname
                            </label>
                            <input type="text" id="firstName" className="form-control" {...register('firstName')} />
                            {errors?.firstName && <div className="text-danger">{errors.firstName.message}</div>}
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                            <label htmlFor="lastName" className="form-label">
                                Lastname
                            </label>
                            <input type="text" id="lastName" className="form-control" {...register('lastName')} />
                            {errors?.lastName && <div className="text-danger">{errors.lastName.message}</div>}
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                            <Controller
                                name="country"
                                control={control}
                                render={({ field }) => (
                                    <CountrySelect {...field} options={countriesOptions} label="Select your country" />
                                )}
                            />
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                            <label htmlFor="city" className="form-label">
                                City
                            </label>
                            <input type="text" id="city" className="form-control" {...register('city')} />
                            {errors?.city && <div className="text-danger">{errors.city.message}</div>}
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                            <label htmlFor="walletAddress" className="form-label">
                                Wallet
                            </label>
                            <input
                                type="text"
                                id="walletAddress"
                                className="form-control"
                                {...register('walletAddress')}
                            />
                            {errors?.walletAddress && <div className="text-danger">{errors.walletAddress.message}</div>}
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                            <Controller
                                name="aboutUs"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={aboutUsOptions}
                                        isOptionNone={true}
                                        label="How did you hear about the association ?"
                                    />
                                )}
                            />
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                            <label htmlFor="referralCode" className="form-label">
                                Referral Code
                            </label>
                            <input
                                type="text"
                                id="referralCode"
                                className="form-control"
                                {...register('referralCode')}
                            />
                            {errors?.referralCode && <div className="text-danger">{errors.referralCode.message}</div>}
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                            <div className="form-check form-switch">
                                <label className="form-check-label" htmlFor="beContacted">
                                    Be Contacted
                                </label>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="beContacted"
                                    {...register('beContacted')}
                                />
                            </div>
                        </div>
                    </fieldset>
                    <fieldset key={2} className="row g-3">
                        <legend>Roles</legend>
                        <div className="col-auto mb-3">
                            {(Object.keys(Role) as (keyof typeof Role)[]).map((key) => {
                                return (
                                    <div key={`role-${key}`} className="form-check form-check-inline">
                                        <label className="form-check-label" htmlFor={key}>
                                            {key}
                                        </label>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={key}
                                            value={Role[key]}
                                            {...register('roles')}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </fieldset>
                    <fieldset key={3} className="row g-3">
                        <legend>Social Medias</legend>
                        <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                            <label htmlFor="twitter" className="form-label">
                                Twitter
                            </label>
                            <input
                                type="text"
                                id="twitter"
                                className="form-control"
                                {...register('socialMedias.twitter')}
                            />
                            {errors?.socialMedias?.twitter && (
                                <div className="text-danger">{errors?.socialMedias?.twitter.message}</div>
                            )}
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                            <label htmlFor="discord" className="form-label">
                                Discord
                            </label>
                            <input
                                type="text"
                                id="discord"
                                className="form-control"
                                {...register('socialMedias.discord')}
                            />
                            {errors?.socialMedias?.discord && (
                                <div className="text-danger">{errors?.socialMedias?.discord.message}</div>
                            )}
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                            <label htmlFor="tiktok" className="form-label">
                                Tiktok
                            </label>
                            <input
                                type="text"
                                id="tiktok"
                                className="form-control"
                                {...register('socialMedias.tiktok')}
                            />
                            {errors?.socialMedias?.tiktok && (
                                <div className="text-danger">{errors?.socialMedias?.tiktok.message}</div>
                            )}
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                            <label htmlFor="telegram" className="form-label">
                                Telegram
                            </label>
                            <input
                                type="text"
                                id="telegram"
                                className="form-control"
                                {...register('socialMedias.telegram')}
                            />
                            {errors?.socialMedias?.telegram && (
                                <div className="text-danger">{errors?.socialMedias?.telegram.message}</div>
                            )}
                        </div>
                    </fieldset>

                    <fieldset key={5} className="row g-3">
                        <legend>Manage membership</legend>
                        <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                            <Controller
                                name="membership.contributionStatus"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} options={contributionStatusOptions} label="Status" />
                                )}
                            />
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                            <Controller
                                name="membership.contribution"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={contributionOptions}
                                        label="Contribution"
                                        isOptionNone={true}
                                    />
                                )}
                            />
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                            <label htmlFor="dateContribution" className="form-label">
                                Date Contribution
                            </label>
                            <input
                                type="date"
                                id="dateContribution"
                                className="form-control"
                                {...register('membership.dateContribution')}
                            />
                            {errors?.membership?.dateContribution && (
                                <div className="text-danger">{errors?.membership?.dateContribution.message}</div>
                            )}
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                            <label htmlFor="endDateContribution" className="form-label">
                                End Contribution
                            </label>
                            <input
                                type="date"
                                id="endDateContribution"
                                className="form-control"
                                {...register('membership.endDateContribution')}
                            />
                            {errors?.membership?.endDateContribution && (
                                <div className="text-danger">{errors?.membership?.endDateContribution.message}</div>
                            )}
                        </div>
                    </fieldset>

                    <button type="submit" className="btn btn-success">
                        {isSubmitting && (
                            <div className="spinner-border spinner-border-sm mx-2" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        )}
                        Submit
                    </button>
                </form>
            </div>

            <NavLink to="/admin/users" className={`btn btn-primary mb-4`}>
                <i className="fa fa-arrow-left"></i> Return to list
            </NavLink>
        </div>
    );
}

export default AdminUserEdit;
