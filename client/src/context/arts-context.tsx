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

type HistoryItem = ArtsState;

type History = HistoryItem[];

interface HistoryState {
  prevHistory: History;
  nextHistory: History;
}

interface SettingsState {
  defColor: string;
  rowSize: number;
  columnSize: number;
  color: string;
  tool: "BRUSH" | "FILL" | "ERASER" | "PIPETTE" | "MOVE" | null;
  pixelSize: number;
}

interface ArtsState {
  arts: Art[];
  chosen: number | null;
  settings: SettingsState;
}

interface ArtsReducerState {
  artsState: ArtsState;
  history: HistoryState;
}

interface ArtsReducerAction {
  type: string;
  data?: any;
  artId?: number;
  x?: number;
  y?: number;
}

interface ArtsProviderValue {
  artsState: ArtsState;
  artsDispatch: React.Dispatch<ArtsReducerAction>;
}

const initialState: ArtsReducerState = {
  artsState: {
    arts: [],
    chosen: null,
    settings: {
      pixelSize: 10,
      defColor: "rgb(49, 49, 49)",
      rowSize: 16,
      columnSize: 16,
      color: "rgb(49, 49, 49)",
      tool: null,
    },
  },

  history: {
    prevHistory: [],
    nextHistory: [],
  },
};

export const ArtsContext = React.createContext<ArtsProviderValue | null>(null);

interface ArtsReducer {
  (a: ArtsReducerState, b: ArtsReducerAction): ArtsReducerState;
}

