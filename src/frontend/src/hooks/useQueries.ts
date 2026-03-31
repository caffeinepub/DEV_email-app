import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { EmailRecord } from "../backend.d";
import { useActor } from "./useActor";

export function useGetEmailHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<EmailRecord[]>({
    queryKey: ["emailHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEmailHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

interface SendEmailParams {
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  body: string;
}

export function useSendEmail() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SendEmailParams) => {
      if (!actor) throw new Error("Not connected");
      return actor.sendAndRecordEmail(
        params.to,
        params.cc,
        params.bcc,
        params.subject,
        params.body,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailHistory"] });
    },
  });
}
