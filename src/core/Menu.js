import React from 'react';
// withRouter higher order component, takes another component (Menu) as an arg
// benefit of this, gives access to => props => history object
import { Link, withRouter } from 'react-router-dom';
import { signout, isAuthenticated } from "../auth";

const isActive = (history, path) => {
  if(history.location.pathname === path) return {color: "#ff9900"}
  else return {color: "#918f89"}
};

const Menu = ({history}) => (
  <div>
    <ul className="nav nav-tabs">
      <li className="nav-item">
        <Link className="nav-link"
              style={isActive(history, "/")}
              to="/">Home</Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link"
              style={isActive(history, "/users")}
              to="/users">Users</Link>
      </li>

      {!isAuthenticated() && (
        <>
          <li className="nav-item">
            <Link className="nav-link"
                  style={isActive(history, "/signin")}
                  to="/signin">Sign In</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link"
                  style={isActive(history, "/signup")}
                  to="/signup">Sign Up</Link>
          </li>
        </>
      )}

      {isAuthenticated() && (
        <>
          <li className="nav-item">
            <Link to={`/post/create`}
                  style={isActive(history, `/post/create`)}
                  className="nav-link">
              Create Post
            </Link>
          </li>

          <li className="nav-item">
            <Link to={`/user/${isAuthenticated().user._id}`}
                  style={isActive(history, `/user/${isAuthenticated().user._id}`)}
                  className="nav-link">
              {`${isAuthenticated().user.plate} profile`}
            </Link>
          </li>

          <li className="nav-item">
            <a className="nav-link"
                  style={(isActive(history, "/signup"),
                  {cursor: "pointer", color: "#c21d1d"})}
                  onClick={() => signout(() => history.push("/"))}>
                  Sign Out
            </a>
          </li>
        </>
      )}
    </ul>
  </div>
);

export default withRouter(Menu);
