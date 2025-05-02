export interface ButtonProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  onClick,
  children,
  className = "",
}: ButtonProps) {
  const variants = {
    primary: `
    bg-primary text-white
    hover:bg-primary-hover
    focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2
    active:bg-primary-active
  `,
    secondary: `
    bg-secondary text-white
    hover:bg-secondary-hover
    focus:outline-none focus:ring-2 focus:ring-secondary-light focus:ring-offset-2
    active:bg-secondary-active
  `,
    outline: `
    border border-primary text-primary bg-transparent
    hover:bg-primary hover:text-white
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
    active:bg-primary-active active:text-white
  `,
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`rounded transition-all duration-150 ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
