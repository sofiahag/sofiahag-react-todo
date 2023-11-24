import { useState } from "react";
import { Container, Form, FormGroup, Input, Button } from "reactstrap";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";

const Login = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
                    <Form className="ml-auto">
                    {error && <p style={{ color: "red" }}>{error}</p>}
                        <FormGroup>
                            <label htmlFor="login-email">E-mail</label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="E-mail"
                            />
                        </FormGroup>
                        <FormGroup>
                            <label htmlFor="login-password">Password</label>
                            <Input
                                type="password"
                                name="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Password"
                            />
                        </FormGroup>
                    </Form>
                    <Button type="button" className="bg-pink-200 rounded-full px-4 py-2 text-black" onClick={handleLogin}>Log in</Button>
                    <button onClick={props.toggle} className="ml-3 bg-sky-200 rounded-full px-4 py-2 
                        text-black max-sm:mt-1 max-sm:-ml-1">Close</button>
                </Container>
            </div>
        </div>
    );
};

export default Login;
