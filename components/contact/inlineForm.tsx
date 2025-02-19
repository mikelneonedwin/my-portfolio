"use client";

import { createSocial, updateSocial } from "@/actions/admin";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ToastAction } from "@/components/ui/toast";
import { useAuth } from "@/context/auth";
import { useSocial } from "@/context/contact";
import { useToast } from "@/hooks/use-toast";
import { platformSchema, socialUrlSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Plus, Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { PLATFORMS } from "@/constants";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { DialogClose, DialogFooter } from "../ui/dialog";

const socialSchema = z.object({
  name: platformSchema,
  url: socialUrlSchema,
  id: z.string().optional(),
});

type Data = z.infer<typeof socialSchema>;

type FormProps = {
  initialState?: Data;
};

export default function InlineForm({ initialState }: FormProps) {
  const { getIdToken } = useAuth();
  const { toast } = useToast();
  const { dispatch } = useSocial()!;
  const form = useForm<Data>({
    resolver: zodResolver(socialSchema),
    defaultValues: initialState,
  });

  const UPDATING = typeof initialState === "object";

  async function save(values: Data) {
    try {
      const token = await getIdToken();
      const result = UPDATING
        ? await updateSocial({
            token,
            data: values,
            id: initialState.id!,
          })
        : await createSocial({
            token,
            platform: values.name,
            url: values.url,
          });

      if (typeof result === "string") throw new Error(result);

      if (UPDATING) {
        dispatch({
          type: "UPDATE_SOCIAL",
          payload: {
            id: initialState!.id!,
            data: values,
          },
        });
      } else {
        dispatch({
          type: "ADD_SOCIAL",
          payload: {
            ...values,
            id: result?.id ?? "",
          },
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Uh oh! Something went wrong`,
        description:
          typeof error === "string"
            ? error
            : `Could not update ${values.name}.`,
        action: (
          <ToastAction altText="Try again" onClick={() => void save(values)}>
            Try again
          </ToastAction>
        ),
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(save)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Platform</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? PLATFORMS.find((platform) => platform === field.value)
                        : "Select Platform"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent>
                  <Command>
                    <CommandInput
                      placeholder="Search platform..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No platforms found.</CommandEmpty>
                      <CommandGroup>
                        {PLATFORMS.map((platform) => (
                          <CommandItem
                            key={platform}
                            value={platform}
                            onSelect={() => {
                              form.setValue("name", platform);
                            }}
                          >
                            {platform}
                            <Check
                              className={cn(
                                "ml-auto",
                                platform === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                The name of the social media platform
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input placeholder="e.g. https://fb.me/facebook" {...field} />
              </FormControl>
              <FormDescription>A direct link to your profile</FormDescription>
            </FormItem>
          )}
        />
        <DialogFooter className="items-start flex-row justify-end space-x-2">
          <DialogClose asChild>
            <Button type="submit" size="sm" variant="default">
              {UPDATING ? (
                <>
                  Save
                  <Save size={16} />
                </>
              ) : (
                <>
                  Add
                  <Plus size={16} />
                </>
              )}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" size="sm" variant="destructive">
              Cancel
              <X size={16} />
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  );
}
