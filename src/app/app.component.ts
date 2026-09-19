import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface WorkItem {
  title: string;
  repositoryUrl?: string;
}

interface PortfolioArea {
  number: string;
  category: string;
  description: string;
  tools: string[];
  workItems: WorkItem[];
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

  // Add a repositoryUrl to any work item below. A GitHub link will then
  // appear automatically beside that project.
  readonly portfolioAreas: PortfolioArea[] = [
    {
      number: '01',
      category: 'Business Analysis, Data Analytics & Intelligence',
      description: 'Turning business needs and operational data into clear requirements, useful insights and decision-ready reporting.',
      tools: ['Business analysis', 'Power BI', 'Excel', 'SQL', 'Python'],
      workItems: [
        { title: 'Executive Power BI Dashboard', repositoryUrl: '' },
        { title: 'Wine Classification Model', repositoryUrl: '' },
        { title: 'Data Modelling and Cleaning', repositoryUrl: '' }
      ],
      image: 'power-bi-project-presentation.png',
      imageAlt: 'Alamgir presenting a project progress dashboard to his team'
    },
    {
      number: '02',
      category: 'IT & Systems Development',
      description: 'Designing and developing practical applications, APIs and connected systems using layered, maintainable approaches.',
      tools: ['.NET 9', 'REST APIs', 'Java', 'SQL'],
      workItems: [
        { title: 'Wide World Importers REST API', repositoryUrl: '' },
        { title: 'EyeMax Cinemas Web Application', repositoryUrl: '' },
        { title: 'Java Client–Server Application', repositoryUrl: '' }
      ]
    },
    {
      number: '03',
      category: 'Project, Program & Change Leadership',
      description: 'Aligning stakeholders, resources, risks and reporting so complex initiatives move from planning to measurable results.',
      tools: ['PMP', 'Agile', 'Waterfall', 'Stakeholders', 'Change'],
      workItems: [
        { title: 'Reporting Process Redesign', repositoryUrl: '' },
        { title: 'Multi-Partner Program Delivery', repositoryUrl: '' },
        { title: 'Stakeholder and Vendor Coordination', repositoryUrl: '' }
      ]
    },
    {
      number: '04',
      category: 'Academic Projects & Applied Learning',
      description: 'Applying Business Information Systems concepts through practical assignments that connect analysis, technology and business value.',
      tools: ['BIS', 'Systems analysis', 'Research', 'Teamwork'],
      workItems: [
        { title: 'Business Information Systems Coursework', repositoryUrl: '' },
        { title: 'Systems Analysis and Requirements Exercises', repositoryUrl: '' },
        { title: 'Technical Labs and Team Projects', repositoryUrl: '' }
      ]
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
