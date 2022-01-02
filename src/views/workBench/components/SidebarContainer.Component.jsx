export function SideBarContainer({ children, style, ...props }) {
  return (
    <div
      style={{
        padding: "4px",
      }}
    >
      {children}
    </div>
  );
}
