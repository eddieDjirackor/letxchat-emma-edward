import React, { useState } from 'react';
import { Col, Container, Form, Row, Button, Spinner } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { useResetUserMutation } from "../services/appApi";
import { useParams } from "react-router";





function Reset() {

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState('');


    let { id } = useParams();


    const navigate = useNavigate();
    const [resetUser, { isLoading }] = useResetUserMutation();



    function handleReset(e) {
        e.preventDefault();
       
        resetUser
        ({ id, password, confirmPassword }).then(({ data }) => {
            if (data) {
              navigate("/chat");
            }
          });
    }


    function handleCancel (e) {
        navigate('/chat');
      }


    return (
        <Container>
            <Row>
                <Col md={12} className="d-flex align-items-center justify-content-center flex-direction-column">
                    <Form style={{ width: "80%", maxWidth: 300 }} onSubmit={handleReset}>
                        <div id="login-header"><h1 className="text-center">Reset password</h1></div>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" placeholder="Confirm password" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} required />
                        </Form.Group>
                        <div className='button-space'>
                            <Button id='button-me' variant="primary" type="submit" onClick={handleReset}>
                            {isLoading ? <Spinner animation="grow" /> : "Reset"}
                            </Button>
                            <Button variant="danger" type="submit" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default Reset