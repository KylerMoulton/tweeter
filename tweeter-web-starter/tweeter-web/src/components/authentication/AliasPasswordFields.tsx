interface Props {
  setAlias: (value: string) => void;
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
          aria-label="alias"
          placeholder="name@example.com"
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
          aria-label="password"
          placeholder="Password"
          onKeyDown={props.keyDownFunction}
          onChange={(event) => props.setPassword(event.target.value)}
        />
        <label htmlFor="passwordInput">Password</label>
      </div>
    </>
  );
};

export default AliasPasswordFields