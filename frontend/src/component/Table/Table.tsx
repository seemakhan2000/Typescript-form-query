import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";

import { fetchUsers } from "../../Services/UserService";
import { UserData } from "../Types/Types";

import {
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../Mutation/mutation";

const Table: React.FC = () => {
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { data: submittedData = [], isLoading } = useQuery<UserData[]>(
    "users",
    fetchUsers
  );

  const deleteUserMutation = useDeleteUserMutation();
  const updateUserMutation = useUpdateUserMutation();

  //riggers the mutation to delete a user.
  const handleDelete = (id: string) => {
    deleteUserMutation.mutate(id);
  };

  //Opens the modal and sets the user to be edited
  const handleEditClick = (user: UserData) => {
    setEditingUser(user);
    setShowModal(true);
  };

  //Closes the modal and resets the editing use
  const handleModalClose = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  useEffect(() => {
    if (submittedData.length > 0) {
      console.log("Submitted Data:", submittedData);
    }
  }, [submittedData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingUser) {
      setEditingUser({
        ...editingUser,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUserMutation.mutate(editingUser);
      handleModalClose();
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {showModal && editingUser && (
        <div className="modal show d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title edit-user">Edit User</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleModalClose}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={editingUser.username}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={editingUser.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                      Phone
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={editingUser.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary save-changes"
                  >
                    Save changes
                  </button>
                </form>
              </div>
              <div className="modal-footer"></div>
            </div>
          </div>
        </div>
      )}

      <table className="table" id="myTable">
        <thead className="table-dark">
          <tr className="th">
            <th scope="col">S.NO</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Phone</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {submittedData.map((data, index) => (
            <tr key={data._id}>
              <td>{index + 1}</td>
              <td>{data.username}</td>
              <td>{data.email}</td>
              <td>{data.phone}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(data._id)}
                >
                  <i className="fas fa-trash" />
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleEditClick(data)}
                >
                  <i className="fas fa-pencil-alt" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
