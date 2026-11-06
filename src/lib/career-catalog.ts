/** Curated fictional employers and learning opportunities for a self-contained interactive practice workspace.
 * Never present these records as verified vacancies or send an application to them. */
export type CareerSector = string;
export type CareerRoleInfo = {id:string;title:string;sector:string;focus:string;skills:string[]};
export type Company = {id:string;name:string;sector:string;location:string;tagline:string;about:string;color:string;teamSize:string;founded:number;image:number;initials:string};
export type Opportunity = {id:string;companyId:string;title:string;sector:string;location:string;type:string;level:string;salary:string;description:string;skills:string[];postedDaysAgo:number;mode:string};
export const CAREER_SECTORS = ["Technology", "Business & Management", "Healthcare & Wellness", "Education & Training", "Finance & Accounting", "Marketing & Media", "Engineering & Construction", "Hospitality & Tourism", "Legal & Public Services", "Retail & Customer Service", "Science & Research", "Agriculture & Sustainability", "Logistics & Manufacturing", "Creative & Design", "Banking & Insurance", "Legal & Compliance", "Energy & Utilities", "Real Estate & Property", "Telecommunications", "Transportation & Aviation", "Food & Beverage", "Sports & Fitness", "Media & Publishing", "Government & Public Policy", "Nonprofit & Community", "Pharmaceuticals & Biotechnology"] as const;
export const ROLE_CATALOG: CareerRoleInfo[] = [
  {
    "id": "frontend",
    "title": "Frontend Developer",
    "sector": "Technology",
    "focus": "accessible, responsive applications",
    "skills": [
      "React",
      "TypeScript",
      "responsive design",
      "API integration"
    ]
  },
  {
    "id": "qa",
    "title": "QA Automation Engineer",
    "sector": "Technology",
    "focus": "reliable automated testing",
    "skills": [
      "test cases",
      "regression testing",
      "defect triage",
      "CI/CD"
    ]
  },
  {
    "id": "analyst",
    "title": "Data Analyst",
    "sector": "Technology",
    "focus": "meaningful insights from data",
    "skills": [
      "SQL",
      "data cleaning",
      "visualization",
      "stakeholder communication"
    ]
  },
  {
    "id": "cybersecurity",
    "title": "Cybersecurity Analyst",
    "sector": "Technology",
    "focus": "identifying and responding to security threats",
    "skills": [
      "incident response",
      "log analysis",
      "risk assessment",
      "access controls"
    ]
  },
  {
    "id": "product",
    "title": "UI/UX Designer",
    "sector": "Technology",
    "focus": "accessible digital experiences",
    "skills": [
      "user research",
      "prototyping",
      "accessibility",
      "usability testing"
    ]
  },
  {
    "id": "software-engineer",
    "title": "Software Engineer",
    "sector": "Technology",
    "focus": "maintainable software systems",
    "skills": [
      "debugging",
      "system design",
      "testing",
      "code review"
    ]
  },
  {
    "id": "data-scientist",
    "title": "Data Scientist",
    "sector": "Technology",
    "focus": "responsible predictive analysis",
    "skills": [
      "statistics",
      "Python",
      "machine learning",
      "data storytelling"
    ]
  },
  {
    "id": "cloud-engineer",
    "title": "Cloud Engineer",
    "sector": "Technology",
    "focus": "resilient cloud services",
    "skills": [
      "cloud architecture",
      "deployment",
      "monitoring",
      "security"
    ]
  },
  {
    "id": "it-support",
    "title": "IT Support Specialist",
    "sector": "Technology",
    "focus": "reliable user technology support",
    "skills": [
      "troubleshooting",
      "customer support",
      "network basics",
      "documentation"
    ]
  },
  {
    "id": "mobile-dev",
    "title": "Mobile App Developer",
    "sector": "Technology",
    "focus": "intuitive mobile applications",
    "skills": [
      "mobile development",
      "API integration",
      "performance",
      "user testing"
    ]
  },
  {
    "id": "project",
    "title": "Project Manager",
    "sector": "Business & Management",
    "focus": "delivering collaborative projects",
    "skills": [
      "planning",
      "risk management",
      "stakeholder alignment",
      "prioritization"
    ]
  },
  {
    "id": "business-analyst",
    "title": "Business Analyst",
    "sector": "Business & Management",
    "focus": "better business decisions",
    "skills": [
      "requirements gathering",
      "process mapping",
      "data analysis",
      "communication"
    ]
  },
  {
    "id": "operations",
    "title": "Operations Manager",
    "sector": "Business & Management",
    "focus": "efficient operational delivery",
    "skills": [
      "process improvement",
      "resource planning",
      "KPIs",
      "team leadership"
    ]
  },
  {
    "id": "hr-generalist",
    "title": "HR Executive",
    "sector": "Business & Management",
    "focus": "inclusive people operations",
    "skills": [
      "recruitment",
      "employee relations",
      "policy administration",
      "communication"
    ]
  },
  {
    "id": "recruiter",
    "title": "Talent Acquisition Specialist",
    "sector": "Business & Management",
    "focus": "effective hiring processes",
    "skills": [
      "sourcing",
      "interviewing",
      "workforce planning",
      "candidate experience"
    ]
  },
  {
    "id": "office-admin",
    "title": "Administrative Executive",
    "sector": "Business & Management",
    "focus": "organized business operations",
    "skills": [
      "scheduling",
      "document management",
      "coordination",
      "accuracy"
    ]
  },
  {
    "id": "entrepreneur",
    "title": "Business Development Executive",
    "sector": "Business & Management",
    "focus": "sustainable business partnerships",
    "skills": [
      "prospecting",
      "negotiation",
      "market research",
      "CRM"
    ]
  },
  {
    "id": "product-manager",
    "title": "Product Manager",
    "sector": "Business & Management",
    "focus": "valuable products for users",
    "skills": [
      "roadmapping",
      "prioritization",
      "user research",
      "analytics"
    ]
  },
  {
    "id": "nurse",
    "title": "Registered Nurse",
    "sector": "Healthcare & Wellness",
    "focus": "safe compassionate patient care",
    "skills": [
      "patient assessment",
      "clinical documentation",
      "teamwork",
      "patient education"
    ]
  },
  {
    "id": "pharmacist",
    "title": "Pharmacist",
    "sector": "Healthcare & Wellness",
    "focus": "safe medicine management",
    "skills": [
      "medication review",
      "patient counseling",
      "accuracy",
      "dispensing"
    ]
  },
  {
    "id": "medical-assistant",
    "title": "Medical Assistant",
    "sector": "Healthcare & Wellness",
    "focus": "efficient clinical patient support",
    "skills": [
      "vital signs",
      "patient communication",
      "care coordination",
      "records"
    ]
  },
  {
    "id": "physiotherapist",
    "title": "Physiotherapist",
    "sector": "Healthcare & Wellness",
    "focus": "individualized rehabilitation care",
    "skills": [
      "movement assessment",
      "treatment planning",
      "patient education",
      "progress tracking"
    ]
  },
  {
    "id": "nutritionist",
    "title": "Nutritionist",
    "sector": "Healthcare & Wellness",
    "focus": "evidence-based nutrition guidance",
    "skills": [
      "dietary assessment",
      "meal planning",
      "education",
      "nutrition science"
    ]
  },
  {
    "id": "public-health",
    "title": "Public Health Officer",
    "sector": "Healthcare & Wellness",
    "focus": "community health outcomes",
    "skills": [
      "health promotion",
      "program planning",
      "research",
      "stakeholder coordination"
    ]
  },
  {
    "id": "teacher",
    "title": "Primary School Teacher",
    "sector": "Education & Training",
    "focus": "engaging and inclusive lessons",
    "skills": [
      "lesson planning",
      "classroom management",
      "assessment",
      "differentiation"
    ]
  },
  {
    "id": "lecturer",
    "title": "University Lecturer",
    "sector": "Education & Training",
    "focus": "effective higher education",
    "skills": [
      "teaching",
      "research",
      "assessment",
      "mentoring"
    ]
  },
  {
    "id": "esl-teacher",
    "title": "English Language Teacher",
    "sector": "Education & Training",
    "focus": "engaging English language learning",
    "skills": [
      "lesson planning",
      "speaking activities",
      "assessment",
      "learner support"
    ]
  },
  {
    "id": "instructional-designer",
    "title": "Instructional Designer",
    "sector": "Education & Training",
    "focus": "effective learning experiences",
    "skills": [
      "curriculum design",
      "learning objectives",
      "storyboarding",
      "evaluation"
    ]
  },
  {
    "id": "academic-adviser",
    "title": "Academic Advisor",
    "sector": "Education & Training",
    "focus": "student academic success",
    "skills": [
      "student counseling",
      "degree planning",
      "communication",
      "record keeping"
    ]
  },
  {
    "id": "trainer",
    "title": "Corporate Trainer",
    "sector": "Education & Training",
    "focus": "workplace learning and development",
    "skills": [
      "facilitation",
      "learning design",
      "feedback",
      "training evaluation"
    ]
  },
  {
    "id": "accountant",
    "title": "Accountant",
    "sector": "Finance & Accounting",
    "focus": "accurate financial reporting",
    "skills": [
      "reconciliations",
      "financial statements",
      "compliance",
      "Excel"
    ]
  },
  {
    "id": "auditor",
    "title": "Internal Auditor",
    "sector": "Finance & Accounting",
    "focus": "effective risk controls",
    "skills": [
      "audit planning",
      "risk assessment",
      "documentation",
      "reporting"
    ]
  },
  {
    "id": "finance-analyst",
    "title": "Financial Analyst",
    "sector": "Finance & Accounting",
    "focus": "sound financial planning",
    "skills": [
      "forecasting",
      "financial modeling",
      "budgeting",
      "presentation"
    ]
  },
  {
    "id": "banker",
    "title": "Banking Officer",
    "sector": "Finance & Accounting",
    "focus": "responsible financial services",
    "skills": [
      "client relations",
      "credit assessment",
      "compliance",
      "financial products"
    ]
  },
  {
    "id": "tax-advisor",
    "title": "Tax Associate",
    "sector": "Finance & Accounting",
    "focus": "accurate tax compliance",
    "skills": [
      "tax preparation",
      "documentation",
      "research",
      "client communication"
    ]
  },
  {
    "id": "insurance",
    "title": "Insurance Advisor",
    "sector": "Finance & Accounting",
    "focus": "appropriate risk protection",
    "skills": [
      "needs analysis",
      "product knowledge",
      "ethics",
      "client service"
    ]
  },
  {
    "id": "marketing",
    "title": "Digital Marketing Specialist",
    "sector": "Marketing & Media",
    "focus": "measurable campaigns",
    "skills": [
      "audience research",
      "campaign metrics",
      "experimentation",
      "content planning"
    ]
  },
  {
    "id": "content-creator",
    "title": "Content Creator",
    "sector": "Marketing & Media",
    "focus": "engaging useful content",
    "skills": [
      "storytelling",
      "video production",
      "editing",
      "audience insights"
    ]
  },
  {
    "id": "social-media",
    "title": "Social Media Manager",
    "sector": "Marketing & Media",
    "focus": "community-led brand growth",
    "skills": [
      "content calendars",
      "engagement",
      "analytics",
      "brand voice"
    ]
  },
  {
    "id": "copywriter",
    "title": "Copywriter",
    "sector": "Marketing & Media",
    "focus": "clear persuasive communication",
    "skills": [
      "writing",
      "research",
      "editing",
      "brand messaging"
    ]
  },
  {
    "id": "pr-executive",
    "title": "Public Relations Executive",
    "sector": "Marketing & Media",
    "focus": "trust-building communication",
    "skills": [
      "media relations",
      "press releases",
      "stakeholder engagement",
      "crisis response"
    ]
  },
  {
    "id": "graphic-designer",
    "title": "Graphic Designer",
    "sector": "Marketing & Media",
    "focus": "compelling visual communications",
    "skills": [
      "typography",
      "visual design",
      "Adobe tools",
      "brand consistency"
    ]
  },
  {
    "id": "videographer",
    "title": "Videographer",
    "sector": "Marketing & Media",
    "focus": "professional visual storytelling",
    "skills": [
      "cinematography",
      "lighting",
      "post-production",
      "client briefs"
    ]
  },
  {
    "id": "civil-engineer",
    "title": "Civil Engineer",
    "sector": "Engineering & Construction",
    "focus": "safe infrastructure design",
    "skills": [
      "structural principles",
      "site coordination",
      "CAD",
      "safety"
    ]
  },
  {
    "id": "mechanical-engineer",
    "title": "Mechanical Engineer",
    "sector": "Engineering & Construction",
    "focus": "reliable mechanical systems",
    "skills": [
      "CAD",
      "thermodynamics",
      "testing",
      "manufacturing"
    ]
  },
  {
    "id": "electrical-engineer",
    "title": "Electrical Engineer",
    "sector": "Engineering & Construction",
    "focus": "safe electrical solutions",
    "skills": [
      "circuit analysis",
      "testing",
      "standards",
      "documentation"
    ]
  },
  {
    "id": "architect",
    "title": "Architect",
    "sector": "Engineering & Construction",
    "focus": "functional sustainable buildings",
    "skills": [
      "design development",
      "BIM",
      "building codes",
      "presentation"
    ]
  },
  {
    "id": "quantity-surveyor",
    "title": "Quantity Surveyor",
    "sector": "Engineering & Construction",
    "focus": "accurate project cost management",
    "skills": [
      "cost estimation",
      "contracts",
      "measurement",
      "procurement"
    ]
  },
  {
    "id": "site-supervisor",
    "title": "Site Supervisor",
    "sector": "Engineering & Construction",
    "focus": "safe effective construction operations",
    "skills": [
      "site inspection",
      "safety",
      "schedule tracking",
      "coordination"
    ]
  },
  {
    "id": "environmental-engineer",
    "title": "Environmental Engineer",
    "sector": "Engineering & Construction",
    "focus": "responsible environmental systems",
    "skills": [
      "environmental monitoring",
      "compliance",
      "data analysis",
      "sustainability"
    ]
  },
  {
    "id": "hotel-manager",
    "title": "Hotel Operations Executive",
    "sector": "Hospitality & Tourism",
    "focus": "positive guest experiences",
    "skills": [
      "guest service",
      "scheduling",
      "quality standards",
      "problem solving"
    ]
  },
  {
    "id": "chef",
    "title": "Chef",
    "sector": "Hospitality & Tourism",
    "focus": "consistent high-quality cuisine",
    "skills": [
      "food safety",
      "menu development",
      "kitchen management",
      "teamwork"
    ]
  },
  {
    "id": "baker",
    "title": "Baker",
    "sector": "Hospitality & Tourism",
    "focus": "safe consistent baked goods",
    "skills": [
      "recipe development",
      "food hygiene",
      "quality control",
      "time management"
    ]
  },
  {
    "id": "event-planner",
    "title": "Event Planner",
    "sector": "Hospitality & Tourism",
    "focus": "successful inclusive events",
    "skills": [
      "event logistics",
      "vendors",
      "budgets",
      "guest experience"
    ]
  },
  {
    "id": "travel-consultant",
    "title": "Travel Consultant",
    "sector": "Hospitality & Tourism",
    "focus": "well-planned travel experiences",
    "skills": [
      "itinerary design",
      "customer service",
      "booking systems",
      "risk management"
    ]
  },
  {
    "id": "restaurant-manager",
    "title": "Restaurant Manager",
    "sector": "Hospitality & Tourism",
    "focus": "excellent dining operations",
    "skills": [
      "inventory",
      "staff supervision",
      "guest relations",
      "food safety"
    ]
  },
  {
    "id": "paralegal",
    "title": "Paralegal",
    "sector": "Legal & Public Services",
    "focus": "organized legal case support",
    "skills": [
      "legal research",
      "drafting",
      "records",
      "confidentiality"
    ]
  },
  {
    "id": "legal-associate",
    "title": "Legal Associate",
    "sector": "Legal & Public Services",
    "focus": "sound client legal support",
    "skills": [
      "legal research",
      "case analysis",
      "drafting",
      "professional ethics"
    ]
  },
  {
    "id": "policy-analyst",
    "title": "Policy Analyst",
    "sector": "Legal & Public Services",
    "focus": "evidence-informed public policy",
    "skills": [
      "research",
      "policy evaluation",
      "stakeholder consultation",
      "report writing"
    ]
  },
  {
    "id": "social-worker",
    "title": "Social Worker",
    "sector": "Legal & Public Services",
    "focus": "person-centered community support",
    "skills": [
      "needs assessment",
      "case management",
      "safeguarding",
      "communication"
    ]
  },
  {
    "id": "ngo-coordinator",
    "title": "NGO Program Coordinator",
    "sector": "Legal & Public Services",
    "focus": "impactful social programs",
    "skills": [
      "program delivery",
      "partnerships",
      "monitoring",
      "reporting"
    ]
  },
  {
    "id": "government-officer",
    "title": "Administrative Officer",
    "sector": "Legal & Public Services",
    "focus": "responsive public administration",
    "skills": [
      "policy implementation",
      "service delivery",
      "documentation",
      "ethics"
    ]
  },
  {
    "id": "sales-executive",
    "title": "Sales Executive",
    "sector": "Retail & Customer Service",
    "focus": "trust-based customer relationships",
    "skills": [
      "consultative selling",
      "CRM",
      "negotiation",
      "product knowledge"
    ]
  },
  {
    "id": "retail-supervisor",
    "title": "Retail Supervisor",
    "sector": "Retail & Customer Service",
    "focus": "high-quality store operations",
    "skills": [
      "inventory",
      "merchandising",
      "team leadership",
      "customer service"
    ]
  },
  {
    "id": "customer-success",
    "title": "Customer Success Specialist",
    "sector": "Retail & Customer Service",
    "focus": "lasting customer outcomes",
    "skills": [
      "onboarding",
      "support",
      "retention",
      "analytics"
    ]
  },
  {
    "id": "call-center",
    "title": "Customer Service Representative",
    "sector": "Retail & Customer Service",
    "focus": "helpful issue resolution",
    "skills": [
      "communication",
      "case tracking",
      "empathy",
      "product knowledge"
    ]
  },
  {
    "id": "ecommerce",
    "title": "E-commerce Specialist",
    "sector": "Retail & Customer Service",
    "focus": "effective online retail operations",
    "skills": [
      "product listings",
      "analytics",
      "order management",
      "marketing"
    ]
  },
  {
    "id": "research-assistant",
    "title": "Research Assistant",
    "sector": "Science & Research",
    "focus": "reproducible research",
    "skills": [
      "literature reviews",
      "data collection",
      "documentation",
      "analysis"
    ]
  },
  {
    "id": "lab-technician",
    "title": "Laboratory Technician",
    "sector": "Science & Research",
    "focus": "safe accurate laboratory work",
    "skills": [
      "sample preparation",
      "equipment maintenance",
      "safety",
      "quality control"
    ]
  },
  {
    "id": "biotechnologist",
    "title": "Biotechnology Researcher",
    "sector": "Science & Research",
    "focus": "responsible biological research",
    "skills": [
      "experimental design",
      "lab techniques",
      "data analysis",
      "biosafety"
    ]
  },
  {
    "id": "research-coordinator",
    "title": "Research Coordinator",
    "sector": "Science & Research",
    "focus": "ethical efficient study operations",
    "skills": [
      "participant coordination",
      "protocols",
      "documentation",
      "data quality"
    ]
  },
  {
    "id": "agronomist",
    "title": "Agronomist",
    "sector": "Agriculture & Sustainability",
    "focus": "sustainable crop production",
    "skills": [
      "crop assessment",
      "soil management",
      "field trials",
      "farmer education"
    ]
  },
  {
    "id": "sustainability",
    "title": "Sustainability Officer",
    "sector": "Agriculture & Sustainability",
    "focus": "measurable sustainability progress",
    "skills": [
      "ESG reporting",
      "carbon accounting",
      "stakeholder engagement",
      "data analysis"
    ]
  },
  {
    "id": "agritech",
    "title": "AgriTech Specialist",
    "sector": "Agriculture & Sustainability",
    "focus": "practical technology for farming",
    "skills": [
      "IoT",
      "farm operations",
      "data collection",
      "training"
    ]
  },
  {
    "id": "conservation",
    "title": "Conservation Officer",
    "sector": "Agriculture & Sustainability",
    "focus": "biodiversity protection",
    "skills": [
      "field monitoring",
      "community engagement",
      "GIS",
      "report writing"
    ]
  },
  {
    "id": "supply-chain",
    "title": "Supply Chain Analyst",
    "sector": "Logistics & Manufacturing",
    "focus": "resilient supply chains",
    "skills": [
      "forecasting",
      "inventory analytics",
      "supplier coordination",
      "reporting"
    ]
  },
  {
    "id": "procurement",
    "title": "Procurement Executive",
    "sector": "Logistics & Manufacturing",
    "focus": "ethical effective purchasing",
    "skills": [
      "vendor evaluation",
      "contracts",
      "cost analysis",
      "negotiation"
    ]
  },
  {
    "id": "logistics",
    "title": "Logistics Coordinator",
    "sector": "Logistics & Manufacturing",
    "focus": "reliable deliveries",
    "skills": [
      "shipment tracking",
      "scheduling",
      "inventory",
      "communication"
    ]
  },
  {
    "id": "quality-engineer",
    "title": "Quality Engineer",
    "sector": "Logistics & Manufacturing",
    "focus": "consistent production quality",
    "skills": [
      "root cause analysis",
      "inspection",
      "process controls",
      "documentation"
    ]
  },
  {
    "id": "production-supervisor",
    "title": "Production Supervisor",
    "sector": "Logistics & Manufacturing",
    "focus": "efficient safe manufacturing",
    "skills": [
      "line planning",
      "safety",
      "quality assurance",
      "team leadership"
    ]
  },
  {
    "id": "interior-designer",
    "title": "Interior Designer",
    "sector": "Creative & Design",
    "focus": "functional human-centered spaces",
    "skills": [
      "space planning",
      "CAD",
      "materials",
      "client presentations"
    ]
  },
  {
    "id": "fashion-designer",
    "title": "Fashion Designer",
    "sector": "Creative & Design",
    "focus": "creative wearable products",
    "skills": [
      "concept development",
      "pattern making",
      "materials",
      "production"
    ]
  },
  {
    "id": "photographer",
    "title": "Photographer",
    "sector": "Creative & Design",
    "focus": "compelling professional images",
    "skills": [
      "lighting",
      "composition",
      "editing",
      "client briefs"
    ]
  },
  {
    "id": "animator",
    "title": "3D Animator",
    "sector": "Creative & Design",
    "focus": "engaging motion and visual stories",
    "skills": [
      "animation",
      "storyboarding",
      "3D tools",
      "timing"
    ]
  },
  {
    "id": "game-designer",
    "title": "Game Designer",
    "sector": "Creative & Design",
    "focus": "engaging interactive experiences",
    "skills": [
      "game mechanics",
      "prototyping",
      "player testing",
      "documentation"
    ]
  }
];

