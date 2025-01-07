// src/store/templateSlice.ts
import { StateCreator } from 'zustand';
import { Template, TemplateSlice } from '../types/store';
import { supabase } from '../lib/supabase';

export const createTemplateSlice: StateCreator<
  TemplateSlice & GrantSlice & AuthSlice,
  [],
  [],
  TemplateSlice
> = (set, get) => ({
  templates: [],
  isLoading: false,
  error: null,

  fetchTemplates: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ templates: data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addTemplate: async (template) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('templates')
        .insert([template])
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        templates: [data, ...state.templates],
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateTemplate: async (id, template) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('templates')
        .update(template)
        .match({ id })
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        templates: state.templates.map(t => t.id === id ? data : t),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  deleteTemplate: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('templates')
        .delete()
        .match({ id });

      if (error) throw error;
      set(state => ({
        templates: state.templates.filter(t => t.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  }
});