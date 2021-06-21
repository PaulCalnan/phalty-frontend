import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { read, update } from "./apiUser";
import { Redirect } from "react-router-dom";
import DefaultProfileImage from "../images/default-avatar.png";

class EditProfile extends Component {

  constructor() {
    super()
    this.state = {
      id: "",
      plate: "",
      email: "",
      password: "",
      redirectToProfile: false,
      error: "", // used for update using backend validations
      fileSize: 0,
      loading: false
    };
}

  init = (userId) => {
    const token = isAuthenticated().token;
      read(userId, token).then(data => {
        if (data.error) {
          this.setState({ redirectToSignin: true });
        } else {
          this.setState({
            id: data._id,
            plate: data.plate,
            email: data.email,
            error: ""
           });
        }
      });
  };

  componentDidMount() {
    this.userData = new FormData();
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  isValid = () => { // client side update validations
    const {plate, email, password, fileSize} = this.state;
    if(fileSize > 100000) {
      this.setState({error: "file size should be less that 100KB"});
      return false;
    }
    if(plate.length === 0) {
      this.setState({error: "Name is required"});
      return false;
    }
    if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      this.setState({error: "Email is not valid format"});
      return false;
    }
    if(password.length >=1 && password.length <=5) {
      this.setState({error: "Password must be at least 6 characters"});
      return false;
    }
    return true;
  };

  handleChange = name => event => {
    this.setState({error: ""}) // empty previous errors from display if any
    const value = name === 'photo' ? event.target.files[0] :event.target.value;
    const fileSize = name === 'photo' ? event.target.files[0].size : 0;
    this.userData.set(name, value);
    this.setState({ [name]: value, fileSize });
  };

  clickSubmit = event => {
    event.preventDefault(); // prevent page from reloading
    this.setState({loading: true})

    if(this.isValid()) { // if client side validation true then...
      const userId = this.props.match.params.userId;
      const token = isAuthenticated().token;

      update(userId, token, this.userData).then(data => {
        if(data.error) this.setState({ error: data.error });
        else this.setState({
          redirectToProfile: true
        });
      });
    }
  };

  signupForm = (plate, email, password) => (
    <form>
    <div className="form-group">
      <label className="text-muted">Profile Photo</label>
      <input
        onChange={this.handleChange("photo")}
        type="file"
        accept="image/*"
        className="form-control"
      />
      </div>
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
        Update
      </button>
    </form>
  );

  render() {
    const { id, plate, email, password, redirectToProfile, error, loading } = this.state;

    if(redirectToProfile) {
        return <Redirect to={`/user/${id}`}/>
    }

    const photoUrl = id
      // get user uploaded photo, and show by latest date and time, or default if none
      ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}`
      : DefaultProfileImage;

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Edit Vehicle</h2>

        <div // display error from backend during validation
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        {loading ? (<div className="jumbotron text-center">
          <h2>Loading...</h2>
        </div>) : ("")}

        <img
            style={{height: "200px", width: "auto"}}
            className="img-thumbnail"
            src={photoUrl}
            //apply default pic if none found
            onError={i => (i.target.src = `${DefaultProfileImage}`)}
            alt={plate}
        />

        {this.signupForm(plate, email, password)}
      </div>
    );
  }
}

export default EditProfile;
