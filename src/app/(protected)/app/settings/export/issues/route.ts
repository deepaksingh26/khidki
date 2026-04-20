import { NextResponse } from "next/server";
import { getAuthState } from "@/lib/auth";
import { toCsv } from "@/lib/csv";
import { getContacts, getIssues } from "@/lib/data";

export async function GET(request: Request) {
  const authState = await getAuthState();

  if (!authState.isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const [issues, contacts] = await Promise.all([getIssues(), getContacts()]);
  const contactMap = new Map(contacts.map((contact) => [contact.id, contact.name]));

  const csv = toCsv(
    issues.map((issue) => ({
      title: issue.title,
      contact: issue.contactId ? contactMap.get(issue.contactId) ?? "" : "",
      type: issue.type,
      priority: issue.priority,
      status: issue.status,
      next_followup_at: issue.nextFollowupAt,
      action_taken: issue.actionTaken,
      created_at: issue.createdAt
    }))
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="khidkee-issues.csv"'
    }
  });
}

