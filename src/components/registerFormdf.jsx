import React, { Component } from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import * as userService from "../services/userService";
import auth from "../services/authService";

class RegisterForm extends Form {
  state = {
    data: {
      email: "",
      password: "",
      person_name_1: "",
      person_name_2: "",
      createdBy: "",
      email: "",
      password: "",
      user_type_id: "",
      status: "",
      createdBy: "",
      email: "",
      password: "",
      user_type_id: "",
      status: "",
      createdBy: "",
      email: "",
      password: "",
      user_type_id: "",
      status: "",
      createdBy: ""
    },
    errors: {}
  };

  schema = {
    person_name_1: Joi.string()
      .min(3)
      .max(50)
      .required(),
    person_name_2: Joi.string()
      .min(3)
      .max(50)
      .optional(),
    person_lastname_1: Joi.string()
      .min(3)
      .max(50)
      .required(),

    person_lastname_2: Joi.string()
      .min(3)
      .max(50)
      .optional(),
    person_phone: Joi.string()
      .min(8)
      .max(50)
      .optional(),
    person_gender: Joi.string()
      .max(1)
      .required(),
    person_bday: Joi.date(),
    status: Joi.number()
      .integer()
      .required(),
    nit: Joi.string()
      .min(2)
      .max(10)
      .required(),
    customer_phone: Joi.string()
      .min(3)
      .max(50)
      .optional(),

    customer_cellphone: Joi.string()
      .min(3)
      .max(50)
      .optional(),
    status: Joi.number()
      .integer()
      .required(),
    email: Joi.string()
      .required()
      .email()
      .label("Email"),
    password: Joi.string()
      .required()
      .min(5)
      .label("Password"),
    createdBy: Joi.string(),
    user_type_id: Joi.number(),
    status: Joi.number()
  };
  doSubmit = async () => {
    try {
      const response = await userService.register(this.state.data);
      console.log(response);
      auth.loginWithJwt(response.headers["x-auth-token"]);
      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.email = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <div>
        <h1>Registro</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("user_type_id", "User type")}
          {this.renderInput("status", "Status")}
          {this.renderInput("createdBy", "Create")}
          {this.renderInput("email", "Email")}
          {this.renderInput("password", "Password", "password")}
          {this.renderButton("Registrar")}
        </form>
      </div>
    );
  }
}

export default RegisterForm;
