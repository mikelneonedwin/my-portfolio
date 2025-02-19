// TODO toasts for errors

"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth";
import type { Social } from "@/types/db";
import { AccordionContent } from "@radix-ui/react-accordion";
import { Save } from "lucide-react";
import { useReducer } from "react";
import { SocialIcon } from "react-social-icons";

type State = Social[];

type Action =
  | {
      type: "ADD_SOCIAL";
      payload: State[number];
    }
  | {
      type: "DELETE_SOCIAL";
      payload: {
        id: State[number]["id"];
      };
    }
  | {
      type: "UPDATE_SOCIAL";
      payload: {
        id: State[number]["id"];
        data: Partial<State[number]>;
      };
    };

function socialReducer(state: State, action: Action): State {
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

// const socialSchema = z.object({
//   name: platformSchema,
//   url: socialUrlSchema,
// });

// type Data = z.infer<typeof socialSchema>;

// type FormProps = {
//   initialState: Data;
//   socialId: string;
//   dispatch: ActionDispatch<[action: Action]>;
// };

// function SocialForm({ initialState, socialId, dispatch }: FormProps) {
//   const { getIdToken } = useAuth();
//   const { toast } = useToast();
//   const form = useForm<Data>({
//     resolver: zodResolver(socialSchema),
//     defaultValues: initialState,
//   });

//   async function save(values: Data) {
//     dispatch({
//       type: "UPDATE_SOCIAL",
//       payload: {
//         id: socialId,
//         data: values,
//       },
//     });
//     const error = await updateSocial({
//       data: values,
//       id: socialId,
//       token: await getIdToken(),
//     });
//     if (!error) return;
//     toast({
//       variant: "destructive",
//       title: "Uh oh! Something went wrong.",
//       description: error,
//     });
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(save)} className="space-y-8">
//         <FormField
//           control={form.control}
//           name="name"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Platform</FormLabel>
//               <FormControl>
//                 <Input {...field} placeholder="e.g Facebook" />
//               </FormControl>
//               <FormDescription>
//                 The name of the social media platform
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="url"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Link</FormLabel>
//               <FormControl>
//                 <Input placeholder="https://fb.me/facebook" {...field} />
//               </FormControl>
//               <FormDescription>A direct link to your profile</FormDescription>
//             </FormItem>
//           )}
//         />
//         <Button disabled={} type="submit" variant="outline" size="sm">
//           <Save className="w-4 h-4" />
//         </Button>
//       </form>
//     </Form>
//   );
// }

type ContactProps = {
  initialState: State;
};

export default function ContactPage({ initialState }: ContactProps) {
  const [state, dispatch] = useReducer(socialReducer, initialState);
  // const [editingId, setEditingId] = useState<string | null>(null);
  const { user } = useAuth();
  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Contact Me</h1>
        <Accordion
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          type="single"
          collapsible
        >
          {state.map((val) =>
            user ? (
              <AccordionItem value={val.name} key={val.id}>
                <AccordionTrigger>
                  <SocialIcon url={val.url} className="size-[24px]" />
                  <p>{val.name}</p>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <Label htmlFor="platform">Name</Label>
                    <Input
                      type="text"
                      name="platform"
                      value={val.name}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_SOCIAL",
                          payload: {
                            id: val.id,
                            data: {
                              name: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="url">Link</Label>
                    <Input
                      type="url"
                      name="platform"
                      value={val.url}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_SOCIAL",
                          payload: {
                            id: val.id,
                            data: {
                              url: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        // disable
                        e.currentTarget.disabled = true;
                        // save to db
                      }}
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ) : (
              <div
                key={val.id}
                className="bg-card text-card-foreground p-4 rounded-lg flex items-center space-x-2"
              >
                <SocialIcon url={val.url} className="size-[24px]" />
                <a href={val.url} target="_blank" rel="noopener noreferrer">
                  {val.name}
                </a>
              </div>
            )
          )}
        </Accordion>
      </main>
    </>
  );
}
