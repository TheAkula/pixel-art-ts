import React, { useReducer } from "react";

export interface Pixel {
  xpos: number;
  ypos: number;
  color: string;
}

export interface Art {
  rows: Pixel[][];
  id: number;
}

interface ArtsReducerState {
  arts: Art[];
  chosen: number | null;
}

interface ArtsReducerAction {
  type: string;
  data?: any;
  artId?: number;
  x?: number;
  y?: number;
}

interface ArtsProviderValue {
  arts: ArtsReducerState;
  artsDispatch: React.Dispatch<ArtsReducerAction>;
}

const initialState: ArtsReducerState = {
  arts: [],
  chosen: null,
};

export const ArtsContext = React.createContext<ArtsProviderValue | null>(null);

interface ArtsReducer {
  (a: ArtsReducerState, b: ArtsReducerAction): ArtsReducerState;
}

const reducer: ArtsReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ART":
      return {
        ...state,
        arts: [...state.arts!, action.data],
        chosen: action.data.id,
      };
    case "ADD_ROW":
      const newArts = JSON.parse(JSON.stringify(state.arts)) as Art[];
      newArts.forEach((art) => {
        art.rows.push(action.data);
      });
      return {
        ...state,
        arts: newArts,
      };
    case "DEL_ROW":
      const arts = JSON.parse(JSON.stringify(state.arts)) as Art[];
      if (arts[0].rows.length === 1) return { ...state, arts: state.arts };
      arts.forEach((art) => {
        art.rows.pop();
      });
      return {
        ...state,
        arts: arts,
      };
    case "ADD_COL":
      const arts1 = JSON.parse(JSON.stringify(state.arts)) as Art[];
      arts1.forEach((art) => {
        art.rows.forEach((row, id) => {
          row.push({ xpos: action.data.x, ypos: id, color: action.data.color });
        });
      });
      return {
        ...state,
        arts: arts1,
      };
    case "DEL_COL":
      const arts2 = JSON.parse(JSON.stringify(state.arts)) as Art[];
      if (arts2[0].rows[0].length === 1) return { ...state, arts: state.arts };
      arts2.forEach((art) => {
        art.rows.forEach((row) => {
          row.pop();
        });
      });
      return {
        ...state,
        arts: arts2,
      };
    case "SET_CHOSEN":
      return {
        ...state,
        chosen: action.data,
      };
    case "SET_PIX":
      let arts3 = JSON.parse(JSON.stringify(state.arts)) as Art[];
      const a = arts3.find((art) => art.id === action.artId)!;
      arts3[arts3.indexOf(a)].rows[action.y!][action.x!].color = action.data;
      return {
        ...state,
        arts: arts3,
      };
    case "DELETE_ART":
      if (state.arts.length === 1)
        return {
          ...state,
        };
      const deletedArt = state.arts.find((art) => art.id === action.data)!;
      const arts4 = JSON.parse(JSON.stringify(state.arts)) as Art[];
      const startArts = arts4.slice(0, deletedArt.id);
      const endArts = arts4.slice(deletedArt.id + 1);
      endArts.forEach((art) => {
        art.id = art.id - 1;
      });
      return {
        chosen: state.arts.length - 2,
        arts: startArts.concat(endArts),
      };
    case "COPY_ART":
      const copiedArt = JSON.parse(
        JSON.stringify(state.arts.find((art) => art.id === action.data))
      );
      const newArts1 = JSON.parse(JSON.stringify(state.arts)) as Art[];
      copiedArt.id = copiedArt.id + 1;
      const updArts1 = newArts1.slice(0, copiedArt.id).concat(copiedArt);
      const updArts2 = newArts1.slice(copiedArt.id).map((art) => {
        art.id = art.id + 1;
        return art;
      });
      return {
        chosen: state.chosen! + 1,
        arts: updArts1.concat(updArts2),
      };
    case "UPD_ART":
      const updatedArts = JSON.parse(JSON.stringify(state.arts)) as Art[];
      let art = updatedArts.find((art) => art.id === action.artId)!;
      updatedArts[updatedArts.indexOf(art)] = action.data;
      return {
        arts: updatedArts,
        chosen: state.chosen,
      };
    default:
      throw new Error("Uncaught type: " + action.type);
  }
};

const ArtsContextProvider = (props: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <ArtsContext.Provider value={{ arts: state, artsDispatch: dispatch }}>
      {props.children}
    </ArtsContext.Provider>
  );
};

export default ArtsContextProvider;
