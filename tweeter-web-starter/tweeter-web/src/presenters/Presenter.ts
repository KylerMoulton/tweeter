import { User, AuthToken } from "tweeter-shared";

export interface View {
  displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
}

export interface MessageView extends View {
  clearLastInfoMessage: () => void;
  displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string) => void;
}

export interface AuthStateView extends MessageView {
  setIsLoading: (value: boolean) => void;
}

export interface DisplayedUserView extends AuthStateView {
  setDisplayedUser: (user: User) => void;
}

export interface NavHookView extends View{
  setDisplayedUser: (user: User) => void;
}

export class Presenter<V extends View> {
	private _view: V;

	protected constructor(view: V) {
		this._view = view;
	}

	protected get view(): V {
		return this._view;
	}

  public async doFailureReportingOperation<T extends View>(this: Presenter<T>,operation: () => Promise<void>,operationDescription: string, finallyCallback?: () => void){
    try {
      await operation();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${(error as Error).message}`
      );
    } finally {
      if (finallyCallback) {
        finallyCallback();
      }
    }
  };
}
