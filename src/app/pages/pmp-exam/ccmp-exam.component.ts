import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ExamGraphicComponent} from './exam-graphic.component';
import {PageFaqComponent} from '../../core/seo/page-faq.component';
import {ExamSimulatorBase} from './exam-simulator.base';
import {CCMP_PROGRAM} from './programs/ccmp-program';

@Component({standalone:true,selector:'app-ccmp-exam',imports:[RouterLink,ExamGraphicComponent,PageFaqComponent],templateUrl:'./pmp-exam.component.html',styleUrl:'./pmp-exam.component.css'})
export class CcmpExamComponent extends ExamSimulatorBase{constructor(){super(CCMP_PROGRAM)}}
