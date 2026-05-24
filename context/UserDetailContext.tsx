import { createContext } from "react";

// UserDetail matches what Convex returns from CreateNewUser mutation.
// _id is optional because it may not be present right after creation.
export interface UserDetail {
  _id?: any;
  email: string;
  name: string;
  imageUrl: string;
  [key: string]: any; // Allow additional Convex fields
}

export interface UserDetailContextType {
  userDetail: UserDetail | undefined;
  setUserDetail: React.Dispatch<React.SetStateAction<UserDetail | undefined>>;
}

export const UserDetailContext = createContext<UserDetailContextType>({
  userDetail: undefined,
  setUserDetail: () => {},
});
