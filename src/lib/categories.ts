export type CategoryId = 'dev' | 'invest' | 'learn' | 'daily';

export interface Category {
  id: CategoryId;
  name: string;
  color: string;
  cssVar: string;
}

export const CATEGORIES: Record<CategoryId, Category> = {
  dev: {
    id: 'dev',
    name: '개발',
    color: '#0066FF',
    cssVar: '--cat-dev',
  },
  invest: {
    id: 'invest',
    name: '투자',
    color: '#f59e0b',
    cssVar: '--cat-invest',
  },
  learn: {
    id: 'learn',
    name: '학습',
    color: '#6541F2',
    cssVar: '--cat-learn',
  },
  daily: {
    id: 'daily',
    name: '일상',
    color: '#14b8a6',
    cssVar: '--cat-daily',
  },
};

export const CATEGORY_LIST: Category[] = Object.values(CATEGORIES);
