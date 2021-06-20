import React, { Component } from "react";

class Signup extends Component {
  constructor() {
    super()
    this.state = {
      plate: "",
      email: "",
      password: "",
      error: "",
      open: false
    };
  }

  handleChange = submitData => event => {
    this.setState({error: ""});
    this.setState({ [submitData]: event.target.value });
  };

  clickSubmit = event => {
    event.preventDefault() // prevent page from reloading
    const {plate, email, password} = this.state;
    const user = {
      plate,
      email,
      password
    };
    //console.log(user);
    this.signup(user).then(data => {
      if(data.error) this.setState({ error: data.error })
      else this.setState({
        error: "",
        plate: "",
        email: "",
        password: "",
        open: true
      })
    })
  };

  signup = user => {
    return fetch("http://localhost:8080/signup", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
  };

  render() {
    const {plate, email, password, error, open} = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Signup</h2>

        <div
          className="alert alert-primary"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        <div
          className="alert alert-info"
          style={{ display: open ? "" : "none" }}
        >
          New account successfully created, please sign in.
        </div>

        <form>
          <div className="form-group">
            <label className="text-muted">Rego Plate</label>
            <input
              onChange={this.handleChange("plate")}
              type="text"
              className="form-control"
              value={plate}
            />
          </div>
          <div className="form-group">
            <label className="text-muted">Email</label>
            <input
              onChange={this.handleChange("email")}
              type="email"
              className="form-control"
              value={email}
            />
          </div>
          <div className="form-group">
            <label className="text-muted">Password</label>
            <input
              onChange={this.handleChange("password")}
              type="password"
              className="form-control"
              value={password}
            />
          </div>
          <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default Signup;