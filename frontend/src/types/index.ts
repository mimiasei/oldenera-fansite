export interface NewsArticle {
  id: number;
  title: string;
  content: string;
  summary: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  author: string;
  imageUrl?: string;
  tags: string[];
}