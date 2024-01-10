import { defineStore } from 'pinia'
import type { IGrammar } from '~/types';

export const useMyGrammarStore = defineStore({
  id: 'myGrammarStore',
  getters: {
    grammar: (state) => state.grammarState
  },
  state: () => ({
    MAX_REPETITIONS_State: 3 as number,
    NOTATIONS_State: ['*', '+', '?'] as string[],
    START_KEY_State: 'Start' as string,

    grammarState: {} as any,
  }),
  actions: {
    async INIT_GRAMMAR() {
      try {
        this.grammarState = await $fetch('/grammar.json')
      } catch (error) {
        throw new Error(error)
      }
    }
  }
})
