import {caseQs,examSet,qs} from '../authoring';
import {CBAP_D as D} from './domains';
import {CASES,CASE_A,CASE_B,CASE_C,P,E,L} from './exam1a';
import {S,R,V} from './exam1b';

export const CBAP_EXAM1=examSet(1,'Case studies: Insurance claims · patient scheduling · retail loyalty',
  [...qs('B1P',D.P,P),...qs('B1E',D.E,E),...qs('B1L',D.L,L),...qs('B1S',D.S,S),...qs('B1R',D.R,R),...qs('B1V',D.V,V)],
  CASES,[...caseQs('B1A',CASES[0].id,CASE_A),...caseQs('B1B',CASES[1].id,CASE_B),...caseQs('B1C',CASES[2].id,CASE_C)]);
