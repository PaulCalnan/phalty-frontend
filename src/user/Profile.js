import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { Redirect, Link } from "react-router-dom";
import { read } from "./apiUser";
import DefaultProfileImage from "../images/default-avatar.png";
import DeleteUser from "./DeleteUser";
import ProfileTabs from "./ProfileTabs";
import { postsByUser } from "../post/apiPost";

class Profile extends Component {
  constructor() {
    super()
    this.state = {
      user: "",
      redirectToSignin: false,
      error: "",
      posts: []
    }
  }

  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectToSignin: true });
      } else {
        this.setState({ user: data });
        this.loadPosts(data._id);
      }
    });
  };

  loadPosts = userId => {
    const token = isAuthenticated().token;
    postsByUser(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
      }
    });
  };

  componentDidMount() {
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  componentWillReceiveProps(props) {
    const userId = props.match.params.userId;
    this.init(userId);
  }

  render() {
    const {redirectToSignin, user, posts} = this.state;
    if(redirectToSignin) return <Redirect to="/signin" />

    const photoUrl = user._id
      // get user uploaded photo, and show by latest date and time, or default if none
      ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}`
      : DefaultProfileImage;

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Vehicle Profile</h2>
        <div className="row">
          <div className="col-md-4">
            <img
                style={{height: "200px", width: "auto"}}
                className="img-thumbnail"
                src={photoUrl}
                //apply default pic if none found
                onError={i => (i.target.src = `${DefaultProfileImage}`)}
                alt={user.plate}
            />
          </div>

          <div className="col-md-8">

            <div className="lead mt-2">
              <p>Rego Plate: {user.plate}</p>
              <p>Email: {user.email}</p>
              <p>{`Joined ${new Date(user.created).toDateString()}`}</p>
            </div>

            {isAuthenticated().user &&
              isAuthenticated().user._id === user._id && (
                <div className="d-inline-block=">
                  <Link className="btn btn-raised btn-info mr-5"
                        to={`/post/create/`}>
                        Create Post
                  </Link>
                  <Link className="btn btn-raised btn-success mr-5"
                        to={`/user/edit/${user._id}`}>
                        Edit Profile
                  </Link>
                  <DeleteUser userId={user._id}/>
                </div>
              )}


          </div>
        </div>
        <div className="row">
          <div className="col md-12 mt-5 mb-5">
            <hr />
              <p className="lead">{user.about}</p>
            <hr />

            <ProfileTabs posts={posts}/>
          </div>
        </div>
      </div>
    );
  }
};

export default Profile;
