import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row,Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import "./MessageForm.css";
// import { useParams } from "react-router";









function MessageForm() {
    const [message, setMessage] = useState("");
    const [file, setFile] = useState("");
    const [url, setUrl] = useState("");
    const [modalShow, setModalShow] = useState(false);

    // let { id } = useParams();


    const user = useSelector((state) => state.user);
    const { socket, currentRoom, setMessages, messages, privateMemberMsg } = useContext(AppContext);
    const messageEndRef = useRef(null);
    function MyVerticallyCenteredModal(props) {
        return (
          <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                image preview
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='d-flex align-items-center mb-3 preview'>
                <img width={"100%"} src={url} />

                </div>
              
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
          </Modal>
        );
      }
      
    
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    function getFormattedDate() {
        const date = new Date();
        const year = date.getFullYear();
        let month = (1 + date.getMonth()).toString();

        month = month.length > 1 ? month : "0" + month;
        let day = date.getDate().toString();

        day = day.length > 1 ? day : "0" + day;

        return month + "/" + day + "/" + year;
    }

    function scrollToBottom() {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }


    const todayDate = getFormattedDate();

    socket.off("room-messages").on("room-messages", (roomMessages) => {
        setMessages(roomMessages);
    });
    function selectFile(e) {
        //    console.log(e.target.file[0]);
        setMessage(e.target.files[0].name);
        setFile(e.target.files[0]);
        }
        
    function handleSubmit(e) {
        e.preventDefault();
        if (!message) return;
        
        const today = new Date();
        const minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
        const time = today.getHours() + ":" + minutes;
        const roomId = currentRoom;
        console.log(file);
        socket.emit("message-room", roomId, message, user, time, todayDate,file,
       file ?  file.type :'text');

        setMessage("");
        setFile();

    }



    
function image(url) {
    return (<img onClick={() => {
        setModalShow(true);
        setUrl(url);
    }} width={"100%"} height={200} alt={url} src={url} />    
    )   
}

function video(url) {
    return (<video width={"100%"} height={200} alt={url} src={url} />)   
}
function application(url) {
    return (<a download target="_blank" href={url}>download</a>)   
}

function checkType(type) {
    if(!type) return "text";
    return type.split("/")[0];
    
}


    return (
        <>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
            <div className="messages-output">
                {user && !privateMemberMsg?._id && <div className="alert alert-info">You are in the {currentRoom} room</div>}
                {user && privateMemberMsg?._id && (
                    <>
                        <div className="alert alert-info conversation-info">
                            <div>
                                Your conversation with {privateMemberMsg.name} <img src={privateMemberMsg.picture} className="conversation-profile-pic" alt="" />
                            </div>
                        </div>
                    </>
                )}
                {!user && <div className="alert alert-danger">Please login</div>}

                {user &&
                    messages.map(({ _id: date, messagesByDate }, idx) => (
                        <div key={idx}>
                            <p className="alert alert-info text-center message-date-indicator">{date}</p>
                            {messagesByDate?.map(({ content, time, from: sender,file,type }, msgIdx) => (
                                <div className={sender?.email === user?.email ? "message" : "incoming-message"} key={msgIdx}>
                                    <div className="message-inner">
                                        <div className="d-flex align-items-center mb-3">
                                            <img src={sender.picture} style={{ width: 35, height: 35, objectFit: "cover", borderRadius: "50%", marginRight: 10 }} alt='' />
                                            <p className="message-sender">{sender._id === user?._id ? "You" : sender.name}</p>
                                        </div>
                                        {type !== "text"? checkType(type) === "image"?image(file):checkType(type) === "video"?video(file):application(file):null}
                                        <p className="message-content">{content}</p>
                                        <p className="message-timestamp-left">{time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                <div ref={messageEndRef} />
            </div>
            <Form onSubmit={handleSubmit}>
                <Row>
                    
                    <Col md={10}>
                        <Form.Group>
                            <Form.Control id="text-box" type="text" placeholder="Your message" disabled={!user} value={message} onChange={(e) => setMessage(e.target.value)}></Form.Control>
                        </Form.Group>

                    </Col>
                    <Col md={1}>
                        <input onChange={selectFile} type='file'/>
                            <Button type="submit" style={{ width: "100%", backgroundColor: "#f88a2a", borderColor: '#f88a2a' }} disabled={!user}>
                            <i class="fa fa-upload"></i>
                        </Button>
                    </Col>
                    <Col md={1}>
                        <Button type="submit" style={{ width: "100%", backgroundColor: "#f88a2a", borderColor: '#f88a2a' }} disabled={!user}>
                            <i className="fas fa-paper-plane"></i>
                        </Button>
                    </Col>
                </Row>
            </Form>

            <MyVerticallyCenteredModal
        show={false}
        onHide={() => setModalShow(false)}
      />
        </>
    );
}




export default MessageForm;
