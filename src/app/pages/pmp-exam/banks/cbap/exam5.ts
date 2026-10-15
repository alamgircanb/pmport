import {caseQs,examSet,qs} from '../authoring';
import {CBAP_D as D} from './domains';
import {CASES,CASE_A,CASE_B,CASE_C,P,E,L} from './exam5a';
import {S,R,V} from './exam5b';

export const CBAP_EXAM5=examSet(5,'Case studies: Smart meter billing · library digital services · supplier portal',
  [...qs('B5P',D.P,P),...qs('B5E',D.E,E),...qs('B5L',D.L,L),...qs('B5S',D.S,S),...qs('B5R',D.R,R),...qs('B5V',D.V,V)],
  CASES,[...caseQs('B5A',CASES[0].id,CASE_A),...caseQs('B5B',CASES[1].id,CASE_B),...caseQs('B5C',CASES[2].id,CASE_C)]);
