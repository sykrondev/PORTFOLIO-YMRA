import { es } from './es';
import { en } from './en';
import type { Content, Lang } from './types';

export const content: Record<Lang, Content> = { es, en };
export type { Content, Lang };
