"use client";

import { updatePost } from "@/app/actions/post";
import { showToast } from "@/components/shared/toasterlogin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Post } from "@/types/post";
import { useEffect, useState } from "react";

interface PostEditDialogProps {
  post: Post | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostUpdated: () => void;
}

export function PostEditDialog({
  post,
  open,
  onOpenChange,
  onPostUpdated,
}: PostEditDialogProps) {
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (post) setDescription(post.description);
  }, [post]);

  const handleSave = async () => {
    if (!post) return;
    if (!description.trim()) {
      showToast.error("Required", "Description cannot be empty.");
      return;
    }

    setIsSaving(true);
    try {
      await updatePost(post.id, { description: description.trim() });
      showToast.success("Updated", "Post updated successfully.");
      onPostUpdated();
      onOpenChange(false);
    } catch (error) {
      showToast.error("Update failed", (error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Label htmlFor="post-description">Description</Label>
          <Textarea
            id="post-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            placeholder="Post description..."
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
