import type {Company} from './career-catalog';
/** Licensed Unsplash editorial workplace photos. These illustrate sectors; they are NOT photographs of the fictional companies. */
const sources=[
 'photo-1497366811353-6870744d04b2','photo-1521737711867-e3b97375f902','photo-1497366754035-f200968a6e72','photo-1524758631624-e2822e304c36',
 'photo-1531482615713-2afd69097998','photo-1497366858526-0766cadbe8fa','photo-1556761175-b413da4baf72','photo-1542744173-8e7e53415bb0',
 'photo-1552664730-d307ca884978','photo-1576091160399-112ba8d25d1d','photo-1494412519320-aa613dfb7738','photo-1503387762-592deb58ef4e',
 'photo-1486406146926-c627a92ad1ab','photo-1517245386807-bb43f82c33c4','photo-1487958449943-2429e8be8625','photo-1520607162513-77705c0f0d4a',
 'photo-1516321318423-f06f85e504b3','photo-1460925895917-afdab827c52f','photo-1497366216548-37526070297c','photo-1504384308090-c894fdcc538d'
];
export function companyPhoto(company:Pick<Company,'id'|'sector'|'image'>):string{
 const bySector:Record<string,number>={'Healthcare & Wellness':9,'Education & Training':15,'Engineering & Construction':11,'Hospitality & Tourism':13,'Logistics & Manufacturing':10,'Agriculture & Sustainability':14,'Finance & Accounting':17,'Creative & Design':8,'Technology':0,'Banking & Insurance':17,'Business & Management':6};
 let index=bySector[company.sector];if(index===undefined){index=[...company.id].reduce((sum,ch)=>sum+ch.charCodeAt(0),0)%sources.length;}else index=(index+(Math.abs(company.image)%3))%sources.length;
 return `https://images.unsplash.com/${sources[index]}?auto=format&fit=crop&w=1120&q=76`;
}
export function companyPhotoCredits(){return 'Unsplash workplace editorial photography; images illustrate industries and do not depict the fictional employers represented in ProofMatch AI.'}
