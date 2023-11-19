import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase.js";
import { Container, Form, FormGroup, Input, Button, Alert} from 'reactstrap';

const Register = (props) => {
    const [email, setEmail] = useState('');
    const [passwordOne, setPasswordOne] = useState('');
    const [passwordTwo, setPasswordTwo] = useState('');
    const [error, setError] = useState(null);

    const onSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        if (passwordOne === passwordTwo) {
            try {
            const res = await createUserWithEmailAndPassword(auth, email, passwordOne);
            const user = res.user;
            await addDoc(collection(db, 'users'), {
                uid: user.uid,
                authProvider: 'local',
                email,
            });
            } catch (error) {
                alert(error.message);
                console.error(error);
            }
        } else {
            setError('The passwords do not match');
        }
        props.toggle();
        };

    return (
        <div className="popup max-sm:text-xs">
            <div className="popup-inner">
                <Container>
                    <Form className="ml-auto" onSubmit={onSubmit}>
                    {error && <Alert color="danger">{error}</Alert>}
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
                            name="passwordOne"
                            value={passwordOne}
                            onChange={(event) => setPasswordOne(event.target.value)}
                            placeholder="Password"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Input
                            type="password"
                            name="password"
                            value={passwordTwo}
                            onChange={(event) => setPasswordTwo(event.target.value)}
                            placeholder="Confirm Password"
                        />
                    </FormGroup>
                </Form>
                <Button className="bg-pink-200 rounded-full px-4 py-2 text-black">Sign Up</Button>
                <button onClick={props.toggle} className="ml-3 bg-sky-200 rounded-full px-4 py-2 
                    text-black max-sm:mt-1 max-sm:-ml-1">Close</button>
                </Container>
            </div>
        </div>
    );
};

export default Register;
