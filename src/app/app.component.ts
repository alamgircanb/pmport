import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Project {
  title: string;
  category: string;
  description: string;
  tools: string[];
  image?: string;
  imageAlt?: string;
}

interface MediaVideo {
  title: string;
  description: string;
  embedUrl: SafeResourceUrl;
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private readonly sanitizer = inject(DomSanitizer);
  readonly year = new Date().getFullYear();
  menuOpen = false;

  // Add your public YouTube channel address here when it is ready.
  readonly youtubeChannelUrl = '';

  // To add a video, copy this object and replace VIDEO_ID with the part after
  // youtube.com/watch?v= or youtu.be/ in your video's address.
  readonly mediaVideos: MediaVideo[] = [
    // {
    //   title: 'My video title',
    //   description: 'A short description of the video.',
    //   embedUrl: this.youtubeEmbed('VIDEO_ID')
    // }
  ];

  readonly projects: Project[] = [
    {
      title: 'Executive Power BI Dashboard',
      category: 'Business Intelligence',
      description: 'Cleaned, modelled and visualized operational data to turn detailed records into decision-ready performance insights.',
      tools: ['Power BI', 'Data modelling', 'Excel'],
      image: 'power-bi-project-presentation.png',
      imageAlt: 'Alamgir presenting a project progress dashboard to his team'
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

  private youtubeEmbed(videoId: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube-nocookie.com/embed/${videoId}`);
  }
}
