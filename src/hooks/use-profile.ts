import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";
import { User } from "./use-auth";
import { useRouter } from "next/navigation";

export const useUpdateName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string }) => {
      const res = await api.patch<{ name: string }>("/user/update-name", data);
      return res.data;
    },
    onSuccess: (data) => {
      // Optimistically update or just invalidate
      queryClient.setQueryData(["user"], (oldData: User | undefined) => {
        if (!oldData) return oldData;
        return { ...oldData, name: data.name };
      });
      toast.success("Name updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update name");
    },
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async (data: Record<string, string>) => {
      const res = await api.patch("/user/update-password", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update password");
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const res = await api.delete("/user/delete");
      return res.data;
    },
    onSuccess: () => {
      queryClient.cancelQueries();
      queryClient.setQueryData(["user"], null);

      router.replace("/login");
      toast.success("Account deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete account");
    },
  });
};
