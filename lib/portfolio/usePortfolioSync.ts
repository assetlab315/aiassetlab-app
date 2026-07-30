"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import type { PortfolioAsset } from "../../features/portfolio/types";
import type { PortfolioSnapshot } from "../../features/portfolio-history/types";
import { canUseSupabaseBrowserClient, createSupabaseBrowserClient } from "../supabase/client";
import {
  clearCloudPortfolioCache,
  loadCloudPortfolioCache,
  loadCloudSnapshotCache,
  loadPortfolioMigrationPending,
  saveCloudPortfolioCache,
  saveCloudSnapshotCache,
  saveGuestPortfolioBackup,
  savePortfolioMigrationPending,
  clearPortfolioMigrationPending,
  savePortfolioSyncMeta,
} from "./cloudPortfolioCache";
import { createAssetsFingerprint } from "./portfolioFingerprint";
import { getPortfolioMigrationState, type PortfolioMigrationState } from "./portfolioMigration";
import type { SyncStatus } from "./repository";
import { createLocalPortfolioRepository } from "./localPortfolioRepository";
import { createSupabasePortfolioRepository } from "./supabasePortfolioRepository";
import { createPortfolioSnapshotFromAssets } from "../portfolio-history/createPortfolioSnapshot";
import {
  clearPortfolioSnapshots,
  loadPortfolioSnapshots,
  savePortfolioSnapshots,
} from "../portfolio-history/portfolioSnapshotStorage";

type OverwriteState = {
  localAssets: PortfolioAsset[];
  localSnapshots: PortfolioSnapshot[];
  cloudAssetCount: number;
} | null;

function shouldLogPortfolioSync() {
  if (typeof window === "undefined") return false;
  return !["aiassetlab.jp", "www.aiassetlab.jp"].includes(window.location.hostname);
}

function logPortfolioSyncEvent(event: string, details: Record<string, string | number | boolean | null> = {}) {
  if (!shouldLogPortfolioSync()) return;
  console.info("[portfolio-sync]", event, details);
}

function addSnapshot(snapshots: PortfolioSnapshot[], assets: PortfolioAsset[]) {
  const snapshot = createPortfolioSnapshotFromAssets(assets);
  if (!snapshot) return snapshots;
  if (snapshots.some((item) => item.fingerprint === snapshot.fingerprint)) {
    return snapshots;
  }
  return [...snapshots, snapshot].slice(-5);
}

