import { useAuth } from '@/contexts/AuthContext';
import { getParametersByCode } from '@/services/setting.service';
import { Parameter } from '@/types/Parameter';
import { Trans } from 'react-i18next';
import useSWR from 'swr';
import Loading from '../Loading';

const fetcherParameters: (token: string) => Promise<Parameter[]> = (token) =>
    getParametersByCode('membership#phone', token);

export const MembershipMessage = () => {
    const { token, username } = useAuth();

    const {
        data: parameters,
        error: parametersError,
        isLoading: parametersLoading,
    } = useSWR<Parameter[]>('parameters_membership', () => fetcherParameters(token!));

    if (parametersError) return  <div><Trans i18nKey="profile.loading-error"></Trans></div>;
    if (parametersLoading) return <Loading />;

    return (
        <>
            <div className="card">
                <div className="card-body">
                    <p>
                        {parameters && (
                            <>
                                <Trans
                                    i18nKey="profile.manage-membership.join-us"
                                    components={{ strong: <strong />, u: <u /> }}
                                />
                                <br />
                                <Trans
                                    i18nKey="profile.manage-membership.smart-send"
                                />{' '}
                                :
                                {parameters.map((p) => (
                                    <span> {p.value}</span>
                                ))}
                                <br />
                                <Trans
                                    i18nKey="profile.manage-membership.communication"
                                />{' '}
                                : "New membership {username}"
                            </>
                        )}
                    </p>
                </div>
            </div>
        </>
    );
};