/** Industry additions share the same candidate/job catalog as the original careers. */
const ADDITIONAL_CAREERS:CareerRoleInfo[] = [
 {id:'risk-adviser',title:'Risk & Compliance Analyst',sector:'Banking & Insurance',focus:'responsible risk reviews',skills:['risk assessment','compliance reporting','Excel','stakeholder communication']},
 {id:'insurance-adviser',title:'Insurance Advisor',sector:'Banking & Insurance',focus:'practical protection solutions',skills:['customer service','product knowledge','risk assessment','communication']},
 {id:'legal-assistant',title:'Legal Assistant',sector:'Legal & Compliance',focus:'accurate legal administration',skills:['legal research','document management','case coordination','confidentiality']},
 {id:'compliance-officer',title:'Compliance Officer',sector:'Legal & Compliance',focus:'sound regulatory controls',skills:['policy administration','auditing','risk assessment','documentation']},
 {id:'energy-engineer',title:'Renewable Energy Engineer',sector:'Energy & Utilities',focus:'efficient renewable infrastructure',skills:['solar design','project planning','energy analysis','safety']},
 {id:'utilities-planner',title:'Utilities Planner',sector:'Energy & Utilities',focus:'reliable service delivery',skills:['resource planning','operations','data analysis','risk management']},
 {id:'property-agent',title:'Property Consultant',sector:'Real Estate & Property',focus:'client-centered property guidance',skills:['negotiation','market research','customer service','documentation']},
 {id:'property-manager',title:'Property Manager',sector:'Real Estate & Property',focus:'safe property operations',skills:['facilities management','budgeting','communication','maintenance']},
 {id:'network-planner',title:'Telecommunications Engineer',sector:'Telecommunications',focus:'resilient communication networks',skills:['network planning','troubleshooting','monitoring','documentation']},
 {id:'telecom-support',title:'Telecom Customer Advisor',sector:'Telecommunications',focus:'helpful technical support',skills:['customer support','CRM','problem solving','communication']},
 {id:'aviation-ops',title:'Aviation Operations Coordinator',sector:'Transportation & Aviation',focus:'safe travel operations',skills:['scheduling','safety','coordination','documentation']},
 {id:'transport-planner',title:'Transport Planner',sector:'Transportation & Aviation',focus:'reliable mobility solutions',skills:['route planning','data analysis','operations','stakeholder communication']},
 {id:'food-quality',title:'Food Quality Specialist',sector:'Food & Beverage',focus:'consistent product quality',skills:['quality assurance','food safety','auditing','documentation']},
 {id:'restaurant-lead',title:'Restaurant Operations Lead',sector:'Food & Beverage',focus:'excellent dining experiences',skills:['team leadership','customer service','inventory','budgeting']},
 {id:'fitness-coach',title:'Fitness Coach',sector:'Sports & Fitness',focus:'individual training progress',skills:['coaching','program design','communication','client assessment']},
 {id:'sports-manager',title:'Sports Program Coordinator',sector:'Sports & Fitness',focus:'accessible sports programs',skills:['event coordination','scheduling','budgeting','communication']},
 {id:'editor',title:'Content Editor',sector:'Media & Publishing',focus:'accurate compelling stories',skills:['editing','research','storytelling','fact checking']},
 {id:'producer',title:'Media Producer',sector:'Media & Publishing',focus:'engaging original productions',skills:['production planning','video editing','project management','storytelling']},
 {id:'public-policy-specialist',title:'Public Policy Analyst',sector:'Government & Public Policy',focus:'evidence-informed public policy',skills:['policy research','data analysis','report writing','stakeholder engagement']},
 {id:'community-officer',title:'Public Service Officer',sector:'Government & Public Policy',focus:'accessible public services',skills:['administration','communication','coordination','documentation']},
 {id:'community-program-officer',title:'Community Program Officer',sector:'Nonprofit & Community',focus:'inclusive community initiatives',skills:['program coordination','impact measurement','communication','budgeting']},
 {id:'grant-officer',title:'Grants & Partnerships Executive',sector:'Nonprofit & Community',focus:'effective social impact partnerships',skills:['grant writing','reporting','stakeholder engagement','planning']},
 {id:'pharma-lab-technician',title:'Pharmaceutical Laboratory Technician',sector:'Pharmaceuticals & Biotechnology',focus:'reliable laboratory processes',skills:['sample preparation','laboratory safety','quality control','documentation']},
 {id:'biotech-specialist',title:'Biotechnology Research Associate',sector:'Pharmaceuticals & Biotechnology',focus:'rigorous scientific investigation',skills:['research methods','data analysis','laboratory techniques','report writing']},
 {id:'film-director',title:'Film Director',sector:'Media & Publishing',focus:'directing narrative films and visual storytelling',skills:['storytelling','scriptwriting','production planning','creative direction']},
 {id:'scriptwriter',title:'Scriptwriter',sector:'Media & Publishing',focus:'writing compelling scripts and story structures',skills:['scriptwriting','storytelling','editing','character development']}
];
ROLE_CATALOG.push(...ADDITIONAL_CAREERS);

