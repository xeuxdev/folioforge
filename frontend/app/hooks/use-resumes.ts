import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, ApiError } from "~/lib/api-client";
import type { CanonicalResumeGraph } from "~/types/resume";

export interface ResumeRecord {
  id: string;
  userId: string;
  title: string;
  originalFilename: string;
  fileKey: string;
  fileType: "pdf" | "docx";
  fileSize: number;
  parsingStatus: "pending" | "processing" | "completed" | "failed";
  rawText?: string | null;
  parsedData?: CanonicalResumeGraph | null;
  createdAt: string;
  updatedAt: string;
}

export function useResumes() {
  const queryClient = useQueryClient();

  const resumesQuery = useQuery<ResumeRecord[], ApiError>({
    queryKey: ["resumes", "me"],
    queryFn: () => apiClient<ResumeRecord[]>("/api/v1/resumes/me"),
  });

  const uploadMutation = useMutation<
    ResumeRecord,
    ApiError,
    { file: File; title?: string }
  >({
    mutationFn: async ({ file, title }) => {
      const formData = new FormData();
      formData.append("file", file);
      if (title) {
        formData.append("title", title);
      }

      const response = await fetch("/api/v1/resumes/upload", {
        method: "POST",
        body: formData,
        credentials: "same-origin",
      });

      if (!response.ok) {
        let errorData: unknown = null;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }
        throw new ApiError(response.status, response.statusText, errorData);
      }

      return response.json() as Promise<ResumeRecord>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes", "me"] });
    },
  });

  const updateMutation = useMutation<
    ResumeRecord,
    ApiError,
    { id: string; title?: string; parsedData?: CanonicalResumeGraph }
  >({
    mutationFn: ({ id, title, parsedData }) =>
      apiClient<ResumeRecord>(`/api/v1/resumes/${id}`, {
        method: "PUT",
        body: JSON.stringify({ title, parsedData }),
      }),
    onSuccess: (updatedRecord) => {
      queryClient.invalidateQueries({ queryKey: ["resumes", "me"] });
      queryClient.setQueryData(["resumes", updatedRecord.id], updatedRecord);
    },
  });

  const deleteMutation = useMutation<{ success: boolean }, ApiError, string>({
    mutationFn: (id) =>
      apiClient<{ success: boolean }>(`/api/v1/resumes/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes", "me"] });
    },
  });

  return {
    resumes: resumesQuery.data ?? [],
    isLoading: resumesQuery.isLoading,
    isError: resumesQuery.isError,
    error: resumesQuery.error,
    uploadResume: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    uploadError: uploadMutation.error,
    updateResume: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteResume: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    refetchResumes: () => resumesQuery.refetch(),
  };
}

export function useResume(id?: string) {
  return useQuery<ResumeRecord, ApiError>({
    queryKey: ["resumes", id],
    queryFn: () => apiClient<ResumeRecord>(`/api/v1/resumes/${id}`),
    enabled: Boolean(id),
  });
}
