import { FunctionComponent, MouseEventHandler, ReactElement } from "react";

interface ButtonProps {
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children?: ReactElement | ReactElement[] | string;
  icon?: ReactElement;
  disabled?: boolean;
}

const Button: FunctionComponent<ButtonProps> = ({
  className = "flex items-center gap-2 text-dim text-sm hover:bg-washed transition-all p-2 rounded-md hover:bg-opacity-50",
  icon,
  onClick,
  children,
  disabled = false,
}) => {
  return (
    <>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${className} disabled:cursor-not-allowed disabled:opacity-50 hover:disabled:bg-transparent`}
      >
        {icon}
        {children}
      </button>
    </>
  );
};

export default Button;
