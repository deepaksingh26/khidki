import { z } from "zod";
import { crisisTypes, issuePriorities, issueStatuses, teamRoles } from "@/lib/constants";

const optionalText = z.string().trim().optional().or(z.literal(""));

export const requestAccessSchema = z.object({
  name: z.string().trim().min(2, "Please share your name."),
  organization: optionalText,
  phone: optionalText,
  email: optionalText.refine((value) => !value || z.email().safeParse(value).success, "Please check the email."),
  district: optionalText,
  notes: optionalText
});

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, "Please share your name."),
  email: optionalText.refine((value) => !value || z.email().safeParse(value).success, "Please check the email."),
  phone: optionalText,
  message: z.string().trim().min(12, "A little more detail will help us respond well.")
});

export const signInSchema = z.object({
  email: z.string().trim().email("Please enter a working email address."),
  nextPath: optionalText
});

export const contactFormSchema = z.object({
  id: optionalText,
  name: z.string().trim().min(2, "Add the contact’s name."),
  nameHi: optionalText,
  phone: optionalText,
  whatsapp: optionalText,
  village: z.string().trim().min(2, "Village name helps the field map stay useful."),
  panchayat: z.string().trim().min(2, "Add the panchayat."),
  block: z.string().trim().min(2, "Add the block."),
  district: z.string().trim().min(2, "Add the district."),
  tagsInput: optionalText,
  notes: optionalText,
  lastVisitAt: optionalText,
  latitude: optionalText,
  longitude: optionalText,
  locationLabel: optionalText
});

export const issueFormSchema = z.object({
  id: optionalText,
  contactId: optionalText,
  title: z.string().trim().min(4, "Name the issue clearly."),
  type: z.string().trim().min(2, "Issue type helps the team sort follow-up."),
  priority: z.enum(issuePriorities),
  status: z.enum(issueStatuses),
  description: optionalText,
  actionTaken: optionalText,
  nextFollowupAt: optionalText,
  assignedTo: optionalText
});

export const visitFormSchema = z.object({
  id: optionalText,
  contactId: optionalText,
  visitedAt: z.string().trim().min(4, "Add the visit date and time."),
  village: z.string().trim().min(2, "Village name helps the diary stay grounded."),
  panchayat: z.string().trim().min(2, "Add the panchayat."),
  durationMins: optionalText,
  outcome: optionalText,
  notes: optionalText,
  latitude: optionalText,
  longitude: optionalText
});

export const alertFormSchema = z.object({
  crisisType: z.enum(crisisTypes),
  latitude: z.string().trim().min(1, "We need the crisis location."),
  longitude: z.string().trim().min(1, "We need the crisis location."),
  radiusKm: z.string().trim().min(1, "Select a radius.")
});

export const inviteTeamSchema = z.object({
  displayName: z.string().trim().min(2, "Add the team member’s name."),
  phone: optionalText,
  role: z.enum(teamRoles)
});

export type RequestAccessValues = z.infer<typeof requestAccessSchema>;
export type ContactMessageValues = z.infer<typeof contactMessageSchema>;
export type SignInValues = z.infer<typeof signInSchema>;
export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type IssueFormValues = z.infer<typeof issueFormSchema>;
export type VisitFormValues = z.infer<typeof visitFormSchema>;
export type AlertFormValues = z.infer<typeof alertFormSchema>;
export type InviteTeamValues = z.infer<typeof inviteTeamSchema>;