export function usePortfolioSync() {
  const localRepository = useMemo(() => createLocalPortfolioRepository(), []);
  const [assets, setAssets] = useState<PortfolioAsset[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [status, setStatus] = useState<SyncStatus>("loading");
  const [message, setMessage] = useState("Portfolioを読み込んでいます…");
  const [migrationState, setMigrationState] = useState<PortfolioMigrationState | null>(null);
  const [overwriteState, setOverwriteState] = useState<OverwriteState>(null);
  const [pendingLocalAssets, setPendingLocalAssets] = useState<PortfolioAsset[]>([]);
  const [pendingLocalSnapshots, setPendingLocalSnapshots] = useState<PortfolioSnapshot[]>([]);

  const isCloudReady = Boolean(user && status !== "migration_required" && status !== "conflict");

  const applyCloudToCache = useCallback((targetUser: User, cloudAssets: PortfolioAsset[], cloudSnapshots: PortfolioSnapshot[]) => {
    localRepository.saveAssets(cloudAssets);
    savePortfolioSnapshots(cloudSnapshots);
    saveCloudPortfolioCache(targetUser.id, cloudAssets);
    saveCloudSnapshotCache(targetUser.id, cloudSnapshots);
    savePortfolioSyncMeta(targetUser.id, createAssetsFingerprint(cloudAssets));
    setAssets(cloudAssets);
  }, [localRepository]);

  const load = useCallback(async () => {
    setStatus("loading");
    setMessage("Portfolioを読み込んでいます…");

    const localAssets = await localRepository.loadAssets();
    const localSnapshots = await localRepository.loadSnapshots();
    logPortfolioSyncEvent("local load completed", { assetCount: localAssets.length });
    setAssets(localAssets);

    if (!canUseSupabaseBrowserClient()) {
      setUser(null);
      setMigrationState(null);
      setStatus("idle");
      setMessage("ゲストとしてこのブラウザに保存します。");
      setIsReady(true);
      return;
    }

    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      setUser(null);
      setMigrationState(null);
      setStatus("idle");
      setMessage("ゲストとしてこのブラウザに保存します。");
      setIsReady(true);
      return;
    }

    logPortfolioSyncEvent("auth user resolved", { userResolved: true });
    setUser(data.user);
    const cloudRepository = createSupabasePortfolioRepository(supabase, data.user.id);

    try {
      const [cloudAssets, cloudSnapshots] = await Promise.all([
        cloudRepository.loadAssets(),
        cloudRepository.loadSnapshots(),
      ]);
      logPortfolioSyncEvent("cloud fetch completed", { assetCount: cloudAssets.length });

      const storedPending = loadPortfolioMigrationPending(data.user.id);
      if (storedPending) {
        setPendingLocalAssets(storedPending.localAssets);
        setPendingLocalSnapshots(storedPending.localSnapshots);
        setMigrationState({
          decision: storedPending.decision,
          localAssetCount: storedPending.localAssets.length,
          cloudAssetCount: cloudAssets.length,
          localSnapshotCount: storedPending.localSnapshots.length,
          cloudSnapshotCount: cloudSnapshots.length,
        });
        setStatus(storedPending.decision === "conflict" ? "conflict" : "migration_required");
        setMessage("この端末の資産をアカウントへ保存するか確認してください。");
        logPortfolioSyncEvent("migration modal opened", {
          decision: storedPending.decision,
          localAssetCount: storedPending.localAssets.length,
          cloudAssetCount: cloudAssets.length,
        });
        setIsReady(true);
        return;
      }

      const nextMigrationState = getPortfolioMigrationState(
        localAssets,
        cloudAssets,
        localSnapshots,
        cloudSnapshots,
      );
      logPortfolioSyncEvent("migration decision", {
        decision: nextMigrationState.decision,
        localAssetCount: nextMigrationState.localAssetCount,
        cloudAssetCount: nextMigrationState.cloudAssetCount,
      });
      setMigrationState(nextMigrationState);

      if (
        nextMigrationState.decision === "empty" ||
        nextMigrationState.decision === "same" ||
        nextMigrationState.decision === "use_cloud"
      ) {
        clearPortfolioMigrationPending();
        setPendingLocalAssets([]);
        setPendingLocalSnapshots([]);
        applyCloudToCache(data.user, cloudAssets, cloudSnapshots);
        setStatus("saved");
        setMessage(
          cloudAssets.length > 0
            ? "アカウントのPortfolioを読み込みました。"
            : "アカウントのPortfolioはまだ空です。",
        );
      } else {
        const pendingDecision = nextMigrationState.decision === "conflict" ? "conflict" : "use_local";
        setPendingLocalAssets(localAssets);
        setPendingLocalSnapshots(localSnapshots);
        savePortfolioMigrationPending(data.user.id, {
          decision: pendingDecision,
          localAssets,
          localSnapshots,
          cloudAssetCount: cloudAssets.length,
          cloudSnapshotCount: cloudSnapshots.length,
        });
        setStatus(nextMigrationState.decision === "conflict" ? "conflict" : "migration_required");
        setMessage("この端末の資産をアカウントへ保存するか確認してください。");
        logPortfolioSyncEvent("migration modal opened", {
          decision: pendingDecision,
          localAssetCount: localAssets.length,
          cloudAssetCount: cloudAssets.length,
        });
      }
    } catch {
      const cachedAssets = loadCloudPortfolioCache(data.user.id);
      const cachedSnapshots = loadCloudSnapshotCache(data.user.id);
      if (cachedAssets.length > 0) {
        setAssets(cachedAssets);
        savePortfolioSnapshots(cachedSnapshots);
      }
      logPortfolioSyncEvent("cloud fetch failed", { fallbackCacheAssetCount: cachedAssets.length });
      setStatus("error");
      setMessage("クラウドのPortfolioを読み込めませんでした。時間をおいて再度お試しください。");
    }

    setIsReady(true);
  }, [applyCloudToCache, localRepository]);

  useEffect(() => {
    load();
  }, [load]);

  const saveAssets = useCallback(
    async (nextAssets: PortfolioAsset[]) => {
      setAssets(nextAssets);

      if (!user || !canUseSupabaseBrowserClient() || !isCloudReady) {
        await localRepository.saveAssets(nextAssets);
        savePortfolioSnapshots(addSnapshot(loadPortfolioSnapshots(), nextAssets));
        setStatus(user ? status : "saved");
        setMessage(user ? "移行方法を選ぶまで、この端末だけに保存します。" : "このブラウザに保存しました。");
        return;
      }

      setStatus("saving");
      setMessage("クラウドへ保存中…");

      try {
        const supabase = createSupabaseBrowserClient();
        const cloudRepository = createSupabasePortfolioRepository(supabase, user.id);
        const nextSnapshots = addSnapshot(await cloudRepository.loadSnapshots(), nextAssets);

        await cloudRepository.saveAssets(nextAssets);
        await cloudRepository.saveSnapshots(nextSnapshots);
        await localRepository.saveAssets(nextAssets);
        savePortfolioSnapshots(nextSnapshots);
        saveCloudPortfolioCache(user.id, nextAssets);
        saveCloudSnapshotCache(user.id, nextSnapshots);
        savePortfolioSyncMeta(user.id, createAssetsFingerprint(nextAssets));
        setStatus("saved");
        setMessage("クラウドへ保存しました。");
      } catch {
        setStatus("error");
        setMessage("クラウドへ保存できませんでした。入力内容は画面に残しています。");
      }
    },
    [isCloudReady, localRepository, status, user],
  );

  const skipMigration = useCallback(() => {
    if (pendingLocalAssets.length > 0 || pendingLocalSnapshots.length > 0) {
      saveGuestPortfolioBackup(pendingLocalAssets, pendingLocalSnapshots);
    }
    setMigrationState(null);
    setPendingLocalAssets([]);
    setPendingLocalSnapshots([]);
    clearPortfolioMigrationPending();
    setStatus("saved");
    setMessage("今回は保存しません。端末の資産は退避し、アカウントのデータを使用します。");
    if (user) {
      applyCloudToCache(user, [], []);
    }
  }, [applyCloudToCache, pendingLocalAssets, pendingLocalSnapshots, user]);

  const uploadLocalToCloud = useCallback(async () => {
    if (!user || !canUseSupabaseBrowserClient()) return;
    setStatus("saving");
    setMessage("この端末のPortfolioをアカウントへ保存中…");
    logPortfolioSyncEvent("upload started", { assetCount: pendingLocalAssets.length });

    try {
      const supabase = createSupabaseBrowserClient();
      const cloudRepository = createSupabasePortfolioRepository(supabase, user.id);
      const localAssets = pendingLocalAssets.length > 0 ? pendingLocalAssets : await localRepository.loadAssets();
      const localSnapshots =
        pendingLocalSnapshots.length > 0 ? pendingLocalSnapshots : await localRepository.loadSnapshots();
      await cloudRepository.saveAssets(localAssets);
      await cloudRepository.saveSnapshots(localSnapshots);
      logPortfolioSyncEvent("upload succeeded", { assetCount: localAssets.length });

      let refetchedAssets: PortfolioAsset[];
      let refetchedSnapshots: PortfolioSnapshot[];
      try {
        [refetchedAssets, refetchedSnapshots] = await Promise.all([
          cloudRepository.loadAssets(),
          cloudRepository.loadSnapshots(),
        ]);
      } catch {
        logPortfolioSyncEvent("refetch failed", { assetCount: localAssets.length });
        throw new Error("portfolio_migration_refetch_failed");
      }
      logPortfolioSyncEvent("refetch succeeded", { assetCount: refetchedAssets.length });

      saveCloudPortfolioCache(user.id, refetchedAssets);
      saveCloudSnapshotCache(user.id, refetchedSnapshots);
      savePortfolioSyncMeta(user.id, createAssetsFingerprint(refetchedAssets));
      await localRepository.saveAssets(refetchedAssets);
      savePortfolioSnapshots(refetchedSnapshots);
      setAssets(refetchedAssets);
      setPendingLocalAssets([]);
      setPendingLocalSnapshots([]);
      setMigrationState(null);
      clearPortfolioMigrationPending();
      setStatus("saved");
      setMessage("アカウントへ保存しました。");
    } catch {
      logPortfolioSyncEvent("upload failed", { assetCount: pendingLocalAssets.length });
      setStatus("error");
      setMessage("アカウントへ保存できませんでした。端末の資産は画面に残しています。再度お試しください。");
    }
  }, [localRepository, pendingLocalAssets, pendingLocalSnapshots, user]);

  const useCloudData = useCallback(async () => {
    if (!user || !canUseSupabaseBrowserClient()) return;
    setStatus("loading");
    setMessage("アカウントのPortfolioを読み込んでいます…");

    try {
      const supabase = createSupabaseBrowserClient();
      const cloudRepository = createSupabasePortfolioRepository(supabase, user.id);
      const [cloudAssets, cloudSnapshots] = await Promise.all([
        cloudRepository.loadAssets(),
        cloudRepository.loadSnapshots(),
      ]);
      applyCloudToCache(user, cloudAssets, cloudSnapshots);
      setMigrationState(null);
      setStatus("saved");
      setMessage("アカウントのPortfolioを使用しています。");
    } catch {
      setStatus("error");
      setMessage("アカウントのPortfolioを読み込めませんでした。");
    }
  }, [applyCloudToCache, user]);

  const prepareOverwriteCloud = useCallback(async () => {
    if (!user || !canUseSupabaseBrowserClient()) return;
    const supabase = createSupabaseBrowserClient();
    const cloudRepository = createSupabasePortfolioRepository(supabase, user.id);
    const cloudAssets = await cloudRepository.loadAssets();
    setOverwriteState({
      localAssets: await localRepository.loadAssets(),
      localSnapshots: await localRepository.loadSnapshots(),
      cloudAssetCount: cloudAssets.length,
    });
  }, [localRepository, user]);

  const confirmOverwriteCloud = useCallback(async () => {
    if (!user || !overwriteState || !canUseSupabaseBrowserClient()) return;
    setStatus("saving");
    setMessage("アカウントのPortfolioを置き換えています…");

    try {
      const supabase = createSupabaseBrowserClient();
      const cloudRepository = createSupabasePortfolioRepository(supabase, user.id);
      const latestCloudAssets = await cloudRepository.loadAssets();
      if (latestCloudAssets.length !== overwriteState.cloudAssetCount) {
        setStatus("conflict");
        setMessage("アカウント側の件数が変わりました。最新データを確認してから選び直してください。");
        setOverwriteState(null);
        return;
      }

      await cloudRepository.saveAssets(overwriteState.localAssets);
      await cloudRepository.saveSnapshots(overwriteState.localSnapshots);
      saveCloudPortfolioCache(user.id, overwriteState.localAssets);
      saveCloudSnapshotCache(user.id, overwriteState.localSnapshots);
      savePortfolioSyncMeta(user.id, createAssetsFingerprint(overwriteState.localAssets));
      setAssets(overwriteState.localAssets);
      setOverwriteState(null);
      setMigrationState(null);
      setStatus("saved");
      setMessage("この端末のPortfolioでアカウントを置き換えました。");
    } catch {
      setStatus("error");
      setMessage("置き換えに失敗しました。アカウントのデータは成功扱いにしていません。");
    }
  }, [overwriteState, user]);

  const clearCloudSessionCache = useCallback(() => {
    if (user) clearCloudPortfolioCache(user.id);
    clearPortfolioSnapshots();
  }, [user]);

  return {
    assets,
    setAssets,
    user,
    isReady,
    status,
    message,
    migrationState,
    overwriteState,
    saveAssets,
    skipMigration,
    uploadLocalToCloud,
    useCloudData,
    prepareOverwriteCloud,
    confirmOverwriteCloud,
    cancelOverwrite: () => setOverwriteState(null),
    reload: load,
    clearCloudSessionCache,
  };
}
