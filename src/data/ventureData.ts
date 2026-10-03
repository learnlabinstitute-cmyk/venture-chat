export interface PlanInfo {
  id: 'silver' | 'gold' | 'platinum';
  name: string;
  badgeColor: string;
  websitesCount: number;
  description: string;
  features: string[];
  bestFor: string;
  supportLevel: string;
}

export const PLANS: Record<string, PlanInfo> = {
  silver: {
    id: 'silver',
    name: 'Silver Plan',
    badgeColor: 'from-slate-400 to-slate-600',
    websitesCount: 1,
    description: '1 High-Performance Business Website with responsive UI and core digital setup.',
    features: [
      '1 Custom Modern Website included',
      'Mobile & Tablet Responsive Design',
      'Essential On-Page SEO & Meta Tags',
      'Free SSL Certificate & Contact Forms',
      'Standard Support Ticket Resolution (L1 SLA: 0-4 hrs)',
      '1 Round of post-launch minor revisions'
    ],
    bestFor: 'Solo entrepreneurs, local businesses, and personal portfolios.',
    supportLevel: 'Standard Level 1 Frontline Support',
  },
  gold: {
    id: 'gold',
    name: 'Gold Plan',
    badgeColor: 'from-amber-400 to-amber-600',
    websitesCount: 2,
    description: '2 Multi-page or distinct business websites with advanced performance and priority care.',
    features: [
      '2 Custom Business Websites included',
      'Advanced UI/UX with modern animations',
      'Speed optimization & Google Core Web Vitals tuned',
      'Social media integration & WhatsApp chat widget',
      'Priority Level 2 Support (Fast-track queue, SLA: 2-6 hrs)',
      '2 Rounds of post-launch revisions & monthly health check'
    ],
    bestFor: 'Growing enterprises, dual-brand ventures, and agency partners.',
    supportLevel: 'Priority Level 1 & Level 2 Technical Support',
  },
  platinum: {
    id: 'platinum',
    name: 'Platinum Plan',
    badgeColor: 'from-emerald-400 to-teal-600',
    websitesCount: 3,
    description: '3 Bespoke enterprise websites or digital web applications with dedicated VIP manager.',
    features: [
      '3 Bespoke Enterprise Websites included',
      'Full Custom Architecture (E-commerce / Web App / Corporate)',
      'Dedicated Account Manager & Technical Lead',
      '24/7 Critical Uptime Monitoring & Emergency Response',
      'VIP Level 3 Escalation Priority & Direct WhatsApp Liaison',
      'Unlimited minor maintenance & quarterly strategy reviews'
    ],
    bestFor: 'High-growth startups, corporate groups, and e-commerce leaders.',
    supportLevel: 'VIP Dedicated 24/7 Account Management & Level 3 Access',
  },
};

export interface PolicyItem {
  id: string;
  title: string;
  url: string;
  category: 'Legal' | 'Support' | 'Conduct' | 'Operations' | 'Finance';
  summary: string;
  keyPoints: string[];
  fullDetails: string;
  faqPrompt: string;
}

