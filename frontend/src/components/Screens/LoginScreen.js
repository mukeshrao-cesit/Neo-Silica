import { Button, Grid, Paper, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginScreen.css";

function LoginScreen() {
    
  const btnStyle = { margin: "25px 0" };
  const paperStyle = {
    padding: 20,
    height: "auto",
    width: 380,
    margin: "20px auto",
  };

  const navigate = useNavigate();
  //STATES  FOR LOGIN
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [err, setErr] = useState(null);

  const handleLoginForm = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErr("enter User Name & Password");
    }
    if (username === "reshi" && password === "123") {
      localStorage.setItem("loggedIn", true);
      navigate("/");
    } else {
      setErr("Invalid Username & Password");
    }
  };


  return (
    <div style={{ marginTop: "200px" }}>
      <Grid>
        <Paper elevation={10} style={paperStyle}>
          <Grid>
            <center>
              <h2> Sign In</h2>
            </center>
          </Grid>
          <form onSubmit={handleLoginForm}>
            {err && <p style={{ color: "red" }}>{err}</p>}
            <TextField
              id="standard-basic"
              label="username"
              variant="standard"
              name="username"
              fullWidth
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <TextField
              id="standard-basic"
              label="Password"
              type="password"
              name="password"
              variant="standard"
              fullWidth
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <Button
              type="submit"
              variant="contained"
              style={btnStyle}
              color="primary"
              fullWidth
            >
              Submit
            </Button>
          </form>
        </Paper>
      </Grid>
    </div>
  );
}
export default LoginScreen;
