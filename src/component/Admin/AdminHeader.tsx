import { NavLink } from 'react-router-dom';

function AdminHeader() {
    return (
        <>
            <header className="navbar sticky-top bg-body-tertiary flex-md-nowrap p-0 shadow">
                <NavLink className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" to="/admin">
                    WASB Admin
                </NavLink>
                <ul className="navbar-nav flex-row d-md-none">
                    <li className="nav-item text-nowrap">
                        <button
                            className="nav-link px-3 text-white"
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#sidebarMenu"
                            aria-controls="sidebarMenu"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </li>
                </ul>
            </header>
        </>
    );
}

export default AdminHeader;
