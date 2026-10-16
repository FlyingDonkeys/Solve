"use client";

// Tracking must never delay or interrupt the interaction that caused it.
export async function updateActivity(): Promise<void> {
  try {
    const response = await fetch("/api/activity", {
      method: "POST",
      credentials: "same-origin",
      keepalive: true,
    });
    if (!response.ok) {
      console.warn("Activity tracking failed:", response.status);
    }
  } catch {
    console.warn("Activity tracking unavailable");
  }
}
