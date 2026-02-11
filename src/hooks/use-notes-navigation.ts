"use client";

import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export function useNotesNavigation() {
  const [query, setQuery] = useQueryStates(
    { patient_id: parseAsString.withDefault(""), page: parseAsInteger.withDefault(1) },
    { shallow: true },
  );

  function setPatientId(patientId: string) {
    setQuery({ patient_id: patientId, page: 1 });
  }

  function setPage(page: number) {
    setQuery({ page });
  }

  return { patientId: query.patient_id, page: query.page, setPatientId, setPage };
}
