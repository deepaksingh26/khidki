import { addDays, differenceInCalendarDays, format, parseISO, startOfMonth, subDays, subHours } from "date-fns";
import type {
  AlertRecord,
  Contact,
  ContactLocation,
  DiaryData,
  DashboardData,
  GapLevel,
  Issue,
  NearbyContact,
  PanchayatSummary,
  TeamMember,
  Visit
} from "@/types/domain";
import { averageCoordinates, haversineDistanceMeters } from "@/lib/geo";
import { chooseSuggestedVisit } from "@/lib/suggestion-engine";

const now = new Date();

const demoCurrentLocation = {
  latitude: 25.7207,
  longitude: 85.4047
};

const teamMembers: TeamMember[] = [
  {
    id: "10000000-0000-0000-0000-000000000001",
    userId: "20000000-0000-0000-0000-000000000001",
    role: "admin",
    displayName: "Rekha Kumari",
    phone: "+91 98765 40001",
    createdAt: subDays(now, 120).toISOString(),
    updatedAt: subDays(now, 2).toISOString()
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    userId: "20000000-0000-0000-0000-000000000002",
    role: "field_worker",
    displayName: "Arif Ansari",
    phone: "+91 98765 40002",
    createdAt: subDays(now, 98).toISOString(),
    updatedAt: subDays(now, 1).toISOString()
  },
  {
    id: "10000000-0000-0000-0000-000000000003",
    userId: "20000000-0000-0000-0000-000000000003",
    role: "view_only",
    displayName: "Neelam Devi",
    phone: "+91 98765 40003",
    createdAt: subDays(now, 76).toISOString(),
    updatedAt: subDays(now, 7).toISOString()
  }
];

const locations: ContactLocation[] = [
  {
    id: "31000000-0000-0000-0000-000000000001",
    contactId: "30000000-0000-0000-0000-000000000001",
    label: "Home",
    latitude: 25.7198,
    longitude: 85.4024,
    accuracyM: 18,
    isPrimary: true,
    createdAt: subDays(now, 70).toISOString(),
    updatedAt: subDays(now, 2).toISOString()
  },
  {
    id: "31000000-0000-0000-0000-000000000002",
    contactId: "30000000-0000-0000-0000-000000000002",
    label: "Meeting Point",
    latitude: 25.7239,
    longitude: 85.409,
    accuracyM: 24,
    isPrimary: true,
    createdAt: subDays(now, 88).toISOString(),
    updatedAt: subDays(now, 4).toISOString()
  },
  {
    id: "31000000-0000-0000-0000-000000000003",
    contactId: "30000000-0000-0000-0000-000000000003",
    label: "Naya Gaon Centre",
    latitude: 25.7314,
    longitude: 85.4162,
    accuracyM: 12,
    isPrimary: true,
    createdAt: subDays(now, 55).toISOString(),
    updatedAt: subDays(now, 8).toISOString()
  },
  {
    id: "31000000-0000-0000-0000-000000000004",
    contactId: "30000000-0000-0000-0000-000000000004",
    label: "Anganwadi Kendra",
    latitude: 25.7353,
    longitude: 85.4288,
    accuracyM: 15,
    isPrimary: true,
    createdAt: subDays(now, 92).toISOString(),
    updatedAt: subDays(now, 12).toISOString()
  },
  {
    id: "31000000-0000-0000-0000-000000000005",
    contactId: "30000000-0000-0000-0000-000000000005",
    label: "Ward Chowk",
    latitude: 25.7095,
    longitude: 85.3927,
    accuracyM: 17,
    isPrimary: true,
    createdAt: subDays(now, 61).toISOString(),
    updatedAt: subDays(now, 9).toISOString()
  },
  {
    id: "31000000-0000-0000-0000-000000000006",
    contactId: "30000000-0000-0000-0000-000000000006",
    label: "Clinic Turn",
    latitude: 25.7047,
    longitude: 85.4014,
    accuracyM: 20,
    isPrimary: true,
    createdAt: subDays(now, 47).toISOString(),
    updatedAt: subDays(now, 3).toISOString()
  },
  {
    id: "31000000-0000-0000-0000-000000000007",
    contactId: "30000000-0000-0000-0000-000000000007",
    label: "Tractor Shed",
    latitude: 25.7418,
    longitude: 85.4382,
    accuracyM: 28,
    isPrimary: true,
    createdAt: subDays(now, 42).toISOString(),
    updatedAt: subDays(now, 7).toISOString()
  },
  {
    id: "31000000-0000-0000-0000-000000000008",
    contactId: "30000000-0000-0000-0000-000000000008",
    label: "School Gate",
    latitude: 25.7473,
    longitude: 85.4474,
    accuracyM: 19,
    isPrimary: true,
    createdAt: subDays(now, 38).toISOString(),
    updatedAt: subDays(now, 6).toISOString()
  }
];

