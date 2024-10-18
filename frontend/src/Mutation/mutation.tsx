import { useMutation, useQueryClient } from "react-query";

import { addUser, deleteUser, updateUser } from "../services/userService";

export const useAddUserMutation = (onFormSubmit: () => void) => {
  return useMutation(addUser, {
    onSuccess: () => {
      onFormSubmit();
    },
  });
};

// Mutation for deleting a user
export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries("users");
    },
  });
};

// Mutation for updating a user
export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries("users"); // Invalidate and refetch users query
    },
  });
};
