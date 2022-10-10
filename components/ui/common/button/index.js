export default function Button({
  children,
  className,
  variant = "purple",
  ...rest
}) {
  const variants = {
    purple: "text-white bg-purple-600 hover:bg-purple-700",
    white: "text-gray-700 bg-white hover:bg-gray-50",
  };
  return (
    <button
      className={`disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 border rounded-md text-base font-medium ${className} ${variants[variant]}`}
      {...rest}>
      {children}
    </button>
  );
}
