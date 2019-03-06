interface ThemeVariables {
  [key: string]: string;
}

/**
 * Frontend url
 */
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

/**
 * Backend url
 */
export const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * Socket url
 */
export const SOCKET_URL = process.env.SOCKET_URL || 'http://localhost:8000';

/**
 * Less theme variables
 */
// @ts-ignore
export const THEME_VARIABLES: ThemeVariables = process.env.THEME_VARIABLES;

export default {
  BACKEND_URL,
  THEME_VARIABLES
};
