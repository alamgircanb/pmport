import {ExamSet} from '../../exam-types';
import {CASE_QUESTIONS,CASE_STUDIES} from './cases';
import {PEOPLE_QUESTIONS} from './people';
import {PROCESS_QUESTIONS} from './process';
import {BUSINESS_ENVIRONMENT_QUESTIONS} from './business-environment';

export const EXAM5:ExamSet={id:5,title:'Exam Simulator 5',subtitle:'Student information system · route-optimization platform · emergency department renovation',cases:CASE_STUDIES,caseQuestions:CASE_QUESTIONS,questions:[...PEOPLE_QUESTIONS,...PROCESS_QUESTIONS,...BUSINESS_ENVIRONMENT_QUESTIONS]};