export const COMPANIES: Company[] = [
  {
    "id": "org-01",
    "name": "Evergrove Labs",
    "sector": "Technology",
    "location": "Kuala Lumpur, Malaysia",
    "tagline": "Building technology that makes everyday work simpler",
    "about": "Building technology that makes everyday work simpler. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#007F76",
    "teamSize": "11–50",
    "founded": 2010,
    "image": 1,
    "initials": "EL"
  },
  {
    "id": "org-02",
    "name": "BlueHarbor Digital",
    "sector": "Technology",
    "location": "Penang, Malaysia",
    "tagline": "Human-centered digital products for ambitious teams",
    "about": "Human-centered digital products for ambitious teams. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#1A74A0",
    "teamSize": "51–200",
    "founded": 2011,
    "image": 2,
    "initials": "BD"
  },
  {
    "id": "org-03",
    "name": "Juniper Systems",
    "sector": "Technology",
    "location": "Remote · Malaysia",
    "tagline": "Reliable technology and accessible digital experiences",
    "about": "Reliable technology and accessible digital experiences. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#7664AB",
    "teamSize": "201–500",
    "founded": 2012,
    "image": 3,
    "initials": "JS"
  },
  {
    "id": "org-04",
    "name": "VantaWorks",
    "sector": "Technology",
    "location": "Cyberjaya, Malaysia",
    "tagline": "Modern software and data solutions",
    "about": "Modern software and data solutions. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#374EAD",
    "teamSize": "501–1,000",
    "founded": 2013,
    "image": 4,
    "initials": "V"
  },
  {
    "id": "org-05",
    "name": "Atlas Peak Solutions",
    "sector": "Technology",
    "location": "Johor Bahru, Malaysia",
    "tagline": "Tools that help organizations move forward",
    "about": "Tools that help organizations move forward. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#3176B0",
    "teamSize": "11–50",
    "founded": 2014,
    "image": 5,
    "initials": "AP"
  },
  {
    "id": "org-06",
    "name": "Meridian Partners",
    "sector": "Business & Management",
    "location": "Kuala Lumpur, Malaysia",
    "tagline": "Better operating systems for growing businesses",
    "about": "Better operating systems for growing businesses. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#556FAE",
    "teamSize": "51–200",
    "founded": 2015,
    "image": 6,
    "initials": "MP"
  },
  {
    "id": "org-07",
    "name": "Summit People Co.",
    "sector": "Business & Management",
    "location": "Ipoh, Malaysia",
    "tagline": "Helping teams and organizations thrive",
    "about": "Helping teams and organizations thrive. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#9368A9",
    "teamSize": "201–500",
    "founded": 2016,
    "image": 7,
    "initials": "SP"
  },
  {
    "id": "org-08",
    "name": "Cedarpoint Consulting",
    "sector": "Business & Management",
    "location": "Remote · Malaysia",
    "tagline": "Practical transformation through collaboration",
    "about": "Practical transformation through collaboration. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#298879",
    "teamSize": "501–1,000",
    "founded": 2017,
    "image": 8,
    "initials": "CC"
  },
  {
    "id": "org-09",
    "name": "WellSpring Care",
    "sector": "Healthcare & Wellness",
    "location": "Kuala Lumpur, Malaysia",
    "tagline": "Thoughtful care across every life stage",
    "about": "Thoughtful care across every life stage. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#2F9F91",
    "teamSize": "11–50",
    "founded": 2018,
    "image": 9,
    "initials": "WC"
  },
  {
    "id": "org-10",
    "name": "Kindred Health Network",
    "sector": "Healthcare & Wellness",
    "location": "Alor Setar, Malaysia",
    "tagline": "Community-centered health and wellbeing",
    "about": "Community-centered health and wellbeing. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#5BA07B",
    "teamSize": "51–200",
    "founded": 2019,
    "image": 10,
    "initials": "KH"
  },
  {
    "id": "org-11",
    "name": "Luma Wellness",
    "sector": "Healthcare & Wellness",
    "location": "Penang, Malaysia",
    "tagline": "Better everyday wellness through quality care",
    "about": "Better everyday wellness through quality care. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#DB7990",
    "teamSize": "201–500",
    "founded": 2020,
    "image": 11,
    "initials": "LW"
  },
  {
    "id": "org-12",
    "name": "Aurora Learning",
    "sector": "Education & Training",
    "location": "Kedah, Malaysia",
    "tagline": "Education that opens new paths",
    "about": "Education that opens new paths. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#B68F43",
    "teamSize": "501–1,000",
    "founded": 2021,
    "image": 12,
    "initials": "AL"
  },
  {
    "id": "org-13",
    "name": "BrightPath Academy",
    "sector": "Education & Training",
    "location": "Kuala Lumpur, Malaysia",
    "tagline": "Curiosity, learning, and meaningful growth",
    "about": "Curiosity, learning, and meaningful growth. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#A077CA",
    "teamSize": "11–50",
    "founded": 2022,
    "image": 1,
    "initials": "BA"
  },
  {
    "id": "org-14",
    "name": "Northstar Education",
    "sector": "Education & Training",
    "location": "Remote · Malaysia",
    "tagline": "Empowering lifelong learners",
    "about": "Empowering lifelong learners. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#557CC9",
    "teamSize": "51–200",
    "founded": 2023,
    "image": 2,
    "initials": "NE"
  },
  {
    "id": "org-15",
    "name": "Oakline Finance",
    "sector": "Finance & Accounting",
    "location": "Kuala Lumpur, Malaysia",
    "tagline": "Clear financial insights and dependable advice",
    "about": "Clear financial insights and dependable advice. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#4371A9",
    "teamSize": "201–500",
    "founded": 2024,
    "image": 3,
    "initials": "OF"
  },
  {
    "id": "org-16",
    "name": "ClearLedger Group",
    "sector": "Finance & Accounting",
    "location": "Penang, Malaysia",
    "tagline": "Making responsible financial decisions simpler",
    "about": "Making responsible financial decisions simpler. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#2B9B98",
    "teamSize": "501–1,000",
    "founded": 2010,
    "image": 4,
    "initials": "CG"
  },
  {
    "id": "org-17",
    "name": "Pearlpoint Assurance",
    "sector": "Finance & Accounting",
    "location": "Johor Bahru, Malaysia",
    "tagline": "Confidence through careful financial planning",
    "about": "Confidence through careful financial planning. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#6B80B6",
    "teamSize": "11–50",
    "founded": 2011,
    "image": 5,
    "initials": "PA"
  },
  {
    "id": "org-18",
    "name": "Bloomfield Creative",
    "sector": "Marketing & Media",
    "location": "Kuala Lumpur, Malaysia",
    "tagline": "Stories that create meaningful brand connection",
    "about": "Stories that create meaningful brand connection. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#D77798",
    "teamSize": "51–200",
    "founded": 2012,
    "image": 6,
    "initials": "BC"
  },
  {
    "id": "org-19",
    "name": "Northlight Studio",
    "sector": "Marketing & Media",
    "location": "Remote · Malaysia",
    "tagline": "Modern content, distinctive ideas",
    "about": "Modern content, distinctive ideas. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#B97B54",
    "teamSize": "201–500",
    "founded": 2013,
    "image": 7,
    "initials": "NS"
  },
  {
    "id": "org-20",
    "name": "Kindred Media House",
    "sector": "Marketing & Media",
    "location": "Penang, Malaysia",
    "tagline": "Creative work that people remember",
    "about": "Creative work that people remember. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#9A69C0",
    "teamSize": "501–1,000",
    "founded": 2014,
    "image": 8,
    "initials": "KM"
  },
  {
    "id": "org-21",
    "name": "TerraSpan Engineering",
    "sector": "Engineering & Construction",
    "location": "Selangor, Malaysia",
    "tagline": "Thoughtful infrastructure for resilient communities",
    "about": "Thoughtful infrastructure for resilient communities. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#4D86A1",
    "teamSize": "11–50",
    "founded": 2015,
    "image": 9,
    "initials": "TE"
  },
  {
    "id": "org-22",
    "name": "ForgeLine Projects",
    "sector": "Engineering & Construction",
    "location": "Johor Bahru, Malaysia",
    "tagline": "Engineering precision and dependable delivery",
    "about": "Engineering precision and dependable delivery. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#96764C",
    "teamSize": "51–200",
    "founded": 2016,
    "image": 10,
    "initials": "FP"
  },
  {
    "id": "org-23",
    "name": "CivicForm Design",
    "sector": "Engineering & Construction",
    "location": "Penang, Malaysia",
    "tagline": "Spaces designed for how people live",
    "about": "Spaces designed for how people live. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#5B9591",
    "teamSize": "201–500",
    "founded": 2017,
    "image": 11,
    "initials": "CD"
  },
  {
    "id": "org-24",
    "name": "Saffron & Stone",
    "sector": "Hospitality & Tourism",
    "location": "Langkawi, Malaysia",
    "tagline": "Warm hospitality and memorable experiences",
    "about": "Warm hospitality and memorable experiences. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#B38A4E",
    "teamSize": "501–1,000",
    "founded": 2018,
    "image": 12,
    "initials": "SS"
  },
  {
    "id": "org-25",
    "name": "Harborstay Hotels",
    "sector": "Hospitality & Tourism",
    "location": "Penang, Malaysia",
    "tagline": "Beautiful stays, thoughtful service",
    "about": "Beautiful stays, thoughtful service. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#547AAB",
    "teamSize": "11–50",
    "founded": 2019,
    "image": 1,
    "initials": "HH"
  },
  {
    "id": "org-26",
    "name": "Palmcrest Experiences",
    "sector": "Hospitality & Tourism",
    "location": "Kuala Lumpur, Malaysia",
    "tagline": "Bringing people together through experiences",
    "about": "Bringing people together through experiences. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#C7786B",
    "teamSize": "51–200",
    "founded": 2020,
    "image": 2,
    "initials": "PE"
  },
  {
    "id": "org-27",
    "name": "CivicBridge Advisory",
    "sector": "Legal & Public Services",
    "location": "Putrajaya, Malaysia",
    "tagline": "Research-led services for better communities",
    "about": "Research-led services for better communities. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#7689AB",
    "teamSize": "201–500",
    "founded": 2021,
    "image": 3,
    "initials": "CA"
  },
  {
    "id": "org-28",
    "name": "Greenfield Community Trust",
    "sector": "Legal & Public Services",
    "location": "Kedah, Malaysia",
    "tagline": "Stronger communities through practical programs",
    "about": "Stronger communities through practical programs. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#4B9A88",
    "teamSize": "501–1,000",
    "founded": 2022,
    "image": 4,
    "initials": "GC"
  },
  {
    "id": "org-29",
    "name": "Sunrise Commerce",
    "sector": "Retail & Customer Service",
    "location": "Kuala Lumpur, Malaysia",
    "tagline": "Making shopping experiences feel effortless",
    "about": "Making shopping experiences feel effortless. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#BD8062",
    "teamSize": "11–50",
    "founded": 2023,
    "image": 5,
    "initials": "SC"
  },
  {
    "id": "org-30",
    "name": "Orchard Retail Co.",
    "sector": "Retail & Customer Service",
    "location": "Penang, Malaysia",
    "tagline": "Helping customers discover what matters",
    "about": "Helping customers discover what matters. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#9C8D5C",
    "teamSize": "51–200",
    "founded": 2024,
    "image": 6,
    "initials": "OR"
  },
  {
    "id": "org-31",
    "name": "Helix Discovery",
    "sector": "Science & Research",
    "location": "Kuala Lumpur, Malaysia",
    "tagline": "Curiosity-driven scientific discovery",
    "about": "Curiosity-driven scientific discovery. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#5D84B8",
    "teamSize": "201–500",
    "founded": 2010,
    "image": 7,
    "initials": "HD"
  },
  {
    "id": "org-32",
    "name": "BioGarden Research",
    "sector": "Science & Research",
    "location": "Selangor, Malaysia",
    "tagline": "Science for people and planet",
    "about": "Science for people and planet. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#639E7E",
    "teamSize": "501–1,000",
    "founded": 2011,
    "image": 8,
    "initials": "BR"
  },
  {
    "id": "org-33",
    "name": "SawahWorks",
    "sector": "Agriculture & Sustainability",
    "location": "Kedah, Malaysia",
    "tagline": "Practical innovations for growing communities",
    "about": "Practical innovations for growing communities. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#7A984C",
    "teamSize": "11–50",
    "founded": 2012,
    "image": 9,
    "initials": "S"
  },
  {
    "id": "org-34",
    "name": "Verdant Impact",
    "sector": "Agriculture & Sustainability",
    "location": "Remote · Malaysia",
    "tagline": "Sustainability measured through action",
    "about": "Sustainability measured through action. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#479879",
    "teamSize": "51–200",
    "founded": 2013,
    "image": 10,
    "initials": "VI"
  },
  {
    "id": "org-35",
    "name": "Wayfinder Supply",
    "sector": "Logistics & Manufacturing",
    "location": "Shah Alam, Malaysia",
    "tagline": "Reliable supply networks and smarter operations",
    "about": "Reliable supply networks and smarter operations. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#8C83BC",
    "teamSize": "201–500",
    "founded": 2014,
    "image": 11,
    "initials": "WS"
  },
  {
    "id": "org-36",
    "name": "Keystone Manufacturing",
    "sector": "Logistics & Manufacturing",
    "location": "Johor Bahru, Malaysia",
    "tagline": "Making quality and precision part of every day",
    "about": "Making quality and precision part of every day. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#67859E",
    "teamSize": "501–1,000",
    "founded": 2015,
    "image": 12,
    "initials": "KM"
  },
  {
    "id": "org-37",
    "name": "Mosaic & Co.",
    "sector": "Creative & Design",
    "location": "Kuala Lumpur, Malaysia",
    "tagline": "Making beautiful things with purpose",
    "about": "Making beautiful things with purpose. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#A46EAE",
    "teamSize": "11–50",
    "founded": 2016,
    "image": 1,
    "initials": "MC"
  },
  {
    "id": "org-38",
    "name": "Studio Ember",
    "sector": "Creative & Design",
    "location": "Penang, Malaysia",
    "tagline": "Imagining new creative possibilities",
    "about": "Imagining new creative possibilities. We work with people across disciplines to deliver thoughtful, responsible results and career-long learning.",
    "color": "#CC7A64",
    "teamSize": "51–200",
    "founded": 2017,
    "image": 2,
    "initials": "SE"
  }
];

