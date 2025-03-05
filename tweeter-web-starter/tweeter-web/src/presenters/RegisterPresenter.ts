import { Buffer } from "buffer";
import { ChangeEvent } from "react";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export interface RegisterView extends AuthenticationView {
  setImageBytes: (imageBytes: Uint8Array) => void;
  setImageUrl: (imageUrl: string) => void;
  setImageFileExtension: (imageFileExtension: string) => void;
}

export class RegisterPresenter extends AuthenticationPresenter<RegisterView> {
  public registerOnEnter = (
    event: React.KeyboardEvent<HTMLElement>,
    alias: string,
    firstName: string,
    lastName: string,
    password: string,
    imageUrl: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean
  ) => {
    this.handleAuthOnEnter(
      event,
      () => this.doRegister(alias, firstName, lastName, password, imageBytes, imageFileExtension, rememberMe),
      alias,
      firstName,
      lastName,
      password,
      imageUrl,
      imageFileExtension
    );
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
        const imageStringBase64BufferContents = imageStringBase64.split("base64,")[1];
        const bytes: Uint8Array = Buffer.from(imageStringBase64BufferContents, "base64");
        this.view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

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

  public doRegister = async (
    alias: string,
    firstName: string,
    lastName: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean
  ) => {
    this.doAuthentication(
      () => this.userService.register(firstName, lastName, alias, password, imageBytes, imageFileExtension),
      "register user",
      rememberMe
    );
  };
}