export const VENTURE_POLICIES: PolicyItem[] = [
  {
    id: 'escalation',
    title: 'Escalation Matrix',
    url: 'https://www.ventureinfotech.in/escalation',
    category: 'Support',
    summary: 'Clear 3-tier grievance and issue escalation hierarchy ensuring every customer concern is resolved within stipulated SLAs.',
    keyPoints: [
      'Level 1 (Frontline): AI Support & Customer Care Executive (Immediate to 2 hours response). Handles regular questions, plan details, status updates.',
      'Level 2 (Technical & Operations): Team Lead / Project Manager (Response within 4 to 12 hours). Handles technical bugs, design milestone delays, domain/hosting configuration.',
      'Level 3 (Management): Grievance Officer & Operations Head (Response within 24 to 48 hours). Handles unresolved issues >24 hours, billing disputes, contract escalations.',
      'Formal Ticket Required: Every escalation must reference a valid Ticket ID.'
    ],
    fullDetails: `Venture Infotech follows a structured Escalation Matrix to ensure 100% transparency and prompt resolution:
- Level 1: Initial query logging, basic troubleshooting, plan clarification. Available 24/7 via AI chat & ticket desk.
- Level 2: If Level 1 does not resolve the issue within 24 hours, the ticket automatically upgrades to the Senior Project Lead.
- Level 3: Contact Grievance Officer at grievance@ventureinfotech.in or support@ventureinfotech.in. Written resolution provided within 48 business hours.`,
    faqPrompt: 'Escalation matrix kaise kaam karta hai aur L1/L2/L3 levels kya hain?'
  },
  {
    id: 'cancellationandrefundpolicy',
    title: 'Cancellation & Refund Policy',
    url: 'https://www.ventureinfotech.in/cancellationandrefundpolicy',
    category: 'Finance',
    summary: 'Clear terms on cancellations, milestone billing, non-refundable third-party costs, and revision guarantee.',
    keyPoints: [
      'Pre-Initiation Window: Cancellation requested within 24 hours of payment before project kickoff is eligible for partial refund minus admin/gateway charges.',
      'Work Commenced: Once development, custom design, or wireframing has begun, payments are strictly non-refundable due to allocated engineering hours.',
      'Third-party Purchases: Domains, server hosting, SSL certificates, and third-party APIs bought on client behalf are 100% non-refundable.',
      'Satisfaction via Revisions: We resolve design disagreements through agreed plan revision cycles rather than monetary refunds.'
    ],
    fullDetails: `Venture Infotech invests significant human capital and engineering time upon project onboarding. 
Once design, coding, or hosting setup has commenced, funds cannot be refunded. If a client is unhappy with initial drafts, our policy provides iterative design revisions to match client expectations perfectly.`,
    faqPrompt: 'Kya refund mil sakta hai agar mujhe website cancel karni ho?'
  },
  {
    id: 'whatsapppolicy',
    title: 'WhatsApp Communication Policy',
    url: 'https://www.ventureinfotech.in/whatsapppolicy',
    category: 'Support',
    summary: 'Guidelines for official WhatsApp messaging, communication hours, and security protocols.',
    keyPoints: [
      'Official Channels Only: Only messages from verified Venture Infotech business numbers are authentic.',
      'Scope of WhatsApp: Ideal for quick updates, milestone notifications, meeting links, and urgent alerts.',
      'Formal Documentation: Scope changes, detailed technical specs, bug reports, and payment disputes MUST be logged via official ticketing or email.',
      'No Confidential Credential Sharing: Never share sensitive banking passwords or OTPs over WhatsApp chat.'
    ],
    fullDetails: `WhatsApp offers rapid convenience, but formal contractual decisions must remain on recorded email or ticket threads. Support teams respond on WhatsApp during operational hours (9:30 AM - 6:30 PM IST), while critical downtime alerts are handled 24/7.`,
    faqPrompt: 'WhatsApp par support lene ke kya rules aur timings hain?'
  },
  {
    id: 'ztpolicy',
    title: 'Zero Tolerance Policy (ZT Policy)',
    url: 'https://www.ventureinfotech.in/ztpolicy',
    category: 'Conduct',
    summary: 'Zero tolerance toward fraudulent activities, chargeback abuse, extortion, security tampering, and unethical conduct.',
    keyPoints: [
      'Immediate Account Suspension for willful payment chargebacks without following cancellation protocol.',
      'Zero Tolerance for cyber attacks, illegal content hosting, copyright infringement, or phishing attempts.',
      'Strict legal remedies invoked against defamatory smear campaigns or blackmail.',
      'Protection of staff and systems remains paramount.'
    ],
    fullDetails: `Under Venture Infotech's Zero Tolerance Policy, any client or entity attempting cyber tampering, illegal content distribution, fraudulent financial chargebacks, or abusive intimidation will face immediate contract termination without refund, alongside legal reporting to cyber authorities.`,
    faqPrompt: 'Zero Tolerance (ZT) Policy me kin cheezon par ban lagta hai?'
  },
  {
    id: 'antiharassment',
    title: 'Anti-Harassment Policy',
    url: 'https://www.ventureinfotech.in/antiharassment',
    category: 'Conduct',
    summary: 'Strict protection for support executives, engineers, and employees against verbal abuse, slurs, and intimidations.',
    keyPoints: [
      'Prohibition of abusive, vulgar, or threatening language on calls, chats, or emails.',
      'Support agents are fully empowered to disconnect or mute abusive callers after 1 formal warning.',
      'Incidents are archived and escalated to legal and executive management.',
      'Commitment to courteous, constructive, and dignified interactions.'
    ],
    fullDetails: `Venture Infotech believes in utmost respect between clients and staff. While we understand project stress, any verbal abuse, aggressive threats, foul language, or discriminatory remarks will lead to immediate termination of live support sessions.`,
    faqPrompt: 'Anti-Harassment policy ke tehat support staff se kaise baat karni chahiye?'
  },
  {
    id: 'harassment',
    title: 'Harassment & Mutual Respect Policy',
    url: 'https://www.ventureinfotech.in/harassment',
    category: 'Conduct',
    summary: 'Fostering a safe, professional, and respectful environment for both client stakeholders and internal teams.',
    keyPoints: [
      'Applies across all channels: WhatsApp, Zoom/Google Meet, email, telephone, and ticketing portal.',
      'Zero tolerance for discriminatory behavior based on gender, region, religion, or background.',
      'Formal reporting channel for any harassment concerns on either side.'
    ],
    fullDetails: `Mutual dignity is the cornerstone of our long-term client partnerships. Every conversation is expected to remain professional, polite, and focused on constructive problem-solving.`,
    faqPrompt: 'Harassment policy client aur company dono par kaise lagu hoti hai?'
  },
  {
    id: 'timemisuepolicy',
    title: 'Time Misuse Policy',
    url: 'https://www.ventureinfotech.in/timemisuepolicy',
    category: 'Operations',
    summary: 'Ensuring productive development schedules, punctual consultations, and structured change requests.',
    keyPoints: [
      'Scheduled Meetings: Clients are requested to attend pre-booked design/sprint review calls on time.',
      'Unproductive Repetitive Calls: Calling repeatedly without actionable feedback hinders developer productivity.',
      'Consolidated Feedback: Clients should send structured, consolidated revision points to avoid endless rework.',
      'Out-of-Scope Requests: Demanding features outside the agreed plan requires a formal Change Request (CR).'
    ],
    fullDetails: `To deliver websites within swift turnaround times, our engineers follow disciplined sprint schedules. Repeated no-shows or incessant unscheduled calls waste valuable coding hours. Feedback must be consolidated via official forms or emails.`,
    faqPrompt: 'Time Misuse policy ka kya matlab hai aur feedback kaise dena chahiye?'
  },
  {
    id: 'codeofconduct',
    title: 'Code of Conduct',
    url: 'https://www.ventureinfotech.in/codeofconduct',
    category: 'Conduct',
    summary: 'Standard of ethical business engagement, professional communication, and cooperative delivery.',
    keyPoints: [
      'Professional courtesy and clear business communication.',
      'Honest disclosure of website requirements and assets.',
      'Prompt client approvals to prevent project stagnation.',
      'Confidentiality of mutual proprietary information.'
    ],
    fullDetails: `The Code of Conduct outlines the ethical partnership contract: Venture Infotech pledges high engineering standards, honest estimates, and courteous assistance; clients pledge constructive feedback and adherence to agreed roadmaps.`,
    faqPrompt: 'Code of conduct ke main rules kya hain?'
  },
  {
    id: 'systemabuse',
    title: 'System Abuse Policy',
    url: 'https://www.ventureinfotech.in/systemabuse',
    category: 'Operations',
    summary: 'Protection of servers, APIs, hosting infrastructure, and digital assets from unauthorized exploitation.',
    keyPoints: [
      'Prohibition of automated bot attacks, SQL injection attempts, or penetration testing without prior authorization.',
      'Strict ban on hosting malicious scripts, cryptocurrency miners, or spam mailers on client servers.',
      'Resource quotas: Server bandwidth and storage must stay within plan allowances.',
      'Immediate blacklisting and service severance upon detection of system abuse.'
    ],
    fullDetails: `Servers allocated for customer websites are shielded by firewalls and anti-malware filters. Any customer activity that threatens shared network integrity or circumvents security triggers instant IP blocking.`,
    faqPrompt: 'System abuse policy me kin technical activities par pabandi hai?'
  },
  {
    id: 'legalclauses',
    title: 'Legal Clauses & Terms of Service',
    url: 'https://www.ventureinfotech.in/legalclauses',
    category: 'Legal',
    summary: 'Governing clauses regarding liability limitations, intellectual property transfer, and legal jurisdiction.',
    keyPoints: [
      'Limitation of Liability: Company is not liable for indirect losses, market fluctuation, or third-party service downtime.',
      'Client Content Indemnity: Client confirms they own full rights to all images, logos, and text submitted for development.',
      'IP Ownership: Source code and website ownership transfer to the client upon 100% full invoice clearance.',
      'Jurisdiction: Governed by the laws of India with exclusive jurisdiction in designated courts.'
    ],
    fullDetails: `Our legal clauses protect both the client and Venture Infotech. All deliverables become client intellectual property once final dues are completed. Clients must ensure their website content does not violate third-party trademarks or copyright.`,
    faqPrompt: 'Website copyright aur legal liability ki kya terms hain?'
  },
  {
    id: 'termination',
    title: 'Service Termination Policy',
    url: 'https://www.ventureinfotech.in/termination',
    category: 'Legal',
    summary: 'Conditions under which service contracts are discontinued, asset handovers, and final settlement procedures.',
    keyPoints: [
      'Voluntary Termination: Client may terminate with 15 days written notice; accrued milestones remain payable.',
      'Involuntary Termination: Immediate termination for non-payment, Zero Tolerance breach, or prolonged inactivity (>60 days).',
      'Asset Handover: All completed files and design assets handed over provided there are no outstanding financial dues.',
      'Archive & Purge: Inactive projects will be safely archived for 30 days before permanent deletion from active servers.'
    ],
    fullDetails: `Termination procedures ensure orderly project closeouts. Upon amicable termination, client receives their database dumps and code repository provided their billing account has zero arrears.`,
    faqPrompt: 'Agar services terminate karni ho toh handover aur rules kya hain?'
  },
  {
    id: 'earningdisclaimer',
    title: 'Earning & Revenue Disclaimer',
    url: 'https://www.ventureinfotech.in/earningdisclaimer',
    category: 'Finance',
    summary: 'Clear affirmation that Venture Infotech provides technical development, not guaranteed financial earnings.',
    keyPoints: [
      'No Revenue Guarantee: Venture Infotech builds high-converting, modern websites, but does NOT guarantee sales figures or ROI.',
      'Business Responsibility: Client sales depend on their market demand, pricing, advertising budget, and customer service.',
      'No Unrealistic Claims: We advise clients against expecting overnight passive income without business execution.',
      'Technical Excellence vs Market Risk: We guarantee website uptime, speed, and design responsiveness, not commercial profits.'
    ],
    fullDetails: `A website is a powerful business tool, but financial success depends on client business strategies, marketing, and execution. Venture Infotech provides technical excellence and modern digital design, but disclaims any direct earning or profit promises.`,
    faqPrompt: 'Kya website banwane ke baad sales ya earnings ki koi guarantee hoti hai?'
  },
  {
    id: '24/7',
    title: '24/7 Support Operations Policy',
    url: 'https://www.ventureinfotech.in/24/7',
    category: 'Operations',
    summary: 'Scope of continuous 24/7 emergency server monitoring versus routine development operating windows.',
    keyPoints: [
      '24/7 Monitoring: Continuous automated checks on website uptime, server health, and security alerts 24/7/365.',
      '24/7 Ticket Logging: AI Support Desk and ticketing system accept queries 24 hours a day, 7 days a week.',
      'Emergency Response: Critical server crashes or security alerts are addressed by on-call engineers within 1 hour.',
      'Standard Development Hours: Feature additions, content revisions, and design feedback are processed Mon-Sat (9:30 AM - 6:30 PM IST).'
    ],
    fullDetails: `Our 24/7 infrastructure ensures your business website never sleeps. While routine styling and text modifications occur during standard working days, our automated systems and emergency desk monitor servers round the clock.`,
    faqPrompt: '24/7 support me kya cheezein round-the-clock milti hain?'
  }
];

export interface SupportTicket {
  id: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  planId: string;
  category: string;
  priority: 'Normal' | 'High' | 'Urgent';
  level: 'Level 1' | 'Level 2' | 'Level 3';
  subject: string;
  description: string;
  createdAt: string;
  status: 'Open' | 'Under Review' | 'Escalated' | 'Resolved';
}
