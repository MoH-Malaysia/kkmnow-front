import { ChangeEventHandler, FunctionComponent, ReactElement } from "react";

interface CheckboxProps {
  name?: string;
  value: boolean;
  required?: boolean;
  disabled?: boolean;
  children: string | ReactElement;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const Checkbox: FunctionComponent<CheckboxProps> = ({
  name,
  required,
  value,
  disabled = false,
  children,
  onChange,
}) => {
  return (
    <div className="checkbox">
      <label htmlFor={name}>
        <div className="relative flex items-center gap-4">
          <input
            id={name}
            type="checkbox"
            name={name}
            defaultChecked={value}
            disabled={disabled}
            onChange={onChange}
            required={required}
          />
          {children}
        </div>
      </label>
    </div>
  );
};

export default Checkbox;
