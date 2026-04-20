import { NextResponse } from "next/server";
import { getAuthState } from "@/lib/auth";
import { toCsv } from "@/lib/csv";
import { getContacts, getVisits } from "@/lib/data";

export async function GET(request: Request) {
  const authState = await getAuthState();

  if (!authState.isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const [visits, contacts] = await Promise.all([getVisits(), getContacts()]);
  const contactMap = new Map(contacts.map((contact) => [contact.id, contact.name]));

  const csv = toCsv(
    visits.map((visit) => ({
      contact: visit.contactId ? contactMap.get(visit.contactId) ?? "" : "",
      visited_at: visit.visitedAt,
      village: visit.village,
      panchayat: visit.panchayat,
      duration_mins: visit.durationMins,
      outcome: visit.outcome,
      notes: visit.notes
    }))
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="khidkee-visits.csv"'
    }
  });
}

