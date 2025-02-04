// TODO toasts for errors

"use client";

import { createSocial, deleteSocial } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/auth";
import { Edit, Save, Trash } from "lucide-react";
import { useReducer, type ChangeEvent } from "react";
import { SocialIcon } from "react-social-icons";

type State = {
  socials: [SocialPlatforms, string][];
  newSocial: { key: SocialPlatforms | ""; value: string };
  editingSocial: SocialPlatforms | null;
};

type Action =
  | { type: "SET_SOCIALS"; payload: [SocialPlatforms, string][] }
  | {
      type: "SET_NEW_SOCIAL";
      payload: { key: SocialPlatforms | ""; value: string };
    }
  | { type: "SET_EDITING_SOCIAL"; payload: SocialPlatforms | null }
  | { type: "UPDATE_SOCIAL"; payload: { key: SocialPlatforms; value: string } }
  | { type: "DELETE_SOCIAL"; payload: SocialPlatforms };

const initialState: State = {
  socials: [],
  newSocial: { key: "", value: "" },
  editingSocial: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_SOCIALS":
      return { ...state, socials: action.payload };
    case "SET_NEW_SOCIAL":
      return { ...state, newSocial: action.payload };
    case "SET_EDITING_SOCIAL":
      return { ...state, editingSocial: action.payload };
    case "UPDATE_SOCIAL":
      return {
        ...state,
        socials: state.socials.map(([key, value]) =>
          key === action.payload.key
            ? [key, action.payload.value]
            : [key, value]
        ),
      };
    case "DELETE_SOCIAL":
      return {
        ...state,
        socials: state.socials.filter(([key]) => key !== action.payload),
      };
    default:
      return state;
  }
}

type props = {
  data: Array<[SocialPlatforms, string]>;
};

export default function ContactPage({ data }: props) {
  const { user, getIdToken } = useAuth();
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    socials: data,
  });

  const handleAddSocial = async () => {
    if (state.newSocial.key && state.newSocial.value) {
      await createSocial(
        state.newSocial.key,
        state.newSocial.value,
        await getIdToken()
      );
      dispatch({
        type: "UPDATE_SOCIAL",
        payload: {
          key: state.newSocial.key as SocialPlatforms,
          value: state.newSocial.value,
        },
      });
      dispatch({ type: "SET_NEW_SOCIAL", payload: { key: "", value: "" } });
    }
  };

  const handleEditSocial = async (key: SocialPlatforms, value: string) => {
    createSocial(key, value, await getIdToken());
    dispatch({ type: "UPDATE_SOCIAL", payload: { key, value } });
    dispatch({ type: "SET_EDITING_SOCIAL", payload: null });
  };

  const handleDeleteSocial = async (key: SocialPlatforms) => {
    await deleteSocial(key, await getIdToken());
    dispatch({ type: "DELETE_SOCIAL", payload: key });
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    key: SocialPlatforms
  ) => {
    dispatch({
      type: "UPDATE_SOCIAL",
      payload: { key, value: e.target.value },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Contact Me</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {state.socials.map(([key, value]) => (
          <div
            key={key}
            className="bg-card text-card-foreground p-4 rounded-lg flex items-center space-x-2"
          >
            <SocialIcon url={value} className="size-[24px]" />
            {state.editingSocial === key ? (
              <Input
                value={value}
                onChange={(e) => handleInputChange(e, key)}
                className="flex-grow"
              />
            ) : (
              <a href={value} target="_blank" rel="noopener noreferrer">
                {key}
              </a>
            )}
            {user && (
              <div className="flex space-x-2">
                {state.editingSocial === key ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditSocial(key, value)}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      dispatch({ type: "SET_EDITING_SOCIAL", payload: key })
                    }
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteSocial(key)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
      {user && (
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Social</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Social</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Select
                value={state.newSocial.key}
                onValueChange={(value) =>
                  dispatch({
                    type: "SET_NEW_SOCIAL",
                    payload: {
                      ...state.newSocial,
                      key: value as SocialPlatforms,
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Social Platform" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(state.socials).map((social) => (
                    <SelectItem key={social} value={social}>
                      {social}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Social Value"
                value={state.newSocial.value}
                onChange={(e) =>
                  dispatch({
                    type: "SET_NEW_SOCIAL",
                    payload: { ...state.newSocial, value: e.target.value },
                  })
                }
              />
              <Button onClick={handleAddSocial}>Add Social</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
