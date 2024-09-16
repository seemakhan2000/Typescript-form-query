//useQueryClient  hook from react-query that provides access to the query client instance, used here to invalidate queries.
import { useMutation, useQueryClient } from 'react-query';
//These functions are imported from ../Services/UserService and are responsible for making HTTP requests to perform CRUD operations on users.
import { addUser, deleteUser, updateUser } from '../Services/UserService';



/*This function initializes a mutation hook (useMutation) to add a new user.Mutation for adding a user*/
export const useAddUserMutation = (onFormSubmit: () => void) => {
    //useQueryClient is used inside a functional component to obtain an instance of QueryClient
  const queryClient = useQueryClient();
  /*addUser: Passed as the first argument to useMutation, this function performs the actual HTTP POST request to add a user.*/
  return useMutation(addUser, {
    onSuccess: () => {
/*Invalidates the 'users' query in the cache, causing it to refetch data from the server.*/
      queryClient.invalidateQueries('users'); 
/*Calls the onFormSubmit callback provided as an argument to useAddUserMutation, 
typically used to handle UI updates or form resets after a successful user addition.*/
      onFormSubmit(); 
    },
  });
};

// Mutation for deleting a user
export const useDeleteUserMutation = () => {
    //useQueryClient is used inside a functional component to obtain an instance of QueryClient
  const queryClient = useQueryClient();
  return useMutation(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users'); // Invalidate and refetch users query
    },
  });
};

// Mutation for updating a user
export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users'); // Invalidate and refetch users query
    },
  });
};






/*In React, a "mutation" typically refers to changing or creating data on the server (like adding a new user). The useAddUserMutation is a custom hook provided by a library like React Query, which simplifies making these changes.*/