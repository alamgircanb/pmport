import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface WorkItem {
  title: string;
  repositoryUrl?: string;
  priority: number;
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
  id: string;
  title: string;
  description: string;
  embedUrl: SafeResourceUrl;
  youtubeUrl: string;
  thumbnailUrl: string;
}

interface ResourceItem {
  type: 'Book' | 'Article';
  title: string;
  description: string;
  repositoryUrl?: string;
}

interface EventItem {
  title: string;
  date: string;
  description: string;
  image: string;
  imageAlt: string;
  repositoryUrl?: string;
  priority: number;
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

  /*
   * YOUTUBE VIDEOS
   * ----------------
   * Add each video with this.video(...). The first video is selected in the
   * large player when the page opens. Visitors can select another video from
   * the list below the player.
   *
   * Example:
   * this.video('VIDEO_ID', 'Video title', 'Short description')
   *
   * VIDEO_ID is the part after youtube.com/watch?v= or youtu.be/.
   */
  readonly mediaVideos: MediaVideo[] = [
    // this.video('VIDEO_ID', 'My video title', 'A short description of the video.'),
    // this.video('ANOTHER_VIDEO_ID', 'My second video', 'A short description of the second video.'),
  ];
  selectedVideo: MediaVideo | undefined = this.mediaVideos[0];

  /*
   * PORTFOLIO CARDS
   * ----------------
   * 1. Put each portfolio image inside the public folder.
   * 2. Set image to that exact file name (for example: 'my-image.png').
   * 3. Replace each empty repositoryUrl with the matching GitHub repository.
   *    Empty links stay hidden, so placeholders never send visitors nowhere.
   * 4. Priority 1 appears first. Larger numbers move items lower. Lists scroll
   *    automatically after about five visible items.
   */
  readonly portfolioAreas: PortfolioArea[] = [
    {
      number: '01',
      category: 'Business Analysis, Data Analytics & Intelligence',
      description: 'Turning business needs and operational data into clear requirements, useful insights and decision-ready reporting.',
      tools: ['Business analysis', 'Power BI', 'Excel', 'SQL', 'Python'],
      workItems: [
        { title: 'Executive Power BI Dashboard', repositoryUrl: 'https://github.com/alamgircanb/Business-Analysis-Data-Analytics-Intelligence/tree/main/Final%20Project', priority: 1 },
        { title: 'Wine Classification Model', repositoryUrl: 'https://github.com/hossain8078/Machine-Learning-and-Deep-Learning/blob/main/Alamgir_BIS_Wine_Classification_EDA_and_RegressionModel.ipynb', priority: 2 },
        { title: 'Data Modelling and Cleaning (Regression with the Diabetes Dataset)', repositoryUrl: 'https://github.com/hossain8078/Machine-Learning-and-Deep-Learning/blob/main/Completed_Lab_Exercise_2_Diabetes_Regression.ipynb', priority: 3 }
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
        { title: 'Wide World Importers REST API', repositoryUrl: '', priority: 1 },
        { title: 'EyeMax Cinemas Web Application', repositoryUrl: '', priority: 2 },
        { title: 'Java Client–Server Application', repositoryUrl: '', priority: 3 }
      ],
      image: 'it-systems-development.png',
      imageAlt: 'Information technology and systems development project work'
    },
    {
      number: '03',
      category: 'Project, Program & Change Leadership',
      description: 'Aligning stakeholders, resources, risks and reporting so complex initiatives move from planning to measurable results.',
      tools: ['PMP', 'Agile', 'Waterfall', 'Stakeholders', 'Change'],
      workItems: [
        { title: 'Reporting Process Redesign', repositoryUrl: '', priority: 1 },
        { title: 'Multi-Partner Program Delivery', repositoryUrl: '', priority: 2 },
        { title: 'Stakeholder and Vendor Coordination', repositoryUrl: '', priority: 3 }
      ],
      image: 'pm_pg_leadership.png',
      imageAlt: 'Project, program and change leadership in a collaborative setting'
    },
    {
      number: '04',
      category: 'Academic Projects & Applied Learning',
      description: 'Applying Business Information Systems concepts through practical assignments that connect analysis, technology and business value.',
      tools: ['BIS', 'Systems analysis', 'Research', 'Teamwork'],
      workItems: [
        { title: 'Business Information Systems Coursework', repositoryUrl: '', priority: 1 },
        { title: 'Systems Analysis and Requirements Exercises', repositoryUrl: '', priority: 2 },
        { title: 'Technical Labs and Team Projects', repositoryUrl: '', priority: 3 }
      ],
      image: 'aca_pro_al.png',
      imageAlt: 'Md Alamgir Hossain representing academic projects and applied learning'
    }
  ];

  /*
   * EVENTS & PHOTO GALLERY
   * ----------------------
   * Put event photos in public/ and use the exact file name below. Add a short
   * paragraph and paste the event's GitHub folder or repository URL.
   * Priority 1 is highest. The first four items become the featured cards;
   * every additional item moves into the scrollable archive automatically.
   */
  readonly eventItems: EventItem[] = [
    { title: 'Recent event title one', date: 'Month Year', description: 'content comming soon.', image: 'picture place holder', imageAlt: 'Replace with a description of event photo one', repositoryUrl: '', priority: 1 },
    { title: 'Recent event title two', date: 'Month Year', description: 'content coming soon', image: 'picture placeholder', imageAlt: 'Replace with a description of event photo two', repositoryUrl: '', priority: 2 },
    { title: 'Recent event title three', date: 'Month Year', description: 'content coming soon', image: 'picture placeholder', imageAlt: 'Replace with a description of event photo three', repositoryUrl: '', priority: 3 },
    { title: 'Recent event title four', date: 'Month Year', description: 'content coming soon.', image: 'picture placeholder', imageAlt: 'Replace with a description of event photo four', repositoryUrl: '', priority: 4 },
    // Add a fifth item here; it will appear in the scrollable event archive.
    // { title: 'Older event', date: 'Month Year', description: 'Short paragraph.', image: 'event-05.jpg', imageAlt: 'Event photo description', repositoryUrl: 'https://github.com/hossain8078/REPOSITORY', priority: 5 },
  ];

  get featuredEvents(): EventItem[] {
    return this.sortedByPriority(this.eventItems).slice(0, 4);
  }

  get archivedEvents(): EventItem[] {
    return this.sortedByPriority(this.eventItems).slice(4);
  }

  /*
   * BOOKS & ARTICLES
   * ----------------
   * Use this section to publish useful material and attract visitors from
   * search, LinkedIn and GitHub. Upload the file/source to GitHub, then place
   * its repository or file URL in repositoryUrl.
   */
  readonly resources: ResourceItem[] = [
    {
      type: 'Book',
      title: 'Book title placeholder',
      description: 'Add a short description explaining what readers will learn.',
      repositoryUrl: ''
    },
    {
      type: 'Article',
      title: 'Article title placeholder',
      description: 'Add a short, keyword-rich summary of the article.',
      repositoryUrl: ''
    }
  ];

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  selectVideo(video: MediaVideo): void {
    this.selectedVideo = video;
  }

  sortedWorkItems(items: WorkItem[]): WorkItem[] {
    return this.sortedByPriority(items);
  }

  private sortedByPriority<T extends { priority: number }>(items: T[]): T[] {
    return [...items].sort((a, b) => a.priority - b.priority);
  }

  private video(id: string, title: string, description: string): MediaVideo {
    return {
      id,
      title,
      description,
      youtubeUrl: `https://www.youtube.com/watch?v=${id}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      embedUrl: this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube-nocookie.com/embed/${id}`)
    };
  }
}
