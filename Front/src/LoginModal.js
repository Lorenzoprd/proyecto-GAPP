import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import './LoginModal.css';

function Login({ setSignup, closeModal }) {
    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');

    const isLoggedIn = useSelector((s) => !!s.user);

    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:4000/api/users/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
            const data = await res.json();
            dispatch({ type: 'LOGIN', user: data });
            closeModal();
        } else {
            const error = new Error('Error de registro, valida tu usuario');
            console.log(error.stack);
            alert(error);
        }
    };

    if (isLoggedIn) {
        return <Redirect to="/" />;
    }

    return (
        <div className="login">
            <h1>Login</h1>
            <form className="login-form" onSubmit={handleLogin}>
                <input
                    name="email"
                    placeholder="Escribe tu email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="button-login">Entrar</button>
                <p className="no-account">
                    Aún no tienes cuenta?
                    <button
                        className="button-signup"
                        type="button"
                        onClick={() => setSignup(true)}
                    >
                        Regístrate
                    </button>
                </p>
            </form>
        </div>
    );
}

function SignUp({ setSignup, closeModal }) {
    const [name_user, setName_user] = useState('');

    const [password_user, setPassword_user] = useState('');

    const [repeatedPassword, setRepeatedPassword] = useState('');

    const [email, setEmail] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        const reg = await fetch('http://localhost:4000/api/users/register', {
            method: 'POST',
            body: JSON.stringify({
                name_user,
                email,
                password_user,
                repeatedPassword,
            }),
            headers: { 'Content-Type': 'application/json' },
        });
        if (reg.ok) {
            closeModal();
        }
    };

    return (
        <div className="register">
            <h1>Regístrate</h1>
            <form className="register-form" onSubmit={handleRegister}>
                <label>
                    <input
                        placeholder="Nombre de Usuario..."
                        onChange={(e) => setName_user(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <input
                        placeholder="Escribe tu Email..."
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <input
                        placeholder="Contraseña mayor a 5 dígitos..."
                        onChange={(e) => setPassword_user(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <input
                        placeholder="Repite tu contraseña..."
                        onChange={(e) => setRepeatedPassword(e.target.value)}
                        required
                    />
                </label>
                <button className="register-button">Registrar</button>
                <p className="yes-account">
                    Ya tienes cuenta?
                    <button
                        className="register-login-button"
                        type="button"
                        onClick={() => setSignup(false)}
                    >
                        Inicia sesión
                    </button>
                </p>
            </form>
        </div>
    );
}

function LoginModal({ closeModal }) {
    const [isSignup, setSignup] = useState(false);

    return (
        <div className="modal-bg" onClick={closeModal}>
            <div className="modal-fg" onClick={(e) => e.stopPropagation()}>
                {!isSignup && (
                    <Login setSignup={setSignup} closeModal={closeModal} />
                )}
                {isSignup && (
                    <SignUp setSignup={setSignup} closeModal={closeModal} />
                )}
            </div>
        </div>
    );
}

export default LoginModal;