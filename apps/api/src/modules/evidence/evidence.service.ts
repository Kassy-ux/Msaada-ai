import { prisma } from "../../../../../packages/database/src/index";
import { uploadToCloudinary } from "./cloudinary";

export async function addEvidence(
  caseId: string,
  fileBuffer: Buffer,
  description?: string
) {
  const { url, fileType } = await uploadToCloudinary(fileBuffer);

  const evidence = await prisma.evidence.create({
    data: {
      caseId,
      fileUrl: url,
      fileType,
      description: description ?? null,
    },
  });

  await prisma.caseEvent.create({
    data: {
      caseId,
      type: "EVIDENCE_UPLOADED",
      description: `Evidence uploaded${description ? `: ${description}` : ""}`,
    },
  });

  return evidence;
}

export async function getEvidenceForCase(caseId: string) {
  return prisma.evidence.findMany({
    where: { caseId },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteEvidence(evidenceId: string) {
  return prisma.evidence.delete({ where: { id: evidenceId } });
}
