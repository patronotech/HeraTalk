import React, { useState, useContext } from "react";
//import { Link as RouterLink } from "react-router-dom";

import {
  CssBaseline,
  TextField,
  InputAdornment,
  IconButton,
} from '@material-ui/core';

//import { LockOutlined, Visibility, VisibilityOff } from '@material-ui/icons';
import { Visibility, VisibilityOff } from '@material-ui/icons';

//import { makeStyles } from "@material-ui/core/styles";

import { i18n } from "../../translate/i18n";

import { AuthContext } from "../../context/Auth/AuthContext";

import wave from './img/wave.png'
import bg from './img/bg.svg'
//import avatar from './img/avatar.svg'
import './style.css';


const Login = () => {
  //const classes = useStyles();

  const [user, setUser] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const { handleLogin } = useContext(AuthContext);

  const handleChangeInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlSubmit = (e) => {
    e.preventDefault();
    handleLogin(user);
  };

  return (
    <>
        <CssBaseline />
        <img className="wave" src={wave} alt=""/>
        <div className="container">
            <div className="img">
                <img src={bg}  alt=""/>
            </div>
            <div className="login-content">
                <form noValidate onSubmit={handlSubmit}>
                <img src="HeraTalk.png" height = "150px" width = "290px"  alt=""/>
                    <TextField
                        variant="standard"
                        margin="normal"
                        color="warning"
                        required
                        fullWidth
                        id="email"
                        label={i18n.t("login.form.email")}
                        name="email"
                        value={user.email}
                        onChange={handleChangeInput}
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        variant="standard"
                        margin="normal"
                      color="success"
                        required
                        fullWidth
                        name="password"
                        label={i18n.t("login.form.password")}
                        id="password"
                        value={user.password}
                        onChange={handleChangeInput}
                        autoComplete="current-password"
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword((e) => !e)}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <input type="submit" className="btn" value="Acessar" />
                </form>
            </div>
        </div>
    </>
);
};

export default Login;
