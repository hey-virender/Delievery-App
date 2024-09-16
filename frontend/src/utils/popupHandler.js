import {
  setError,
  setMessage,
  clearError,
  clearMessage,
} from "../slices/popupSlice";
import { useDispatch } from "react-redux";

export const useShowPopup = () => {
  const dispatch = useDispatch();

  const showPopup = (type, message) => {
    if (type === "message") {
      dispatch(setMessage(message));
    } else if (type === "error") {
      dispatch(setError(message));
    }

    setTimeout(() => {
      dispatch(clearMessage());
      dispatch(clearError());
    }, 3000); // Add the timeout duration here
  };

  return showPopup;
};