const issues: Issue[] = [
  {
    id: "32000000-0000-0000-0000-000000000001",
    contactId: "30000000-0000-0000-0000-000000000001",
    title: "Canal water entered lower field edge",
    type: "flood-risk",
    priority: "high",
    status: "in_progress",
    description: "Bund repair is needed before the next heavy rain.",
    actionTaken: "Shared with panchayat member and marked for field check.",
    nextFollowupAt: addDays(now, 2).toISOString(),
    assignedTo: teamMembers[0].userId,
    createdBy: teamMembers[1].userId,
    createdAt: subDays(now, 3).toISOString(),
    updatedAt: subDays(now, 1).toISOString()
  },
  {
    id: "32000000-0000-0000-0000-000000000002",
    contactId: "30000000-0000-0000-0000-000000000002",
    title: "Self-help group meeting space locked",
    type: "community-space",
    priority: "medium",
    status: "open",
    description: "Women’s group could not meet this week because the room key was not available.",
    actionTaken: "No action yet.",
    nextFollowupAt: addDays(now, 5).toISOString(),
    assignedTo: teamMembers[1].userId,
    createdBy: teamMembers[0].userId,
    createdAt: subDays(now, 6).toISOString(),
    updatedAt: subDays(now, 2).toISOString()
  },
  {
    id: "32000000-0000-0000-0000-000000000003",
    contactId: "30000000-0000-0000-0000-000000000004",
    title: "Nutrition supplies delayed for two weeks",
    type: "nutrition",
    priority: "critical",
    status: "blocked",
    description: "Children under three have missed the latest supply cycle.",
    actionTaken: "Called block office. Waiting for dispatch date.",
    nextFollowupAt: addDays(now, 1).toISOString(),
    assignedTo: teamMembers[0].userId,
    createdBy: teamMembers[0].userId,
    createdAt: subDays(now, 1).toISOString(),
    updatedAt: subHours(now, 8).toISOString()
  },
  {
    id: "32000000-0000-0000-0000-000000000004",
    contactId: "30000000-0000-0000-0000-000000000005",
    title: "Handpump repair request pending",
    type: "water",
    priority: "high",
    status: "open",
    description: "Main handpump near ward chowk is still not repaired.",
    actionTaken: "Awaiting mechanic visit.",
    nextFollowupAt: addDays(now, 4).toISOString(),
    assignedTo: teamMembers[1].userId,
    createdBy: teamMembers[0].userId,
    createdAt: subDays(now, 8).toISOString(),
    updatedAt: subDays(now, 2).toISOString()
  },
  {
    id: "32000000-0000-0000-0000-000000000005",
    contactId: "30000000-0000-0000-0000-000000000006",
    title: "Medical escort needed for antenatal check-up",
    type: "medical-support",
    priority: "medium",
    status: "in_progress",
    description: "Family needs help getting to the community health centre.",
    actionTaken: "Volunteer support lined up for Thursday morning.",
    nextFollowupAt: addDays(now, 1).toISOString(),
    assignedTo: teamMembers[1].userId,
    createdBy: teamMembers[1].userId,
    createdAt: subDays(now, 2).toISOString(),
    updatedAt: subHours(now, 16).toISOString()
  },
  {
    id: "32000000-0000-0000-0000-000000000006",
    contactId: "30000000-0000-0000-0000-000000000008",
    title: "Learning circle attendance dropped sharply",
    type: "education",
    priority: "medium",
    status: "open",
    description: "Several girls have stopped coming after sunset because of lighting concerns.",
    actionTaken: "Need to speak with guardians and school committee.",
    nextFollowupAt: addDays(now, 6).toISOString(),
    assignedTo: teamMembers[2].userId,
    createdBy: teamMembers[1].userId,
    createdAt: subDays(now, 4).toISOString(),
    updatedAt: subDays(now, 1).toISOString()
  }
];

