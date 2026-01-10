import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Helper for Tailwind classes
export const cn = (...inputs) => twMerge(clsx(inputs));

// Card Component
export const Card = ({ children, className }) => (
  <div
    className={cn(
      "bg-white rounded-3xl p-6 shadow-sm border border-gray-100",
      className
    )}
  >
    {children}
  </div>
);

// Button Component
export const Button = ({
  children,
  className,
  fullWidth,
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-6 py-3 font-semibold transition-all duration-200 focus:outline-none disabled:opacity-50",
        "bg-primary text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30",
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
