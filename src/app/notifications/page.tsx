"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import {
  CheckCircle2,
  AlertCircle,
  Award,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface AppNotification {
  id: string;
  title: string;
  message: string;
  examName: string;
  category: "admit_card" | "deadline" | "monitoring" | "result";
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    title: "Hall Ticket Released",
    message: "ISRO Scientist/Engineer 'SC' computer science examination hall ticket is now available for download. Exam scheduled for 18 Apr 2026.",
    examName: "ISRO ICRB 2026",
    category: "admit_card",
    timestamp: "2026-04-05T08:30:00Z",
    isRead: false,
    actionUrl: "https://apps.isro.gov.in/icrb/admitcard",
  },
  {
    id: "notif-2",
    title: "Official Notification Tracked",
    message: "DRDO CEPTAM-11 STA-B recruitment advertisement detected on official recruitment website. Application window tentative from 01 Apr 2026.",
    examName: "DRDO CEPTAM-11",
    category: "monitoring",
    timestamp: "2026-03-20T14:10:00Z",
    isRead: false,
    actionUrl: "https://drdo.gov.in/ceptam",
  },
  {
    id: "notif-3",
    title: "Official Scorecard Declared",
    message: "GATE 2026 committee has published verified candidate scorecards. Your recorded score: 782 (Qualified for PSU Direct Interview).",
    examName: "GATE 2026 (CS & IT)",
    category: "result",
    timestamp: "2026-03-19T18:00:00Z",
    isRead: true,
  },
  {
    id: "notif-4",
    title: "Application Closing Reminder",
    message: "Only 4 days remaining to finalize and submit application fee for RRB NTPC Graduate Posts 2026. Payment portal closes 16 Apr 2026.",
    examName: "RRB NTPC CEN 05/2026",
    category: "deadline",
    timestamp: "2026-04-12T09:00:00Z",
    isRead: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getIcon = (cat: AppNotification["category"]) => {
    switch (cat) {
      case "admit_card":
        return <Award className="w-4 h-4 text-emerald-400" />;
      case "deadline":
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case "monitoring":
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
      case "result":
        return <CheckCircle2 className="w-4 h-4 text-blue-400" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Notifications & Alerts
            </h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-[11px]">
                {unreadCount} Unread
              </Badge>
            )}
          </div>
          <p className="text-xs md:text-sm text-slate-400">
            Admit card alerts, deadline warnings, and automatic official website monitoring changes.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={markAllRead}
            className="text-xs h-8"
          >
            Mark All as Read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((item) => (
          <Card
            key={item.id}
            className={`border-[#1e2536] transition-all ${
              item.isRead ? "bg-[#121620]" : "bg-[#141a27] border-indigo-500/30"
            }`}
          >
            <CardContent className="p-4 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#0e121a] border border-[#20293d] mt-0.5 flex-shrink-0">
                {getIcon(item.category)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white">
                      {item.title}
                    </h3>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {formatDateTime(item.timestamp)}
                  </span>
                </div>

                <div className="text-xs font-semibold text-indigo-400 mb-1">
                  {item.examName}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.message}
                </p>

                {item.actionUrl && (
                  <div className="mt-3">
                    <a
                      href={item.actionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                    >
                      Open Official Source <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
