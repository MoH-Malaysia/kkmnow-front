import { OptionType } from "@components/types";
import { statesOptions } from "@lib/options";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import Dropdown from ".";

interface StateDropdownProps {
  url?: string;
  currentState?: string;
  onChange?: (selected: OptionType) => void;
  exclude?: string[];
  disableText?: boolean;
  width?: string;
}

const StateDropdown: FunctionComponent<StateDropdownProps> = ({
  url,
  currentState,
  onChange,
  exclude,
  disableText = false,
  width = "w-64",
}) => {
  const router = useRouter();
  return (
    <div className="flex items-center gap-4">
      {!disableText && <p className="text-sm font-bold text-dim">Zoom into</p>}
      <Dropdown
        onChange={selected =>
          onChange ? onChange(selected) : router.push(`${url}/${selected.value}`)
        }
        selected={statesOptions.find(state => state.value === currentState)}
        options={statesOptions.filter(option => !exclude?.includes(option.value))}
        placeholder="Select state"
        enableFlag
        width={width}
      />
    </div>
  );
};

export default StateDropdown;
