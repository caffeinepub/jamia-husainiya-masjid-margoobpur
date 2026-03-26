export interface Notice {
  id: string;
  title: string;
  date: string;
  description: string;
  important: boolean;
  category?: string;
}

export const NOTICES: Notice[] = [];
