import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, ApiError } from "~/lib/api-client";
import type { BulletDiffItem } from "~/components/dashboard/tailoring/diff-comparison-list";

export interface TailoredRecord {
  id: string;
  userId: string;
  masterResumeId?: string | null;
  targetRole: string;
  targetCompany: string;
  jobDescription: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  bulletDiffs: BulletDiffItem[];
  createdAt: string;
  updatedAt: string;
}

export function useTailor() {
  const queryClient = useQueryClient();

  const historyQuery = useQuery<TailoredRecord[], ApiError>({
    queryKey: ["tailor", "history"],
    queryFn: () => apiClient<TailoredRecord[]>("/api/v1/tailor/history"),
  });

  const analyzeMutation = useMutation<
    TailoredRecord,
    ApiError,
    {
      masterResumeId?: string;
      targetRole: string;
      targetCompany: string;
      jobDescription: string;
    }
  >({
    mutationFn: (data) =>
      apiClient<TailoredRecord>("/api/v1/tailor/analyze", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (newRecord) => {
      queryClient.invalidateQueries({ queryKey: ["tailor", "history"] });
      queryClient.setQueryData(["tailor", newRecord.id], newRecord);
    },
  });

  const atsCheckMutation = useMutation<
    TailoredRecord,
    ApiError,
    { id: string }
  >({
    mutationFn: ({ id }) =>
      apiClient<TailoredRecord>(`/api/v1/tailor/${id}/ats-check`, {
        method: "POST",
      }),
    onSuccess: (updatedRecord) => {
      queryClient.invalidateQueries({ queryKey: ["tailor", "history"] });
      queryClient.setQueryData(["tailor", updatedRecord.id], updatedRecord);
    },
  });

  const updateMutation = useMutation<
    TailoredRecord,
    ApiError,
    {
      id: string;
      matchedKeywords?: string[];
      missingKeywords?: string[];
      bulletDiffs?: BulletDiffItem[];
    }
  >({
    mutationFn: ({ id, ...data }) =>
      apiClient<TailoredRecord>(`/api/v1/tailor/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: (updatedRecord) => {
      queryClient.invalidateQueries({ queryKey: ["tailor", "history"] });
      queryClient.setQueryData(["tailor", updatedRecord.id], updatedRecord);
    },
  });

  const deleteMutation = useMutation<{ success: boolean }, ApiError, string>({
    mutationFn: (id) =>
      apiClient<{ success: boolean }>(`/api/v1/tailor/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tailor", "history"] });
    },
  });

  const downloadDocx = async (id: string, defaultFilename?: string) => {
    const res = await fetch(`/api/v1/tailor/${id}/export/docx`, {
      method: "POST",
      credentials: "same-origin",
    });
    if (!res.ok) {
      throw new Error("Failed to export DOCX document");
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = defaultFilename || "Tailored_Resume.docx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return {
    history: historyQuery.data ?? [],
    isHistoryLoading: historyQuery.isLoading,
    analyzeJob: analyzeMutation.mutateAsync,
    isAnalyzing: analyzeMutation.isPending,
    analyzeError: analyzeMutation.error,
    evaluateAtsCheck: atsCheckMutation.mutateAsync,
    isEvaluatingAts: atsCheckMutation.isPending,
    updateTailoredRecord: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteTailoredRecord: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    downloadDocx,
  };
}
