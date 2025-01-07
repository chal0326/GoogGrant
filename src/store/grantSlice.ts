// src/store/grantSlice.ts
import { StateCreator } from 'zustand';
import { Grant, GrantSlice } from '../types/store';
import { supabase } from '../lib/supabase';

export const createGrantSlice: StateCreator<
  TemplateSlice & GrantSlice & AuthSlice,
  [],
  [],
  GrantSlice
> = (set, get) => ({
  grants: [],
  currentGrant: null,
  isLoading: false,
  error: null,

  fetchGrants: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('grants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ grants: data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  setCurrentGrant: (grant) => {
    set({ currentGrant: grant });
  },

  saveGrant: async (grant) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('grants')
        .insert([grant])
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        grants: [data, ...state.grants],
        currentGrant: data,
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateGrant: async (id, grant) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('grants')
        .update(grant)
        .match({ id })
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        grants: state.grants.map(g => g.id === id ? data : g),
        currentGrant: state.currentGrant?.id === id ? data : state.currentGrant,
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  deleteGrant: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('grants')
        .delete()
        .match({ id });

      if (error) throw error;
      set(state => ({
        grants: state.grants.filter(g => g.id !== id),
        currentGrant: state.currentGrant?.id === id ? null : state.currentGrant,
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  }
});