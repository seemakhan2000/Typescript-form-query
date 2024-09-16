/*Imports React and hooks: Imports the necessary React library and useState hook for managing state.*/
import React, { useState } from "react";
/*Imports a custom hook, likely created with React Query, for handling mutation logic related to adding a user*/
import { useAddUserMutation } from '../../Mutation/mutation';
import { FormValue } from '../Types/Types';

interface ValidationError {
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
}
/*An interface for the props the Form component expects. Here, onFormSubmit is a callback function to be
 called when the form is successfully submitted.*/
interface UserFormProps {
  onFormSubmit: () => void;
}
/*A functional React component with UserFormProps type, which receives onFormSubmit as a prop*/
const Form: React.FC<UserFormProps> = ({ onFormSubmit }) => {
  /*Initializes state to manage form values with empty strings for username, email, phone, and password*/
  const [formValue, setFormValue] = useState<FormValue>({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
/* Initializes state to manage validation errors, starting with an empty object.*/
  const [validationErrors, setValidationErrors] = useState<ValidationError>({});
  /*useAddUserMutation takes onFormSubmit as a parameter, which is a callback function to be executed after a successful mutation*/
  const mutation = useAddUserMutation(onFormSubmit);
/*Updates the formValue state whenever an input field changes. It uses the name attribute of the input to determine which field to update and sets the new value*/
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  };

  const handleValidation = (): boolean => {
    let errors: ValidationError = {};
    let isValid = true;

    if (!formValue.username) {
      errors.username = "Username is required";
      isValid = false;
    }
    if (!formValue.email) {
      errors.email = "Email is required";
      isValid = false;
    }
    if (!formValue.phone) {
      errors.phone = "Phone is required";
      isValid = false;
    }
    if (!formValue.password) {
      errors.password = "Password is required";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };
/*Prevents the default form submission behavior. Calls handleValidation to check if the form is valid. If it 
is valid, mutation.mutate is called with the form values, triggering the mutation to add a user*/
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (handleValidation()) {

      mutation.mutate(formValue);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="username"
            value={formValue.username}
            onChange={handleInput}
          />
          {validationErrors.username && (
            <small className="text-danger">{validationErrors.username}</small>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formValue.email}
            onChange={handleInput}
          />
          {validationErrors.email && (
            <small className="text-danger">{validationErrors.email}</small>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Phone:
          </label>
          <input
            type="text"
            className="form-control"
            id="phone"
            name="phone"
            value={formValue.phone}
            onChange={handleInput}
          />
          {validationErrors.phone && (
            <small className="text-danger">{validationErrors.phone}</small>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formValue.password}
            onChange={handleInput}
          />
          {validationErrors.password && (
            <small className="text-danger">{validationErrors.password}</small>
          )}
        </div>
        <div className="modal-footer">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default Form;
