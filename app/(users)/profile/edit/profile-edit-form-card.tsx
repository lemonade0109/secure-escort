"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import FormContainer from "@/components/shared/form/form-container";
import FormInput from "@/components/shared/form/form-input";
import { Button } from "@/components/ui/button";
import { updateProfileAction } from "@/lib/actions/profile/update-profile";

export default function ProfileEditCard({
  initial,
}: {
  initial: {
    name: string | null;
    email: string | null;
    image: string | null;
    phone: string | null;
    emergencyName: string | null;
    emergencyPhone: string | null;
  };
}) {
  const [avatarUrl, setAvatarUrl] = React.useState(initial.image ?? "");
  const [uploading, setUploading] = React.useState(false);

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.set("file", file);

      const res = await fetch("/api/upload/avatar", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error ?? "Upload failed");
      setAvatarUrl(String(data.url));
    } catch (err) {
      // FormContainer already toasts messages; this is just local
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <Card className="overflow-hidden text-white border-white/10 bg-white/4 backdrop-blur-xl">
      <div className="px-4 py-3 border-b border-white/10 bg-white/3">
        <CardTitle className="text-sm font-medium tracking-tight">
          Edit Profile
        </CardTitle>
      </div>

      <CardContent className="p-6 space-y-5">
        {/* Avatar row */}
        <div className="flex items-center gap-4">
          <div className="relative overflow-hidden border rounded-full size-14 border-white/10 bg-white/3">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Avatar"
                fill
                className="object-cover"
              />
            ) : (
              <div className="grid w-full h-full text-xs place-items-center text-white/60">
                No avatar
              </div>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">Avatar</p>
            <p className="text-xs text-white/60">
              Upload a clear face photo for trust and quick ID.
            </p>

            <label className="inline-flex items-center px-3 py-2 text-xs text-white border rounded-md cursor-pointer border-white/15 bg-white/3 hover:bg-white/6">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onPickFile}
              />
              {uploading ? "Uploading..." : "Upload avatar"}
            </label>
          </div>
        </div>

        <div className="w-full h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />

        <FormContainer action={updateProfileAction} className="space-y-4">
          {() => (
            <>
              {/* Hidden avatar url */}
              <input type="hidden" name="image" value={avatarUrl} />

              <FormInput
                name="name"
                type="text"
                label="Full name"
                placeholder="Your name"
                defaultValue={initial.name ?? ""}
                className="text-xs"
              />

              <FormInput
                name="phone"
                type="tel"
                label="Phone"
                placeholder="e.g. +234..."
                defaultValue={initial.phone ?? ""}
                className="text-xs"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormInput
                  name="emergencyName"
                  type="text"
                  label="Emergency contact name"
                  placeholder="e.g. Sister / Dad"
                  defaultValue={initial.emergencyName ?? ""}
                  className="text-xs"
                />
                <FormInput
                  name="emergencyPhone"
                  type="tel"
                  label="Emergency contact phone"
                  placeholder="e.g. +234..."
                  defaultValue={initial.emergencyPhone ?? ""}
                  className="text-xs"
                />
              </div>

              <Button
                type="submit"
                className="w-full text-black bg-gold hover:bg-gold/90"
              >
                Save changes
              </Button>

              <p className="text-xs text-white/60">
                Email can&apos;t be changed here (we&apos;ll add “change email”
                flow later).
              </p>
            </>
          )}
        </FormContainer>
      </CardContent>
    </Card>
  );
}
