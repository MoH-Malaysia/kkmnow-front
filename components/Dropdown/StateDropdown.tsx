import { OptionType } from "@components/types";
import { statesOptions } from "@lib/options";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import Dropdown from ".";

interface StateDropdownProps {
  url?: string;
  currentState?: string;
  onChange?: (selected: OptionType) => void;
  disabled?: boolean;
  exclude?: string[];
  width?: string;
  label?: string;
}

const StateDropdown: FunctionComponent<StateDropdownProps> = ({
  url,
  currentState,
  onChange,
  exclude,
  width = "w-64",
  label,
  disabled = false,
}) => {
  const router = useRouter();
  const redirect = (selected: OptionType) => {
    if (selected.value === "mys") {
      url && router.push(url);
      return;
    }
    url && router.push(`${url}/${selected.value}`);
  };
  return (
    <Dropdown
      onChange={selected => (onChange ? onChange(selected) : redirect(selected))}
      disabled={disabled}
      selected={statesOptions.find(state => state.value === currentState)}
      options={statesOptions.filter(option => !exclude?.includes(option.value))}
      placeholder="Select state"
      enableFlag
      width={width}
      label={label}
    />
  );
};

export default StateDropdown;
