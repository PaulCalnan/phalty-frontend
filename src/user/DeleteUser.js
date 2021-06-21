import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { remove } from "./apiUser";
import { signout } from "../auth";

class DeleteUser extends Component {
  //state needed for redirect
  state = {
    redirect: false
  };

  deleteAccount = () => {
    const token = isAuthenticated().token;
    const userId = this.props.userId
    remove(userId, token)
    .then(data => {
      if(data.error) {
        console.log(data.error)
      } else {
        // signout user and redirect
        signout(() => console.log("User is deleted")); // imported from signout
        this.setState({redirect: true}); // change state redirect from false to true
      }
    })
  };

  deleteConfirmed = () => {
    let answer = window.confirm("Are you sure you want to delete your account?");
    if (answer) {
      this.deleteAccount();
    }
  };

  render() {
    if(this.state.redirect) {
      return <Redirect to="/"/>
    }
    return (
      <button
        onClick={this.deleteConfirmed}
        className="btn btn-raised btn-danger">
        Delete Vehicle
      </button>
    );
  }
}

export default DeleteUser;
