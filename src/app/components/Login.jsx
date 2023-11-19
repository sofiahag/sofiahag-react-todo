import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";
import { Container, Form, FormGroup, Input, Button } from "reactstrap";

const Login = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            setError(error.message);
        }
        props.toggle();
    };

    return (
        <div className="popup max-sm:text-xs">
            <div className="popup-inner">
                <Container>
                    <Form className="ml-auto" onSubmit={handleLogin}>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                        <FormGroup>
                            <Input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="Email"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Input
                                type="password"
                                name="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Password"
                            />
                        </FormGroup>
                    </Form>
                    <button onClick={props.toggle} className="bg-sky-200 rounded-full px-4 py-2 
                        text-black max-sm:mt-1 max-sm:-ml-1">Close</button>
                </Container>
            </div>
        </div>
    );
};

export default Login;
