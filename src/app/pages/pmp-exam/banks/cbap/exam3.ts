import {caseQs,examSet,qs} from '../authoring';
import {CBAP_D as D} from './domains';
import {CASES,CASE_A,CASE_B,CASE_C,P,E,L} from './exam3a';
import {S,R,V} from './exam3b';

export const CBAP_EXAM3=examSet(3,'Case studies: Building permits · clinical trial data · telecom churn',
  [...qs('B3P',D.P,P),...qs('B3E',D.E,E),...qs('B3L',D.L,L),...qs('B3S',D.S,S),...qs('B3R',D.R,R),...qs('B3V',D.V,V)],
  CASES,[...caseQs('B3A',CASES[0].id,CASE_A),...caseQs('B3B',CASES[1].id,CASE_B),...caseQs('B3C',CASES[2].id,CASE_C)]);
