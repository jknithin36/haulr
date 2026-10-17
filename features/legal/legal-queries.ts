import "server-only";
import { privacy, terms } from "@/lib/demo-data/legal";

const docs = { terms, privacy };

export type LegalDocId = keyof typeof docs;

export async function getLegalDoc(id: LegalDocId) {
  return docs[id];
}
