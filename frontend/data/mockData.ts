export interface Ticket {
  ticketId: string;
  subject: string;
  category: "Hardware/Infrastructure" | "Billing" | "Technical Support" | "Feature Request";
  categoryConfidence: number;
  severity: "P1" | "P2" | "P3" | "P4";
  slaRemaining: string;
  status: "Open" | "In Progress" | "Resolved" | "Escalated";
  customer: {
    company: string;
    domain: string;
    tier: "Gold" | "Silver" | "Bronze" | "Trial";
    csm: string;
    role: string;
    department: string;
    isNewLead: boolean;
  };
  deduplication: {
    mergedEmails: number;
    similarity: number;
  };
  aiInsights: {
    severityReason: string;
    confidenceNote: string;
  };
  aiResponse: {
    greeting?: string;
    steps: string[];
    successRate: string;
    avgResolutionTime: string;
    matchScore: number;
  };
  messages: Array<{
    id: string;
    sender: string;
    role: "customer" | "support" | "system";
    timestamp: string;
    subject: string;
    body: string;
    merged?: boolean;
  }>;
}

export const mockTickets: Ticket[] = [
  {
    ticketId: "INC000123",
    subject: "Server down – production impacted",
    category: "Hardware/Infrastructure",
    categoryConfidence: 0.96,
    severity: "P1",
    slaRemaining: "45 minutes",
    status: "Open",
    customer: {
      company: "Tata Steel",
      domain: "tatasteel.com",
      tier: "Gold",
      csm: "Rahul Verma",
      role: "IT Admin",
      department: "Infrastructure",
      isNewLead: false,
    },
    deduplication: {
      mergedEmails: 3,
      similarity: 0.89,
    },
    aiInsights: {
      severityReason: "Production impact detected from language and keywords",
      confidenceNote: "High confidence due to repeated incidents",
    },
    aiResponse: {
      greeting: "Hi Team,",
      steps: [
        "Restart database service",
        "Verify application connectivity",
        "Monitor system logs for 15 minutes",
      ],
      successRate: "82%",
      avgResolutionTime: "1.4 hours",
      matchScore: 85,
    },
    messages: [
      {
        id: "m4",
        sender: "Rahul Verma <csm@intellidesk.ai>",
        role: "support",
        timestamp: "10:15 AM",
        subject: "Re: Server down – production impacted",
        body: "Automated AI acknowledgement sent. Investigating P1 status.",
      },
      {
        id: "m3",
        sender: "system@monitoring.tatasteel.com",
        role: "customer",
        timestamp: "10:12 AM",
        subject: "ALERT: DB-04 Unresponsive",
        body: "Critical alert: Database node 04 is not responding to ping.",
        merged: true,
      },
      {
        id: "m2",
        sender: "ops@tatasteel.com (Amit K)",
        role: "customer",
        timestamp: "10:10 AM",
        subject: "Production DB connection failed",
        body: "We are seeing 500 errors on the checkout page. Logs show DB timeout.",
        merged: true,
      },
      {
        id: "m1",
        sender: "admin@tatasteel.com",
        role: "customer",
        timestamp: "10:05 AM",
        subject: "Server down – production impacted",
        body: "Urgent: The main production server seems to be down. Customers cannot login.",
      },
    ],
  },
  {
    ticketId: "INC000124",
    subject: "License key activation failing",
    category: "Billing",
    categoryConfidence: 0.92,
    severity: "P3",
    slaRemaining: "4 hours",
    status: "Open",
    customer: {
      company: "Acme Corp",
      domain: "acme.com",
      tier: "Silver",
      csm: "Sarah Jenkins",
      role: "Procurement",
      department: "Finance",
      isNewLead: false,
    },
    deduplication: {
      mergedEmails: 1,
      similarity: 0.0,
    },
    aiInsights: {
      severityReason: "License issue affects single user, workarounds available",
      confidenceNote: "Standard billing classification",
    },
    aiResponse: {
      greeting: "Hello,",
      steps: [
        "Verify subscription status in portal",
        "Regenerate license key",
        "Clear local cache",
      ],
      successRate: "95%",
      avgResolutionTime: "15 mins",
      matchScore: 92,
    },
    messages: [
      {
        id: "m5",
        sender: "billing@acme.com",
        role: "customer",
        timestamp: "11:30 AM",
        subject: "License error 503",
        body: "Trying to activate the new seat but getting error 503.",
      },
    ],
  },
  {
    ticketId: "INC000125",
    subject: "Feature request: Dark mode export",
    category: "Feature Request",
    categoryConfidence: 0.88,
    severity: "P4",
    slaRemaining: "2 days",
    status: "In Progress",
    customer: {
      company: "Designify",
      domain: "designify.io",
      tier: "Trial",
      csm: "None",
      role: "Designer",
      department: "Product",
      isNewLead: true,
    },
    deduplication: {
      mergedEmails: 0,
      similarity: 0.0,
    },
    aiInsights: {
      severityReason: "Non-critical feature request",
      confidenceNote: "Keyword match 'feature request'",
    },
    aiResponse: {
      greeting: "Hi there,",
      steps: [
        "Log request in feedback portal",
        "Send roadmap link",
      ],
      successRate: "100%",
      avgResolutionTime: "N/A",
      matchScore: 55,
    },
    messages: [
      {
        id: "m6",
        sender: "mike@designify.io",
        role: "customer",
        timestamp: "09:00 AM",
        subject: "Dark mode export?",
        body: "Can we export reports in dark mode? That would be cool.",
      },
    ],
  },
  {
    ticketId: "INC000126",
    subject: "API Rate limiting errors",
    category: "Technical Support",
    categoryConfidence: 0.95,
    severity: "P2",
    slaRemaining: "1.5 hours",
    status: "Open",
    customer: {
      company: "TechFlow",
      domain: "techflow.net",
      tier: "Gold",
      csm: "Rahul Verma",
      role: "Developer",
      department: "Engineering",
      isNewLead: false,
    },
    deduplication: {
      mergedEmails: 2,
      similarity: 0.91,
    },
    aiInsights: {
      severityReason: "Integration failing for multiple users",
      confidenceNote: "Error logs correlation",
    },
    aiResponse: {
      greeting: "Hello TechFlow Team,",
      steps: [
        "Check current usage quota",
        "Implement exponential backoff",
        "Request quota increase",
      ],
      successRate: "76%",
      avgResolutionTime: "45 mins",
      matchScore: 78,
    },
    messages: [
      {
        id: "m8",
        sender: "dev@techflow.net",
        role: "customer",
        timestamp: "08:45 AM",
        subject: "429 Errors",
        body: "We are getting 429 Too Many Requests errors since the morning deployment.",
      },
         {
        id: "m9",
        sender: "cto@techflow.net",
        role: "customer",
        timestamp: "08:50 AM",
        subject: "API Down?",
        body: "Is the API down? We can't sync.",
        merged: true
      },
    ],
  },
];
