import { useState } from "react";

interface Props {
  //remove alias, password
  alias: string;
  setAlias: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  keyDownFunction: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const AliasPasswordFields = (props: Props) => {
  return (
    <>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="aliasInput"
          placeholder="name@example.com"
          value={props.alias}
          onKeyDown={props.keyDownFunction}
          onChange={(event) => props.setAlias(event.target.value)}
        />
        <label htmlFor="aliasInput">Alias</label>
      </div>
      <div className="form-floating mb-3">
        <input
          type="password"
          className="form-control bottom"
          id="passwordInput"
          placeholder="Password"
          value={props.password}
          onKeyDown={props.keyDownFunction}
          onChange={(event) => props.setPassword(event.target.value)}
        />
        <label htmlFor="passwordInput">Password</label>
      </div>
    </>
  );
};

export default AliasPasswordFields