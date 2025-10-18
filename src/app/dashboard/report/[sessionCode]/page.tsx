"use client";
import { useParams } from "next/navigation";
import SessionReportUI from "@/components/dashboar-host/SessionReportUI";

export default function SessionReportPage() {
  const params = useParams();
  const sessionCode = params?.sessionCode as string;

  return <SessionReportUI sessionCode={sessionCode} />;
}