const visits: Visit[] = [
  {
    id: "33000000-0000-0000-0000-000000000001",
    contactId: "30000000-0000-0000-0000-000000000006",
    visitedBy: teamMembers[1].userId,
    visitedAt: subDays(now, 4).toISOString(),
    village: "Sikandarpur",
    panchayat: "Sahariya",
    durationMins: 45,
    outcome: "Escort plan agreed",
    notes: "Family confirmed they can leave by 8:30 AM.",
    latitude: 25.7047,
    longitude: 85.4014,
    createdAt: subDays(now, 4).toISOString(),
    updatedAt: subDays(now, 4).toISOString()
  },
  {
    id: "33000000-0000-0000-0000-000000000002",
    contactId: "30000000-0000-0000-0000-000000000003",
    visitedBy: teamMembers[1].userId,
    visitedAt: subDays(now, 8).toISOString(),
    village: "Naya Gaon",
    panchayat: "Rampur Khajuria",
    durationMins: 30,
    outcome: "Volunteer route updated",
    notes: "Aslam shared two alternate lanes for rainy days.",
    latitude: 25.7314,
    longitude: 85.4162,
    createdAt: subDays(now, 8).toISOString(),
    updatedAt: subDays(now, 8).toISOString()
  },
  {
    id: "33000000-0000-0000-0000-000000000003",
    contactId: "30000000-0000-0000-0000-000000000005",
    visitedBy: teamMembers[0].userId,
    visitedAt: subDays(now, 12).toISOString(),
    village: "Jalalpur",
    panchayat: "Sahariya",
    durationMins: 35,
    outcome: "Repair need confirmed",
    notes: "Handpump handle is still broken.",
    latitude: 25.7095,
    longitude: 85.3927,
    createdAt: subDays(now, 12).toISOString(),
    updatedAt: subDays(now, 12).toISOString()
  },
  {
    id: "33000000-0000-0000-0000-000000000004",
    contactId: "30000000-0000-0000-0000-000000000002",
    visitedBy: teamMembers[1].userId,
    visitedAt: subDays(now, 19).toISOString(),
    village: "Chandpur Basti",
    panchayat: "Basantpur",
    durationMins: 40,
    outcome: "Group concerns collected",
    notes: "Women asked for safer evening meeting space.",
    latitude: 25.7239,
    longitude: 85.409,
    createdAt: subDays(now, 19).toISOString(),
    updatedAt: subDays(now, 19).toISOString()
  },
  {
    id: "33000000-0000-0000-0000-000000000005",
    contactId: "30000000-0000-0000-0000-000000000008",
    visitedBy: teamMembers[1].userId,
    visitedAt: subDays(now, 26).toISOString(),
    village: "Khaira Tola",
    panchayat: "Chandpura",
    durationMins: 50,
    outcome: "Attendance issue surfaced",
    notes: "Parents mentioned fear of dark road after evening class.",
    latitude: 25.7473,
    longitude: 85.4474,
    createdAt: subDays(now, 26).toISOString(),
    updatedAt: subDays(now, 26).toISOString()
  },
  {
    id: "33000000-0000-0000-0000-000000000006",
    contactId: "30000000-0000-0000-0000-000000000001",
    visitedBy: teamMembers[1].userId,
    visitedAt: subDays(now, 34).toISOString(),
    village: "Mahua Tola",
    panchayat: "Basantpur",
    durationMins: 55,
    outcome: "Field risk mapped",
    notes: "Ramesh marked the section where water first enters.",
    latitude: 25.7198,
    longitude: 85.4024,
    createdAt: subDays(now, 34).toISOString(),
    updatedAt: subDays(now, 34).toISOString()
  },
  {
    id: "33000000-0000-0000-0000-000000000007",
    contactId: "30000000-0000-0000-0000-000000000007",
    visitedBy: teamMembers[0].userId,
    visitedAt: subDays(now, 42).toISOString(),
    village: "Betia East",
    panchayat: "Chandpura",
    durationMins: 20,
    outcome: "Transport support discussed",
    notes: "Fuel support needed if transport is activated.",
    latitude: 25.7418,
    longitude: 85.4382,
    createdAt: subDays(now, 42).toISOString(),
    updatedAt: subDays(now, 42).toISOString()
  },
  {
    id: "33000000-0000-0000-0000-000000000008",
    contactId: "30000000-0000-0000-0000-000000000004",
    visitedBy: teamMembers[0].userId,
    visitedAt: subDays(now, 67).toISOString(),
    village: "Bishunpur",
    panchayat: "Rampur Khajuria",
    durationMins: 60,
    outcome: "Stock gap escalated",
    notes: "Children may miss the next cycle too if delivery is delayed.",
    latitude: 25.7353,
    longitude: 85.4288,
    createdAt: subDays(now, 67).toISOString(),
    updatedAt: subDays(now, 67).toISOString()
  },
  {
    id: "33000000-0000-0000-0000-000000000009",
    visitedBy: teamMembers[0].userId,
    visitedAt: subDays(now, 3).toISOString(),
    village: "Mahua Tola",
    panchayat: "Basantpur",
    durationMins: 70,
    outcome: "Area walk complete",
    notes: "Visited the canal edge and met two families without scheduled check-ins.",
    latitude: 25.7189,
    longitude: 85.4019,
    createdAt: subDays(now, 3).toISOString(),
    updatedAt: subDays(now, 3).toISOString()
  },
  {
    id: "33000000-0000-0000-0000-000000000010",
    visitedBy: teamMembers[1].userId,
    visitedAt: subDays(now, 10).toISOString(),
    village: "Sikandarpur",
    panchayat: "Sahariya",
    durationMins: 65,
    outcome: "Health route reviewed",
    notes: "Volunteer path is usable even after rainfall.",
    latitude: 25.7052,
    longitude: 85.4009,
    createdAt: subDays(now, 10).toISOString(),
    updatedAt: subDays(now, 10).toISOString()
  }
];

