import type { TeamMember, Vehicle, Team, Magnet, Container, GenericBoardData } from '@/lib/mrt/types';
import { INITIAL_TEAM_MEMBERS, INITIAL_VEHICLES, INITIAL_TEAMS } from '@/lib/mrt/data';

export type BoardData = {
  teamMembers: TeamMember[];
  vehicles: Vehicle[];
  teams: Team[];
}

export const ALL_BOARDS = [
    { id: 'mrt-board', name: 'MRT Board', type: 'mrt' },
    { id: 'inspiration', name: 'Inspiration', type: 'inspiration' },
    { id: 'personal', name: 'Personal', type: 'personal' },
    { id: 'work', name: 'Work', type: 'work' },
];

export const BOARDS_DATA: Record<string, BoardData> = {
  'mrt-board': {
    teamMembers: INITIAL_TEAM_MEMBERS,
    vehicles: INITIAL_VEHICLES,
    teams: INITIAL_TEAMS,
  },
  'inspiration': {
    teamMembers: [],
    vehicles: [],
    teams: [],
  },
  'personal': {
    teamMembers: [],
    vehicles: [],
    teams: [],
  },
  'work': {
    teamMembers: [],
    vehicles: [],
    teams: [],
  }
};

// Generic Board Data for different board types
export const GENERIC_BOARDS_DATA: Record<string, GenericBoardData> = {
  'inspiration': {
    magnets: [
      {
        id: 'mag-1',
        type: 'idea',
        title: 'New App Concept',
        content: 'A mobile app for local community events',
        color: '#4CAF50',
        tags: ['mobile', 'community'],
        position: { x: 100, y: 100 },
        width: 200,
        height: 120,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mag-2',
        type: 'note',
        title: 'Design Inspiration',
        content: 'Minimalist design with bold typography',
        color: '#2196F3',
        tags: ['design', 'inspiration'],
        position: { x: 350, y: 150 },
        width: 180,
        height: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
    containers: [
      {
        id: 'cat-ideas',
        name: 'Ideas',
        type: 'category',
        color: '#FF9800',
        position: { x: 50, y: 300 },
        width: 250,
        height: 200,
        magnets: ['mag-1']
      },
      {
        id: 'cat-design',
        name: 'Design',
        type: 'category',
        color: '#9C27B0',
        position: { x: 350, y: 300 },
        width: 250,
        height: 200,
        magnets: ['mag-2']
      },
      {
        id: 'toolbar',
        name: 'Toolbar',
        type: 'toolbar',
        color: '#607D8B',
        position: { x: 20, y: 20 },
        width: 380,
        height: 52,
        magnets: []
      }
    ],
    boardType: 'inspiration',
    title: 'Inspiration Board',
    description: 'Collect and organize creative ideas and inspiration'
  },
  'personal': {
    magnets: [
      {
        id: 'task-1',
        type: 'task',
        title: 'Buy groceries',
        content: 'Milk, bread, eggs, vegetables',
        color: '#F44336',
        tags: ['shopping', 'urgent'],
        position: { x: 100, y: 100 },
        width: 180,
        height: 80,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'note-1',
        type: 'note',
        title: 'Book recommendations',
        content: 'The Pragmatic Programmer, Clean Code, Refactoring',
        color: '#4CAF50',
        tags: ['books', 'learning'],
        position: { x: 300, y: 100 },
        width: 200,
        height: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
    containers: [
      {
        id: 'cat-tasks',
        name: 'To Do',
        type: 'category',
        color: '#FF5722',
        position: { x: 50, y: 250 },
        width: 250,
        height: 200,
        magnets: ['task-1']
      },
      {
        id: 'cat-notes',
        name: 'Notes',
        type: 'category',
        color: '#4CAF50',
        position: { x: 350, y: 250 },
        width: 250,
        height: 200,
        magnets: ['note-1']
      },
      {
        id: 'toolbar',
        name: 'Toolbar',
        type: 'toolbar',
        color: '#607D8B',
        position: { x: 20, y: 20 },
        width: 380,
        height: 52,
        magnets: []
      }
    ],
    boardType: 'personal',
    title: 'Personal Board',
    description: 'Organize personal tasks, notes, and ideas'
  },
  'work': {
    magnets: [
      {
        id: 'project-1',
        type: 'task',
        title: 'Q4 Planning',
        content: 'Review goals and set objectives for next quarter',
        color: '#2196F3',
        tags: ['planning', 'quarterly'],
        position: { x: 100, y: 100 },
        width: 200,
        height: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'meeting-1',
        type: 'note',
        title: 'Team Meeting Notes',
        content: 'Discuss new project requirements and timeline',
        color: '#FF9800',
        tags: ['meeting', 'project'],
        position: { x: 350, y: 100 },
        width: 180,
        height: 120,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
    containers: [
      {
        id: 'cat-projects',
        name: 'Projects',
        type: 'category',
        color: '#2196F3',
        position: { x: 50, y: 300 },
        width: 250,
        height: 200,
        magnets: ['project-1']
      },
      {
        id: 'cat-meetings',
        name: 'Meetings',
        type: 'category',
        color: '#FF9800',
        position: { x: 350, y: 300 },
        width: 250,
        height: 200,
        magnets: ['meeting-1']
      },
      {
        id: 'toolbar',
        name: 'Toolbar',
        type: 'toolbar',
        color: '#607D8B',
        position: { x: 20, y: 20 },
        width: 380,
        height: 52,
        magnets: []
      }
    ],
    boardType: 'work',
    title: 'Work Board',
    description: 'Manage work projects, meetings, and tasks'
  }
};
