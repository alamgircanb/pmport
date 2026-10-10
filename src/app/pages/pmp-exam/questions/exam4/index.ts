import {ExamSet} from '../../exam-types';
import {CASE_QUESTIONS,CASE_STUDIES} from './cases';
import {PEOPLE_QUESTIONS} from './people';
import {PROCESS_QUESTIONS} from './process';
import {BUSINESS_ENVIRONMENT_QUESTIONS} from './business-environment';

export const EXAM4:ExamSet={id:4,title:'Exam Simulator 4',subtitle:'Airport terminal expansion · claims automation with AI · water treatment plant',cases:CASE_STUDIES,caseQuestions:CASE_QUESTIONS,questions:[...PEOPLE_QUESTIONS,...PROCESS_QUESTIONS,...BUSINESS_ENVIRONMENT_QUESTIONS]};
