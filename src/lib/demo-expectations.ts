/** Fictional, clearly labeled salary context for the recruiter demo.
 * This must NEVER be presented as a market salary estimate or used as an automatic rejection rule.
 */
export type SalaryRange={min:number;max:number};
export const exampleCandidateSalary:Record<string,SalaryRange>={
 C01:{min:3800,max:5200},C02:{min:4800,max:6400},C03:{min:4800,max:6500},
 C04:{min:3500,max:4700},C05:{min:4900,max:5900},C06:{min:4200,max:5700},
 C07:{min:4700,max:6000},C08:{min:6900,max:8200},
};
export const exampleRoleSalary:Record<string,SalaryRange>={
 frontend:{min:4000,max:5800},qa:{min:4200,max:5600},analyst:{min:4400,max:6100},
};
export function compareExampleSalary(candidateId:string,roleId:string){
 const candidate=exampleCandidateSalary[candidateId],company=exampleRoleSalary[roleId];
 if(!candidate||!company)return null;
 const overlap=candidate.min<=company.max&&company.min<=candidate.max;
 return {candidate,company,overlap,discussion:overlap?'These example salary ranges overlap. Confirm the actual offer and candidate expectations.':'These example salary ranges do not overlap. Ask both sides whether there is flexibility before taking any further step.'};
}
export const formatDemoRM=(amount:number)=>`RM ${amount.toLocaleString('en-MY')}`;
