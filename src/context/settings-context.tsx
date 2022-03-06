import React, { useReducer } from "react";

interface SettingsReducerState {
  defColor: string;
  rowSize: number;
  columnSize: number;
  color: string;
  tool: "BRUSH" | "FILL" | "ERASER" | "PIPETTE" | "MOVE" | null;
}

interface SettingsReducerAction {
  type: string;
  data?: any;
  rId?: string;
}

const initialState = {
  defColor: "#000",
  rowSize: 16,
  columnSize: 16,
  color: "#000",
  tool: null,
};

export const SettingsContext = React.createContext<ProviderValue>({
  settings: null,
  settingsDispatch: null,
});

interface SettingsReducer {
  (a: SettingsReducerState, b: SettingsReducerAction): SettingsReducerState;
}

const reducer: SettingsReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ROW":
      return {
        ...state,
        rowSize: state.rowSize + 1,
      };
    case "DEL_ROW":
      return {
        ...state,
        rowSize: state.rowSize - 1 || 1,
      };
    case "ADD_COL":
      return {
        ...state,
        columnSize: state.columnSize + 1,
      };
    case "DEL_COL":
      return {
        ...state,
        columnSize: state.columnSize - 1 || 1,
      };
    case "SET_TOOL":
      return {
        ...state,
        tool: action.data,
      };
    case "SET_COLOR":
      return {
        ...state,
        color: action.data,
      };
    default:
      throw new Error(`Uncaught type: ${action.type}`);
  }
};

interface ProviderValue {
  settings: SettingsReducerState | null;
  settingsDispatch: React.Dispatch<SettingsReducerAction> | null;
}

const SettingsContextProvider = (props: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <SettingsContext.Provider
      value={{ settings: state, settingsDispatch: dispatch }}
    >
      {props.children}
    </SettingsContext.Provider>
  );
};

export default SettingsContextProvider;
