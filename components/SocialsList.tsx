"use client";

import { createSocial, deleteSocial, updateSocial } from "@/actions/socials";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { socialSchema } from "@/schemas/socials";
import type { Social } from "@/types/db";
import { errorMessage } from "@/utils/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as icons from "simple-icons";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { runAction } from "@/utils/client";

type SocialFormData = z.infer<typeof socialSchema>;

// Icon rendering component
function SocialIcon({ slug }: { slug: string }) {
  const icon = icons[slug as keyof typeof icons] as icons.SimpleIcon;
  if (!icon) return null;
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="mr-2"
    >
      <path d={icon.path} />
    </svg>
  );
}

export default function SocialsList({ socials }: { socials: Social[] }) {
  const [editingSocial, setEditingSocial] = useState<Social | null>(null);
  const [addingSocial, setAddingSocial] = useState(false);
  const { user, getIdToken } = useAuth();
  const isAdmin = useMemo(() => Boolean(user), [user]);

  // Edit form
  const editForm = useForm<SocialFormData>({
    resolver: zodResolver(socialSchema),
    defaultValues: editingSocial
      ? {
          name: editingSocial.name,
          slug: editingSocial.slug,
          url: editingSocial.url,
        }
      : {},
  });

  // Add form
  const addForm = useForm<SocialFormData>({
    resolver: zodResolver(socialSchema),
  });

  // Handle edit submission
  const handleEditSubmit = async (data: SocialFormData) => {
    if (editingSocial) {
      try {
        const idToken = await getIdToken();
        await runAction(updateSocial(idToken, editingSocial.id, data));
        setEditingSocial(null);
      } catch (error) {
        toast({
          title: "Failed to update social",
          description: errorMessage(error),
          variant: "destructive",
        });
      }
    }
  };

  // Handle add submission
  const handleAddSubmit = async (data: SocialFormData) => {
    try {
      const idToken = await getIdToken();
      await runAction(createSocial(idToken, data));
      setAddingSocial(false);
    } catch (error) {
      toast({
        title: "Failed to add social",
        description: errorMessage(error),
        variant: "destructive",
      });
    }
  };

  // Handle delete
  const handleDelete = async (id: Social["id"]) => {
    try {
      const idToken = await getIdToken();
      await runAction(deleteSocial(idToken, id));
    } catch (error) {
      toast({
        title: "Failed to delete social",
        description: errorMessage(error),
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {socials.map((social) => (
          <div
            key={social.id}
            className="flex items-center justify-between p-4 bg-card border rounded-lg"
          >
            {isAdmin ? (
              <button
                onClick={() => setEditingSocial(social)}
                className="flex items-center text-left w-full"
              >
                <SocialIcon slug={social.slug} />
                <span>{social.name}</span>
              </button>
            ) : (
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-left w-full hover:underline"
              >
                <SocialIcon slug={social.slug} />
                <span>{social.name}</span>
              </a>
            )}
            {isAdmin && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(social.id)}
              >
                Delete
              </Button>
            )}
          </div>
        ))}
      </div>

      {isAdmin && (
        <Button onClick={() => setAddingSocial(true)} className="mt-6">
          Add Social
        </Button>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={!!editingSocial}
        onOpenChange={() => setEditingSocial(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Social</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(handleEditSubmit)}
              className="space-y-4"
            >
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Slug (e.g., siTwitter)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="URL" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addingSocial} onOpenChange={setAddingSocial}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Social</DialogTitle>
          </DialogHeader>
          <Form {...addForm}>
            <form
              onSubmit={addForm.handleSubmit(handleAddSubmit)}
              className="space-y-4"
            >
              <FormField
                control={addForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Name" />
                      <FormMessage />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Slug (e.g., siTwitter)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="URL" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Add</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
