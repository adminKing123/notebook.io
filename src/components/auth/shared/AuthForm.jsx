export default function AuthForm({ onSubmit, children }) {
  return (
    <form
      className="auth__form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      {children}
    </form>
  );
}
