import Register from '../component/Register.tsx';
import Setting from '../component/Setting.tsx';

export default function PrivateRoutes () {
    const pathname: string = window.location.pathname;
    
    const redirectToHome = () => window.location.replace(`${window.location.protocol}//${window.location.host}`);
    const checkPathName = (route: string) => pathname.includes(route);

    const memberOrJustCertified = () => {
        try {
            let certified: boolean = false;
            let member: string = '';

            certified = JSON.parse(localStorage.getItem('accountCertified') || JSON.stringify(''));
            member = localStorage.getItem('token') || '';

            return {certified, member};
        } catch {
            redirectToHome();
        }
    };

    const elementToDisplay = () => {
        const routes = memberOrJustCertified();

        if(routes?.certified && !routes.member && checkPathName('register')) return <Register />;
        else if(routes?.certified && !!routes?.member && checkPathName('setting')) return <Setting />;
        redirectToHome();
    };

    return (
        elementToDisplay()
    );
}