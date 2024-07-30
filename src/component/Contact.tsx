import { useAuth } from '../contexts/AuthContext';

export default function Contact() {
    const { username, roles } = useAuth();

    return (
        <div className="container">
            <h1 className="title mt-4">Page de Contact</h1>
            <h3>your username is : {username}</h3>
            <h3>your roles is : {roles?.join(', ')}</h3>
        </div>
    );
}