const reducer: ArtsReducer = (state, action) => {
  const curSnapshot = { ...JSON.parse(JSON.stringify(state.artsState)) };
  const newHistory = {
    prevHistory: state.history.prevHistory.concat([curSnapshot]),
    nextHistory: [],
  };
  switch (action.type) {
    case "ADD_ART":
      const addedArt = action.data;
      const arts5 = JSON.parse(JSON.stringify(state.artsState.arts)) as Art[];
      const difY = action.data.rows.length - state.artsState.settings.rowSize;
      const difX =
        action.data.rows[0].length - state.artsState.settings.columnSize;
      const rs =
        difY <= 0
          ? state.artsState.settings.rowSize
          : state.artsState.settings.rowSize + difY;
      if (difY > 0) {
        arts5.forEach((art) => {
          for (let i = 0; i < difY; i++) {
            const row = [];
            for (let j = 0; j < state.artsState.settings.columnSize; j++) {
              row.push({
                xpos: j,
                ypos: state.artsState.settings.rowSize + i,
                color: state.artsState.settings.defColor,
              });
            }
            art.rows.push(row);
          }
        });
      } else if (difY < 0) {
        for (let i = 0; i < Math.abs(difY); i++) {
          const row = [];
          for (let j = 0; j < addedArt.rows[0].length; j++) {
            row.push({
              xpos: j,
              ypos: addedArt.rows.length + i,
              color: state.artsState.settings.defColor,
            });
          }
          addedArt.rows.push(row);
        }
      }
      if (difX > 0) {
        arts5.forEach((art) => {
          for (let i = 0; i < difX; i++) {
            for (let j = 0; j < rs; j++) {
              art.rows[j].push({
                xpos: state.artsState.settings.columnSize + i,
                ypos: j,
                color: state.artsState.settings.defColor,
              });
            }
          }
        });
      } else if (difX < 0) {
        for (let i = 0; i < Math.abs(difX); i++) {
          for (let j = 0; j < rs; j++) {
            addedArt.rows[j].push({
              xpos: addedArt.rows[0].length + i,
              ypos: j,
              color: state.artsState.settings.defColor,
            });
          }
        }
      }
      return {
        ...state,
        artsState: {
          ...state.artsState,
          arts: arts5.concat(action.data),
          chosen: action.data.id,
          settings: {
            ...state.artsState.settings,
            columnSize:
              state.artsState.settings.columnSize + (difX > 0 ? difX : 0),
            rowSize: state.artsState.settings.rowSize + (difY > 0 ? difY : 0),
          },
        },
        history: newHistory,
      };
    case "ADD_ROW":
      const newArts = JSON.parse(JSON.stringify(state.artsState.arts)) as Art[];
      newArts.forEach((art) => {
        art.rows.push(action.data);
      });
      return {
        ...state,
        artsState: {
          ...state.artsState,
          arts: newArts,
          settings: {
            ...state.artsState.settings,
            rowSize: state.artsState.settings.rowSize + 1,
          },
        },
        history: newHistory,
      };
    case "DEL_ROW":
      const arts = JSON.parse(JSON.stringify(state.artsState.arts)) as Art[];
      if (arts[0].rows.length === 1)
        return { ...state, arts: state.artsState.arts };
      arts.forEach((art) => {
        art.rows.pop();
      });
      return {
        ...state,
        artsState: {
          ...state.artsState,
          arts: arts,
          settings: {
            ...state.artsState.settings,
            rowSize: state.artsState.settings.rowSize - 1 || 1,
          },
        },
        history: newHistory,
      };
    case "ADD_COL":
      const arts1 = JSON.parse(JSON.stringify(state.artsState.arts)) as Art[];
      arts1.forEach((art) => {
        art.rows.forEach((row, id) => {
          row.push({ xpos: action.data.x, ypos: id, color: action.data.color });
        });
      });
      return {
        ...state,
        artsState: {
          ...state.artsState,
          arts: arts1,
          settings: {
            ...state.artsState.settings,
            columnSize: state.artsState.settings.columnSize + 1,
          },
        },
        history: newHistory,
      };
    case "DEL_COL":
      const arts2 = JSON.parse(JSON.stringify(state.artsState.arts)) as Art[];
      if (arts2[0].rows[0].length === 1)
        return {
          ...state,
        };
      arts2.forEach((art) => {
        art.rows.forEach((row) => {
          row.pop();
        });
      });
      return {
        ...state,
        artsState: {
          ...state.artsState,
          arts: arts2,
          settings: {
            ...state.artsState.settings,
            columnSize: state.artsState.settings.columnSize - 1,
          },
        },
        history: newHistory,
      };
    case "SET_TOOL":
      return {
        ...state,
        artsState: {
          ...state.artsState,
          settings: {
            ...state.artsState.settings,
            tool: action.data,
          },
        },
      };
    case "SET_COLOR":
      return {
        ...state,
        artsState: {
          ...state.artsState,
          settings: {
            ...state.artsState.settings,
            color: action.data,
          },
        },
      };
    case "SET_CHOSEN":
      return {
        ...state,
        artsState: {
          ...state.artsState,
          chosen: action.data,
        },
        history: newHistory,
      };
    case "SET_PIX":
      let arts3 = JSON.parse(JSON.stringify(state.artsState.arts)) as Art[];
      const a = arts3.find((art) => art.id === action.artId)!;
      arts3[arts3.indexOf(a)].rows[action.y!][action.x!].color = action.data;
      return {
        ...state,
        artsState: {
          ...state.artsState,
          arts: arts3,
        },
        history: newHistory,
      };
    case "DELETE_ART":
      if (state.artsState.arts.length === 1)
        return {
          ...state,
        };
      const deletedArt = state.artsState.arts.find(
        (art) => art.id === action.data
      )!;
      const arts4 = JSON.parse(JSON.stringify(state.artsState.arts)) as Art[];
      const startArts = arts4.slice(0, deletedArt.id);
      const endArts = arts4.slice(deletedArt.id + 1);
      endArts.forEach((art) => {
        art.id = art.id - 1;
      });
      return {
        ...state,
        artsState: {
          ...state.artsState,
          chosen: state.artsState.arts.length - 2,
          arts: startArts.concat(endArts),
        },
        history: newHistory,
      };
    case "COPY_ART":
      const copiedArt = JSON.parse(
        JSON.stringify(
          state.artsState.arts.find((art) => art.id === action.data)
        )
      );
      const newArts1 = JSON.parse(
        JSON.stringify(state.artsState.arts)
      ) as Art[];
      copiedArt.id = copiedArt.id + 1;
      const updArts1 = newArts1.slice(0, copiedArt.id).concat(copiedArt);
      const updArts2 = newArts1.slice(copiedArt.id).map((art) => {
        art.id = art.id + 1;
        return art;
      });
      return {
        ...state,
        artsState: {
          ...state.artsState,
          chosen: state.artsState.chosen! + 1,
          arts: updArts1.concat(updArts2),
        },
        history: newHistory,
      };
    case "UPD_ART":
      const updatedArts = JSON.parse(
        JSON.stringify(state.artsState.arts)
      ) as Art[];
      let art = updatedArts.find((art) => art.id === action.artId)!;
      updatedArts[updatedArts.indexOf(art)] = action.data;
      return {
        ...state,
        artsState: {
          ...state.artsState,
          arts: updatedArts,
          chosen: state.artsState.chosen,
        },
        history: newHistory,
      };
    case "BACK_HIS":
      if (!state.history.prevHistory.length) {
        return {
          ...state,
        };
      }
      const lastSnapshot = state.history.prevHistory.at(-1)!;
      if (!lastSnapshot.arts.length) return { ...state };
      return {
        history: {
          prevHistory: state.history.prevHistory.slice(0, -1),
          nextHistory: state.history.nextHistory.concat([
            JSON.parse(JSON.stringify(state.artsState)),
          ]),
        },
        artsState: {
          ...lastSnapshot,
        },
      };
    case "NEXT_HIS":
      if (!state.history.nextHistory.length) {
        return {
          ...state,
        };
      }
      const lastSnapshot1 = state.history.nextHistory.at(-1)!;
      if (!lastSnapshot1.arts) return { ...state };
      return {
        history: {
          prevHistory: state.history.prevHistory.concat([
            JSON.parse(JSON.stringify(state.artsState)),
          ]),
          nextHistory: state.history.nextHistory.slice(0, -1),
        },
        artsState: {
          ...lastSnapshot1,
        },
      };
    case "SET_PS":
      return {
        ...state,
        artsState: {
          ...state.artsState,
          settings: {
            ...state.artsState.settings,
            pixelSize: action.data,
          },
        },
      };
    default:
      throw new Error("Uncaught type: " + action.type);
  }
};

const ArtsContextProvider = (props: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <ArtsContext.Provider
      value={{ artsState: state.artsState, artsDispatch: dispatch }}
    >
      {props.children}
    </ArtsContext.Provider>
  );
};

export default ArtsContextProvider;
