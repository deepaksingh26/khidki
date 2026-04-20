import { ContactForm } from "@/components/forms/contact-form";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";

export default function NewContactPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Add contact"
        title="Bring one more person into view"
        description="Keep it simple. Name, place, reachability, and a grounded note are enough to start."
      />
      <Card>
        <ContactForm />
      </Card>
    </div>
  );
}