const alerts: AlertRecord[] = [
  {
    id: "35000000-0000-0000-0000-000000000001",
    createdBy: teamMembers[0].userId,
    crisisType: "Flood",
    latitude: 25.7204,
    longitude: 85.4031,
    radiusKm: 3,
    status: "closed",
    triggeredAt: subDays(now, 28).toISOString(),
    createdAt: subDays(now, 28).toISOString(),
    recipients: [
      {
        id: "36000000-0000-0000-0000-000000000001",
        alertId: "35000000-0000-0000-0000-000000000001",
        contactId: "30000000-0000-0000-0000-000000000001",
        distanceM: 140,
        notifiedAt: subDays(now, 28).toISOString(),
        response: "Reached by phone and moved grain sacks to higher room.",
        respondedAt: subDays(now, 28).toISOString(),
        createdAt: subDays(now, 28).toISOString()
      },
      {
        id: "36000000-0000-0000-0000-000000000002",
        alertId: "35000000-0000-0000-0000-000000000001",
        contactId: "30000000-0000-0000-0000-000000000003",
        distanceM: 860,
        notifiedAt: subDays(now, 28).toISOString(),
        response: "Helped share warning across Naya Gaon.",
        respondedAt: subDays(now, 28).toISOString(),
        createdAt: subDays(now, 28).toISOString()
      }
    ]
  },
  {
    id: "35000000-0000-0000-0000-000000000002",
    createdBy: teamMembers[1].userId,
    crisisType: "Medical Emergency",
    latitude: 25.705,
    longitude: 85.4012,
    radiusKm: 2,
    status: "triggered",
    triggeredAt: subHours(now, 14).toISOString(),
    createdAt: subHours(now, 14).toISOString(),
    recipients: [
      {
        id: "36000000-0000-0000-0000-000000000003",
        alertId: "35000000-0000-0000-0000-000000000002",
        contactId: "30000000-0000-0000-0000-000000000006",
        distanceM: 52,
        notifiedAt: subHours(now, 14).toISOString(),
        response: "Accompanied family to clinic.",
        respondedAt: subHours(now, 13).toISOString(),
        createdAt: subHours(now, 14).toISOString()
      },
      {
        id: "36000000-0000-0000-0000-000000000004",
        alertId: "35000000-0000-0000-0000-000000000002",
        contactId: "30000000-0000-0000-0000-000000000005",
        distanceM: 1020,
        notifiedAt: subHours(now, 14).toISOString(),
        response: "Kept road access open for vehicle.",
        respondedAt: subHours(now, 13).toISOString(),
        createdAt: subHours(now, 14).toISOString()
      }
    ]
  }
];

