import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ExamGraphicComponent} from './exam-graphic.component';
import {PageFaqComponent} from '../../core/seo/page-faq.component';
import {ExamSimulatorBase} from './exam-simulator.base';
import {RMP_PROGRAM} from './programs/rmp-program';

@Component({standalone:true,selector:'app-rmp-exam',imports:[RouterLink,ExamGraphicComponent,PageFaqComponent],templateUrl:'./pmp-exam.component.html',styleUrl:'./pmp-exam.component.css'})
export class RmpExamComponent extends ExamSimulatorBase{constructor(){super(RMP_PROGRAM)}}
