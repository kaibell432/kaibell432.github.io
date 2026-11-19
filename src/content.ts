import {
  ArchiveIcon,
  BarChartIcon,
  CheckCircledIcon,
  Component1Icon,
  Crosshair2Icon,
  GlobeIcon,
  IdCardIcon,
  MagicWandIcon,
  ReaderIcon,
  SewingPinFilledIcon,
  TargetIcon,
} from '@radix-ui/react-icons';

/**
 * Everything the site says about Kai lives in this file.
 * Edit here; the components only handle layout.
 */

type Icon = typeof GlobeIcon;

export const profile = {
  name: 'Kai Bell',
  role: 'Associate Technical Professional',
  company: 'KBR',
  division: 'National Security Solutions',
  location: 'Washington, DC area',
  email: 'kaibell241@gmail.com',
  github: 'https://github.com/kaibell432',
  linkedin: 'https://www.linkedin.com/in/kai-bell',
  /**
   * Path to the résumé PDF in /public. Set to null to hide the Résumé buttons.
   */
  resumeUrl: '/KaiBellResume.pdf' as string | null,
};

/** Map-legend symbols. The hero's facts strip is the key; the same symbol marks that fact further down the page. */
export const legend = {
  now: IdCardIcon,
  certified: CheckCircledIcon,
  studied: ReaderIcon,
  based: SewingPinFilledIcon,
};

export const facts = [
  { label: 'Now', value: 'KBR · National Security Solutions', icon: legend.now },
  { label: 'Certified', value: 'AWS Solutions Architect – Associate', icon: legend.certified },
  { label: 'Studied', value: 'Computer Science, UVA ’24', icon: legend.studied },
  { label: 'Based', value: 'Washington, DC area', icon: legend.based },
];

export const about = {
  title: 'From labeling the data to building the tools.',
  paragraphs: [
    'I studied computer science at the University of Virginia and graduated in 2024. I gravitated toward the places where software meets data: R and Python for analysis, Django and Node for the web, and a machine-learning project that predicted wildfire size from 1.88 million U.S. fire records.',
    'My first role after school was at Enabled Intelligence, labeling geospatial imagery, full-motion video, and SAR data used to train AI models for government programs. I moved into quality control, where the job was finding the patterns behind annotation errors and turning them into better guidelines and training, not just fixing individual labels.',
    'Now I’m an Associate Technical Professional at KBR, working alongside a team of systems engineers. My part is the software: React apps that sit on top of SharePoint and high-volume geospatial data sources, with AI built in to streamline analysis.',
  ],
  focus: [
    {
      icon: Component1Icon,
      title: 'React front ends',
      body: 'Two apps at KBR so far, one on Base UI and one on Fluent UI.',
    },
    {
      icon: GlobeIcon,
      title: 'Geospatial data',
      body: 'Imagery, FMV, and SAR, from annotation and QC to analysis tooling.',
    },
    {
      icon: MagicWandIcon,
      title: 'AI in the workflow',
      body: 'Building AI into tools so large datasets are faster to work through.',
    },
    {
      icon: TargetIcon,
      title: 'Data quality',
      body: 'An eye for the small errors that quietly degrade training data.',
    },
  ],
  hobbies: ['Soccer (and most other sports)', 'Gaming', 'Film', 'Animation'],
};

export type Role = {
  title: string;
  start: string;
  end: string;
  bullets: string[];
};

export type Job = {
  company: string;
  detail?: string;
  location?: string;
  current?: boolean;
  roles: Role[];
  stack?: string[];
};

