import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { User } from '../../types/User';
import AccountFom from '../Form/AccountForm';
import { NavLink, useParams } from 'react-router-dom';
import { getUserWithAllInfo, patchUser } from '../../services/user.service';
import { useAuth } from '../../contexts/AuthContext';
import MembershipForm from '../Form/MembershipForm';
import SocialMediasForm from '../Form/SocialMediasForm';
import Role from '../../types/Role';

function AdminUserEdit() {
    const [user, setUser] = useState<User>();
    const { token } = useAuth();
    const { id } = useParams();
    const [selectedRoles, setSelectedRoles] = useState<Array<Role>>([]);
    const [isInit, setIsInit] = useState(false);

    const initUser = useCallback(async () => {
        if (id) {
            const u = await getUserWithAllInfo(Number(id), token!);
            setUser(u);
            setSelectedRoles(u.roles);
            setIsInit(true);
        }
    }, [token]);

    useEffect(() => {
        initUser();
    }, [initUser]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const role = event.target.value as Role;
        const isChecked = event.target.checked;

        setSelectedRoles((prevSelectedRoles) =>
            isChecked ? [...prevSelectedRoles, role] : prevSelectedRoles.filter((r) => r !== role),
        );
    };

    useEffect(() => {
        if (user && token) {
            if (user.roles != selectedRoles) {
                const patch: Partial<User> = {
                    roles: selectedRoles,
                };
                patchUser(user.id, token, patch);
            }
        }
    }, [selectedRoles]);

    const isRoleSelected = (role: Role): boolean => {
        return selectedRoles.includes(role);
    };

    return (
        <div className="container">
            <header className="row">
                <h2 className="title">Update user : {user?.username}</h2>
                <form>
                    <h4>Roles : </h4>

                    {isInit &&
                        (Object.keys(Role) as (keyof typeof Role)[]).map((key) => {
                            return (
                                <div className="form-check form-check-inline">
                                    <label className="form-check-label" htmlFor={key}>
                                        {key}
                                    </label>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={key}
                                        value={Role[key]}
                                        name="roles"
                                        defaultChecked={isRoleSelected(Role[key])}
                                        onChange={handleChange}
                                    />
                                </div>
                            );
                        })}
                </form>
            </header>
            <div className="row">
                <AccountFom user={user} setUser={setUser} />
                <MembershipForm membership={user?.membership} />
                <SocialMediasForm socialMedias={user?.socialMedias} setUser={setUser} user={user} />
            </div>

            <NavLink to="/admin/users" className={`btn btn-primary`}>
                <i className="fa fa-arrow-left"></i> Return to list
            </NavLink>
        </div>
    );
}

export default AdminUserEdit;
