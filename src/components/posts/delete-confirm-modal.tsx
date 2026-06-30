import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Post, useDeletePost } from '@/hooks/use-posts';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteConfirmModal({ post, isOpen, onClose }: DeleteConfirmModalProps) {
  const deletePost = useDeletePost();

  const handleConfirm = () => {
    if (!post) return;
    deletePost.mutate(post._id, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive mb-2">
            <AlertTriangle className="size-5" />
            <DialogTitle>Delete Post</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete the post "{post?.title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button variant="outline" onClick={onClose} disabled={deletePost.isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={deletePost.isPending}>
            {deletePost.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
