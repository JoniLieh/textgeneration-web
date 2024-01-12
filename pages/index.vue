<template>
  <div>
    <h1 class="text-h3 my-12 text-center">Projektaufgabe 2 – NLP „Textgenerierung“</h1>
    
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-toolbar color="accent" title="Einstellungen">
          </v-toolbar>
          
          <v-card-text class="pa-4">
            <v-row>
              <v-col cols="6">
                <v-text-field hide-details variant="outlined" label="MAX_REPETITIONS" v-model="MAX_REPETITIONS_State"
                  prepend-icon="mdi-repeat"></v-text-field>
              </v-col>

              <v-col cols="6">
                <v-text-field hide-details variant="outlined" label="START_SYMBOL" v-model="START_KEY_State"
                  prepend-icon="mdi-ray-start-arrow"></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col md="6" sm="12">
        <v-card elevation="2">
          <v-toolbar color="primary" title="Grammatik-Editor">
            <v-btn @click="download()" icon="mdi-download"></v-btn>
          </v-toolbar>

          <v-card-text>
            <v-alert type="info" variant="tonal" border="start" class="my-4">
              <ul>
                <li>
                  <code>
                    <span class="text-error">[</span>"Option1", "Option2", ...<span class="text-error">]</span><v-icon start>mdi-arrow-right</v-icon>für Alternativen auf der rechten Seite einer Produktionsregel
                  </code>
                </li>
                <li>
                  <code>
                    {Regel<span class="text-error">+</span>} <v-icon start>mdi-arrow-right</v-icon>für 1 bis n Wiederholungen auf der rechten Seite der Produktionsregel
                  </code>
                </li>
                <li>
                  <code>
                    {Regel<span class="text-error">?</span>} <v-icon start>mdi-arrow-right</v-icon>für optionale Elemente auf der rechten Seite einer Produktionsregel
                  </code>
                </li>
                <li>
                  <code>
                    {Regel<span class="text-error">*</span>} <v-icon start>mdi-arrow-right</v-icon>für 0 bis n Wiederholungen auf der rechten Seite einer Produktionsregel
                  </code>
                </li>
              </ul>
            </v-alert>

            <client-only>
              <JsonEditorVue v-model="grammarState" mode="text" />
            </client-only>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col md="6" sm="12">
        <v-card elevation="2">
          <v-toolbar color="secondary" title="Generation">
            <v-btn-toggle v-model="generationMode" mandatory>
              <v-btn color="secondary">Alle</v-btn>
              <v-btn color="secondary">Einzeln</v-btn>
            </v-btn-toggle>

            <v-btn @click="RunGrammar()" icon="mdi-refresh" title="Manuell Neugenerieren" class="ml-2"></v-btn>
          </v-toolbar>

          <v-card-text>
            <v-select v-if="generationMode == 1" :items="singleStartItems" v-model="singleStartKey"
              label="Welchen Start allein ausführen"></v-select>

            <v-list :items="output" lines="two" density="comfortable" mandatory>
              <template #subtitle="{ item }: any">
                <v-icon start>mdi-ray-start-arrow</v-icon>{{ item.subtitle }}
              </template>
              <template #prepend>
                <v-icon>mdi-send</v-icon>
              </template>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
const grammarStore = useMyGrammarStore()
const generationMode = ref(0)
const { grammar, grammarState, START_KEY_State, MAX_REPETITIONS_State }: any = storeToRefs(grammarStore)
const output = ref<any>([]);

const singleStartKey = ref<string>("");
const singleStartItems = computed(() => grammar.value[START_KEY_State.value]);

watch(
  () => generationMode.value,
  () => {
    output.value = [] // reset output
  }
);

watchEffect(() => {
  RunGrammar()
});

function RunGrammar() {
  try {
    if (typeof grammarState.value === "string") // Editor gives back as text
      grammarState.value = JSON.parse(grammarState.value)

    console.log("RERUN", MAX_REPETITIONS_State.value, START_KEY_State.value);

    output.value = [] // reset output
    if (generationMode.value == 1 && singleStartKey.value) {
      let index = grammar.value[START_KEY_State.value].indexOf(singleStartKey.value) // get Index of selected grammar Start Key

      output.value = [{
        title: useGenerateSentence(grammar.value[START_KEY_State.value][index], grammar.value, MAX_REPETITIONS_State.value),
        subtitle: grammar.value[START_KEY_State.value][index]
      }]
    } else if (generationMode.value == 0) {
      for (let index = 0; index < grammar.value[START_KEY_State.value].length; index++) {
        output.value.push({
          title: useGenerateSentence(grammar.value[START_KEY_State.value][index], grammar.value, MAX_REPETITIONS_State.value),
          subtitle: grammar.value[START_KEY_State.value][index]
        })
      }
    }
  } catch (error) {
    console.log("Error happend", error);
    return;
  }
}

function download(): void {
  const text: string = JSON.stringify(grammarState.value, null, 2)
  // Create a Blob with the text content
  const blob = new Blob([text], { type: 'application/json' });

  // Create a temporary URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement('a');

  // Set link's attributes
  let filename = `grammar_${new Date().getTime()}.json`;
  link.href = url;
  link.download = filename;

  // Append link to the DOM (required for Firefox)
  document.body.appendChild(link);

  // Trigger a click event to initiate download
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
</script>

<style></style>