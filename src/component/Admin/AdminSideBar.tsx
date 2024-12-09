import { NavLink } from 'react-router-dom';

export default function AdminSideBar() {
    return (
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0">
            <nav
                className="offcanvas-md offcanvas-end bg-body-tertiary"
                tabIndex={-1}
                id="sidebarMenu"
                aria-labelledby="sidebarMenuLabel"
            >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="sidebarMenuLabel">
                        WASB Admin
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                        data-bs-target="#sidebarMenu"
                        aria-label="Close"
                    ></button>
                </div>
                <div className="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <NavLink className="nav-link d-flex align-items-center gap-2 active" to="/admin">
                                <i className="fa-duotone fa-solid fa-house"></i> Dashboard
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link d-flex align-items-center gap-2 active" to="/admin/category">
                                <i className="fa-solid fa-list"></i> Categories
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link d-flex align-items-center gap-2 active" to="/admin/posts">
                                <i className="fa-solid fa-blog"></i> Posts
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link d-flex align-items-center gap-2 active" to="/admin/users">
                                <i className="fa-duotone fa-solid fa-users"></i> Users
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className="nav-link d-flex align-items-center gap-2 active"
                                to="/admin/memberships"
                            >
                                <i className="fa-duotone fa-solid fa-id-badge "></i> Memberships
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className="nav-link d-flex align-items-center gap-2 active"
                                to="/admin/contributions"
                            >
                                <i className="fa-duotone fa-solid fa-shopping-cart"></i> Contributions
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link d-flex align-items-center gap-2 active" to="/admin/settings">
                                <i className="fa-duotone fa-solid fa-gear"></i> Settings
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link d-flex align-items-center gap-2 active" to="/">
                                <i className="fa-solid fa-right-from-bracket"></i> Return to website
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}
