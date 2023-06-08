import React, { useEffect } from "react";
import PropTypes from "prop-types";
import withRouter from "../../common/withRouter";
import { logoutUser } from "../store/actions";

//redux
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LandingPage from "../../components/LandingPage";

const Logout = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logoutUser(history));
  }, [dispatch, history]);

  return <LandingPage/>;
};

Logout.propTypes = {
  history: PropTypes.object,
};

export default withRouter(Logout);
