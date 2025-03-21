export const setToken = (token: string) => ({
    type: 'SET_TOKEN',
    payload: token,
  });
  
  export const setProfile = (profile: any) => ({
    type: 'SET_PROFILE',
    payload: profile,
  });
  
  export const setMenstruationDays = (menstruationDays: any) => ({
    type: 'SET_MENSTRUATION_DAYS',
    payload: menstruationDays,
  });
  
  export const setInsights = (insights: any) => ({
    type: 'SET_INSIGHTS',
    payload: insights,
  });
  