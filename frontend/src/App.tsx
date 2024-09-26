import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import Form from "./component/Form/Form";
import Table from "./component/Table/Table";
import Login from "./module/login/Login";
import Signup from "./module/signup/Signup";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/form"
            element={
              <>
                <button
                  type="button"
                  className=" btn btn-primary addUser"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Add User
                </button>
                <div
                  className="modal fade"
                  id="exampleModal"
                  tabIndex={-1}
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h3 className="modal-title" id="exampleModalLabel">
                          User Form
                        </h3>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="containers">
                        <Form
                          onFormSubmit={() =>
                            queryClient.invalidateQueries("users")
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <Table />
              </>
            }
          />
          <Route path="/" element={<Signup />} /> Default route
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};
export default App;

/* React Query is a powerful library for managing server state in React applications,
 providing tools for fetching, caching, synchronizing, and updating server state.
 //The mutation is used to post or update data on the server.
 //To get data from the server, we use a query.*/

/*React Query: React Query abstracts away the complexities of data fetching and caching. 
 It provides hooks (useQuery) that handle caching (in-memory caching by default), background 
 refetching, stale data management, and automatic cache invalidation. This makes it easier to manage
  server state and ensures that data remains consistent across your application.*/
