import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ExamGraphicComponent} from './exam-graphic.component';
import {ExamSimulatorBase} from './exam-simulator.base';
import {ITIL_PROGRAM} from './programs/itil-program';

@Component({standalone:true,selector:'app-itil-exam',imports:[RouterLink,ExamGraphicComponent],templateUrl:'./pmp-exam.component.html',styleUrl:'./pmp-exam.component.css'})
export class ItilExamComponent extends ExamSimulatorBase{constructor(){super(ITIL_PROGRAM)}}
