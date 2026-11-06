export type PanelSpeaker={id:string;name:string;role:string;color:string;voicePitch:number};
export type PanelLine={speaker:string;text:string};
export type PanelEpisode={id:string;title:string;subtitle:string;length:string;topic:string;lines:PanelLine[]};
export const PANEL_SPEAKERS:PanelSpeaker[]=[
 {id:'maya',name:'Maya Chen',role:'Moderator · Career Futures',color:'#7dd3fc',voicePitch:1.14},
 {id:'aisha',name:'Aisha Rahman',role:'Talent Acquisition Lead',color:'#d6bbfb',voicePitch:1.25},
 {id:'daniel',name:'Daniel Lee',role:'Future of Work Researcher',color:'#a7f3d0',voicePitch:.94},
 {id:'priya',name:'Priya Nair',role:'Early-Career Mentor',color:'#fdba74',voicePitch:1.07},
];
export const PANEL_EPISODES:PanelEpisode[]=[
{id:'future',title:'The Future of Careers',subtitle:'AI, emerging roles and the skills that travel across industries.',length:'8 min conversation',topic:'Future of Work',lines:[
 {speaker:'maya',text:'Welcome to Career Forward. Today we are asking a question that concerns almost every graduate: how do you prepare for jobs that are changing faster than job titles?'},
 {speaker:'daniel',text:'I would begin by separating tasks from titles. Technology may automate parts of a job without removing the whole profession. Look at the tasks that still need judgment, people skills and accountability.'},
 {speaker:'aisha',text:'Recruiters increasingly want evidence. If someone tells me they can analyze data, I ask what they actually analyzed, how they worked with it and what decision followed.'},
 {speaker:'priya',text:'And that evidence can come from student projects, volunteering and part-time work. You do not need a famous company on your CV to show a useful contribution.'},
 {speaker:'maya',text:'So how should someone choose a skill to learn next? There is an overwhelming number of online courses.'},
 {speaker:'daniel',text:'Find three real job descriptions that interest you. Compare their recurring requirements, then choose one skill you can practise in a small measurable project.'},
 {speaker:'aisha',text:'Also watch the working conditions. A strong match needs agreement about location, salary expectations, schedule and the responsibilities themselves.'},
 {speaker:'priya',text:'I encourage people to document their learning. What problem did you face, what did you try, what did you change, and what happened next? That story belongs in your portfolio.'},
 {speaker:'maya',text:'What about candidates applying for the wrong role? Can a rejection become an opportunity?'},
 {speaker:'aisha',text:'Absolutely. A person applying for software engineering might have stronger demonstrated strengths in quality assurance or business analysis. A thoughtful recruiter can explore alternative roles rather than ending the conversation.'},
 {speaker:'daniel',text:'It is important that AI assists with this process rather than making final decisions. Evidence may be incomplete or inaccurate, and a person should be able to clarify it.'},
 {speaker:'priya',text:'The best career preparation is not chasing one perfect title. It is building transferable strengths, demonstrating them responsibly, and staying curious.'},
 {speaker:'maya',text:'That is our takeaway: from a single application to more possibilities. Thanks to all our panelists for joining Career Forward.'},
]},
{id:'recruitment',title:'Beyond the CV: Smarter Hiring',subtitle:'Discover hidden talent, evaluate evidence and refer candidates responsibly.',length:'7 min conversation',topic:'Talent & Recruitment',lines:[
 {speaker:'maya',text:'Today we are talking about a familiar hiring problem: great candidates overlooked because they did not use the right words on their CV.'},
 {speaker:'aisha',text:'Keyword matching is a useful first search aid, but a résumé is not a full measure of ability. We need to inspect work samples, project contributions and job-relevant experience.'},
 {speaker:'daniel',text:'It also helps to distinguish a claimed skill from an inspectable artifact. A quote from a CV can support that a candidate mentioned a skill, not prove they mastered it.'},
 {speaker:'priya',text:'Graduates often have relevant evidence they do not recognize. They might have managed a student budget, coordinated volunteers or prepared a detailed research report.'},
 {speaker:'maya',text:'What happens when they miss the requirements for the position they originally applied for?'},
 {speaker:'aisha',text:'First check whether another vacancy at the same organization aligns better. Be transparent about what evidence supports the recommendation and where gaps remain.'},
 {speaker:'daniel',text:'Cross-company referrals are another idea, but company connections alone are not sufficient. A candidate should approve sharing information with the particular receiving organization.'},
 {speaker:'priya',text:'And a mismatch does not mean the person lacks value. It simply means their documented evidence does not align closely with that vacancy at this time.'},
 {speaker:'maya',text:'What would you advise recruiters implementing AI ranking?'},
 {speaker:'aisha',text:'Keep people accountable for hiring decisions. Make the criteria job-relevant, invite corrections and do not let a numerical score become a substitute for reading the evidence.'},
 {speaker:'daniel',text:'Track the quality of recommendations and the outcomes of consent-based referrals, not only the number of automated scores produced.'},
 {speaker:'maya',text:'Fairness, evidence and human oversight: a much better starting point for meaningful matching. Thanks for listening.'},
]},
{id:'first-job',title:'Your First Job, Your First Impression',subtitle:'Practical CV, interview and networking advice for early-career talent.',length:'6 min conversation',topic:'Early Careers',lines:[
 {speaker:'maya',text:'Welcome back. What is one thing graduates misunderstand about writing their first CV?'},
 {speaker:'priya',text:'They think they have no experience. But experience includes relevant projects, internships, volunteering and real responsibilities. The goal is to describe those honestly and specifically.'},
 {speaker:'aisha',text:'Recruiters want clarity. Start with a readable layout, a targeted summary and bullets that explain actions and results rather than lists of adjectives.'},
 {speaker:'daniel',text:'And make the PDF readable. Complex layouts and text embedded in images can make automated extraction fail.'},
 {speaker:'maya',text:'Let us move to interview preparation. What does a strong answer sound like?'},
 {speaker:'aisha',text:'It addresses the question, gives a concrete example and explains what the person learned. STAR is one useful structure: situation, task, action and result.'},
 {speaker:'priya',text:'Practise out loud, but do not memorize a script so rigidly that you stop listening. Ask clarifying questions when you need to.'},
 {speaker:'daniel',text:'In video interviews, test the microphone and camera, close unnecessary tabs and prepare any slides before the call.'},
 {speaker:'maya',text:'What should someone do if they have a skill gap?'},
 {speaker:'priya',text:'Be honest about it. Identify a manageable learning step and find a way to demonstrate progress in a small project or assessment.'},
 {speaker:'aisha',text:'And remember it is a two-way conversation. Ask how the team works and what success looks like in the role.'},
 {speaker:'maya',text:'Great advice. Start with evidence, communicate clearly and look for a role that works for both sides.'},
]}
];
