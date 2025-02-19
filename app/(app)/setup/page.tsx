"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Trash } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

// Zod schema for the setup form (KvMapper + socials + skills)
const setupSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().nonempty("Phone is required"),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  image: z.string().url("Must be a valid URL"),
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "DOB must be in YYYY-MM-DD format"),
  job: z.string().nonempty("Job is required"),
  bio: z.string().nonempty("Bio is required"),
  socials: z
    .array(
      z.object({
        name: z.string().nonempty("Social name is required"),
        url: z.string().url("Invalid URL"),
      })
    )
    .optional(),
  skills: z
    .array(
      z.object({
        name: z.string().nonempty("Skill name is required"),
        icon_url: z.string().url("Invalid URL").optional(),
      })
    )
    .optional(),
});

type SetupFormData = z.infer<typeof setupSchema>;

export default function SetupPage() {
  // Only available during development
  const form = useForm<SetupFormData>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      prefix: "",
      suffix: "",
      image: "",
      dob: "",
      job: "",
      bio: "",
      socials: [],
      skills: [],
    },
  });

  const {
    fields: socialsFields,
    append: appendSocial,
    remove: removeSocial,
  } = useFieldArray({
    control: form.control,
    name: "socials",
  });

  const {
    fields: skillsFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  async function onSubmit(data: SetupFormData) {
    // Wire up your data persistence here (e.g. call an API or database action)
    console.log("Setup data submitted:", data);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Development Setup</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* KvMapper Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="job"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job</FormLabel>
                  <FormControl>
                    <Input placeholder="Your job title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input placeholder="YYYY-MM-DD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea placeholder="Tell us about yourself" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Dynamic Socials */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Socials</h2>
            <div className="space-y-4">
              {socialsFields.map((item, index) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <FormField
                    control={form.control}
                    name={`socials.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Platform Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Twitter" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`socials.${index}.url`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeSocial(index)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => appendSocial({ name: "", url: "" })}
              >
                <PlusCircle className="w-4 h-4 mr-2" /> Add Social
              </Button>
            </div>
          </div>

          {/* Dynamic Skills */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Skills</h2>
            <div className="space-y-4">
              {skillsFields.map((item, index) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <FormField
                    control={form.control}
                    name={`skills.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Skill Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., React" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`skills.${index}.icon_url`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Icon URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeSkill(index)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => appendSkill({ name: "", icon_url: "" })}
              >
                <PlusCircle className="w-4 h-4 mr-2" /> Add Skill
              </Button>
            </div>
          </div>

          <Button type="submit">Save Setup</Button>
        </form>
      </Form>
    </div>
  );
}
