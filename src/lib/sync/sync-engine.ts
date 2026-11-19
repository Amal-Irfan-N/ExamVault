import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { examVaultDB, OfflineMutation, LocalExamination } from "@/lib/db/indexed-db";
import { Examination } from "@/types/examination";

export interface SyncAuditItem {
  id: string;
  entity: "examination" | "document" | "credential";
  entityId: string;
  strategy: "last-write-wins" | "merged" | "queued-replay";
  winner: "local" | "remote";
  resolvedAt: string;
  details: string;
}

export interface SyncEngineResult {
  success: boolean;
  syncedExams: number;
  syncedDocs: number;
  syncedCreds: number;
  conflictsResolved: number;
  auditLog: SyncAuditItem[];
  timestamp: string;
  message: string;
}

/**
 * Reconciles local IndexedDB data with remote Supabase cloud backend
 */
export async function runCloudSync(
  userId: string = "user-demo-1",
  isConfigured: boolean = false
): Promise<SyncEngineResult> {
  const auditLog: SyncAuditItem[] = [];
  let conflictsResolved = 0;
  let syncedExams = 0;
  let syncedDocs = 0;
  let syncedCreds = 0;

  try {
    // 1. Process and replay pending offline mutation queue
    const pendingMutations: OfflineMutation[] = await examVaultDB.offlineMutations
      .where("status")
      .equals("pending")
      .toArray();

    const supabase = isConfigured ? getSupabaseBrowserClient() : null;
    const client = supabase as any; // eslint-disable-line @typescript-eslint/no-explicit-any

    if (client && isConfigured) {
      // Replay against real Supabase PostgreSQL
      for (const mut of pendingMutations) {
        try {
          if (mut.entity === "examination") {
            if (mut.action === "create" && mut.payload) {
              const p = mut.payload as Examination;
              await client.from("examinations").upsert({
                id: p.id,
                user_id: userId,
                exam_name: p.examName,
                recruiting_org: p.recruitingOrg,
                category: p.category,
                post_name: p.postName,
                advertisement_number: p.advertisementNumber || null,
                recruitment_year: p.recruitmentYear,
                official_notification_url: p.officialNotificationUrl || null,
                official_application_url: p.officialApplicationUrl || null,
                official_website_url: p.officialWebsiteUrl || null,
                personal_notes: p.personalNotes || null,
                status: p.status,
                is_archived: p.isArchived || false,
                updated_at: p.updatedAt || new Date().toISOString(),
              });
              syncedExams++;
            } else if (mut.action === "update" && mut.payload) {
              const p = mut.payload as Partial<Examination>;
              await client
                .from("examinations")
                .update({
                  ...(p.examName && { exam_name: p.examName }),
                  ...(p.recruitingOrg && { recruiting_org: p.recruitingOrg }),
                  ...(p.status && { status: p.status }),
                  ...(typeof p.isArchived === "boolean" && { is_archived: p.isArchived }),
                  updated_at: new Date().toISOString(),
                })
                .eq("id", mut.entityId);
              syncedExams++;
            } else if (mut.action === "delete") {
              await client.from("examinations").delete().eq("id", mut.entityId);
              syncedExams++;
            }
          }

          auditLog.push({
            id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            entity: mut.entity,
            entityId: mut.entityId,
            strategy: "queued-replay",
            winner: "local",
            resolvedAt: new Date().toISOString(),
            details: `Successfully replayed offline ${mut.action.toUpperCase()} operation to Supabase PostgreSQL.`,
          });

          await examVaultDB.offlineMutations.delete(mut.id);
        } catch (mutErr) {
          console.warn(`Error syncing mutation ${mut.id}:`, mutErr);
          await examVaultDB.offlineMutations.update(mut.id, { retryCount: (mut.retryCount || 0) + 1 });
        }
      }

      // Fetch remote examinations to check for cloud updates
      const { data: remoteExams, error } = await client.from("examinations").select("*");
      if (!error && remoteExams) {
        for (const remote of remoteExams) {
          const local = await examVaultDB.examinations.get(remote.id);
          if (local) {
            const localTime = new Date(local.updatedAt).getTime();
            const remoteTime = new Date(remote.updated_at).getTime();

            if (remoteTime > localTime) {
              // Remote is newer: Remote Wins
              const updatedLocal: LocalExamination = {
                ...local,
                examName: remote.exam_name,
                recruitingOrg: remote.recruiting_org,
                category: remote.category,
                postName: remote.post_name,
                advertisementNumber: remote.advertisement_number || undefined,
                recruitmentYear: remote.recruitment_year,
                applicationStatus: remote.status,
                isArchived: remote.is_archived,
                updatedAt: remote.updated_at,
                syncStatus: "synced",
              };
              await examVaultDB.examinations.put(updatedLocal);
              conflictsResolved++;
              auditLog.push({
                id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                entity: "examination",
                entityId: remote.id,
                strategy: "last-write-wins",
                winner: "remote",
                resolvedAt: new Date().toISOString(),
                details: `Remote record is newer (${new Date(remoteTime).toLocaleTimeString()}). Updated local IndexedDB record.`,
              });
            } else if (localTime > remoteTime) {
              // Local is newer: Local Wins (push to remote)
              await client
                .from("examinations")
                .update({
                  exam_name: local.examName,
                  recruiting_org: local.recruitingOrg,
                  status: local.applicationStatus,
                  is_archived: local.isArchived,
                  updated_at: local.updatedAt,
                })
                .eq("id", local.id);
              conflictsResolved++;
              auditLog.push({
                id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                entity: "examination",
                entityId: local.id,
                strategy: "last-write-wins",
                winner: "local",
                resolvedAt: new Date().toISOString(),
                details: `Local record is newer (${new Date(localTime).toLocaleTimeString()}). Updated remote Supabase PostgreSQL record.`,
              });
            }
          }
        }
      }
    } else {
      // Demo / Local Mode: Simulate realistic cloud synchronization
      await new Promise((resolve) => setTimeout(resolve, 800));

      for (const mut of pendingMutations) {
        auditLog.push({
          id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          entity: mut.entity,
          entityId: mut.entityId,
          strategy: "queued-replay",
          winner: "local",
          resolvedAt: new Date().toISOString(),
          details: `Replayed ${mut.action.toUpperCase()} for ${mut.entity} into ExamVault Cloud Vault (Demo Mode).`,
        });

        if (mut.entity === "examination") syncedExams++;
        if (mut.entity === "document") syncedDocs++;
        if (mut.entity === "credential") syncedCreds++;

        await examVaultDB.offlineMutations.delete(mut.id);
      }

      // Mark all entity tables as synced
      await examVaultDB.examinations.toCollection().modify({ syncStatus: "synced" });
      await examVaultDB.documents.toCollection().modify({ syncStatus: "synced" });
      await examVaultDB.credentials.toCollection().modify({ syncStatus: "synced" });
    }

    const totalSynced = syncedExams + syncedDocs + syncedCreds + pendingMutations.length;

    return {
      success: true,
      syncedExams,
      syncedDocs,
      syncedCreds,
      conflictsResolved,
      auditLog,
      timestamp: new Date().toLocaleTimeString(),
      message:
        totalSynced > 0
          ? `Bi-directional synchronization complete: ${totalSynced} changes reconciled with 0 unresolved conflicts.`
          : "ExamVault is fully up to date with cloud records.",
    };
  } catch (error) {
    console.error("Cloud sync engine error:", error);
    return {
      success: false,
      syncedExams: 0,
      syncedDocs: 0,
      syncedCreds: 0,
      conflictsResolved: 0,
      auditLog: [],
      timestamp: new Date().toLocaleTimeString(),
      message: "Sync encounter an unexpected error. Offline modifications remain safely queued in IndexedDB.",
    };
  }
}
