import type { IGrammar } from "~/types";

const NOTATIONS: string[] = ['*', '+', '?'];

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

export const useGenerateSentence = (sentence: string, grammar: IGrammar, MAX_REPETITIONS: number): string => {
  let lookedUpSentence = HandleSentence(sentence, grammar, MAX_REPETITIONS)
  lookedUpSentence = lookedUpSentence.trim()
  lookedUpSentence = CapitalizeFirstLetter(lookedUpSentence);

  return lookedUpSentence
}
