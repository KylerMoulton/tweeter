import { MessageView } from "../../presenters/Presenter";
import useToaster from "./ToastHook";

const useToastListener = (): MessageView => {
  const { displayInfoToast, displayErrorToast, deleteLastInfoToast } =
    useToaster();

  return {
    displayInfoMessage: displayInfoToast,
    displayErrorMessage: (message: string, bootstrapClasses?: string) =>
    displayErrorToast(message, 0, bootstrapClasses),
    clearLastInfoMessage: deleteLastInfoToast,
  };
};

export default useToastListener;
