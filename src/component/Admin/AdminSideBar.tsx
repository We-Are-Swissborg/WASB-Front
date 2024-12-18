import {
    PeopleTwoTone,
    DashboardTwoTone,
    CategoryTwoTone,
    ArticleTwoTone,
    LoyaltyTwoTone,
    SettingsTwoTone,
    ExitToAppTwoTone,
    AttachMoneyTwoTone,
} from '@mui/icons-material';
// import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
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
                                <DashboardTwoTone /> Dashboard
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link d-flex align-items-center gap-2 active" to="/admin/category">
                                <CategoryTwoTone /> Categories
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link d-flex align-items-center gap-2 active" to="/admin/posts">
                                <ArticleTwoTone /> Posts
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link d-flex align-items-center gap-2 active" to="/admin/users">
                                <PeopleTwoTone /> Users
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className="nav-link d-flex align-items-center gap-2 active"
                                to="/admin/memberships"
                            >
                                <LoyaltyTwoTone /> Memberships
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className="nav-link d-flex align-items-center gap-2 active"
                                to="/admin/contributions"
                            >
                                <AttachMoneyTwoTone /> Contributions
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link d-flex align-items-center gap-2 active" to="/admin/settings">
                                <SettingsTwoTone /> Settings
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link d-flex align-items-center gap-2 active" to="/">
                                <ExitToAppTwoTone /> Return to website
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}
