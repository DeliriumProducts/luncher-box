interface ThemeVariables {
  [key: string]: string;
}

/**
 * Backend url
 */
export const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * Less theme variables
 */
// @ts-ignore
export const THEME_VARIABLES: ThemeVariables = process.env.THEME_VARIABLES;

export default {
  BACKEND_URL,
  THEME_VARIABLES
};