/** Fictional profiles make each sector browsable, without suggesting real employer endorsement. */
const companyNames=['Northstar','Crescent','Pavilion','Silverline','Harborview','Keystone','Evergreen','Brightstone','Meridian','Newbridge','Clearpath','Redwood'];
const industryName:Record<string,string>={
 'Technology':'Digital','Business & Management':'Advisory','Healthcare & Wellness':'Health','Education & Training':'Learning','Finance & Accounting':'Capital','Marketing & Media':'Creative','Engineering & Construction':'Engineering','Hospitality & Tourism':'Hospitality','Legal & Public Services':'Civic','Retail & Customer Service':'Commerce','Science & Research':'Research','Agriculture & Sustainability':'Agri','Logistics & Manufacturing':'Supply','Creative & Design':'Design','Banking & Insurance':'Assurance','Legal & Compliance':'Compliance','Energy & Utilities':'Energy','Real Estate & Property':'Properties','Telecommunications':'Networks','Transportation & Aviation':'Mobility','Food & Beverage':'Foods','Sports & Fitness':'Wellness','Media & Publishing':'Media','Government & Public Policy':'Policy','Nonprofit & Community':'Foundation','Pharmaceuticals & Biotechnology':'Biotech'};
const remainingCompanies=Math.max(0,200-COMPANIES.length);
const generatedCompanies:Company[]=Array.from({length:remainingCompanies},(_,i)=>{
 const sector=CAREER_SECTORS[i%CAREER_SECTORS.length];
 const root=companyNames[Math.floor(i/CAREER_SECTORS.length)%companyNames.length];
 const name=`${root} ${industryName[sector]||'Group'}`;
 const colors=['#0B8077','#3B7197','#8067A4','#AA7351','#3F846B','#A85E7B'];
 const locations=['Kuala Lumpur','Penang','Johor Bahru','Ipoh','Alor Setar','Kuching','Shah Alam','Kota Kinabalu'];
 return {id:`org-extra-${String(i+1).padStart(3,'0')}`,name,sector,location:`${locations[i%locations.length]}, Malaysia`,tagline:`Thoughtful solutions in ${sector.toLowerCase()}`,about:`${name} focuses on ${sector.toLowerCase()}, cross-functional collaboration, and long-term professional learning.`,color:colors[i%colors.length],teamSize:['11–50','51–200','201–500','501–1,000'][i%4],founded:2004+i%21,image:i%7+1,initials:root.slice(0,1)+industryName[sector].slice(0,1)};
});
COMPANIES.push(...generatedCompanies);

