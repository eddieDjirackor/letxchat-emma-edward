import React, { useState } from 'react'
import { Form, Container, Col, Row, Button } from 'react-bootstrap'
import {useEditUserMutation } from '../services/appApi';
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useParams } from "react-router";
import './Profile.css';


function EditUser() {
  const user = useSelector(state => state.user)

  // Getting Current User Avartar
  const userAvartar = user.picture;

  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [name, setName] = useState(user.name);
  const [staffId, setStaffId] = useState(user.staffId);
  
  let { id } = useParams();

  const navigate = useNavigate()
  const [ editUser, { isLoading, error }] = useEditUserMutation();

  // Image upload state
  const [image, setImage] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Validate the size of the Image
  function validateImg (e) {
  const file = e.target.files[0];
  if(file.size >= 1048576**5) {
    return alert("Max file size is 5mb")
  } else {
    setImage(file);
    setImagePreview(URL.createObjectURL(file))
  }
  }
  

  async function uploadImage () {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'uv4sn8q1')

    try{
      setUploadingImg(true);
      let res = await fetch('https://api.cloudinary.com/v1_1/ddnlroc9k/image/upload', {
        method: "PUT",
        body: data
      })
      const urlData = await res.json();
      setUploadingImg(false);
      return urlData.url
    } catch(error) {
      setUploadingImg(false);
      console.log(error);
    }
  }


  async function handleEditUser (e) {
    e.preventDefault()

    const url = await uploadImage(image)

    // Edit user
    editUser({id,  name,  email, staffId, username, picture: url}).then(({data}) => {
      if(data) {
        navigate('/chat')
      }
    })
  }

  function handleCancel (e) {
    navigate('/chat');
  }


  return (
      <Container>
          <Row>
          <Col md={15} className="d-flex align-items-center justify-content-center flex-direction-column"> 
              <Form style={{width: '80%', maxWidth: 350}} onSubmit={handleEditUser}>
              <h1 className='text-center'>Edit Profile</h1>
              <div className='signup-profile-pic__container'>
                <img src={imagePreview || userAvartar} className='signup-profile-pic' alt="profile"/>
                <label htmlFor='image-upload' className='image-upload-label' >
                  <i className='fas fa-plus-circle add-picture-icon'></i>
                </label>
                <input type="file" id="image-upload" hidden accept="image/png, img/jpeg, img/jpg" onChange={validateImg}/>
              </div>
              {error && <p className='alert alert-danger'>{error.data}</p>}
              <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Fullname</Form.Label>
              <Form.Control type="text" onChange={(e) => setName(e.target.value)} value={name} disabled/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicUserName">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" onChange={(e) => setUsername(e.target.value)} value={username}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicStaffId">
              <Form.Label>Staff ID</Form.Label>
              <Form.Control type="text" onChange={(e) => setStaffId(e.target.value)} value={staffId} disabled/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" onChange={(e) => setEmail(e.target.value)} value={email} />
              </Form.Group>
          
              
              <div className='button-space'>
                <Button variant="primary" type="submit" onClick={handleEditUser}>
                {uploadingImg || isLoading ? 'Saving changes...' : 'Save Changes'}
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

export default EditUser;