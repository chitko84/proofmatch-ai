import {COMPANIES,OPPORTUNITIES} from './career-catalog.ts';
/** Seeded fictional social and conversation records for hands-on product exploration.
 * These are not real members, messages, employer updates, or externally delivered conversations. */
export type NetworkPerson={id:string;name:string;role:string;company:string;sector:string;initials:string;color:string;avatar:string};
export type NetworkComment={id:string;authorId:string;text:string;createdAt:string};
export type NetworkPost={id:string;authorId:string;category:string;body:string;createdAt:string;image:string;likes:number;comments:NetworkComment[]};
export type NetworkMessage={id:string;fromSide:'me'|'contact';text:string;createdAt:string;attachment:null|{name:string;data:string;type:string}};
export type NetworkThread={id:string;contactId:string;subject:string;updatedAt:string;messages:NetworkMessage[];unread:boolean;pinned:boolean};
export type ApplicationRecord={id:string;opportunityId:string;fullName:string;email:string;phone:string;coverLetter:string;resumeName:string;createdAt:string;stage:'Saved'|'In review'|'Withdrawn';reviewNote?:string};
export type WorkspaceState={applications:ApplicationRecord[];savedJobs:string[];following:string[];posts:NetworkPost[];likedPosts:string[];bookmarkedPosts:string[];threads:NetworkThread[];identity:'candidate'|'recruiter'};
export const NETWORK_PEOPLE:NetworkPerson[]=[
  {
    "id": "person-01",
    "name": "Aisha Rahman",
    "role": "People & Culture Partner",
    "company": "Summit People Co.",
    "sector": "Technology",
    "initials": "AR",
    "color": "#0C857A",
    "avatar": "/network/avatars/avatar-01.svg"
  },
  {
    "id": "person-02",
    "name": "Daniel Lim",
    "role": "Software Engineer",
    "company": "BlueHarbor Digital",
    "sector": "Business & Management",
    "initials": "DL",
    "color": "#457EA9",
    "avatar": "/network/avatars/avatar-02.svg"
  },
  {
    "id": "person-03",
    "name": "Priya Nair",
    "role": "Medical Officer",
    "company": "WellSpring Care",
    "sector": "Healthcare & Wellness",
    "initials": "PN",
    "color": "#9672B5",
    "avatar": "/network/avatars/avatar-03.svg"
  },
  {
    "id": "person-04",
    "name": "Amir Hakim",
    "role": "Learning Designer",
    "company": "BrightPath Academy",
    "sector": "Education & Training",
    "initials": "AH",
    "color": "#B57C57",
    "avatar": "/network/avatars/avatar-04.svg"
  },
  {
    "id": "person-05",
    "name": "Nur Sofia",
    "role": "Financial Analyst",
    "company": "Oakline Finance",
    "sector": "Finance & Accounting",
    "initials": "NS",
    "color": "#418E97",
    "avatar": "/network/avatars/avatar-05.svg"
  },
  {
    "id": "person-06",
    "name": "Chen Wei",
    "role": "Brand Strategist",
    "company": "Bloomfield Creative",
    "sector": "Marketing & Media",
    "initials": "CW",
    "color": "#987A9F",
    "avatar": "/network/avatars/avatar-06.svg"
  },
  {
    "id": "person-07",
    "name": "Maria Santos",
    "role": "Civil Engineer",
    "company": "TerraSpan Engineering",
    "sector": "Engineering & Construction",
    "initials": "MS",
    "color": "#0C857A",
    "avatar": "/network/avatars/avatar-07.svg"
  },
  {
    "id": "person-08",
    "name": "Farah Idris",
    "role": "Hospitality Manager",
    "company": "Harborstay Hotels",
    "sector": "Hospitality & Tourism",
    "initials": "FI",
    "color": "#457EA9",
    "avatar": "/network/avatars/avatar-08.svg"
  },
  {
    "id": "person-09",
    "name": "Kevin Tan",
    "role": "Policy Researcher",
    "company": "CivicBridge Advisory",
    "sector": "Legal & Public Services",
    "initials": "KT",
    "color": "#9672B5",
    "avatar": "/network/avatars/avatar-09.svg"
  },
  {
    "id": "person-10",
    "name": "Hana Lee",
    "role": "Customer Success Lead",
    "company": "Sunrise Commerce",
    "sector": "Retail & Customer Service",
    "initials": "HL",
    "color": "#B57C57",
    "avatar": "/network/avatars/avatar-10.svg"
  },
  {
    "id": "person-11",
    "name": "Arjun Patel",
    "role": "Research Associate",
    "company": "Helix Discovery",
    "sector": "Science & Research",
    "initials": "AP",
    "color": "#418E97",
    "avatar": "/network/avatars/avatar-11.svg"
  },
  {
    "id": "person-12",
    "name": "Sara Malik",
    "role": "Agritech Specialist",
    "company": "SawahWorks",
    "sector": "Agriculture & Sustainability",
    "initials": "SM",
    "color": "#987A9F",
    "avatar": "/network/avatars/avatar-12.svg"
  },
  {
    "id": "person-13",
    "name": "Iskandar Azmi",
    "role": "Operations Manager",
    "company": "Wayfinder Supply",
    "sector": "Logistics & Manufacturing",
    "initials": "IA",
    "color": "#0C857A",
    "avatar": "/network/avatars/avatar-01.svg"
  },
  {
    "id": "person-14",
    "name": "Leila Hassan",
    "role": "Creative Director",
    "company": "Mosaic & Co.",
    "sector": "Creative & Design",
    "initials": "LH",
    "color": "#457EA9",
    "avatar": "/network/avatars/avatar-02.svg"
  },
  {
    "id": "person-15",
    "name": "Zoe Wong",
    "role": "People & Culture Partner",
    "company": "Summit People Co.",
    "sector": "Technology",
    "initials": "ZW",
    "color": "#9672B5",
    "avatar": "/network/avatars/avatar-03.svg"
  },
  {
    "id": "person-16",
    "name": "Ravi Kumar",
    "role": "Software Engineer",
    "company": "BlueHarbor Digital",
    "sector": "Business & Management",
    "initials": "RK",
    "color": "#B57C57",
    "avatar": "/network/avatars/avatar-04.svg"
  },
  {
    "id": "person-17",
    "name": "Maya Abdullah",
    "role": "Medical Officer",
    "company": "WellSpring Care",
    "sector": "Healthcare & Wellness",
    "initials": "MA",
    "color": "#418E97",
    "avatar": "/network/avatars/avatar-05.svg"
  },
  {
    "id": "person-18",
    "name": "Oliver Chen",
    "role": "Learning Designer",
    "company": "BrightPath Academy",
    "sector": "Education & Training",
    "initials": "OC",
    "color": "#987A9F",
    "avatar": "/network/avatars/avatar-06.svg"
  },
  {
    "id": "person-19",
    "name": "Aina Yusuf",
    "role": "Financial Analyst",
    "company": "Oakline Finance",
    "sector": "Finance & Accounting",
    "initials": "AY",
    "color": "#0C857A",
    "avatar": "/network/avatars/avatar-07.svg"
  },
  {
    "id": "person-20",
    "name": "Nadia Karim",
    "role": "Brand Strategist",
    "company": "Bloomfield Creative",
    "sector": "Marketing & Media",
    "initials": "NK",
    "color": "#457EA9",
    "avatar": "/network/avatars/avatar-08.svg"
  },
  {
    "id": "person-21",
    "name": "Ethan Low",
    "role": "Civil Engineer",
    "company": "TerraSpan Engineering",
    "sector": "Engineering & Construction",
    "initials": "EL",
    "color": "#9672B5",
    "avatar": "/network/avatars/avatar-09.svg"
  },
  {
    "id": "person-22",
    "name": "Siti Amina",
    "role": "Hospitality Manager",
    "company": "Harborstay Hotels",
    "sector": "Hospitality & Tourism",
    "initials": "SA",
    "color": "#B57C57",
    "avatar": "/network/avatars/avatar-10.svg"
  },
  {
    "id": "person-23",
    "name": "Adam Lee",
    "role": "Policy Researcher",
    "company": "CivicBridge Advisory",
    "sector": "Legal & Public Services",
    "initials": "AL",
    "color": "#418E97",
    "avatar": "/network/avatars/avatar-11.svg"
  },
  {
    "id": "person-24",
    "name": "Samantha Ong",
    "role": "Customer Success Lead",
    "company": "Sunrise Commerce",
    "sector": "Retail & Customer Service",
    "initials": "SO",
    "color": "#987A9F",
    "avatar": "/network/avatars/avatar-12.svg"
  },
  {
    "id": "person-25",
    "name": "Nabilah Noor",
    "role": "Research Associate",
    "company": "Helix Discovery",
    "sector": "Science & Research",
    "initials": "NN",
    "color": "#0C857A",
    "avatar": "/network/avatars/avatar-01.svg"
  },
  {
    "id": "person-26",
    "name": "Irfan Shah",
    "role": "Agritech Specialist",
    "company": "SawahWorks",
    "sector": "Agriculture & Sustainability",
    "initials": "IS",
    "color": "#457EA9",
    "avatar": "/network/avatars/avatar-02.svg"
  },
  {
    "id": "person-27",
    "name": "Grace Tan",
    "role": "Operations Manager",
    "company": "Wayfinder Supply",
    "sector": "Logistics & Manufacturing",
    "initials": "GT",
    "color": "#9672B5",
    "avatar": "/network/avatars/avatar-03.svg"
  },
  {
    "id": "person-28",
    "name": "Yusuf Omar",
    "role": "Creative Director",
    "company": "Mosaic & Co.",
    "sector": "Creative & Design",
    "initials": "YO",
    "color": "#B57C57",
    "avatar": "/network/avatars/avatar-04.svg"
  },
  {
    "id": "person-29",
    "name": "Michelle Lee",
    "role": "People & Culture Partner",
    "company": "Summit People Co.",
    "sector": "Technology",
    "initials": "ML",
    "color": "#418E97",
    "avatar": "/network/avatars/avatar-05.svg"
  },
  {
    "id": "person-30",
    "name": "Ben Tan",
    "role": "Software Engineer",
    "company": "BlueHarbor Digital",
    "sector": "Business & Management",
    "initials": "BT",
    "color": "#987A9F",
    "avatar": "/network/avatars/avatar-06.svg"
  },
  {
    "id": "person-31",
    "name": "Fatima Ali",
    "role": "Medical Officer",
    "company": "WellSpring Care",
    "sector": "Healthcare & Wellness",
    "initials": "FA",
    "color": "#0C857A",
    "avatar": "/network/avatars/avatar-07.svg"
  },
  {
    "id": "person-32",
    "name": "Joseph Wong",
    "role": "Learning Designer",
    "company": "BrightPath Academy",
    "sector": "Education & Training",
    "initials": "JW",
    "color": "#457EA9",
    "avatar": "/network/avatars/avatar-08.svg"
  },
  {
    "id": "person-33",
    "name": "Emily Chan",
    "role": "Financial Analyst",
    "company": "Oakline Finance",
    "sector": "Finance & Accounting",
    "initials": "EC",
    "color": "#9672B5",
    "avatar": "/network/avatars/avatar-09.svg"
  },
  {
    "id": "person-34",
    "name": "Harith Azman",
    "role": "Brand Strategist",
    "company": "Bloomfield Creative",
    "sector": "Marketing & Media",
    "initials": "HA",
    "color": "#B57C57",
    "avatar": "/network/avatars/avatar-10.svg"
  },
  {
    "id": "person-35",
    "name": "Jasmin Yeo",
    "role": "Civil Engineer",
    "company": "TerraSpan Engineering",
    "sector": "Engineering & Construction",
    "initials": "JY",
    "color": "#418E97",
    "avatar": "/network/avatars/avatar-11.svg"
  },
  {
    "id": "person-36",
    "name": "Hafiz Rahim",
    "role": "Hospitality Manager",
    "company": "Harborstay Hotels",
    "sector": "Hospitality & Tourism",
    "initials": "HR",
    "color": "#987A9F",
    "avatar": "/network/avatars/avatar-12.svg"
  },
  {
    "id": "person-37",
    "name": "Noor Aisyah",
    "role": "Policy Researcher",
    "company": "CivicBridge Advisory",
    "sector": "Legal & Public Services",
    "initials": "NA",
    "color": "#0C857A",
    "avatar": "/network/avatars/avatar-01.svg"
  },
  {
    "id": "person-38",
    "name": "Raymond Ho",
    "role": "Customer Success Lead",
    "company": "Sunrise Commerce",
    "sector": "Retail & Customer Service",
    "initials": "RH",
    "color": "#457EA9",
    "avatar": "/network/avatars/avatar-02.svg"
  },
  {
    "id": "person-39",
    "name": "Jessica Lee",
    "role": "Research Associate",
    "company": "Helix Discovery",
    "sector": "Science & Research",
    "initials": "JL",
    "color": "#9672B5",
    "avatar": "/network/avatars/avatar-03.svg"
  },
  {
    "id": "person-40",
    "name": "Megan Ong",
    "role": "Agritech Specialist",
    "company": "SawahWorks",
    "sector": "Agriculture & Sustainability",
    "initials": "MO",
    "color": "#B57C57",
    "avatar": "/network/avatars/avatar-04.svg"
  }
];
const ORIGINAL_SEED_POSTS:NetworkPost[]=[
  {
    "id": "post-001",
    "authorId": "person-09",
    "category": "Team culture",
    "body": "There is something special about a team that makes space for questions. This week we hosted an open conversation about learning at work, feedback and supporting early-career colleagues.",
    "createdAt": "2026-10-01T07:24:00.000Z",
    "image": "",
    "likes": 26,
    "comments": [
      {
        "id": "comment-0-a",
        "authorId": "person-06",
        "text": "Great perspective, thanks for sharing!",
        "createdAt": "2026-10-01T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-002",
    "authorId": "person-12",
    "category": "Workplace perspectives",
    "body": "Good projects need more than a great idea. They need clear roles, patient communication and people willing to keep learning when plans change.",
    "createdAt": "2026-10-02T08:24:00.000Z",
    "image": "/network/covers/cover-02.svg",
    "likes": 45,
    "comments": [
      {
        "id": "comment-1-a",
        "authorId": "person-07",
        "text": "Appreciate the practical insight here.",
        "createdAt": "2026-10-02T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-003",
    "authorId": "person-15",
    "category": "Project milestone",
    "body": "A proud moment for our team: after weeks of thoughtful collaboration, our latest project reached an important milestone. Excited for the next chapter.",
    "createdAt": "2026-10-03T09:24:00.000Z",
    "image": "/network/covers/cover-03.svg",
    "likes": 64,
    "comments": [
      {
        "id": "comment-2-a",
        "authorId": "person-08",
        "text": "This is exactly the kind of conversation we need.",
        "createdAt": "2026-10-03T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-004",
    "authorId": "person-18",
    "category": "Behind the scenes",
    "body": "A little behind-the-scenes look at how our team plans its next project. The best ideas came from listening closely to the people who use our work every day.",
    "createdAt": "2026-10-04T10:24:00.000Z",
    "image": "/network/covers/cover-04.svg",
    "likes": 83,
    "comments": [
      {
        "id": "comment-3-a",
        "authorId": "person-09",
        "text": "Love seeing teams build things together.",
        "createdAt": "2026-10-04T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-005",
    "authorId": "person-21",
    "category": "New opportunities",
    "body": "We have been exploring new ways to welcome talent from different backgrounds. Transferable skills deserve attention alongside traditional experience.",
    "createdAt": "2026-10-05T11:24:00.000Z",
    "image": "",
    "likes": 102,
    "comments": [
      {
        "id": "comment-4-a",
        "authorId": "person-10",
        "text": "Great perspective, thanks for sharing!",
        "createdAt": "2026-10-05T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-006",
    "authorId": "person-24",
    "category": "Hiring insights",
    "body": "A CV can open a conversation, but a thoughtful portfolio or real work example helps us understand what someone can do. What makes a candidate stand out to you?",
    "createdAt": "2026-10-06T12:24:00.000Z",
    "image": "/network/covers/cover-06.svg",
    "likes": 121,
    "comments": [
      {
        "id": "comment-5-a",
        "authorId": "person-11",
        "text": "Appreciate the practical insight here.",
        "createdAt": "2026-10-06T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-007",
    "authorId": "person-27",
    "category": "Career tips",
    "body": "What is one skill that helped you grow in your career? For me, it has been the ability to explain complex ideas clearly and ask better questions.",
    "createdAt": "2026-10-07T13:24:00.000Z",
    "image": "/network/covers/cover-07.svg",
    "likes": 140,
    "comments": [
      {
        "id": "comment-6-a",
        "authorId": "person-12",
        "text": "This is exactly the kind of conversation we need.",
        "createdAt": "2026-10-07T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-008",
    "authorId": "person-30",
    "category": "Team recognition",
    "body": "Recognizing colleagues who quietly make work better: the ones who document, support, follow up and find thoughtful solutions when things get difficult.",
    "createdAt": "2026-10-08T14:24:00.000Z",
    "image": "/network/covers/cover-08.svg",
    "likes": 159,
    "comments": [
      {
        "id": "comment-7-a",
        "authorId": "person-13",
        "text": "Love seeing teams build things together.",
        "createdAt": "2026-10-08T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-009",
    "authorId": "person-33",
    "category": "Community impact",
    "body": "It was wonderful to see colleagues and volunteers sharing their time with the community this week. Small actions can create meaningful change.",
    "createdAt": "2026-10-09T15:24:00.000Z",
    "image": "",
    "likes": 178,
    "comments": [
      {
        "id": "comment-8-a",
        "authorId": "person-14",
        "text": "Great perspective, thanks for sharing!",
        "createdAt": "2026-10-09T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-010",
    "authorId": "person-36",
    "category": "Learning together",
    "body": "Our latest learning session was a reminder that growth is not always linear. Practice, honest feedback and a supportive community make a real difference.",
    "createdAt": "2026-10-10T16:24:00.000Z",
    "image": "/network/covers/cover-10.svg",
    "likes": 197,
    "comments": [
      {
        "id": "comment-9-a",
        "authorId": "person-15",
        "text": "Appreciate the practical insight here.",
        "createdAt": "2026-10-10T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-011",
    "authorId": "person-39",
    "category": "Behind the scenes",
    "body": "A little behind-the-scenes look at how our team plans its next project. The best ideas came from listening closely to the people who use our work every day.",
    "createdAt": "2026-10-11T17:24:00.000Z",
    "image": "/network/covers/cover-11.svg",
    "likes": 216,
    "comments": [
      {
        "id": "comment-10-a",
        "authorId": "person-16",
        "text": "This is exactly the kind of conversation we need.",
        "createdAt": "2026-10-11T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-012",
    "authorId": "person-02",
    "category": "New opportunities",
    "body": "We have been exploring new ways to welcome talent from different backgrounds. Transferable skills deserve attention alongside traditional experience.",
    "createdAt": "2026-10-12T18:24:00.000Z",
    "image": "/network/covers/cover-12.svg",
    "likes": 235,
    "comments": [
      {
        "id": "comment-11-a",
        "authorId": "person-17",
        "text": "Love seeing teams build things together.",
        "createdAt": "2026-10-12T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-013",
    "authorId": "person-05",
    "category": "Hiring insights",
    "body": "A CV can open a conversation, but a thoughtful portfolio or real work example helps us understand what someone can do. What makes a candidate stand out to you?",
    "createdAt": "2026-10-13T07:24:00.000Z",
    "image": "",
    "likes": 254,
    "comments": [
      {
        "id": "comment-12-a",
        "authorId": "person-18",
        "text": "Great perspective, thanks for sharing!",
        "createdAt": "2026-10-13T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-014",
    "authorId": "person-08",
    "category": "Career tips",
    "body": "What is one skill that helped you grow in your career? For me, it has been the ability to explain complex ideas clearly and ask better questions.",
    "createdAt": "2026-10-14T08:24:00.000Z",
    "image": "/network/covers/cover-14.svg",
    "likes": 273,
    "comments": [
      {
        "id": "comment-13-a",
        "authorId": "person-19",
        "text": "Appreciate the practical insight here.",
        "createdAt": "2026-10-14T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-015",
    "authorId": "person-11",
    "category": "Team recognition",
    "body": "Recognizing colleagues who quietly make work better: the ones who document, support, follow up and find thoughtful solutions when things get difficult.",
    "createdAt": "2026-10-15T09:24:00.000Z",
    "image": "/network/covers/cover-01.svg",
    "likes": 292,
    "comments": [
      {
        "id": "comment-14-a",
        "authorId": "person-20",
        "text": "This is exactly the kind of conversation we need.",
        "createdAt": "2026-10-15T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-016",
    "authorId": "person-14",
    "category": "Community impact",
    "body": "It was wonderful to see colleagues and volunteers sharing their time with the community this week. Small actions can create meaningful change.",
    "createdAt": "2026-10-16T10:24:00.000Z",
    "image": "/network/covers/cover-02.svg",
    "likes": 311,
    "comments": [
      {
        "id": "comment-15-a",
        "authorId": "person-21",
        "text": "Love seeing teams build things together.",
        "createdAt": "2026-10-16T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-017",
    "authorId": "person-17",
    "category": "Learning together",
    "body": "Our latest learning session was a reminder that growth is not always linear. Practice, honest feedback and a supportive community make a real difference.",
    "createdAt": "2026-10-17T11:24:00.000Z",
    "image": "",
    "likes": 330,
    "comments": [
      {
        "id": "comment-16-a",
        "authorId": "person-22",
        "text": "Great perspective, thanks for sharing!",
        "createdAt": "2026-10-17T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-018",
    "authorId": "person-20",
    "category": "Team culture",
    "body": "There is something special about a team that makes space for questions. This week we hosted an open conversation about learning at work, feedback and supporting early-career colleagues.",
    "createdAt": "2026-10-18T12:24:00.000Z",
    "image": "/network/covers/cover-04.svg",
    "likes": 349,
    "comments": [
      {
        "id": "comment-17-a",
        "authorId": "person-23",
        "text": "Appreciate the practical insight here.",
        "createdAt": "2026-10-18T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-019",
    "authorId": "person-23",
    "category": "Workplace perspectives",
    "body": "Good projects need more than a great idea. They need clear roles, patient communication and people willing to keep learning when plans change.",
    "createdAt": "2026-10-19T13:24:00.000Z",
    "image": "/network/covers/cover-05.svg",
    "likes": 368,
    "comments": [
      {
        "id": "comment-18-a",
        "authorId": "person-24",
        "text": "This is exactly the kind of conversation we need.",
        "createdAt": "2026-10-19T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-020",
    "authorId": "person-26",
    "category": "Project milestone",
    "body": "A proud moment for our team: after weeks of thoughtful collaboration, our latest project reached an important milestone. Excited for the next chapter.",
    "createdAt": "2026-10-20T14:24:00.000Z",
    "image": "/network/covers/cover-06.svg",
    "likes": 27,
    "comments": [
      {
        "id": "comment-19-a",
        "authorId": "person-25",
        "text": "Love seeing teams build things together.",
        "createdAt": "2026-10-20T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-021",
    "authorId": "person-29",
    "category": "Career tips",
    "body": "What is one skill that helped you grow in your career? For me, it has been the ability to explain complex ideas clearly and ask better questions.",
    "createdAt": "2026-10-21T15:24:00.000Z",
    "image": "",
    "likes": 46,
    "comments": [
      {
        "id": "comment-20-a",
        "authorId": "person-26",
        "text": "Great perspective, thanks for sharing!",
        "createdAt": "2026-10-21T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-022",
    "authorId": "person-32",
    "category": "Team recognition",
    "body": "Recognizing colleagues who quietly make work better: the ones who document, support, follow up and find thoughtful solutions when things get difficult.",
    "createdAt": "2026-10-22T16:24:00.000Z",
    "image": "/network/covers/cover-08.svg",
    "likes": 65,
    "comments": [
      {
        "id": "comment-21-a",
        "authorId": "person-27",
        "text": "Appreciate the practical insight here.",
        "createdAt": "2026-10-22T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-023",
    "authorId": "person-35",
    "category": "Community impact",
    "body": "It was wonderful to see colleagues and volunteers sharing their time with the community this week. Small actions can create meaningful change.",
    "createdAt": "2026-10-23T17:24:00.000Z",
    "image": "/network/covers/cover-09.svg",
    "likes": 84,
    "comments": [
      {
        "id": "comment-22-a",
        "authorId": "person-28",
        "text": "This is exactly the kind of conversation we need.",
        "createdAt": "2026-10-23T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-024",
    "authorId": "person-38",
    "category": "Learning together",
    "body": "Our latest learning session was a reminder that growth is not always linear. Practice, honest feedback and a supportive community make a real difference.",
    "createdAt": "2026-10-24T18:24:00.000Z",
    "image": "/network/covers/cover-10.svg",
    "likes": 103,
    "comments": [
      {
        "id": "comment-23-a",
        "authorId": "person-29",
        "text": "Love seeing teams build things together.",
        "createdAt": "2026-10-24T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-025",
    "authorId": "person-01",
    "category": "Team culture",
    "body": "There is something special about a team that makes space for questions. This week we hosted an open conversation about learning at work, feedback and supporting early-career colleagues.",
    "createdAt": "2026-10-25T07:24:00.000Z",
    "image": "",
    "likes": 122,
    "comments": [
      {
        "id": "comment-24-a",
        "authorId": "person-30",
        "text": "Great perspective, thanks for sharing!",
        "createdAt": "2026-10-25T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-026",
    "authorId": "person-04",
    "category": "Workplace perspectives",
    "body": "Good projects need more than a great idea. They need clear roles, patient communication and people willing to keep learning when plans change.",
    "createdAt": "2026-10-26T08:24:00.000Z",
    "image": "/network/covers/cover-12.svg",
    "likes": 141,
    "comments": [
      {
        "id": "comment-25-a",
        "authorId": "person-31",
        "text": "Appreciate the practical insight here.",
        "createdAt": "2026-10-26T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-027",
    "authorId": "person-07",
    "category": "Project milestone",
    "body": "A proud moment for our team: after weeks of thoughtful collaboration, our latest project reached an important milestone. Excited for the next chapter.",
    "createdAt": "2026-10-27T09:24:00.000Z",
    "image": "/network/covers/cover-13.svg",
    "likes": 160,
    "comments": [
      {
        "id": "comment-26-a",
        "authorId": "person-32",
        "text": "This is exactly the kind of conversation we need.",
        "createdAt": "2026-10-27T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-028",
    "authorId": "person-10",
    "category": "Behind the scenes",
    "body": "A little behind-the-scenes look at how our team plans its next project. The best ideas came from listening closely to the people who use our work every day.",
    "createdAt": "2026-10-28T10:24:00.000Z",
    "image": "/network/covers/cover-14.svg",
    "likes": 179,
    "comments": [
      {
        "id": "comment-27-a",
        "authorId": "person-33",
        "text": "Love seeing teams build things together.",
        "createdAt": "2026-10-28T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-029",
    "authorId": "person-13",
    "category": "New opportunities",
    "body": "We have been exploring new ways to welcome talent from different backgrounds. Transferable skills deserve attention alongside traditional experience.",
    "createdAt": "2026-10-01T11:24:00.000Z",
    "image": "",
    "likes": 198,
    "comments": [
      {
        "id": "comment-28-a",
        "authorId": "person-34",
        "text": "Great perspective, thanks for sharing!",
        "createdAt": "2026-10-01T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-030",
    "authorId": "person-16",
    "category": "Hiring insights",
    "body": "A CV can open a conversation, but a thoughtful portfolio or real work example helps us understand what someone can do. What makes a candidate stand out to you?",
    "createdAt": "2026-10-02T12:24:00.000Z",
    "image": "/network/covers/cover-02.svg",
    "likes": 217,
    "comments": [
      {
        "id": "comment-29-a",
        "authorId": "person-35",
        "text": "Appreciate the practical insight here.",
        "createdAt": "2026-10-02T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-031",
    "authorId": "person-19",
    "category": "Learning together",
    "body": "Our latest learning session was a reminder that growth is not always linear. Practice, honest feedback and a supportive community make a real difference.",
    "createdAt": "2026-10-03T13:24:00.000Z",
    "image": "/network/covers/cover-03.svg",
    "likes": 236,
    "comments": [
      {
        "id": "comment-30-a",
        "authorId": "person-36",
        "text": "This is exactly the kind of conversation we need.",
        "createdAt": "2026-10-03T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-032",
    "authorId": "person-22",
    "category": "Team culture",
    "body": "There is something special about a team that makes space for questions. This week we hosted an open conversation about learning at work, feedback and supporting early-career colleagues.",
    "createdAt": "2026-10-04T14:24:00.000Z",
    "image": "/network/covers/cover-04.svg",
    "likes": 255,
    "comments": [
      {
        "id": "comment-31-a",
        "authorId": "person-37",
        "text": "Love seeing teams build things together.",
        "createdAt": "2026-10-04T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-033",
    "authorId": "person-25",
    "category": "Workplace perspectives",
    "body": "Good projects need more than a great idea. They need clear roles, patient communication and people willing to keep learning when plans change.",
    "createdAt": "2026-10-05T15:24:00.000Z",
    "image": "",
    "likes": 274,
    "comments": [
      {
        "id": "comment-32-a",
        "authorId": "person-38",
        "text": "Great perspective, thanks for sharing!",
        "createdAt": "2026-10-05T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-034",
    "authorId": "person-28",
    "category": "Project milestone",
    "body": "A proud moment for our team: after weeks of thoughtful collaboration, our latest project reached an important milestone. Excited for the next chapter.",
    "createdAt": "2026-10-06T16:24:00.000Z",
    "image": "/network/covers/cover-06.svg",
    "likes": 293,
    "comments": [
      {
        "id": "comment-33-a",
        "authorId": "person-39",
        "text": "Appreciate the practical insight here.",
        "createdAt": "2026-10-06T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-035",
    "authorId": "person-31",
    "category": "Behind the scenes",
    "body": "A little behind-the-scenes look at how our team plans its next project. The best ideas came from listening closely to the people who use our work every day.",
    "createdAt": "2026-10-07T17:24:00.000Z",
    "image": "/network/covers/cover-07.svg",
    "likes": 312,
    "comments": [
      {
        "id": "comment-34-a",
        "authorId": "person-40",
        "text": "This is exactly the kind of conversation we need.",
        "createdAt": "2026-10-07T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-036",
    "authorId": "person-34",
    "category": "New opportunities",
    "body": "We have been exploring new ways to welcome talent from different backgrounds. Transferable skills deserve attention alongside traditional experience.",
    "createdAt": "2026-10-08T18:24:00.000Z",
    "image": "/network/covers/cover-08.svg",
    "likes": 331,
    "comments": [
      {
        "id": "comment-35-a",
        "authorId": "person-01",
        "text": "Love seeing teams build things together.",
        "createdAt": "2026-10-08T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-037",
    "authorId": "person-37",
    "category": "Hiring insights",
    "body": "A CV can open a conversation, but a thoughtful portfolio or real work example helps us understand what someone can do. What makes a candidate stand out to you?",
    "createdAt": "2026-10-09T07:24:00.000Z",
    "image": "",
    "likes": 350,
    "comments": [
      {
        "id": "comment-36-a",
        "authorId": "person-02",
        "text": "Great perspective, thanks for sharing!",
        "createdAt": "2026-10-09T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-038",
    "authorId": "person-40",
    "category": "Career tips",
    "body": "What is one skill that helped you grow in your career? For me, it has been the ability to explain complex ideas clearly and ask better questions.",
    "createdAt": "2026-10-10T08:24:00.000Z",
    "image": "/network/covers/cover-10.svg",
    "likes": 369,
    "comments": [
      {
        "id": "comment-37-a",
        "authorId": "person-03",
        "text": "Appreciate the practical insight here.",
        "createdAt": "2026-10-10T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-039",
    "authorId": "person-03",
    "category": "Team recognition",
    "body": "Recognizing colleagues who quietly make work better: the ones who document, support, follow up and find thoughtful solutions when things get difficult.",
    "createdAt": "2026-10-11T09:24:00.000Z",
    "image": "/network/covers/cover-11.svg",
    "likes": 28,
    "comments": [
      {
        "id": "comment-38-a",
        "authorId": "person-04",
        "text": "This is exactly the kind of conversation we need.",
        "createdAt": "2026-10-11T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-040",
    "authorId": "person-06",
    "category": "Community impact",
    "body": "It was wonderful to see colleagues and volunteers sharing their time with the community this week. Small actions can create meaningful change.",
    "createdAt": "2026-10-12T10:24:00.000Z",
    "image": "/network/covers/cover-12.svg",
    "likes": 47,
    "comments": [
      {
        "id": "comment-39-a",
        "authorId": "person-05",
        "text": "Love seeing teams build things together.",
        "createdAt": "2026-10-12T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-041",
    "authorId": "person-09",
    "category": "Project milestone",
    "body": "A proud moment for our team: after weeks of thoughtful collaboration, our latest project reached an important milestone. Excited for the next chapter.",
    "createdAt": "2026-10-13T11:24:00.000Z",
    "image": "",
    "likes": 66,
    "comments": [
      {
        "id": "comment-40-a",
        "authorId": "person-06",
        "text": "Great perspective, thanks for sharing!",
        "createdAt": "2026-10-13T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-042",
    "authorId": "person-12",
    "category": "Behind the scenes",
    "body": "A little behind-the-scenes look at how our team plans its next project. The best ideas came from listening closely to the people who use our work every day.",
    "createdAt": "2026-10-14T12:24:00.000Z",
    "image": "/network/covers/cover-14.svg",
    "likes": 85,
    "comments": [
      {
        "id": "comment-41-a",
        "authorId": "person-07",
        "text": "Appreciate the practical insight here.",
        "createdAt": "2026-10-14T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-043",
    "authorId": "person-15",
    "category": "New opportunities",
    "body": "We have been exploring new ways to welcome talent from different backgrounds. Transferable skills deserve attention alongside traditional experience.",
    "createdAt": "2026-10-15T13:24:00.000Z",
    "image": "/network/covers/cover-01.svg",
    "likes": 104,
    "comments": [
      {
        "id": "comment-42-a",
        "authorId": "person-08",
        "text": "This is exactly the kind of conversation we need.",
        "createdAt": "2026-10-15T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-044",
    "authorId": "person-18",
    "category": "Hiring insights",
    "body": "A CV can open a conversation, but a thoughtful portfolio or real work example helps us understand what someone can do. What makes a candidate stand out to you?",
    "createdAt": "2026-10-16T14:24:00.000Z",
    "image": "/network/covers/cover-02.svg",
    "likes": 123,
    "comments": [
      {
        "id": "comment-43-a",
        "authorId": "person-09",
        "text": "Love seeing teams build things together.",
        "createdAt": "2026-10-16T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-045",
    "authorId": "person-21",
    "category": "Career tips",
    "body": "What is one skill that helped you grow in your career? For me, it has been the ability to explain complex ideas clearly and ask better questions.",
    "createdAt": "2026-10-17T15:24:00.000Z",
    "image": "",
    "likes": 142,
    "comments": [
      {
        "id": "comment-44-a",
        "authorId": "person-10",
        "text": "Great perspective, thanks for sharing!",
        "createdAt": "2026-10-17T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-046",
    "authorId": "person-24",
    "category": "Team recognition",
    "body": "Recognizing colleagues who quietly make work better: the ones who document, support, follow up and find thoughtful solutions when things get difficult.",
    "createdAt": "2026-10-18T16:24:00.000Z",
    "image": "/network/covers/cover-04.svg",
    "likes": 161,
    "comments": [
      {
        "id": "comment-45-a",
        "authorId": "person-11",
        "text": "Appreciate the practical insight here.",
        "createdAt": "2026-10-18T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-047",
    "authorId": "person-27",
    "category": "Community impact",
    "body": "It was wonderful to see colleagues and volunteers sharing their time with the community this week. Small actions can create meaningful change.",
    "createdAt": "2026-10-19T17:24:00.000Z",
    "image": "/network/covers/cover-05.svg",
    "likes": 180,
    "comments": [
      {
        "id": "comment-46-a",
        "authorId": "person-12",
        "text": "This is exactly the kind of conversation we need.",
        "createdAt": "2026-10-19T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-048",
    "authorId": "person-30",
    "category": "Learning together",
    "body": "Our latest learning session was a reminder that growth is not always linear. Practice, honest feedback and a supportive community make a real difference.",
    "createdAt": "2026-10-20T18:24:00.000Z",
    "image": "/network/covers/cover-06.svg",
    "likes": 199,
    "comments": [
      {
        "id": "comment-47-a",
        "authorId": "person-13",
        "text": "Love seeing teams build things together.",
        "createdAt": "2026-10-20T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-049",
    "authorId": "person-33",
    "category": "Team culture",
    "body": "There is something special about a team that makes space for questions. This week we hosted an open conversation about learning at work, feedback and supporting early-career colleagues.",
    "createdAt": "2026-10-21T07:24:00.000Z",
    "image": "",
    "likes": 218,
    "comments": [
      {
        "id": "comment-48-a",
        "authorId": "person-14",
        "text": "Great perspective, thanks for sharing!",
        "createdAt": "2026-10-21T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-050",
    "authorId": "person-36",
    "category": "Workplace perspectives",
    "body": "Good projects need more than a great idea. They need clear roles, patient communication and people willing to keep learning when plans change.",
    "createdAt": "2026-10-22T08:24:00.000Z",
    "image": "/network/covers/cover-08.svg",
    "likes": 237,
    "comments": [
      {
        "id": "comment-49-a",
        "authorId": "person-15",
        "text": "Appreciate the practical insight here.",
        "createdAt": "2026-10-22T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-051",
    "authorId": "person-39",
    "category": "Hiring insights",
    "body": "A CV can open a conversation, but a thoughtful portfolio or real work example helps us understand what someone can do. What makes a candidate stand out to you?",
    "createdAt": "2026-10-23T09:24:00.000Z",
    "image": "/network/covers/cover-09.svg",
    "likes": 256,
    "comments": [
      {
        "id": "comment-50-a",
        "authorId": "person-16",
        "text": "This is exactly the kind of conversation we need.",
        "createdAt": "2026-10-23T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-052",
    "authorId": "person-02",
    "category": "Career tips",
    "body": "What is one skill that helped you grow in your career? For me, it has been the ability to explain complex ideas clearly and ask better questions.",
    "createdAt": "2026-10-24T10:24:00.000Z",
    "image": "/network/covers/cover-10.svg",
    "likes": 275,
    "comments": [
      {
        "id": "comment-51-a",
        "authorId": "person-17",
        "text": "Love seeing teams build things together.",
        "createdAt": "2026-10-24T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-053",
    "authorId": "person-05",
    "category": "Team recognition",
    "body": "Recognizing colleagues who quietly make work better: the ones who document, support, follow up and find thoughtful solutions when things get difficult.",
    "createdAt": "2026-10-25T11:24:00.000Z",
    "image": "",
    "likes": 294,
    "comments": [
      {
        "id": "comment-52-a",
        "authorId": "person-18",
        "text": "Great perspective, thanks for sharing!",
        "createdAt": "2026-10-25T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-054",
    "authorId": "person-08",
    "category": "Community impact",
    "body": "It was wonderful to see colleagues and volunteers sharing their time with the community this week. Small actions can create meaningful change.",
    "createdAt": "2026-10-26T12:24:00.000Z",
    "image": "/network/covers/cover-12.svg",
    "likes": 313,
    "comments": [
      {
        "id": "comment-53-a",
        "authorId": "person-19",
        "text": "Appreciate the practical insight here.",
        "createdAt": "2026-10-26T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-055",
    "authorId": "person-11",
    "category": "Learning together",
    "body": "Our latest learning session was a reminder that growth is not always linear. Practice, honest feedback and a supportive community make a real difference.",
    "createdAt": "2026-10-27T13:24:00.000Z",
    "image": "/network/covers/cover-13.svg",
    "likes": 332,
    "comments": [
      {
        "id": "comment-54-a",
        "authorId": "person-20",
        "text": "This is exactly the kind of conversation we need.",
        "createdAt": "2026-10-27T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-056",
    "authorId": "person-14",
    "category": "Team culture",
    "body": "There is something special about a team that makes space for questions. This week we hosted an open conversation about learning at work, feedback and supporting early-career colleagues.",
    "createdAt": "2026-10-28T14:24:00.000Z",
    "image": "/network/covers/cover-14.svg",
    "likes": 351,
    "comments": [
      {
        "id": "comment-55-a",
        "authorId": "person-21",
        "text": "Love seeing teams build things together.",
        "createdAt": "2026-10-28T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-057",
    "authorId": "person-17",
    "category": "Workplace perspectives",
    "body": "Good projects need more than a great idea. They need clear roles, patient communication and people willing to keep learning when plans change.",
    "createdAt": "2026-10-01T15:24:00.000Z",
    "image": "",
    "likes": 370,
    "comments": [
      {
        "id": "comment-56-a",
        "authorId": "person-22",
        "text": "Great perspective, thanks for sharing!",
        "createdAt": "2026-10-01T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-058",
    "authorId": "person-20",
    "category": "Project milestone",
    "body": "A proud moment for our team: after weeks of thoughtful collaboration, our latest project reached an important milestone. Excited for the next chapter.",
    "createdAt": "2026-10-02T16:24:00.000Z",
    "image": "/network/covers/cover-02.svg",
    "likes": 29,
    "comments": [
      {
        "id": "comment-57-a",
        "authorId": "person-23",
        "text": "Appreciate the practical insight here.",
        "createdAt": "2026-10-02T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-059",
    "authorId": "person-23",
    "category": "Behind the scenes",
    "body": "A little behind-the-scenes look at how our team plans its next project. The best ideas came from listening closely to the people who use our work every day.",
    "createdAt": "2026-10-03T17:24:00.000Z",
    "image": "/network/covers/cover-03.svg",
    "likes": 48,
    "comments": [
      {
        "id": "comment-58-a",
        "authorId": "person-24",
        "text": "This is exactly the kind of conversation we need.",
        "createdAt": "2026-10-03T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-060",
    "authorId": "person-26",
    "category": "New opportunities",
    "body": "We have been exploring new ways to welcome talent from different backgrounds. Transferable skills deserve attention alongside traditional experience.",
    "createdAt": "2026-10-04T18:24:00.000Z",
    "image": "/network/covers/cover-04.svg",
    "likes": 67,
    "comments": [
      {
        "id": "comment-59-a",
        "authorId": "person-25",
        "text": "Love seeing teams build things together.",
        "createdAt": "2026-10-04T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-061",
    "authorId": "person-29",
    "category": "Community impact",
    "body": "It was wonderful to see colleagues and volunteers sharing their time with the community this week. Small actions can create meaningful change.",
    "createdAt": "2026-10-05T07:24:00.000Z",
    "image": "",
    "likes": 86,
    "comments": [
      {
        "id": "comment-60-a",
        "authorId": "person-26",
        "text": "Great perspective, thanks for sharing!",
        "createdAt": "2026-10-05T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-062",
    "authorId": "person-32",
    "category": "Learning together",
    "body": "Our latest learning session was a reminder that growth is not always linear. Practice, honest feedback and a supportive community make a real difference.",
    "createdAt": "2026-10-06T08:24:00.000Z",
    "image": "/network/covers/cover-06.svg",
    "likes": 105,
    "comments": [
      {
        "id": "comment-61-a",
        "authorId": "person-27",
        "text": "Appreciate the practical insight here.",
        "createdAt": "2026-10-06T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-063",
    "authorId": "person-35",
    "category": "Team culture",
    "body": "There is something special about a team that makes space for questions. This week we hosted an open conversation about learning at work, feedback and supporting early-career colleagues.",
    "createdAt": "2026-10-07T09:24:00.000Z",
    "image": "/network/covers/cover-07.svg",
    "likes": 124,
    "comments": [
      {
        "id": "comment-62-a",
        "authorId": "person-28",
        "text": "This is exactly the kind of conversation we need.",
        "createdAt": "2026-10-07T12:30:00.000Z"
      }
    ]
  },
  {
    "id": "post-064",
    "authorId": "person-38",
    "category": "Workplace perspectives",
    "body": "Good projects need more than a great idea. They need clear roles, patient communication and people willing to keep learning when plans change.",
    "createdAt": "2026-10-08T10:24:00.000Z",
    "image": "/network/covers/cover-08.svg",
    "likes": 143,
    "comments": [
      {
        "id": "comment-63-a",
        "authorId": "person-29",
        "text": "Love seeing teams build things together.",
        "createdAt": "2026-10-08T12:30:00.000Z"
      }
    ]
  }
];
export const SEED_THREADS:NetworkThread[]=[
  {
    "id": "thread-01",
    "contactId": "person-01",
    "subject": "Career conversation",
    "updatedAt": "2026-11-02T08:15:00.000Z",
    "messages": [
      {
        "id": "m-0-1",
        "fromSide": "contact",
        "text": "Hi! Thanks for connecting. I enjoyed reading about your recent projects.",
        "createdAt": "2026-11-01T10:30:00.000Z",
        "attachment": null
      },
      {
        "id": "m-0-2",
        "fromSide": "me",
        "text": "Thanks for reaching out. I would be happy to hear more.",
        "createdAt": "2026-11-01T11:00:00.000Z",
        "attachment": null
      },
      {
        "id": "m-0-3",
        "fromSide": "contact",
        "text": "Would you be available to share more about a recent project?",
        "createdAt": "2026-11-02T08:15:00.000Z",
        "attachment": null
      }
    ],
    "unread": true,
    "pinned": true
  },
  {
    "id": "thread-02",
    "contactId": "person-02",
    "subject": "Opportunities and experience",
    "updatedAt": "2026-11-02T08:15:00.000Z",
    "messages": [
      {
        "id": "m-1-1",
        "fromSide": "contact",
        "text": "Hello! I noticed your interest in our career opportunities.",
        "createdAt": "2026-11-01T10:30:00.000Z",
        "attachment": null
      },
      {
        "id": "m-1-2",
        "fromSide": "me",
        "text": "Appreciate your message! I’m interested in learning more about the team.",
        "createdAt": "2026-11-01T11:00:00.000Z",
        "attachment": null
      },
      {
        "id": "m-1-3",
        "fromSide": "contact",
        "text": "What kind of opportunities are you exploring right now?",
        "createdAt": "2026-11-02T08:15:00.000Z",
        "attachment": null
      }
    ],
    "unread": false,
    "pinned": true
  },
  {
    "id": "thread-03",
    "contactId": "person-03",
    "subject": "Exploring next steps",
    "updatedAt": "2026-11-02T08:15:00.000Z",
    "messages": [
      {
        "id": "m-2-1",
        "fromSide": "contact",
        "text": "Great to connect. I wanted to follow up on your background and interests.",
        "createdAt": "2026-11-01T10:30:00.000Z",
        "attachment": null
      },
      {
        "id": "m-2-2",
        "fromSide": "me",
        "text": "Thank you! I’d love to discuss the next steps.",
        "createdAt": "2026-11-01T11:00:00.000Z",
        "attachment": null
      },
      {
        "id": "m-2-3",
        "fromSide": "contact",
        "text": "Could you tell me a little about your experience and goals?",
        "createdAt": "2026-11-02T08:15:00.000Z",
        "attachment": null
      }
    ],
    "unread": false,
    "pinned": false
  },
  {
    "id": "thread-04",
    "contactId": "person-04",
    "subject": "Career conversation",
    "updatedAt": "2026-11-02T08:15:00.000Z",
    "messages": [
      {
        "id": "m-3-1",
        "fromSide": "contact",
        "text": "Hi! Thanks for connecting. I enjoyed reading about your recent projects.",
        "createdAt": "2026-11-01T10:30:00.000Z",
        "attachment": null
      },
      {
        "id": "m-3-2",
        "fromSide": "me",
        "text": "Thanks for reaching out. I would be happy to hear more.",
        "createdAt": "2026-11-01T11:00:00.000Z",
        "attachment": null
      },
      {
        "id": "m-3-3",
        "fromSide": "contact",
        "text": "Would you be available to share more about a recent project?",
        "createdAt": "2026-11-02T08:15:00.000Z",
        "attachment": null
      }
    ],
    "unread": true,
    "pinned": false
  },
  {
    "id": "thread-05",
    "contactId": "person-05",
    "subject": "Opportunities and experience",
    "updatedAt": "2026-11-02T08:15:00.000Z",
    "messages": [
      {
        "id": "m-4-1",
        "fromSide": "contact",
        "text": "Hello! I noticed your interest in our career opportunities.",
        "createdAt": "2026-11-01T10:30:00.000Z",
        "attachment": null
      },
      {
        "id": "m-4-2",
        "fromSide": "me",
        "text": "Appreciate your message! I’m interested in learning more about the team.",
        "createdAt": "2026-11-01T11:00:00.000Z",
        "attachment": null
      },
      {
        "id": "m-4-3",
        "fromSide": "contact",
        "text": "What kind of opportunities are you exploring right now?",
        "createdAt": "2026-11-02T08:15:00.000Z",
        "attachment": null
      }
    ],
    "unread": false,
    "pinned": false
  },
  {
    "id": "thread-06",
    "contactId": "person-06",
    "subject": "Exploring next steps",
    "updatedAt": "2026-11-02T08:15:00.000Z",
    "messages": [
      {
        "id": "m-5-1",
        "fromSide": "contact",
        "text": "Great to connect. I wanted to follow up on your background and interests.",
        "createdAt": "2026-11-01T10:30:00.000Z",
        "attachment": null
      },
      {
        "id": "m-5-2",
        "fromSide": "me",
        "text": "Thank you! I’d love to discuss the next steps.",
        "createdAt": "2026-11-01T11:00:00.000Z",
        "attachment": null
      },
      {
        "id": "m-5-3",
        "fromSide": "contact",
        "text": "Could you tell me a little about your experience and goals?",
        "createdAt": "2026-11-02T08:15:00.000Z",
        "attachment": null
      }
    ],
    "unread": false,
    "pinned": false
  },
  {
    "id": "thread-07",
    "contactId": "person-07",
    "subject": "Career conversation",
    "updatedAt": "2026-11-02T08:15:00.000Z",
    "messages": [
      {
        "id": "m-6-1",
        "fromSide": "contact",
        "text": "Hi! Thanks for connecting. I enjoyed reading about your recent projects.",
        "createdAt": "2026-11-01T10:30:00.000Z",
        "attachment": null
      },
      {
        "id": "m-6-2",
        "fromSide": "me",
        "text": "Thanks for reaching out. I would be happy to hear more.",
        "createdAt": "2026-11-01T11:00:00.000Z",
        "attachment": null
      },
      {
        "id": "m-6-3",
        "fromSide": "contact",
        "text": "Would you be available to share more about a recent project?",
        "createdAt": "2026-11-02T08:15:00.000Z",
        "attachment": null
      }
    ],
    "unread": true,
    "pinned": false
  },
  {
    "id": "thread-08",
    "contactId": "person-08",
    "subject": "Opportunities and experience",
    "updatedAt": "2026-11-02T08:15:00.000Z",
    "messages": [
      {
        "id": "m-7-1",
        "fromSide": "contact",
        "text": "Hello! I noticed your interest in our career opportunities.",
        "createdAt": "2026-11-01T10:30:00.000Z",
        "attachment": null
      },
      {
        "id": "m-7-2",
        "fromSide": "me",
        "text": "Appreciate your message! I’m interested in learning more about the team.",
        "createdAt": "2026-11-01T11:00:00.000Z",
        "attachment": null
      },
      {
        "id": "m-7-3",
        "fromSide": "contact",
        "text": "What kind of opportunities are you exploring right now?",
        "createdAt": "2026-11-02T08:15:00.000Z",
        "attachment": null
      }
    ],
    "unread": false,
    "pinned": false
  },
  {
    "id": "thread-09",
    "contactId": "person-09",
    "subject": "Exploring next steps",
    "updatedAt": "2026-11-02T08:15:00.000Z",
    "messages": [
      {
        "id": "m-8-1",
        "fromSide": "contact",
        "text": "Great to connect. I wanted to follow up on your background and interests.",
        "createdAt": "2026-11-01T10:30:00.000Z",
        "attachment": null
      },
      {
        "id": "m-8-2",
        "fromSide": "me",
        "text": "Thank you! I’d love to discuss the next steps.",
        "createdAt": "2026-11-01T11:00:00.000Z",
        "attachment": null
      },
      {
        "id": "m-8-3",
        "fromSide": "contact",
        "text": "Could you tell me a little about your experience and goals?",
        "createdAt": "2026-11-02T08:15:00.000Z",
        "attachment": null
      }
    ],
    "unread": false,
    "pinned": false
  },
  {
    "id": "thread-10",
    "contactId": "person-10",
    "subject": "Career conversation",
    "updatedAt": "2026-11-02T08:15:00.000Z",
    "messages": [
      {
        "id": "m-9-1",
        "fromSide": "contact",
        "text": "Hi! Thanks for connecting. I enjoyed reading about your recent projects.",
        "createdAt": "2026-11-01T10:30:00.000Z",
        "attachment": null
      },
      {
        "id": "m-9-2",
        "fromSide": "me",
        "text": "Thanks for reaching out. I would be happy to hear more.",
        "createdAt": "2026-11-01T11:00:00.000Z",
        "attachment": null
      },
      {
        "id": "m-9-3",
        "fromSide": "contact",
        "text": "Would you be available to share more about a recent project?",
        "createdAt": "2026-11-02T08:15:00.000Z",
        "attachment": null
      }
    ],
    "unread": true,
    "pinned": false
  },
  {
    "id": "thread-11",
    "contactId": "person-11",
    "subject": "Opportunities and experience",
    "updatedAt": "2026-11-02T08:15:00.000Z",
    "messages": [
      {
        "id": "m-10-1",
        "fromSide": "contact",
        "text": "Hello! I noticed your interest in our career opportunities.",
        "createdAt": "2026-11-01T10:30:00.000Z",
        "attachment": null
      },
      {
        "id": "m-10-2",
        "fromSide": "me",
        "text": "Appreciate your message! I’m interested in learning more about the team.",
        "createdAt": "2026-11-01T11:00:00.000Z",
        "attachment": null
      },
      {
        "id": "m-10-3",
        "fromSide": "contact",
        "text": "What kind of opportunities are you exploring right now?",
        "createdAt": "2026-11-02T08:15:00.000Z",
        "attachment": null
      }
    ],
    "unread": false,
    "pinned": false
  },
  {
    "id": "thread-12",
    "contactId": "person-12",
    "subject": "Exploring next steps",
    "updatedAt": "2026-11-02T08:15:00.000Z",
    "messages": [
      {
        "id": "m-11-1",
        "fromSide": "contact",
        "text": "Great to connect. I wanted to follow up on your background and interests.",
        "createdAt": "2026-11-01T10:30:00.000Z",
        "attachment": null
      },
      {
        "id": "m-11-2",
        "fromSide": "me",
        "text": "Thank you! I’d love to discuss the next steps.",
        "createdAt": "2026-11-01T11:00:00.000Z",
        "attachment": null
      },
      {
        "id": "m-11-3",
        "fromSide": "contact",
        "text": "Could you tell me a little about your experience and goals?",
        "createdAt": "2026-11-02T08:15:00.000Z",
        "attachment": null
      }
    ],
    "unread": false,
    "pinned": false
  },
  {
    "id": "thread-13",
    "contactId": "person-13",
    "subject": "Career conversation",
    "updatedAt": "2026-11-02T08:15:00.000Z",
    "messages": [
      {
        "id": "m-12-1",
        "fromSide": "contact",
        "text": "Hi! Thanks for connecting. I enjoyed reading about your recent projects.",
        "createdAt": "2026-11-01T10:30:00.000Z",
        "attachment": null
      },
      {
        "id": "m-12-2",
        "fromSide": "me",
        "text": "Thanks for reaching out. I would be happy to hear more.",
        "createdAt": "2026-11-01T11:00:00.000Z",
        "attachment": null
      },
      {
        "id": "m-12-3",
        "fromSide": "contact",
        "text": "Would you be available to share more about a recent project?",
        "createdAt": "2026-11-02T08:15:00.000Z",
        "attachment": null
      }
    ],
    "unread": true,
    "pinned": false
  },
  {
    "id": "thread-14",
    "contactId": "person-14",
    "subject": "Opportunities and experience",
    "updatedAt": "2026-11-02T08:15:00.000Z",
    "messages": [
      {
        "id": "m-13-1",
        "fromSide": "contact",
        "text": "Hello! I noticed your interest in our career opportunities.",
        "createdAt": "2026-11-01T10:30:00.000Z",
        "attachment": null
      },
      {
        "id": "m-13-2",
        "fromSide": "me",
        "text": "Appreciate your message! I’m interested in learning more about the team.",
        "createdAt": "2026-11-01T11:00:00.000Z",
        "attachment": null
      },
      {
        "id": "m-13-3",
        "fromSide": "contact",
        "text": "What kind of opportunities are you exploring right now?",
        "createdAt": "2026-11-02T08:15:00.000Z",
        "attachment": null
      }
    ],
    "unread": false,
    "pinned": false
  },
  {
    "id": "thread-15",
    "contactId": "person-15",
    "subject": "Exploring next steps",
    "updatedAt": "2026-11-02T08:15:00.000Z",
    "messages": [
      {
        "id": "m-14-1",
        "fromSide": "contact",
        "text": "Great to connect. I wanted to follow up on your background and interests.",
        "createdAt": "2026-11-01T10:30:00.000Z",
        "attachment": null
      },
      {
        "id": "m-14-2",
        "fromSide": "me",
        "text": "Thank you! I’d love to discuss the next steps.",
        "createdAt": "2026-11-01T11:00:00.000Z",
        "attachment": null
      },
      {
        "id": "m-14-3",
        "fromSide": "contact",
        "text": "Could you tell me a little about your experience and goals?",
        "createdAt": "2026-11-02T08:15:00.000Z",
        "attachment": null
      }
    ],
    "unread": false,
    "pinned": false
  },
  {
    "id": "thread-16",
    "contactId": "person-16",
    "subject": "Career conversation",
    "updatedAt": "2026-11-02T08:15:00.000Z",
    "messages": [
      {
        "id": "m-15-1",
        "fromSide": "contact",
        "text": "Hi! Thanks for connecting. I enjoyed reading about your recent projects.",
        "createdAt": "2026-11-01T10:30:00.000Z",
        "attachment": null
      },
      {
        "id": "m-15-2",
        "fromSide": "me",
        "text": "Thanks for reaching out. I would be happy to hear more.",
        "createdAt": "2026-11-01T11:00:00.000Z",
        "attachment": null
      },
      {
        "id": "m-15-3",
        "fromSide": "contact",
        "text": "Would you be available to share more about a recent project?",
        "createdAt": "2026-11-02T08:15:00.000Z",
        "attachment": null
      }
    ],
    "unread": true,
    "pinned": false
  },
  {
    "id": "thread-17",
    "contactId": "person-17",
    "subject": "Opportunities and experience",
    "updatedAt": "2026-11-02T08:15:00.000Z",
    "messages": [
      {
        "id": "m-16-1",
        "fromSide": "contact",
        "text": "Hello! I noticed your interest in our career opportunities.",
        "createdAt": "2026-11-01T10:30:00.000Z",
        "attachment": null
      },
      {
        "id": "m-16-2",
        "fromSide": "me",
        "text": "Appreciate your message! I’m interested in learning more about the team.",
        "createdAt": "2026-11-01T11:00:00.000Z",
        "attachment": null
      },
      {
        "id": "m-16-3",
        "fromSide": "contact",
        "text": "What kind of opportunities are you exploring right now?",
        "createdAt": "2026-11-02T08:15:00.000Z",
        "attachment": null
      }
    ],
    "unread": false,
    "pinned": false
  },
  {
    "id": "thread-18",
    "contactId": "person-18",
    "subject": "Exploring next steps",
    "updatedAt": "2026-11-02T08:15:00.000Z",
    "messages": [
      {
        "id": "m-17-1",
        "fromSide": "contact",
        "text": "Great to connect. I wanted to follow up on your background and interests.",
        "createdAt": "2026-11-01T10:30:00.000Z",
        "attachment": null
      },
      {
        "id": "m-17-2",
        "fromSide": "me",
        "text": "Thank you! I’d love to discuss the next steps.",
        "createdAt": "2026-11-01T11:00:00.000Z",
        "attachment": null
      },
      {
        "id": "m-17-3",
        "fromSide": "contact",
        "text": "Could you tell me a little about your experience and goals?",
        "createdAt": "2026-11-02T08:15:00.000Z",
        "attachment": null
      }
    ],
    "unread": false,
    "pinned": false
  },
  {
    "id": "thread-19",
    "contactId": "person-19",
    "subject": "Career conversation",
    "updatedAt": "2026-11-02T08:15:00.000Z",
    "messages": [
      {
        "id": "m-18-1",
        "fromSide": "contact",
        "text": "Hi! Thanks for connecting. I enjoyed reading about your recent projects.",
        "createdAt": "2026-11-01T10:30:00.000Z",
        "attachment": null
      },
      {
        "id": "m-18-2",
        "fromSide": "me",
        "text": "Thanks for reaching out. I would be happy to hear more.",
        "createdAt": "2026-11-01T11:00:00.000Z",
        "attachment": null
      },
      {
        "id": "m-18-3",
        "fromSide": "contact",
        "text": "Would you be available to share more about a recent project?",
        "createdAt": "2026-11-02T08:15:00.000Z",
        "attachment": null
      }
    ],
    "unread": true,
    "pinned": false
  },
  {
    "id": "thread-20",
    "contactId": "person-20",
    "subject": "Opportunities and experience",
    "updatedAt": "2026-11-02T08:15:00.000Z",
    "messages": [
      {
        "id": "m-19-1",
        "fromSide": "contact",
        "text": "Hello! I noticed your interest in our career opportunities.",
        "createdAt": "2026-11-01T10:30:00.000Z",
        "attachment": null
      },
      {
        "id": "m-19-2",
        "fromSide": "me",
        "text": "Appreciate your message! I’m interested in learning more about the team.",
        "createdAt": "2026-11-01T11:00:00.000Z",
        "attachment": null
      },
      {
        "id": "m-19-3",
        "fromSide": "contact",
        "text": "What kind of opportunities are you exploring right now?",
        "createdAt": "2026-11-02T08:15:00.000Z",
        "attachment": null
      }
    ],
    "unread": false,
    "pinned": false
  },
  {
    "id": "thread-21",
    "contactId": "person-21",
    "subject": "Exploring next steps",
    "updatedAt": "2026-11-02T08:15:00.000Z",
    "messages": [
      {
        "id": "m-20-1",
        "fromSide": "contact",
        "text": "Great to connect. I wanted to follow up on your background and interests.",
        "createdAt": "2026-11-01T10:30:00.000Z",
        "attachment": null
      },
      {
        "id": "m-20-2",
        "fromSide": "me",
        "text": "Thank you! I’d love to discuss the next steps.",
        "createdAt": "2026-11-01T11:00:00.000Z",
        "attachment": null
      },
      {
        "id": "m-20-3",
        "fromSide": "contact",
        "text": "Could you tell me a little about your experience and goals?",
        "createdAt": "2026-11-02T08:15:00.000Z",
        "attachment": null
      }
    ],
    "unread": false,
    "pinned": false
  },
  {
    "id": "thread-22",
    "contactId": "person-22",
    "subject": "Career conversation",
    "updatedAt": "2026-11-02T08:15:00.000Z",
    "messages": [
      {
        "id": "m-21-1",
        "fromSide": "contact",
        "text": "Hi! Thanks for connecting. I enjoyed reading about your recent projects.",
        "createdAt": "2026-11-01T10:30:00.000Z",
        "attachment": null
      },
      {
        "id": "m-21-2",
        "fromSide": "me",
        "text": "Thanks for reaching out. I would be happy to hear more.",
        "createdAt": "2026-11-01T11:00:00.000Z",
        "attachment": null
      },
      {
        "id": "m-21-3",
        "fromSide": "contact",
        "text": "Would you be available to share more about a recent project?",
        "createdAt": "2026-11-02T08:15:00.000Z",
        "attachment": null
      }
    ],
    "unread": true,
    "pinned": false
  }
];
/** Organization authors and industry posts extend the existing social network without replacing prior records. */
NETWORK_PEOPLE.push(...COMPANIES.map((c,i)=>({id:`org-author-${c.id}`,name:c.name,role:'Company updates',company:c.name,sector:c.sector,initials:c.initials,color:c.color,avatar:`/network/avatars/avatar-${String(i%12+1).padStart(2,'0')}.svg`})));
const COMPANY_POST_TEMPLATES=[
 (company:string,role:string)=>`We're growing our ${role} team at ${company}. Our work brings together people with different backgrounds and practical skills. Explore the company profile for related openings and career updates.`,
 (company:string,role:string)=>`What makes a great ${role}? We value thoughtful work, clear communication and evidence of problem-solving. We'd love to hear how people across the industry approach this role.`,
 (company:string,role:string)=>`A highlight from ${company}: our colleagues have been sharing lessons from recent projects, better team collaboration and professional development. What would you like your next team to focus on?`,
 (company:string,role:string)=>`Hiring conversations should look beyond job titles. Our ${role} discussions focus on transferable skills, real examples and the environment in which someone does their best work.`,
 (company:string,role:string)=>`We have been exploring new ways to support career growth in our ${role} function. Training, mentorship and collaboration remain priorities for our team.`,
 (company:string,role:string)=>`A question for our professional network: which tools, experiences and learning opportunities help people succeed in ${role} roles? Share your perspective in the comments.`
 ];
const ADDITIONAL_SEED_POSTS:NetworkPost[]=Array.from({length:Math.max(0,500-ORIGINAL_SEED_POSTS.length)},(_,i)=>{
 const company=COMPANIES[(i*13+Math.floor(i/COMPANIES.length))%COMPANIES.length];
 const opening=OPPORTUNITIES.find(j=>j.companyId===company.id);
 const template=COMPANY_POST_TEMPLATES[i%COMPANY_POST_TEMPLATES.length];
 const day=(i*7+Math.floor(i/9))%170;
 const date=new Date(Date.UTC(2026,10,3-day,8+i%10,i%60));
 return {id:`company-post-${String(i+1).padStart(4,'0')}`,authorId:`org-author-${company.id}`,category:i%4===0?'Hiring update':i%4===1?'Company culture':i%4===2?'Industry discussion':'Professional development',body:template(company.name,opening?.title||company.sector),createdAt:date.toISOString(),image:i%3===0?`/network/covers/cover-${String(i%14+1).padStart(2,'0')}.svg`:'',likes:7+(i*17)%220,comments:[]};
});
export const SEED_POSTS:NetworkPost[]=[...ORIGINAL_SEED_POSTS,...ADDITIONAL_SEED_POSTS];
export const STORAGE_KEY='proofmatch-network-workspace-v2';
export function createWorkspace():WorkspaceState{return {applications:[],savedJobs:[],following:[],posts:SEED_POSTS,likedPosts:[],bookmarkedPosts:[],threads:SEED_THREADS,identity:'candidate'}}
export function loadWorkspace():WorkspaceState{
 const fresh=createWorkspace();
 if(typeof window==='undefined')return fresh;
 try{const raw=localStorage.getItem(STORAGE_KEY);if(!raw)return fresh;const data=JSON.parse(raw) as Partial<WorkspaceState>;
 return {...fresh,...data,applications:Array.isArray(data.applications)?data.applications.slice(0,250):[],savedJobs:Array.isArray(data.savedJobs)?data.savedJobs:[],following:Array.isArray(data.following)?data.following:[],posts:Array.isArray(data.posts)?(data.posts.length>=400?data.posts.slice(0,900):[...data.posts,...SEED_POSTS.filter(p=>!data.posts!.some(old=>old.id===p.id))].slice(0,900)):fresh.posts,likedPosts:Array.isArray(data.likedPosts)?data.likedPosts:[],bookmarkedPosts:Array.isArray(data.bookmarkedPosts)?data.bookmarkedPosts:[],threads:Array.isArray(data.threads)?data.threads.slice(0,120):fresh.threads,identity:data.identity==='recruiter'?'recruiter':'candidate'};
 }catch{return fresh}
}
export function saveWorkspace(data:WorkspaceState):boolean{
 if(typeof window==='undefined')return false;
 try{localStorage.setItem(STORAGE_KEY,JSON.stringify(data));window.dispatchEvent(new Event('proofmatch-workspace-updated'));return true}catch{return false}
}
export function networkPerson(id:string){return NETWORK_PEOPLE.find(p=>p.id===id)}
export const displayDate=(v:string)=>new Date(v).toLocaleDateString(undefined,{month:'short',day:'numeric'});
export const newId=(prefix:string)=>`${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
