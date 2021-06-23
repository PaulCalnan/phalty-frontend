import React, { Component } from "react";
import { singlePost, update } from "./apiPost";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";
import DefaultPostImage from "../images/default-post-image.jpeg";

class EditPost extends Component {
  constructor() {
    super()
    this.state = {
      id: "",
      title: "",
      body:"",
      redirectToProfile: false,
      error: "",
      fileSize: 0,
      loading: false
    };
  }

  init = postId => { // init populate with current post data from backend
      singlePost(postId).then(data => {
        if (data.error) {
          this.setState({ redirectToProfile: true });
        } else {
          this.setState({
            id: data._id,
            title: data.title,
            body: data.body,
            error: ""
           });
        }
      });
  };

  componentDidMount() {
    this.postData = new FormData();
    const postId = this.props.match.params.postId;
    this.init(postId)
  }

  isValid = () => { // client side update validations
    const {title, body, fileSize} = this.state;
    if(fileSize > 100000) {
      this.setState({error: "file size should be less that 100KB"});
      return false;
    }
    if(title.length === 0 || body.length === 0) {
      this.setState({error: "All fields are required", loading: false});
      return false;
    }

    return true;
  };

  handleChange = name => event => {
    this.setState({error: ""}) // empty previous errors from display if any
    const value = name === 'photo' ? event.target.files[0] :event.target.value;
    const fileSize = name === 'photo' ? event.target.files[0].size : 0;
    this.postData.set(name, value);
    this.setState({ [name]: value, fileSize });
  };

  clickSubmit = event => {
    event.preventDefault(); // prevent page from reloading
    this.setState({loading: true});

    if(this.isValid()) { // if client side validation true then...
      const postId = this.state.id
      const token = isAuthenticated().token;

      update(postId, token, this.postData).then(data => {
        if(data.error) this.setState({ error: data.error });
        else {
          this.setState({ loading: false, title: "", body: "", photo: "", redirectToProfile: true });
        }
      });
    }
  };

  editPostForm = (title, body) => (
    <form>
      <div className="form-group">
        <label className="text-muted">Post Photo</label>
        <input
          onChange={this.handleChange("photo")}
          type="file"
          accept="image/*"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Title</label>
        <input
          onChange={this.handleChange("title")}
          type="text"
          className="form-control"
          value={title}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Post</label>
        <textarea
          onChange={this.handleChange("body")}
          type="text"
          className="form-control"
          value={body}
        />
      </div>

      <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
        Update Post
      </button>
    </form>
  );

  render() {
    const {id, title, body, redirectToProfile, error, loading} = this.state;

    if(redirectToProfile) {
        return <Redirect to={`/user/${isAuthenticated().user._id}`}/>;
    }

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">{title}</h2>

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
            src={`${process.env.REACT_APP_API_URL}/post/photo/${id}}`}
            //apply default pic if none found
            onError={i => (i.target.src = `${DefaultPostImage}`)}
            alt={title}
        />

        {this.editPostForm(title, body)}
      </div>
    );
  }
}

export default EditPost;
