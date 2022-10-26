import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./Home.css";

function Home() {
    return (
        <Row>
            <Col md={6} className="home__bg"></Col>
            <Col md={6} className="d-flex flex-direction-column align-items-center justify-content-center">
                <div id='hompage'>
                    <h1>Collaborate and Share With Let<span className='XX'>X</span>Chat</h1>
                    <p>Let<span className='XX'>X</span>Chat makes it easy and fun to stay connected  with your entire team. With Let<span className='XX'>X</span>Chat, you'll get fast,simple, secure messaging and easy teamwork</p>
                    <LinkContainer to="/Signup">
                        <Button id='button-me' variant="success">
                            Signup here<i className="fas fa-comments home-message-icon"></i>
                        </Button>
                    </LinkContainer>
                </div>
            </Col>
        </Row>
    );
}

export default Home;
