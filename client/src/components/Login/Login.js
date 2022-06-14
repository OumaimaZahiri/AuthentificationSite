import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Axios from 'axios';
import "./Login.css";

export default function Login() {
  
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, [])

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd])


  const handleSubmit = async e => {
    e.preventDefault();
    
    try {
      const response = await Axios.post('http://localhost:8080/login', 
        {username: user,
          password: pwd,
        });
        if(response?.data==="Logged in !")
        {
          setUser('');
          setPwd('');
          setSuccess(true);
          navigate(from, { replace: true });
        }
        else{
          setErrMsg(response.data);
        }
    } catch (e) {
      setErrMsg('Login Failed');
      errRef.current.focus();
    }
  }

  return (
    <>
    {success ? (
      <section>
        <h>Home</h>
      </section>
    ) : (
    <section className="Login">
      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
      <h1>Please Log In</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="username">
          <Form.Label>Username :</Form.Label>
          <Form.Control
            type="text"
            value={user}
            ref={userRef}
            autoComplete="off"
            required
            onChange={(e) => setUser(e.target.value)}
          />
        </Form.Group>

        <Form.Group size="lg" controlId="password">
          <Form.Label>Password :</Form.Label>
          <Form.Control
            type="password"
            value={pwd}
            required
            onChange={(e) => setPwd(e.target.value)}
          />
        </Form.Group>
        <Button block="true" size="lg" type="submit">
          Sign In
        </Button>
      </Form>
      <p>
        Don't have an account ?<br />
        <span className="line">
          <Link to="/register">Sign Up</Link>
        </span>
      </p>
    </section>
)}
    </>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}
