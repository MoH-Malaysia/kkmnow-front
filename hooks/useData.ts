import { useState } from "react";
export const useData = (data: Record<string, any> = {}) => {
  const [state, setState] = useState(data);

  const setData = (key: string, value: any) => {
    setState({ ...state, [state[key]]: value });
  };

  return {
    data: state,
    setData,
  };
};
