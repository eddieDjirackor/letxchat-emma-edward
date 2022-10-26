import React, { useState } from "react";
import { Container, Row, Form, Col, Button } from "react-bootstrap";
import { socket } from "../context/appContext";
import { useForgotUserMutation } from "../services/appApi";

function Forgot() {
  const [email, setEmail] = useState("");
  const [forgotUser] = useForgotUserMutation();

  function handleForgot(e) {
    e.preventDefault();

    forgotUser({ email}).then(({data}) => {
    socket.emit("send email-link");
    })

    alert("Email sent : check your mail");
  }

  function handleResend(e) {
    // <Button variant="new" type="submit" style={{borderColor: 'teal',color:'white', borderRadius:'20px', backgroundColor:'teal'}} onClick={handleResend}>
    //                         Resend
    //                     </Button>

    alert("check email:spam for reset link");
    // localStorage.setItem('email', "enochboispon@gmail.com");
  }

  return (
    <Container>
      <Row>
        <Col
          md={15}
          className="d-flex align-items-center justify-content-center flex-direction-column"
        >
          <Form style={{ width: "80%", maxWidth: 400 }} onSubmit={handleForgot}>
            <div id="login-header">
              <h1 className="text-center">Forgot password</h1>
            </div>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter employee email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </Form.Group>
            <div className="button-space">
              <Button
                id="button-me"
                variant="primary"
                type="submit"
                onChange={handleResend}
              >
                Request reset link
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Forgot;
