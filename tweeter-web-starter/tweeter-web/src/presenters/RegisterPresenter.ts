import { Buffer } from "buffer";
import { ChangeEvent } from "react";
import { UserService } from "../model/service/UserService";
import { User, AuthToken } from "tweeter-shared";

export interface RegisterView {
setIsLoading: (isLoading: boolean) => void;
updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void;
navigate: (url: string) => void;
displayErrorMessage: (message: string) => void;
setImageBytes: (imageBytes: Uint8Array<ArrayBufferLike>) => void;
setImageUrl: (imageUrl: string) => void;
setImageFileExtension: (imageFileExtension: string) => void;
}

export class RegisterPresenter {
  private userService: UserService;
  private view: RegisterView;
  
  public constructor(view: RegisterView) {
    this.userService = new UserService;
    this.view = view;
  }

  public checkSubmitButtonStatus = (alias: string, firstName: string, lastName: string, password: string, imageUrl: string, imageFileExtension: string): boolean => {
    return (
      !firstName ||
      !lastName ||
      !alias ||
      !password ||
      !imageUrl ||
      !imageFileExtension
    );
  };

  public registerOnEnter = (event: React.KeyboardEvent<HTMLElement>, alias: string, firstName: string, lastName: string, password: string, imageUrl: string, imageBytes: Uint8Array<ArrayBufferLike>, imageFileExtension: string, rememberMe: boolean) => {
    if (event.key == "Enter" && !this.checkSubmitButtonStatus(alias, firstName, lastName, password, imageUrl, imageFileExtension)) {
      this.doRegister(alias, firstName, lastName, password, imageBytes, imageFileExtension, rememberMe);
    }
  };
  public handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      this.handleImageFile(file);
    };

  public handleImageFile = (file: File | undefined) => {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.view.setImageFileExtension(fileExtension);
      }
    } else {
      this.view.setImageUrl("");
      this.view.setImageBytes(new Uint8Array());
    }
  };

  public getFileExtension = (file: File): string | undefined => {
    return file.name.split(".").pop();
  };

  public doRegister = async (alias: string, firstName: string, lastName: string, password: string, imageBytes: Uint8Array<ArrayBufferLike>, imageFileExtension: string, rememberMe: boolean) => {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.userService.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension
      );

      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate("/");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`
      );
    } finally {
      this.view.setIsLoading(false);
    }
  };
}