export const experience: Job[] = [
  {
    company: 'KBR, Inc.',
    detail: 'National Security Solutions',
    current: true,
    roles: [
      {
        title: 'Associate Technical Professional',
        start: 'Aug 2026',
        end: 'Present',
        bullets: [
          'Built a React front end for a high-volume geospatial data source API that uses AI to streamline analysis, composed from Base UI components and styled with Tailwind CSS.',
          'Built a data repository interface in React and Fluent UI that integrates with SharePoint’s API.',
          'Work alongside systems engineering teams supporting national security programs.',
        ],
      },
    ],
    stack: ['React', 'Base UI', 'Tailwind CSS', 'Fluent UI', 'SharePoint API', 'AI'],
  },
  {
    company: 'Enabled Intelligence, Inc.',
    location: 'Falls Church, VA',
    roles: [
      {
        title: 'Quality Control Analyst',
        start: 'Apr 2026',
        end: 'Aug 2026',
        bullets: [
          'Audited geospatial annotations from a large annotation team against project guidelines, keeping training data accurate and consistent for government AI/ML programs.',
          'Analyzed recurring error patterns across annotation batches to surface systemic issues, giving annotators targeted feedback that reduced downstream rework.',
          'Worked with QA and training teams to turn error trends into updated guidelines and training materials.',
        ],
      },
      {
        title: 'Geospatial AI Data Annotator',
        start: 'Nov 2025',
        end: 'Apr 2026',
        bullets: [
          'Labeled and categorized large geospatial datasets (imagery, full-motion video, and synthetic aperture radar) used to train AI/ML models for U.S. Government programs.',
          'Worked with data scientists, data engineers, and project managers to improve labeling workflows and give feedback on platform enhancements.',
          'Followed strict security and data-handling requirements for national security work.',
        ],
      },
    ],
    stack: ['Imagery', 'FMV', 'SAR', 'AI/ML training data', 'Quality control'],
  },
];

export type ProjectLink = { label: string; href: string };

export type Project = {
  id: string;
  title: string;
  context: string;
  year?: string;
  icon: Icon;
  kind: 'work' | 'personal' | 'academic';
  summary: string;
  details: string[];
  stack: string[];
  links?: ProjectLink[];
  note?: string;
};

const INTERNAL_NOTE = 'Built for internal use at KBR, so there’s no public demo or source code.';

export const projects: Project[] = [
  {
    id: 'geospatial-analysis',
    title: 'Geospatial analysis app',
    context: 'KBR · Internal',
    year: '2026',
    icon: GlobeIcon,
    kind: 'work',
    summary:
      'A React front end over a high-volume geospatial data source API, with AI built in to streamline analysis.',
    details: [
      'Front end built in React, composed from Base UI’s unstyled components and styled with Tailwind CSS.',
      'Pulls from a large-volume geospatial data source API.',
      'Uses AI to streamline analysis of the data it returns.',
    ],
    stack: ['React', 'Base UI', 'Tailwind CSS', 'Geospatial API', 'AI'],
    note: INTERNAL_NOTE,
  },
  {
    id: 'data-repository',
    title: 'Data repository UI',
    context: 'KBR · Internal',
    year: '2026',
    icon: ArchiveIcon,
    kind: 'work',
    summary: 'A React and Fluent UI interface for a data repository, built on top of SharePoint’s API.',
    details: [
      'React front end built with Microsoft’s Fluent UI component library.',
      'Integrates with SharePoint’s API as the backing data store.',
    ],
    stack: ['React', 'Fluent UI', 'SharePoint API'],
    note: INTERNAL_NOTE,
  },
  {
    id: 'meal-planner',
    title: 'AI meal planner',
    context: 'Personal project',
    year: '2024',
    icon: MagicWandIcon,
    kind: 'personal',
    summary:
      'A full-stack web app that generates personalized meal plans and dietary suggestions with AI.',
    details: [
      'Prompts an AI model to return meal plans as JSON, with parsing and error correction so malformed output doesn’t break the app.',
      'React front end, with a Node.js and Express back end serving RESTful endpoints and MongoDB Atlas for storage.',
      'Refactored for performance and iterated on prompts to make the AI’s output more reliable.',
      'Next up: Google sign-in for user accounts and a recipe API for linking to full recipes.',
    ],
    stack: ['React', 'Node.js', 'Express', 'MongoDB Atlas', 'AI'],
    links: [
      { label: 'Live app', href: 'https://aiweightloss.onrender.com/' },
      { label: 'Source', href: 'https://github.com/kaibell432/AIWeightloss' },
    ],
  },
  {
    id: 'wildfire',
    title: 'Predicting U.S. wildfire size',
    context: 'UVA · 5-person team',
    icon: Crosshair2Icon,
    kind: 'academic',
    summary:
      'Machine-learning models that predict wildfire size and locate state-level fire hotspots, trained on 1.88 million U.S. fire records.',
    details: [
      'Used the U.S. Forest Service’s “1.88 Million US Wildfires” dataset, covering 1992 to 2015.',
      'Cleaned the data and engineered features, including one-hot encoding for categorical fields.',
      'Compared logistic regression, decision trees, random forests, k-nearest neighbors, and multi-layer perceptrons. Random forest scored best at 64% accuracy, with hardware as the main limit.',
      'Applied k-means clustering to find wildfire center points within each state, to support fire management and prevention planning.',
      'Wrote up our methods and results as a team paper.',
    ],
    stack: ['Machine learning', 'Random forest', 'k-means', 'Feature engineering'],
    links: [
      {
        label: 'Paper (LinkedIn)',
        href: 'https://www.linkedin.com/in/kai-bell/details/projects/1716742522077/single-media-viewer/?profileId=ACoAADiqiWcBjqYm5wM1tVAAG15PkXcuuAWf1f4',
      },
      { label: 'Dataset', href: 'https://www.kaggle.com/datasets/rtatman/188-million-us-wildfires/' },
    ],
  },
  {
    id: 'ski-hotels',
    title: 'Ski hotel value analysis',
    context: 'UVA · STAT 1601 · 2-person team',
    icon: BarChartIcon,
    kind: 'academic',
    summary:
      'An R analysis that ranks ski hotels by value, weighing price against total slope length and distance to the nearest slope.',
    details: [
      'Cleaned and reshaped a Kaggle dataset of ski hotels in R.',
      'Ranked hotels on value metrics including price, total slope length, and distance to the nearest slope.',
      'Presented the findings through visualizations and a detailed written report.',
    ],
    stack: ['R', 'Data cleaning', 'Data visualization'],
    links: [
      { label: 'Report (PDF)', href: '/ski-hotel-analysis.pdf' },
      { label: 'Dataset', href: 'https://www.kaggle.com/datasets/jacklacey/skiing-hotels' },
    ],
  },
];

