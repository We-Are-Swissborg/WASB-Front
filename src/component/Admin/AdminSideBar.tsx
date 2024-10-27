import { NavLink } from 'react-router-dom';

export default function AdminSideBar() {
    return (
        <div className="sidebar border border-right col-md-3 col-lg-2 col-xxl-1 p-0 bg-body-tertiary">
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
                            <NavLink className="nav-link d-flex align-items-center gap-2 active" to="/admin/category">
                                <i className="fa-solid fa-blog"></i> Posts
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link d-flex align-items-center gap-2 active" to="/admin/users">
                                <i className="fa-duotone fa-solid fa-users"></i> Users
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
