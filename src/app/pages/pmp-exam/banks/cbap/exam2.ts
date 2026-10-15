import {caseQs,examSet,qs} from '../authoring';
import {CBAP_D as D} from './domains';
import {CASES,CASE_A,CASE_B,CASE_C,P,E,L} from './exam2a';
import {S,R,V} from './exam2b';

export const CBAP_EXAM2=examSet(2,'Case studies: Utility work orders · university enrolment · warehouse automation',
  [...qs('B2P',D.P,P),...qs('B2E',D.E,E),...qs('B2L',D.L,L),...qs('B2S',D.S,S),...qs('B2R',D.R,R),...qs('B2V',D.V,V)],
  CASES,[...caseQs('B2A',CASES[0].id,CASE_A),...caseQs('B2B',CASES[1].id,CASE_B),...caseQs('B2C',CASES[2].id,CASE_C)]);