export const skills = [
  {
    group: 'Languages',
    items: ['JavaScript', 'Python', 'Java', 'SQL', 'R', 'C++', 'HTML / CSS'],
  },
  {
    group: 'Front end',
    items: ['React', 'Base UI', 'Fluent UI', 'Tailwind CSS', 'Bootstrap', 'Semantic UI'],
  },
  {
    group: 'Back end & data',
    items: ['Node.js', 'Express', 'Django', 'MongoDB', 'SharePoint API', 'Power BI'],
  },
  {
    group: 'Cloud & tools',
    items: ['AWS', 'Docker', 'Git', 'VS Code', 'Agile / Scrum', 'Photoshop', 'Microsoft Office'],
  },
];

export const certification = {
  name: 'AWS Certified Solutions Architect – Associate',
  code: 'SAA-C03',
  issuer: 'Amazon Web Services',
  issued: 'Sep 2025',
  expires: 'Sep 2028',
  description:
    'Designing resilient, high-performing, secure, and cost-efficient architectures on AWS across networking, storage, compute, and databases.',
  url: 'https://www.credly.com/badges/bdd20590-7eaa-449c-8045-6b38928faed1',
};

export const education = {
  school: 'University of Virginia',
  degree: 'B.A. in Computer Science',
  location: 'Charlottesville, VA',
  graduated: 'May 2024',
  coursework: [
    'Data Structures & Algorithms',
    'Software Development Methods',
    'Advanced Software Development',
    'Internet Scale Applications',
    'Artificial Intelligence',
    'Intro to Data Science with R',
    'Computer Architecture',
    'Program & Data Representation',
    'Intro to Cybersecurity',
    'Engineering Interactive Technologies',
    'Discrete Math',
    'Statistics for Biologists (R)',
    'R Applications in Psychology',
  ],
  highlights: [
    {
      course: 'Advanced Software Development',
      bullets: [
        'Semester-long Django web app built by a team using Scrum, from requirements and design through implementation and maintenance.',
        'Led project planning, scheduling, resource management, and documentation.',
      ],
    },
    {
      course: 'Internet Scale Applications',
      bullets: [
        'Methods for building large-scale websites: performance engineering, scaling, security, and large-team engineering.',
        'Built small scalable web apps with HTML/CSS, JavaScript, Node.js, MongoDB, Docker, Apache, and Git.',
      ],
    },
  ],
};
