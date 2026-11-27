import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ExamGraphicComponent} from './exam-graphic.component';
import {PageFaqComponent} from '../../core/seo/page-faq.component';
import {ExamSimulatorBase} from './exam-simulator.base';
import {PL300_PROGRAM} from './programs/pl300-program';

@Component({standalone:true,selector:'app-pl300-exam',imports:[RouterLink,ExamGraphicComponent,PageFaqComponent],templateUrl:'./pmp-exam.component.html',styleUrl:'./pmp-exam.component.css'})
export class Pl300ExamComponent extends ExamSimulatorBase{constructor(){super(PL300_PROGRAM)}}
