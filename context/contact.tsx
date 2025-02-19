import {
  createContext,
  useContext,
  type ActionDispatch,
  type FC,
  type ReactNode,
} from "react";

type State = SelectedSocials[];

type Action =
  | {
      type: "ADD_SOCIAL";
      payload: State[number];
    }
  | {
      type: "DELETE_SOCIAL";
      payload: {
        id: string;
      };
    }
  | {
      type: "UPDATE_SOCIAL";
      payload: {
        id: string;
        data: Partial<State[number]>;
      };
    };

export function socialReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_SOCIAL": {
      return [...state, action.payload];
    }
    case "DELETE_SOCIAL": {
      return state.filter((val) => val.id !== action.payload.id);
    }
    case "UPDATE_SOCIAL": {
      return state.map((val) => {
        if (val.id !== action.payload.id) return val;
        return {
          ...val,
          ...action.payload.data,
        };
      });
    }
  }
}

type Dispatch = ActionDispatch<[action: Action]>;

const SocialContext = createContext<{
  dispatch: Dispatch;
} | null>(null);

type Props = {
  dispatch: Dispatch;
  children: ReactNode;
};

export const useSocial = () => useContext(SocialContext);

export const SocialProvider: FC<Props> = ({ dispatch, children }) => {
  return (
    <SocialContext.Provider value={{ dispatch }}>
      {children}
    </SocialContext.Provider>
  );
};
