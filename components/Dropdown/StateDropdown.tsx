import { OptionType } from "@components/types";
import { statesOptions } from "@lib/options";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import Dropdown from ".";

interface StateDropdownProps {
  url?: string;
  currentState: string;
  onChange?: (selected: OptionType) => OptionType<any, any>;
}

const StateDropdown: FunctionComponent<StateDropdownProps> = ({ url, currentState, onChange }) => {
  const router = useRouter();
  return (
    <div className="flex items-center gap-4">
      <p className="text-sm font-bold text-dim">Zoom into</p>
      <Dropdown
        onChange={selected =>
          onChange ? onChange(selected) : router.push(`${url}/${selected.value}`)
        }
        selected={statesOptions.find(state => state.value === currentState)}
        options={statesOptions}
        placeholder="Select state"
        enableFlag
        width="w-64"
      />
    </div>
  );
};

export default StateDropdown;
