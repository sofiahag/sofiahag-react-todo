import { useState } from "react";
import { Container, Form, FormGroup, Input, Button, Alert} from "reactstrap";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase.js";

const Register = ({ newTask, setAllTasks, toggle }) => {
    const [email, setEmail] = useState("");
    const [passwordOne, setPasswordOne] = useState("");
    const [passwordTwo, setPasswordTwo] = useState("");
    const [error, setError] = useState(null);

    const onSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        if (passwordOne === passwordTwo) {
            try {
                const res = await createUserWithEmailAndPassword(auth, email, passwordOne);
                const user = res.user;
                setAllTasks([]);
                await addDoc(collection(db, "users"), {
                    uid: user.uid,
                    authProvider: "local",
                    email,
                });
            } catch (error) {
                setError(error.message);
                console.error(error);
            }
        } else {
            setError("The passwords do not match");
        }       
        toggle();
    };

    return (
        <div className="popup max-sm:text-xs">
            <div className="popup-inner">
                <Container>
                    <Form className="ml-auto" onSubmit={onSubmit}>
                    {error && <Alert color="danger">{error}</Alert>}
                    <FormGroup>
                        <label htmlFor="register-email">E-mail</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="E-mail"
                        />
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="register-password-one">Password</label>
                        <Input
                            type="password"
                            name="passwordOne"
                            value={passwordOne}
                            onChange={(event) => setPasswordOne(event.target.value)}
                            placeholder="Password"
                        />
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="register-password-two">Confirm password</label>
                        <Input
                            type="password"
                            name="password"
                            value={passwordTwo}
                            onChange={(event) => setPasswordTwo(event.target.value)}
                            placeholder="Confirm Password"
                        />
                    </FormGroup>
                    <div className="d-flex relative mt-5">
                    <Button type="submit" className="bg-pink-200 rounded-full px-4 py-2 text-black">
                            Sign Up
                    </Button>
                    <button
                        onClick={toggle}
                        className="ml-5 bg-sky-200 rounded-full px-4 py-2 text-black max-sm:mt-1 max-sm:-ml-1"
                    >
                        Close
                    </button>
                    </div>
                    </Form>
                </Container>
            </div>
        </div>
    );
};

export default Register;