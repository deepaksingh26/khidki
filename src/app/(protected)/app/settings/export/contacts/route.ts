import { NextResponse } from "next/server";
import { getAuthState } from "@/lib/auth";
import { toCsv } from "@/lib/csv";
import { getContacts } from "@/lib/data";

export async function GET(request: Request) {
  const authState = await getAuthState();

  if (!authState.isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const contacts = await getContacts();
  const csv = toCsv(
    contacts.map((contact) => ({
      name: contact.name,
      name_hi: contact.nameHi,
      phone: contact.phone,
      whatsapp: contact.whatsapp,
      village: contact.village,
      panchayat: contact.panchayat,
      block: contact.block,
      district: contact.district,
      tags: contact.tags.join(" | "),
      last_visit_at: contact.lastVisitAt,
      visit_count: contact.visitCount
    }))
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="khidkee-contacts.csv"'
    }
  });
}

