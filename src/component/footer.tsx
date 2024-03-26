import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

export default function Footer() {
    const [t] = useTranslation("global");
    const backToUp = useRef(null);

    useEffect(() => {
        // if (
        //     document.body.scrollTop > 5 ||
        //     document.documentElement.scrollTop > 5
        //   ) {
        //     const el  = backToUp.current;
        //     // el.style.display = "block";
        //   } else {
        //     const el = backToUp.current;
        //     // backToUp.style.display = "none";
        //   }
    }, []);

 return (
    <footer className="text-muted py-5 bg-primary">
        <div className="container"  style={{color: "#FFF"}}>
            <button ref={backToUp}
                    type="button"
                    className="btn btn-danger btn-floating btn-lg"
                    id="btn-back-to-top"
                    onClick={() => window.scrollTo(0, 0)}
                    >
                <i className="fas fa-arrow-up"></i>
            </button>
            <p className="mb-3">{t("footer.message")}</p>
            <div className="row">
                <div className="col-6 col-md-2 mb-3">
                    <h5>{t("footer.subtitle")}</h5>
                    <ul className="nav flex-column">
                        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 link-light">{t("footer.whoarewe")}</a></li>
                        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 link-light">{t("footer.team")}</a></li>
                        <li className="nav-item mb-2"><NavLink className="nav-link p-0 link-light" to="/contact">{t("footer.contact")}</NavLink></li>
                        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 link-light">{t("footer.donation")}</a></li>
                    </ul>
                </div>
                <div className="col">
                    <h5>{t("footer.join")}</h5>
                    <ul className="list-group list-group-horizontal">
                        <li className="list-group-item">
                            <a href="#"><i className="fa-brands fa-x-twitter fa-2x"></i></a>
                        </li>
                        <li className="list-group-item">
                            <a href='https://discord.gg/hCekNVzGSM' target='_blank'><i className="fa-brands fa-discord fa-2x"></i></a>
                        </li>
                        <li className="list-group-item">
                            <a href="#"><i className="fa-brands fa-youtube fa-2x"></i></a>
                        </li>
                        <li className="list-group-item">
                            <a href="#"><i className="fa-brands fa-facebook fa-2x"></i></a>
                        </li>
                        <li className="list-group-item">
                            <a href="#"><i className="fa-brands fa-twitch fa-2x"></i></a>
                        </li>
                    </ul>
                </div>
                <div className="col-md-5 offset-md-1 mb-3">
                    <form>
                        <h5>Subscribe to our newsletter</h5>
                        <p>Monthly digest of what's new and exciting from us.</p>
                        <div className="d-flex flex-column flex-sm-row w-100 gap-2">
                            <label htmlFor="newsletter1" className="visually-hidden">Email address</label>
                            <input id="newsletter1" type="text" className="form-control" placeholder="Email address" disabled />
                            <button className="btn btn-secondary" type="button" disabled>Subscribe</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
                <p>© 2024 WeAreSwissborg, Inc. All rights reserved.</p>
                <ul className="list-unstyled d-flex">
                    <li className="ms-3"><a className="link-light" href="#"><i className="fa-brands fa-x-twitter"></i></a></li>
                    <li className="ms-3"><a className="link-light" href='https://discord.gg/hCekNVzGSM' target='_blank'><i className="fa-brands fa-discord"></i></a></li>
                    <li className="ms-3"><a className="link-light" href="#"><i className="fa-brands fa-youtube"></i></a></li>
                    <li className="ms-3"><a className="link-light" href="#"><i className="fa-brands fa-facebook"></i></a></li>
                    <li className="ms-3"><a className="link-light" href="#"><i className="fa-brands fa-twitch"></i></a></li>
                </ul>
            </div>
        </div>
    </footer>
 );
}