function deriveGapLevel(lastVisitAt?: string | null): GapLevel {
  if (!lastVisitAt) return "critical";

  const daysSince = differenceInCalendarDays(now, parseISO(lastVisitAt));
  if (daysSince >= 60) return "critical";
  if (daysSince >= 30) return "high_priority";
  if (daysSince >= 15) return "attention_needed";
  if (daysSince >= 7) return "gentle_reminder";
  return "on_track";
}

function baseContacts(): Omit<Contact, "locations" | "gapLevel" | "daysSinceLastVisit" | "openIssueCount" | "criticalIssueCount">[] {
  return [
    {
      id: "30000000-0000-0000-0000-000000000001",
      name: "Ramesh Paswan",
      nameHi: "रमेश पासवान",
      phone: "+91 91234 50001",
      whatsapp: "+91 91234 50001",
      village: "Mahua Tola",
      panchayat: "Basantpur",
      block: "Mahua",
      district: "Vaishali",
      tags: ["farmer", "flood-watch"],
      notes: "Keeps track of the low-lying fields near the canal. Usually the first to notice water rise.",
      photoUrl: null,
      lastVisitAt: subDays(now, 34).toISOString(),
      visitCount: 11,
      addedBy: teamMembers[1].userId,
      createdAt: subDays(now, 180).toISOString(),
      updatedAt: subDays(now, 4).toISOString()
    },
    {
      id: "30000000-0000-0000-0000-000000000002",
      name: "Sunita Devi",
      nameHi: "सुनीता देवी",
      phone: "+91 91234 50002",
      whatsapp: "+91 91234 50002",
      village: "Chandpur Basti",
      panchayat: "Basantpur",
      block: "Mahua",
      district: "Vaishali",
      tags: ["self-help-group", "women-leader"],
      notes: "Runs the women’s group circle and often gathers concerns before meetings.",
      photoUrl: null,
      lastVisitAt: subDays(now, 19).toISOString(),
      visitCount: 14,
      addedBy: teamMembers[1].userId,
      createdAt: subDays(now, 150).toISOString(),
      updatedAt: subDays(now, 6).toISOString()
    },
    {
      id: "30000000-0000-0000-0000-000000000003",
      name: "Md. Aslam",
      nameHi: "मो. असलम",
      phone: "+91 91234 50003",
      whatsapp: "+91 91234 50003",
      village: "Naya Gaon",
      panchayat: "Rampur Khajuria",
      block: "Mahua",
      district: "Vaishali",
      tags: ["youth-volunteer", "bike-access"],
      notes: "Can reach scattered hamlets quickly. Useful in urgent follow-up.",
      photoUrl: null,
      lastVisitAt: subDays(now, 8).toISOString(),
      visitCount: 9,
      addedBy: teamMembers[1].userId,
      createdAt: subDays(now, 120).toISOString(),
      updatedAt: subDays(now, 8).toISOString()
    },
    {
      id: "30000000-0000-0000-0000-000000000004",
      name: "Pushpa Kumari",
      nameHi: "पुष्पा कुमारी",
      phone: "+91 91234 50004",
      whatsapp: "+91 91234 50004",
      village: "Bishunpur",
      panchayat: "Rampur Khajuria",
      block: "Mahua",
      district: "Vaishali",
      tags: ["anganwadi", "nutrition"],
      notes: "Tracks nutrition follow-up for mothers with infants.",
      photoUrl: null,
      lastVisitAt: subDays(now, 67).toISOString(),
      visitCount: 5,
      addedBy: teamMembers[0].userId,
      createdAt: subDays(now, 108).toISOString(),
      updatedAt: subDays(now, 12).toISOString()
    },
    {
      id: "30000000-0000-0000-0000-000000000005",
      name: "Bhola Yadav",
      nameHi: "भोला यादव",
      phone: "+91 91234 50005",
      whatsapp: null,
      village: "Jalalpur",
      panchayat: "Sahariya",
      block: "Mahua",
      district: "Vaishali",
      tags: ["panchayat-member", "water"],
      notes: "Usually available in the evening after field work.",
      photoUrl: null,
      lastVisitAt: subDays(now, 12).toISOString(),
      visitCount: 17,
      addedBy: teamMembers[0].userId,
      createdAt: subDays(now, 132).toISOString(),
      updatedAt: subDays(now, 9).toISOString()
    },
    {
      id: "30000000-0000-0000-0000-000000000006",
      name: "Kiran Bano",
      nameHi: "किरण बानो",
      phone: "+91 91234 50006",
      whatsapp: "+91 91234 50006",
      village: "Sikandarpur",
      panchayat: "Sahariya",
      block: "Mahua",
      district: "Vaishali",
      tags: ["health", "volunteer"],
      notes: "Often helps with medical referrals and escort support.",
      photoUrl: null,
      lastVisitAt: subDays(now, 4).toISOString(),
      visitCount: 8,
      addedBy: teamMembers[1].userId,
      createdAt: subDays(now, 90).toISOString(),
      updatedAt: subDays(now, 3).toISOString()
    },
    {
      id: "30000000-0000-0000-0000-000000000007",
      name: "Anil Kumar",
      nameHi: "अनिल कुमार",
      phone: "+91 91234 50007",
      whatsapp: "+91 91234 50007",
      village: "Betia East",
      panchayat: "Chandpura",
      block: "Mahua",
      district: "Vaishali",
      tags: ["tractor-owner", "logistics"],
      notes: "Provides transport during flood response if fuel is arranged.",
      photoUrl: null,
      lastVisitAt: subDays(now, 42).toISOString(),
      visitCount: 6,
      addedBy: teamMembers[0].userId,
      createdAt: subDays(now, 84).toISOString(),
      updatedAt: subDays(now, 7).toISOString()
    },
    {
      id: "30000000-0000-0000-0000-000000000008",
      name: "Mamta Ji",
      nameHi: "ममता जी",
      phone: "+91 91234 50008",
      whatsapp: "+91 91234 50008",
      village: "Khaira Tola",
      panchayat: "Chandpura",
      block: "Mahua",
      district: "Vaishali",
      tags: ["school-committee", "adolescent-girls"],
      notes: "Leads the local adolescent girls learning circle.",
      photoUrl: null,
      lastVisitAt: subDays(now, 26).toISOString(),
      visitCount: 10,
      addedBy: teamMembers[1].userId,
      createdAt: subDays(now, 74).toISOString(),
      updatedAt: subDays(now, 6).toISOString()
    }
  ];
}

