import {caseQs,examSet,qs} from '../authoring';
import {CBAP_D as D} from './domains';
import {CASES,CASE_A,CASE_B,CASE_C,P,E,L} from './exam4a';
import {S,R,V} from './exam4b';

export const CBAP_EXAM4=examSet(4,'Case studies: Commercial lending · airline crew rostering · online benefits',
  [...qs('B4P',D.P,P),...qs('B4E',D.E,E),...qs('B4L',D.L,L),...qs('B4S',D.S,S),...qs('B4R',D.R,R),...qs('B4V',D.V,V)],
  CASES,[...caseQs('B4A',CASES[0].id,CASE_A),...caseQs('B4B',CASES[1].id,CASE_B),...caseQs('B4C',CASES[2].id,CASE_C)]);
