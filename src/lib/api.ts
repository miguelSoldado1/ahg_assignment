import { tryCatch } from "@/try-catch";

export async function fetcher(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const result = await tryCatch(response.json());
    const errorData = result.data || {};
    throw new Error(errorData.error || "Failed to fetch data");
  }

  return response.json();
}