function attachContactStats(rawContact: ReturnType<typeof baseContacts>[number]): Contact {
  const contactLocations = locations.filter((location) => location.contactId === rawContact.id);
  const relatedIssues = issues.filter((issue) => issue.contactId === rawContact.id && issue.status !== "resolved");
  const daysSinceLastVisit = rawContact.lastVisitAt ? differenceInCalendarDays(now, parseISO(rawContact.lastVisitAt)) : null;

  return {
    ...rawContact,
    locations: contactLocations,
    gapLevel: deriveGapLevel(rawContact.lastVisitAt),
    daysSinceLastVisit,
    openIssueCount: relatedIssues.length,
    criticalIssueCount: relatedIssues.filter((issue) => issue.priority === "critical").length
  };
}

export function getDemoContacts() {
  return baseContacts()
    .map(attachContactStats)
    .sort((left, right) => {
      const leftDays = left.daysSinceLastVisit ?? 999;
      const rightDays = right.daysSinceLastVisit ?? 999;
      return rightDays - leftDays;
    });
}

export function getDemoContactById(id: string) {
  return getDemoContacts().find((contact) => contact.id === id) ?? null;
}

export function getDemoIssues() {
  return [...issues].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export function getDemoIssueById(id: string) {
  return getDemoIssues().find((issue) => issue.id === id) ?? null;
}

export function getDemoVisits() {
  return [...visits].sort((left, right) => right.visitedAt.localeCompare(left.visitedAt));
}

export function getDemoTeamMembers() {
  return [...teamMembers];
}

export function getDemoAlerts() {
  return [...alerts].sort((left, right) => right.triggeredAt.localeCompare(left.triggeredAt));
}

export function getDemoNearbyContacts(
  latitude = demoCurrentLocation.latitude,
  longitude = demoCurrentLocation.longitude,
  radiusKm = 5,
  tag?: string | null
): NearbyContact[] {
  return getDemoContacts()
    .map((contact) => {
      const primaryLocation = contact.locations.find((location) => location.isPrimary) ?? contact.locations[0];

      return {
        ...contact,
        distanceMeters: primaryLocation
          ? haversineDistanceMeters(
              { latitude, longitude },
              {
                latitude: primaryLocation.latitude,
                longitude: primaryLocation.longitude
              }
            )
          : null
      };
    })
    .filter((contact) => (tag ? contact.tags.includes(tag) : true))
    .filter((contact) => (contact.distanceMeters ?? Number.POSITIVE_INFINITY) <= radiusKm * 1000)
    .sort((left, right) => (left.distanceMeters ?? Number.POSITIVE_INFINITY) - (right.distanceMeters ?? Number.POSITIVE_INFINITY));
}

export function getDemoPanchayatSummary(): PanchayatSummary[] {
  const contacts = getDemoContacts();
  const byPanchayat = new Map<string, PanchayatSummary>();

  contacts.forEach((contact) => {
    const existing = byPanchayat.get(contact.panchayat) ?? {
      panchayat: contact.panchayat,
      totalContacts: 0,
      contactsNeedingAttention: 0,
      openIssues: 0,
      visitCount: 0,
      lastActivityAt: null,
      center: null
    };

    existing.totalContacts += 1;
    existing.openIssues += contact.openIssueCount;
    if (["attention_needed", "high_priority", "critical"].includes(contact.gapLevel)) {
      existing.contactsNeedingAttention += 1;
    }

    const primaryLocations = contacts
      .filter((entry) => entry.panchayat === contact.panchayat)
      .flatMap((entry) => entry.locations.filter((location) => location.isPrimary))
      .map((location) => ({ latitude: location.latitude, longitude: location.longitude }));

    existing.center = averageCoordinates(primaryLocations);

    const lastVisit = visits
      .filter((visit) => visit.panchayat === contact.panchayat)
      .sort((left, right) => right.visitedAt.localeCompare(left.visitedAt))[0];

    existing.visitCount = visits.filter((visit) => visit.panchayat === contact.panchayat).length;
    existing.lastActivityAt = lastVisit?.visitedAt ?? contact.lastVisitAt ?? null;

    byPanchayat.set(contact.panchayat, existing);
  });

  return Array.from(byPanchayat.values()).sort((left, right) => (right.contactsNeedingAttention + right.openIssues) - (left.contactsNeedingAttention + left.openIssues));
}

export function getDemoDiaryData(): DiaryData {
  const monthlySummary = [0, 1, 2].map((offset) => {
    const monthStart = startOfMonth(subDays(now, offset * 30));
    const monthLabel = format(monthStart, "MMMM");
    const monthVisits = visits.filter((visit) => format(parseISO(visit.visitedAt), "yyyy-MM") === format(monthStart, "yyyy-MM"));

    return {
      label: monthLabel,
      visitCount: monthVisits.length,
      focusLine:
        monthVisits.length >= 4
          ? "The month held steady contact across villages."
          : "The month needs a tighter field rhythm."
    };
  });

  const villagesNotVisited = getDemoContacts()
    .filter((contact) => (contact.daysSinceLastVisit ?? 999) >= 21)
    .map((contact) => ({
      village: contact.village,
      panchayat: contact.panchayat,
      daysSinceVisit: contact.daysSinceLastVisit,
      lastVisitAt: contact.lastVisitAt
    }))
    .sort((left, right) => (right.daysSinceVisit ?? 0) - (left.daysSinceVisit ?? 0));

  const coveragePoints = getDemoContacts().flatMap((contact) =>
    contact.locations
      .filter((location) => location.isPrimary)
      .map((location) => ({
        id: location.id,
        label: `${contact.village}, ${contact.panchayat}`,
        latitude: location.latitude,
        longitude: location.longitude,
        recencyBand: contact.gapLevel
      }))
  );

  return {
    monthlySummary,
    panchayatSummary: getDemoPanchayatSummary(),
    villagesNotVisited,
    coveragePoints
  };
}

export function getDemoDashboardData(currentLocation = demoCurrentLocation): DashboardData {
  const contacts = getDemoContacts();
  const openIssues = getDemoIssues().filter((issue) => issue.status !== "resolved");
  const panchayatCoverage = getDemoPanchayatSummary();
  const suggestedVisit = chooseSuggestedVisit(panchayatCoverage, currentLocation);

  return {
    greeting: "Good morning, Rekha.",
    summaryLine: "You can already see where the day is pulling you.",
    contacts,
    needsAttentionContacts: contacts.filter((contact) =>
      ["attention_needed", "high_priority", "critical"].includes(contact.gapLevel)
    ),
    overdueContacts: contacts.filter((contact) => ["high_priority", "critical"].includes(contact.gapLevel)),
    issues,
    openIssues,
    recentVisits: getDemoVisits().slice(0, 6),
    panchayatCoverage,
    suggestedVisit,
    currentLocation
  };
}

export function getDemoAuthState() {
  return {
    isAuthenticated: true,
    isDemoMode: true,
    userId: teamMembers[0].userId,
    displayName: teamMembers[0].displayName,
    role: teamMembers[0].role
  } as const;
}