const jobModes=['On-site','Hybrid','Remote'];
const types=['Full-time','Full-time','Contract','Internship'];
const levels=['Entry level','Associate','Mid level','Graduate'];
const wages=['RM 2,800–4,500','RM 3,500–5,500','RM 4,500–7,000','RM 5,500–9,000','Competitive'];
const INITIAL_OPPORTUNITIES:Opportunity[]=ROLE_CATALOG.flatMap((role,index)=>{
 const possible=COMPANIES.filter(company=>company.sector===role.sector);
 return Array.from({length:7},(_,offset)=>{
 const company=possible[(index+offset)%possible.length];
 return {id:`job-${role.id}-${offset+1}`,companyId:company.id,title:role.title,sector:role.sector,location:company.location,type:types[(index+offset)%types.length],level:levels[(index+offset)%levels.length],salary:wages[(index+offset)%wages.length],description:`Join ${company.name} as a ${role.title}. Contribute to ${role.focus}, collaborate across teams, solve meaningful problems and continue developing your professional skills.`,skills:role.skills,postedDaysAgo:(index*3+offset*5)%28+1,mode:jobModes[(index+offset)%jobModes.length]};
 });
});
export const OPPORTUNITIES:Opportunity[]=[...INITIAL_OPPORTUNITIES,...Array.from({length:Math.max(0,800-INITIAL_OPPORTUNITIES.length)},(_,i)=>{
 const role=ROLE_CATALOG[i%ROLE_CATALOG.length];
 const possible=COMPANIES.filter(c=>c.sector===role.sector);
 const company=possible[(i+9)%possible.length];
 return {id:`job-additional-${i+1}`,companyId:company.id,title:role.title,sector:role.sector,location:company.location,type:types[i%types.length],level:levels[i%levels.length],salary:wages[i%wages.length],description:`Work with ${company.name} on ${role.focus}. Bring your experience in ${role.skills.slice(0,3).join(', ')}.`,skills:role.skills,postedDaysAgo:i%29+1,mode:jobModes[i%jobModes.length]};
})];
export const companyById=(id:string)=>COMPANIES.find(c=>c.id===id);
export const roleById=(id:string)=>ROLE_CATALOG.find(r=>r.id===id);
