import { useState, useRef, useEffect } from "react";
import {
  User as UserIcon,
  ShieldCheck,
  Download,
  Trash2,
  Database,
  Upload,
  Camera,
  CheckCircle2,
  Loader2,
  Save,
  Check,
  AlertTriangle,
  AtSign,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { useAuth } from "~/hooks/use-auth";

export function AccountSettings() {
  const {
    user,
    updateProfile,
    isUpdatingProfile,
    uploadPhoto,
    isUploadingPhoto,
  } = useAuth();

  const [nameInput, setNameInput] = useState<string>("");
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setNameInput(user.name || "");
      setUsernameInput(user.username || "");
      setAvatarPreview(user.avatarUrl || null);
    }
  }, [user]);

  const userName = user?.name || user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  // Dirty state calculation: disable save button if no changes were made
  const initialName = user?.name || "";
  const initialUsername = user?.username || "";

  const isDirty =
    nameInput.trim() !== initialName.trim() ||
    usernameInput.trim().toLowerCase() !== initialUsername.trim().toLowerCase();

  // Handle Photo Upload directly
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Profile photo must be under 5MB.");
      return;
    }

    setPhotoError(null);
    try {
      const updatedUser = await uploadPhoto(file);
      if (updatedUser?.avatarUrl) {
        setAvatarPreview(updatedUser.avatarUrl);
      }
    } catch (err: unknown) {
      const errStr =
        err instanceof Error ? err.message : "Failed to upload profile photo";
      setPhotoError(errStr);
    }
  };

  const handleSaveProfile = async () => {
    if (!isDirty) return;
    setSaveError(null);
    try {
      await updateProfile({
        name: nameInput.trim(),
        username: usernameInput.trim().toLowerCase(),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err: unknown) {
      const errStr =
        err instanceof Error ? err.message : "Failed to update profile details";
      setSaveError(errStr);
    }
  };

  const handleExportJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify(
          {
            user: userName,
            username: usernameInput,
            email: userEmail,
            exportedAt: new Date().toISOString(),
            schemaVersion: "1.0",
            platform: "FolioForge Engine",
          },
          null,
          2,
        ),
      );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "folioforge-master-graph.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 w-full mx-auto pb-16 text-foreground">
      {/* ── Section 01: Profile Identity & Avatar Photo ── */}
      <div className="py-6 border-b border-border space-y-6">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono font-semibold text-muted-foreground">
            01
          </span>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Profile Identity &amp; Avatar
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Upload your profile photo and configure your personal handle.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-2">
          {/* Avatar Photo Container */}
          <div className="relative group shrink-0">
            <Avatar className="w-20 h-20 border-2 border-border shadow-xs">
              <AvatarImage src={avatarPreview || undefined} alt={userName} />
              <AvatarFallback className="text-lg font-bold bg-muted text-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Photo Edit Overlay */}
            <button
              type="button"
              disabled={isUploadingPhoto}
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-medium"
              aria-label="Upload profile photo"
            >
              {isUploadingPhoto ? (
                <Loader2 className="w-4 h-4 animate-spin mb-0.5" />
              ) : (
                <Camera className="w-4 h-4 mb-0.5" />
              )}
              {isUploadingPhoto ? "Uploading..." : "Change"}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handlePhotoSelect}
              className="hidden"
            />
          </div>

          <div className="flex-1 space-y-4 w-full max-w-md">
            <div>
              <Label
                htmlFor="display-name"
                className="text-xs text-muted-foreground font-medium"
              >
                Full Name
              </Label>
              <Input
                id="display-name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="mt-1 text-xs font-semibold"
              />
            </div>

            <div>
              <Label
                htmlFor="username-handle"
                className="text-xs text-muted-foreground font-medium"
              >
                Unique Username Handle
              </Label>
              <div className="flex items-center rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs font-mono mt-1">
                <AtSign className="w-3.5 h-3.5 text-muted-foreground mr-1 shrink-0" />
                <input
                  id="username-handle"
                  value={usernameInput}
                  onChange={(e) =>
                    setUsernameInput(
                      e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                    )
                  }
                  placeholder="alexmorgan"
                  className="bg-transparent font-semibold text-foreground focus:outline-none flex-1 min-w-0"
                />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Powers your public domain path: <code className="font-mono">folioforge.com/u/{usernameInput || "username"}</code>
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
                className="text-xs h-8 font-medium cursor-pointer"
              >
                {isUploadingPhoto ? (
                  <>
                    <Loader2 className="mr-1.5 w-3.5 h-3.5 animate-spin text-emerald-600" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-1.5 w-3.5 h-3.5" />
                    Upload Photo
                  </>
                )}
              </Button>

              <Button
                size="sm"
                onClick={handleSaveProfile}
                disabled={isUpdatingProfile || isUploadingPhoto || !isDirty}
                className="text-xs h-8 font-semibold cursor-pointer px-4"
              >
                {isUpdatingProfile ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    Saving...
                  </>
                ) : saveSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 mr-1.5" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>

            {photoError && (
              <p className="text-xs text-destructive font-medium font-mono">
                {photoError}
              </p>
            )}

            {saveError && (
              <p className="text-xs text-destructive font-medium font-mono">
                {saveError}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Section 02: Account Security & Authentication ── */}
      <div className="py-6 border-b border-border space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono font-semibold text-muted-foreground">
            02
          </span>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Authentication &amp; Security
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Managed sign-in provider credentials and session authorization.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground font-medium">
              Email Address
            </Label>
            <div className="p-2.5 rounded-lg border border-border bg-muted/20 text-xs font-mono font-semibold text-foreground truncate">
              {userEmail || "Not logged in"}
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground font-medium">
              Sign-In Provider
            </Label>
            <div className="p-2.5 rounded-lg border border-border bg-muted/20 text-xs font-medium text-foreground flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Google Single Sign-On</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 03: Data Portability & Backup Export ── */}
      <div className="py-6 border-b border-border space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono font-semibold text-muted-foreground">
            03
          </span>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Data Portability &amp; Backup Export
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Export your canonical CV history, tailored bullets, and portfolio
              configuration at any time.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Database className="w-4 h-4 text-foreground shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-foreground">
                Canonical Graph Export
              </p>
              <p className="text-muted-foreground mt-0.5 font-mono text-[11px]">
                Format: Standalone Zod JSON
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportJson}
            className="text-xs h-8 font-medium cursor-pointer shrink-0"
          >
            {downloadSuccess ? (
              <>
                <CheckCircle2 className="mr-1.5 w-3.5 h-3.5 text-emerald-600" />
                JSON Downloaded
              </>
            ) : (
              <>
                <Download className="mr-1.5 w-3.5 h-3.5" />
                Export JSON Backup
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ── Section 04: Account Purge & Deletion ── */}
      <div className="py-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono font-semibold text-destructive">
            04
          </span>
          <div>
            <h3 className="text-base font-semibold text-destructive">
              Danger Zone: Purge Account Data
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Permanently delete user records, canonical resume graphs, and
              custom domain bindings.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/5 space-y-3">
          <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
            <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Account deletion is immediate and non-reversible. All stored
              resume history, tailoring logs, and custom subdomains will be
              purged server-side.
            </p>
          </div>

          <Button
            variant="destructive"
            size="sm"
            className="text-xs h-8 font-semibold cursor-pointer"
          >
            <Trash2 className="mr-1.5 w-3.5 h-3.5" />
            Purge Account &amp; All CV Data
          </Button>
        </div>
      </div>
    </div>
  );
}
