import { Component } from '@angular/core';

interface Project {
  title: string;
  category: string;
  description: string;
  tools: string[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  readonly year = new Date().getFullYear();
  menuOpen = false;

  readonly projects: Project[] = [
    {
      title: 'Executive Power BI Dashboard',
      category: 'Business Intelligence',
      description: 'Cleaned, modelled and visualized operational data to turn detailed records into decision-ready performance insights.',
      tools: ['Power BI', 'Data modelling', 'Excel']
    },
    {
      title: 'Wide World Importers REST API',
      category: 'Application Development',
      description: 'Developed a layered .NET REST API using controllers, services, repositories, DTOs and asynchronous data access.',
      tools: ['.NET 9', 'REST', 'SQL']
    },
    {
      title: 'Wine Classification Model',
      category: 'Data & Machine Learning',
      description: 'Prepared data and trained a decision-tree model to classify wine observations and evaluate predictive performance.',
      tools: ['Python', 'Decision Tree', 'Data preparation']
    },
    {
      title: 'Reporting Process Redesign',
      category: 'Project & Process Improvement',
      description: 'Led requirements alignment and reporting redesign across stakeholders, shortening the reporting cycle by approximately two weeks.',
      tools: ['Requirements', 'Stakeholders', 'Process improvement']
    }
  ];

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }
}
