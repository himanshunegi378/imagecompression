export function ErrorFallback({ error, children }) {
  return (
    <div>
      <h1>{error.message}</h1>
      <pre>{error.stack}</pre>
      {children}
    </div>
  );
}
