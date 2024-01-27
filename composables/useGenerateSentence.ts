import type { IGrammar } from "~/types";

const NOTATIONS: string[] = ['*', '+', '?'];

const grammarComposableState = ref<IGrammar>({})

useFetch('/grammar.json')
.then((result) => {
  grammarComposableState.value = result.data.value as IGrammar
}).catch((err) => {
  console.log("Error while fetching grammar.json", err);
});

function CapitalizeFirstLetter(sentence: string): string {
  if (!sentence || typeof sentence !== 'string') return ''; // Check for empty string or non-string input

  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

function RandomElement(arr: string[] | boolean[] | number[]): string | boolean | number {
  var randomIndex = Math.floor((Math.random() * arr.length));
  return arr[randomIndex];
}

function ReplacePartOfSentence(partOfSentence: string, grammar: IGrammar, MAX_REPETITIONS: number): string {
  // Check for appended notations
  let replacement: string = '';
  let partOfSentenceLength: number = partOfSentence.length
  let notation = partOfSentence.charAt(partOfSentenceLength - 1)

  // remove notation from part of sentence
  partOfSentence = NOTATIONS.includes(notation) ? partOfSentence.slice(0, partOfSentenceLength - 1) : partOfSentence


  if (notation === '*') {
    // für 0 bis n Wiederholungen auf der rechten Seite einer Produktionsregel
    let repetitions = Math.floor(Math.random() * MAX_REPETITIONS); // random repetitions between 0 and MAX_REPETITIONS

    // repeat for [repetitions] and lookup new part from grammar
    for (let index = 0; index < repetitions; index++) {
      let grammaredPart = HandleSentence(RandomElement(grammar[partOfSentence]) as string, grammar, MAX_REPETITIONS)
      replacement += grammaredPart

      // add whitespace for oncoming parts
      if (index < repetitions-1)
        replacement += ' '
    }

  } else if (notation === '+') {
    // für 1 bis n Wiederholungen auf der rechten Seite der Produktionsregel
    let repetitions = Math.floor(Math.random() * MAX_REPETITIONS) + 1; // random repetitions between 1 and MAX_REPETITIONS

    for (let index = 0; index < repetitions; index++) {
      let grammaredPart = HandleSentence(RandomElement(grammar[partOfSentence]) as string, grammar, MAX_REPETITIONS)
      replacement += grammaredPart

      // add whitespace for oncoming parts
      if (index < repetitions-1)
        replacement += ' '
    }

  } else if (notation === '?') {
    if (RandomElement([false, true]) as boolean) {
      // für optionale Elemente auf der rechten Seite einer Produktionsregel
      let grammaredPart = HandleSentence(RandomElement(grammar[partOfSentence]) as string, grammar, MAX_REPETITIONS)
  
      // add whitespace for optional
      replacement += grammaredPart
    } else {
      // do nothing
    }
  } else {
    // No notation found, lookup grammar normally
    let grammaredPart = HandleSentence(RandomElement(grammar[partOfSentence]) as string, grammar, MAX_REPETITIONS)
    replacement += grammaredPart
  }

  return replacement;
}

function ReplaceWithGrammarWord(sentence: string, partOfSentence: string, lookedUpWord: string): string {
  // Ersetze strings "partOfSentence" in "sentence" mit "lookedUpWord"
  const startIndex = sentence.indexOf(partOfSentence); 
  const endIndex = startIndex + partOfSentence.length;

  const newSentence = sentence.substring(0, startIndex) + lookedUpWord + sentence.substring(endIndex);

  return newSentence
}


function HandleSentence(sentence: string, grammar: IGrammar, MAX_REPETITIONS: number): string {
  // "{Hoeflichkeit?}{VerbDu} du ich er Sie es {Subjekt} wir to "['{Hoeflichkeit?}','{VerbDu}','du','ich','er','Sie','es','{Subjekt}','wir']

  var finalSentence: string = sentence;
  
  // Splitte alle Vorkommnisse mit "{" und "}" sowie Zeichenketten, die aus mindestens einem Zeichen besteht und keine Leerzeichen oder geschweiften Klammern enthält
  var sentenceParts: string[] = sentence.match(/\{.*?\}|[^\s{}]+/g) as string[];

  for (const partOfSentence of sentenceParts) {
    let lookedUpWord: string = ''; // word looked up in gramma
    let partOfSentenceLength: number = partOfSentence.length
    let edittedPartOfSentence: string = partOfSentence;


    if (partOfSentence.charAt(0) === '{' && partOfSentence.charAt(partOfSentenceLength - 1) === '}') {
      // Replace Part of Sentence
      
      // Remove "{ }"
      edittedPartOfSentence = partOfSentence.slice(1, partOfSentenceLength - 1);
      

      // Add replaced part to final sentence
      lookedUpWord = ReplacePartOfSentence(edittedPartOfSentence, grammar, MAX_REPETITIONS);
    } else {
      // no replacement needed, add to final sentence
      lookedUpWord = partOfSentence;
    }


    // replace in handled part in our final sentence with the looked up word from the grammar
    finalSentence = ReplaceWithGrammarWord(finalSentence, partOfSentence, lookedUpWord);
  }

  return finalSentence;
}

function useGenerateSentenceReverse(terminalSymbol: string, grammarGiven: IGrammar, MAX_REPETITIONS: number, START_SYMBOL: string): { title: string, subtitle: string } {
  var history: {
    [key: string]: string
  }[] = [];

  // find furthest Start => either in StartSymbol or nonterminal

  function findKeyHistoryByValueInGrammar(valueToReverse: string | RegExp, oldKey?: string) {
    if (oldKey) {
      history.push({
        key: oldKey,
        value: valueToReverse  as string
      });
      valueToReverse = new RegExp(`\\{(${oldKey})([+*?]?)\\}`) // {<Key><+*?>} // Key in geschweiften Klammern gefolgt von optionaler Notation // fix Notations Lookup
    }
    if (oldKey == START_SYMBOL) {
      return history // return final history
    }

    var grammarLookup = structuredClone(toRaw(grammarGiven)) // deep copy of grammar to edit it

    // wenn neuer Key gefunden wurde => erneut funktion aufrufen : ansonsten derzeitigen Key zurückgeben
    for (const grammarKey in grammarLookup) {
      // für jeden NichtTerminal in grammar
      
      if (Object.prototype.hasOwnProperty.call(grammarLookup, grammarKey)) {
        const rightSideArray = grammarLookup[grammarKey]; // right side Array (terminals/nonterminals)

        for (const elementRSA of rightSideArray) { // RSA RightSideArray
          if (history.length == 0 ? elementRSA == valueToReverse : elementRSA.match(valueToReverse)) { // when first iteration look for exact terminalSymbol else test Regex // mir → {Hoeflichkeit?} {VerbGeben} mir ein {Objekt-Das} {Aufzaehlung*} → WRONG
            // found our value to reverse, check if its further(new)

            if (grammarKey != oldKey) {
              // found new furthest key, lookup the current key
              delete grammarLookup[grammarKey] // delete already found key

              return findKeyHistoryByValueInGrammar(elementRSA, grammarKey)
            }
          }
        }
      }
    }
  }

  // immediately execute recursive function
  findKeyHistoryByValueInGrammar(terminalSymbol)

  // build final Sentence
  let title = "";
  let subtitle = "";
  history = history.reverse()

  history.forEach(({ key, value }, index) => {
    title += index != history.length-1 ? value : ``,
    subtitle += key + (index != history.length-1 ? ' → ' : ` → ${terminalSymbol}`) // add following arrow
  });

  var originalTitle = title; // make copy and mutate the old one

  while (!title.includes(terminalSymbol)) {
    // bruteforce till terminalSymbol is included
    title = HandleSentence(originalTitle, grammarGiven, MAX_REPETITIONS);
  }

  return { title, subtitle }
}

const useGenerateSentence = (sentence: string, grammarGiven: IGrammar, MAX_REPETITIONS: number): string => {
  grammarComposableState.value = grammarGiven

  let lookedUpSentence = HandleSentence(sentence, grammarGiven, MAX_REPETITIONS)

  lookedUpSentence = lookedUpSentence.trim()
  lookedUpSentence = CapitalizeFirstLetter(lookedUpSentence);

  return lookedUpSentence
}

export {
  useGenerateSentence,
  useGenerateSentenceReverse
}