import React from "react";
import "./NavItem.css";
import { Link } from "react-router-dom";

export default props =>
    <Link to={props.url}>
        <i className={`fa fa-${props.icon}`}></i>
        {props.title}
    </Link>