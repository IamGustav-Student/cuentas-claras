import { httpClient } from "./httpClient";

// RF-13/RF-14.
export const budgetApi = {
  contribute: (sessionId: string, payload: { participantId: string; amount: number }) =>
    httpClient.post(`/sessions/${sessionId}/budget`, payload),

  getResult: (sessionId: string) => httpClient.get(`/sessions/${sessionId}/result`),
};
