import { notFound } from "next/navigation";
import { ContactForm } from "@/components/forms/contact-form";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { getContactById } from "@/lib/data";

export default async function EditContactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contact = await getContactById(id);

  if (!contact) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Edit contact"
        title={`Update ${contact.name}`}
        description="Refine the record while the field memory is still fresh."
      />
      <Card>
        <ContactForm contact={contact} />
      </Card>
    </div>
  );
}

