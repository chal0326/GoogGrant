// src/store/index.ts
import { create } from 'zustand';
import { createTemplateSlice } from './templateSlice';
import { createGrantSlice } from './grantSlice';
import { TemplateSlice, GrantSlice, AuthSlice } from '../types/store';

export const useStore = create<TemplateSlice & GrantSlice & AuthSlice>()((...args) => ({
  ...createTemplateSlice(...args),
  ...createGrantSlice(...args),
  // Auth slice values from Supabase
  user: null,
  isLoading: false,
  error: null,
  setUser: (user) => args[0]({ user }),
  signOut: async () => {
    const [set] = args;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
    } catch (error) {
      set({ error: error.message });
    }
  }
}));