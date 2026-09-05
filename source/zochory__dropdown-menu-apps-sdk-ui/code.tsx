import React, { useState } from "react";

// ChevronDown icon matching Storybook
const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Button component matching Storybook style
const Button = ({ children, color = "primary", size = "lg", variant = "ghost", ...props }) => {
  const styles = {
    padding: size === "lg" ? "10px 16px" : "8px 12px",
    fontSize: size === "lg" ? "14px" : "13px",
    backgroundColor: variant === "ghost" ? "#3a3a3a" : "#0066ff",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: 400,
    fontFamily: "system-ui, -apple-system, sans-serif",
    transition: "background-color 0.2s",
  };

  return (
    <button
      style={styles}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = variant === "ghost" ? "#4a4a4a" : "#0052cc";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = variant === "ghost" ? "#3a3a3a" : "#0066ff";
      }}
      {...props}
    >
      {children}
    </button>
  );
};

// Menu components with dark theme
const Menu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { isOpen, setIsOpen })
      )}
    </div>
  );
};

Menu.Trigger = ({ children, isOpen, setIsOpen }) => (
  <div onClick={() => setIsOpen(!isOpen)}>
    {children}
  </div>
);

Menu.Content = ({ children, width, minWidth, isOpen, setIsOpen }) => {
  if (!isOpen) return null;
  
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
        }}
        onClick={() => setIsOpen(false)}
      />
      <div
        style={{
          position: "absolute",
          top: "calc(100% + 4px)",
          right: 0,
          width: width || "auto",
          minWidth: minWidth || 200,
          backgroundColor: "#2a2a2a",
          border: "1px solid #3a3a3a",
          borderRadius: "8px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          padding: "4px",
          zIndex: 1000,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {children}
      </div>
    </>
  );
};

Menu.Item = ({ children, disabled, onSelect }) => (
  <div
    onClick={!disabled && onSelect ? onSelect : undefined}
    style={{
      padding: "8px 12px",
      borderRadius: "6px",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      backgroundColor: "transparent",
      transition: "background-color 0.15s",
      fontSize: "14px",
      color: "#ffffff",
    }}
    onMouseEnter={(e) => {
      if (!disabled) e.currentTarget.style.backgroundColor = "#3a3a3a";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = "transparent";
    }}
  >
    {children}
  </div>
);

Menu.Link = ({ children, href }) => (
  <a
    href={href}
    style={{
      display: "block",
      padding: "8px 12px",
      borderRadius: "6px",
      color: "#ffffff",
      textDecoration: "none",
      transition: "background-color 0.15s",
      fontSize: "14px",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = "#3a3a3a";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = "transparent";
    }}
  >
    {children}
  </a>
);

Menu.Separator = () => (
  <div
    style={{
      height: "1px",
      backgroundColor: "#3a3a3a",
      margin: "4px 0",
    }}
  />
);

// DefaultMenu demo component with dark theme
const DefaultMenu = () => (
  <div
    style={{
      padding: "40px",
      fontFamily: "system-ui, -apple-system, sans-serif",
      backgroundColor: "#1a1a1a",
      minHeight: "100vh",
      minWidth: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Menu>
      <Menu.Trigger>
        <Button color="primary" size="lg" variant="ghost">
          Sample menu <ChevronDown />
        </Button>
      </Menu.Trigger>
      <Menu.Content width={210} minWidth={210}>
        <Menu.Item>
          <div>
            <p style={{ fontWeight: 600, margin: 0, fontSize: "14px", color: "#ffffff" }}>
              Sam Smith
            </p>
            <p style={{ color: "#999999", margin: "2px 0 0 0", fontSize: "13px" }}>
              sam.smith@gmail.com
            </p>
          </div>
        </Menu.Item>
        <Menu.Separator />
        <Menu.Link href="/settings">Your profile</Menu.Link>
        <Menu.Link href="https://openai.com/policies/">Terms & policies</Menu.Link>
        <Menu.Item disabled onSelect={() => {}}>
          Feature flags
        </Menu.Item>
        <Menu.Separator />
        <Menu.Item onSelect={() => alert("Logged out!")}>Logout</Menu.Item>
      </Menu.Content>
    </Menu>
  </div>
);

export default DefaultMenu;
export { Menu, Button, ChevronDown };