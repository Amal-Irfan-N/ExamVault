/**
 * Service Worker & Web Push Notification Service
 */

export interface NotificationStatus {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
    return registration;
  } catch (error) {
    console.warn("Service Worker registration failed:", error);
    return null;
  }
}

export function getNotificationPermissionStatus(): NotificationPermission {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error("Failed to request notification permission:", error);
    return "denied";
  }
}

export async function triggerLocalPushNotification(
  title: string,
  options?: NotificationOptions & { url?: string }
): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }

  let permission = Notification.permission;
  if (permission === "default") {
    permission = await requestNotificationPermission();
  }

  if (permission !== "granted") {
    return false;
  }

  try {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      if (registration && "showNotification" in registration) {
        await registration.showNotification(title, {
          icon: "/icons/icon-192.svg",
          badge: "/icons/icon-192.svg",
          ...options,
        });
        return true;
      }
    }

    // Fallback standard browser notification
    new Notification(title, {
      icon: "/icons/icon-192.svg",
      ...options,
    });
    return true;
  } catch (error) {
    console.error("Error dispatching notification:", error);
    return false;
  }
}
