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
  return (
    <Dropdown
      onChange={selected =>
        onChange ? onChange(selected) : router.push(`${url}/${selected.value}`)
      }
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
