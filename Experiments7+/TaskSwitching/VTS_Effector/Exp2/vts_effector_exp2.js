// Voluntary Task Switching
// Illuminating the role of effector-specific task representations in voluntary task switching
// Online version of Experiment 2
//
// Two stimuli (i.e., letter/coloured square) are presented in each trial and are
//  associated with two-independent task sets (letter task vs. colour task)
//  1st half: tasks assigned to same hand (task-to-hand)
//  2nd half: tasks assigned to same finger (task-to-finger)
//  Participants decide which task to perform
// In 50% of trials (Free Choice), 50% of trials (Forced-Choice, only one stimulus presented)

const jsPsych = initJsPsych({});

const CANVAS_COLOUR = 'rgba(200, 200, 200, 1)';
const CANVAS_SIZE = [1280, 720];
const CANVAS_BORDER = '5px solid black';

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////

const COLOURS = shuffle(['red', 'blue', 'green', 'yellow']);
const LETTERS = shuffle(['Q', 'K', 'G', 'L']);

const DE_EN = { red: 'rot', blue: 'blau', green: 'grün', yellow: 'gelb', Q: 'Q', K: 'K', G: 'G', L: 'L' };

const PRMS = {
  screenRes: [960, 720], // minimum screen resolution requested
  nTrls: 100, // number of trials within a block
  nBlks: 14, // number of blocks
  nPoor: 10, // number of errors allowed in block before extended message during break
  fbDur: [0, 2500], // feedback duration for correct and incorrect trials, respectively
  fbText: ['', 'Falsch!'],
  rsi: 500,
  waitDur: 30000, // wait time at end of block if too many errors!
  stimFont: '80px Arial',
  rectLineWidth: 10,
  rectHeight: 100,
  rectWidth: 80,
  fbFont: '28px Arial',
  colours1: [COLOURS[0], COLOURS[1]],
  letters1: [LETTERS[0], LETTERS[1]],
  colours2: [COLOURS[2], COLOURS[3]],
  letters2: [LETTERS[2], LETTERS[3]],
  respKeys: ['Q', 'W', 'O', 'P'],
  leftHand: ['Q', 'W'],
  rightHand: ['O', 'P'],
  indexFinger: ['W', 'O'],
  middleFinger: ['Q', 'P'],
  deactivateKeys: true, // should keys be deactivate when task not available?
};

const VTS_DATA = {
  cTrl: 1,
  cBlk: 1,
  half: 1,
  nLetter: 0,
  nColour: 0,
  previousTask: 'na',
  repCounter: 0,
  poorPerformance: false,
};

// 8 counter balanced versions
const VERSION = Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: VERSION });

// 8 counter-balanced versions
// 1st half: hand-to-task   (left: colour, right: letter), 2nd half: finger-to-task (index: colour, middle: letter)
// 1st half: hand-to-task   (left: letter, right: colour), 2nd half: finger-to-task (index: colour, middle: letter)
// 1st half: hand-to-task   (left: colour, right: letter), 2nd half: finger-to-task (index: letter, middle: colour)
// 1st half: hand-to-task   (left: letter, right: colour), 2nd half: finger-to-task (index: letter, middle: colour)
// 1st half: finger-to-task (left: colour, right: letter), 2nd half: hand-to-task   (index: colour, middle: letter)
// 1st half: finger-to-task (left: letter, right: colour), 2nd half: hand-to-task   (index: colour, middle: letter)
// 1st half: finger-to-task (left: colour, right: letter), 2nd half: hand-to-task   (index: letter, middle: colour)
// 1st half: finger-to-task (left: letter, right: colour), 2nd half: hand-to-task   (index: letter, middle: colour)

// lt = left task, rt = right task
// it = index task, mt = middle task
// slr = stim left resp, srr = stim right resp
// prettier-ignore
const VERSIONS = [
  {ver: 1, order: ["hand", "finger"], hand: {lt: "colour", slr: {[PRMS.colours1[0]]: PRMS.leftHand[0], [PRMS.colours1[1]]: PRMS.leftHand[1]}, rt: "letter", srr: {[PRMS.letters1[0]]: PRMS.rightHand[0], [PRMS.letters1[1]]: PRMS.rightHand[1]}}, finger: {it: "colour", sir: {[PRMS.colours2[0]]: PRMS.indexFinger[0], [PRMS.colours2[1]]: PRMS.indexFinger[1]}, mt: "letter", smr: {[PRMS.letters2[0]]: PRMS.middleFinger[0], [PRMS.letters2[1]]: PRMS.middleFinger[1]}}},
  {ver: 2, order: ["hand", "finger"], hand: {lt: "letter", slr: {[PRMS.letters1[0]]: PRMS.leftHand[0], [PRMS.letters1[1]]: PRMS.leftHand[1]}, rt: "colour", srr: {[PRMS.colours1[0]]: PRMS.rightHand[0], [PRMS.colours1[1]]: PRMS.rightHand[1]}}, finger: {it: "colour", sir: {[PRMS.colours2[0]]: PRMS.indexFinger[0], [PRMS.colours2[1]]: PRMS.indexFinger[1]}, mt: "letter", smr: {[PRMS.letters2[0]]: PRMS.middleFinger[0], [PRMS.letters2[1]]: PRMS.middleFinger[1]}}},
  {ver: 3, order: ["hand", "finger"], hand: {lt: "colour", slr: {[PRMS.colours1[0]]: PRMS.leftHand[0], [PRMS.colours1[1]]: PRMS.leftHand[1]}, rt: "letter", srr: {[PRMS.letters1[0]]: PRMS.rightHand[0], [PRMS.letters1[1]]: PRMS.rightHand[1]}}, finger: {it: "letter", sir: {[PRMS.letters2[0]]: PRMS.indexFinger[0], [PRMS.letters2[1]]: PRMS.indexFinger[1]}, mt: "colour", smr: {[PRMS.colours2[0]]: PRMS.middleFinger[0], [PRMS.colours2[1]]: PRMS.middleFinger[1]}}},
  {ver: 4, order: ["hand", "finger"], hand: {lt: "letter", slr: {[PRMS.letters1[0]]: PRMS.leftHand[0], [PRMS.letters1[1]]: PRMS.leftHand[1]}, rt: "colour", srr: {[PRMS.colours1[0]]: PRMS.rightHand[0], [PRMS.colours1[1]]: PRMS.rightHand[1]}}, finger: {it: "letter", sir: {[PRMS.letters2[0]]: PRMS.indexFinger[0], [PRMS.letters2[1]]: PRMS.indexFinger[1]}, mt: "colour", smr: {[PRMS.colours2[0]]: PRMS.middleFinger[0], [PRMS.colours2[1]]: PRMS.middleFinger[1]}}},
  {ver: 5, order: ["finger", "hand"], hand: {lt: "colour", slr: {[PRMS.colours2[0]]: PRMS.leftHand[0], [PRMS.colours2[1]]: PRMS.leftHand[1]}, rt: "letter", srr: {[PRMS.letters2[0]]: PRMS.rightHand[0], [PRMS.letters2[1]]: PRMS.rightHand[1]}}, finger: {it: "colour", sir: {[PRMS.colours1[0]]: PRMS.indexFinger[0], [PRMS.colours1[1]]: PRMS.indexFinger[1]}, mt: "letter", smr: {[PRMS.letters1[0]]: PRMS.middleFinger[0], [PRMS.letters1[1]]: PRMS.middleFinger[1]}}},
  {ver: 6, order: ["finger", "hand"], hand: {lt: "letter", slr: {[PRMS.letters2[0]]: PRMS.leftHand[0], [PRMS.letters2[1]]: PRMS.leftHand[1]}, rt: "colour", srr: {[PRMS.colours2[0]]: PRMS.rightHand[0], [PRMS.colours2[1]]: PRMS.rightHand[1]}}, finger: {it: "colour", sir: {[PRMS.colours1[0]]: PRMS.indexFinger[0], [PRMS.colours1[1]]: PRMS.indexFinger[1]}, mt: "letter", smr: {[PRMS.letters1[0]]: PRMS.middleFinger[0], [PRMS.letters1[1]]: PRMS.middleFinger[1]}}},
  {ver: 7, order: ["finger", "hand"], hand: {lt: "colour", slr: {[PRMS.colours2[0]]: PRMS.leftHand[0], [PRMS.colours2[1]]: PRMS.leftHand[1]}, rt: "letter", srr: {[PRMS.letters2[0]]: PRMS.rightHand[0], [PRMS.letters2[1]]: PRMS.rightHand[1]}}, finger: {it: "letter", sir: {[PRMS.letters1[0]]: PRMS.indexFinger[0], [PRMS.letters1[1]]: PRMS.indexFinger[1]}, mt: "colour", smr: {[PRMS.colours1[0]]: PRMS.middleFinger[0], [PRMS.colours1[1]]: PRMS.middleFinger[1]}}},
  {ver: 8, order: ["finger", "hand"], hand: {lt: "letter", slr: {[PRMS.letters2[0]]: PRMS.leftHand[0], [PRMS.letters2[1]]: PRMS.leftHand[1]}, rt: "colour", srr: {[PRMS.colours2[0]]: PRMS.rightHand[0], [PRMS.colours2[1]]: PRMS.rightHand[1]}}, finger: {it: "letter", sir: {[PRMS.letters1[0]]: PRMS.indexFinger[0], [PRMS.letters1[1]]: PRMS.indexFinger[1]}, mt: "colour", smr: {[PRMS.colours1[0]]: PRMS.middleFinger[0], [PRMS.colours1[1]]: PRMS.middleFinger[1]}}},
];

const STIM_RESP = VERSIONS[VERSION - 1];

function pad_me(str, npad) {
  let len = Math.floor((npad - str.length) / 2);
  str = ' '.repeat(len) + str + ' '.repeat(len);
  return str
    .split('')
    .map(function (c) {
      return c === ' ' ? '&nbsp;' : c;
    })
    .join('');
}

function get_keymapping_hand(obj) {
  'use strict';
  let s = 24;
  let k = 26;
  let s1_1 = Object.getOwnPropertyNames(obj.hand.slr)[0];
  let k1_1 = obj.hand.slr[s1_1];
  s1_1 = pad_me(DE_EN[s1_1], s);
  k1_1 = pad_me('(' + k1_1 + '-Taste)', k);
  let s2_1 = Object.getOwnPropertyNames(obj.hand.slr)[1];
  let k2_1 = obj.hand.slr[s2_1];
  s2_1 = pad_me(DE_EN[s2_1], s);
  k2_1 = pad_me('(' + k2_1 + '-Taste)', k);
  let s1_2 = Object.getOwnPropertyNames(obj.hand.srr)[0];
  let k1_2 = obj.hand.srr[s1_2];
  s1_2 = pad_me(DE_EN[s1_2], s);
  k1_2 = pad_me('(' + k1_2 + '-Taste)', k);
  let s2_2 = Object.getOwnPropertyNames(obj.hand.srr)[1];
  let k2_2 = obj.hand.srr[s2_2];
  s2_2 = pad_me(DE_EN[s2_2], s);
  k2_2 = pad_me('(' + k2_2 + '-Taste)', k);

  return `<span style="font-weight:bold";>${s1_1} ${s2_1} ${s1_2} ${s2_2}</span><br>
          <span style="font-size:24px";>${k1_1} ${k2_1} ${k1_2} ${k2_2}</span>`;
}

function get_keymapping_finger(obj) {
  'use strict';
  let s = 24;
  let k = 26;
  let s1_1 = Object.getOwnPropertyNames(obj.finger.sir)[0];
  let k1_1 = obj.finger.sir[s1_1];
  s1_1 = pad_me(DE_EN[s1_1], s);
  k1_1 = pad_me('(' + k1_1 + '-Taste)', k);
  let s2_1 = Object.getOwnPropertyNames(obj.finger.sir)[1];
  let k2_1 = obj.finger.sir[s2_1];
  s2_1 = pad_me(DE_EN[s2_1], s);
  k2_1 = pad_me('(' + k2_1 + '-Taste)', k);
  let s1_2 = Object.getOwnPropertyNames(obj.finger.smr)[0];
  let k1_2 = obj.finger.smr[s1_2];
  s1_2 = pad_me(DE_EN[s1_2], s);
  k1_2 = pad_me('(' + k1_2 + '-Taste)', k);
  let s2_2 = Object.getOwnPropertyNames(obj.finger.smr)[1];
  let k2_2 = obj.finger.smr[s2_2];
  s2_2 = pad_me(DE_EN[s2_2], s);
  k2_2 = pad_me('(' + k2_2 + '-Taste)', k);

  return `<span style="font-weight:bold";>${s1_2} ${s1_1} ${s2_1} ${s2_2}</span><br>
          <span style="font-size:24px";>${k1_2} ${k1_1} ${k2_1} ${k2_2}</span>`;
}

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const WELCOME_INSTRUCTIONS = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: generate_formatted_html({
    text: `Willkommen zu unserem Experiment:<br><br>
           Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
           Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und genügend Zeit hast,
           um das Experiment durchzuführen. Wir bitten dich die ca. nächsten 45 Minuten konzentriert zu arbeiten.<br><br>
           Du erhältst den Code für VP-Stunden/Geld und weitere Anweisungen am Ende des Experiments.
           Bei Fragen oder Problemen wende dich bitte an:<br><br>
           hiwipibio@gmail.com <br><br>
           Drücke eine beliebige Taste, um fortzufahren`,
    align: 'left',
    fontsize: 30,
    width: '1200px',
    lineheight: 1.5,
  }),
};

const TASK_INSTRUCTIONS_FINAL = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: generate_formatted_html({
    text: `In jedem Durchgang muss nur eine Aufgabe bearbeitet werden.<br><br> 
     Wenn nur eine Aufgabe präsentiert wird, dann bearbeite bitte diese <br><br>
     Wenn beide Aufgaben präsentiert werden, kannst du dir frei aussuchen, welche du bearbeitest.<br><br>
     Drücke eine beliebige Taste um fortzufahren.`,
    align: 'left',
    fontsize: 30,
    width: '1200px',
    lineheight: 1.5,
  }),
};

const VP_CODE_INSTRUCTIONS1 = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: generate_formatted_html({
    text: `Du erhaelst den Code für VP-Stunden/Geld und weitere Anweisungen
    am Ende des Experimentes. Bei Fragen oder Problemen wende dich bitte an:<br><br>
    hiwipibio@gmail.com<br><br>
    Drücke eine beliebige Taste, um fortzufahren!`,
    align: 'left',
    fontsize: 30,
    width: '1200px',
    lineheight: 1.5,
  }),
};

function hand_instructions() {
  let task_instructions;
  let resp_mapping1;
  let resp_mapping2;
  if (STIM_RESP.hand.lt === 'colour') {
    task_instructions = generate_formatted_html({
      text: `Es gibt zwei Aufgaben.<br><br>
             Jede Aufgabe wird mit <span style="font-weight:bold">der linken oder rechten Hand</span> bearbeitet.<br><br>
             Farbaufgabe = Linke Hand: <br>
             Bitte platziere hierzu den Zeigefinger und Mittelfinger auf die Tasten „Q“ und „W“.<br><br>
             Buchstabeaufgabe = Rechte Hand:<br> 
             Bitte platziere hierzu den Zeigefinger und Mittelfinger auf die Tasten „O“ und „P“.<br><br>
             Drücke eine beliebige Taste um fortzufahren.`,
      align: 'left',
      fontsize: 28,
      width: '1200px',
      lineheight: 1.5,
    });
    resp_mapping1 = generate_formatted_html({
      text: `Für die Buchstabenaufgabe musst du entscheiden welcher Buchstabe präsentiert ist.
             Für die Farbaufgabe musst du entscheiden welche Farbe ein Quadrat hat. Es gilt:<br><br>
             <span style="font-weight:bold";>
             Farbaufgabe = Linke Hand<br> 
             Buchstabeaufgabe = Rechte Hand
             </span><br><br>
             ${get_keymapping_hand(STIM_RESP)}<br><br>
             Drücke eine beliebige Taste um fortzufahren.`,
      align: 'center',
      fontsize: 30,
      width: '1200px',
      lineheight: 1.5,
    });
    resp_mapping2 = generate_formatted_html({
      text: `Für die Buchstabenaufgabe musst du entscheiden welcher Buchstabe präsentiert ist.
             Für die Farbaufgabe musst du entscheiden welche Farbe ein Quadrat hat. Es gilt:<br><br>
             <span style="font-weight:bold";>
             Farbaufgabe = Linke Hand<br> 
             Buchstabeaufgabe = Rechte Hand
             </span><br><br>
             ${get_keymapping_hand(STIM_RESP)}<br><br>
             Drücke eine beliebige Taste um fortzufahren.`,
      align: 'center',
      fontsize: 30,
      width: '1200px',
      lineheight: 1.5,
    });
  } else if (STIM_RESP.hand.lt === 'letter') {
    task_instructions = generate_formatted_html({
      text: `Es gibt zwei Aufgaben.<br><br>
           Jede Aufgabe wird mit <span style="font-weight:bold">der linken oder rechten Hand</span> bearbeitet.<br><br>
           Buchstabeaufgabe = Linke Hand: <br>
           Bitte platziere hierzu den Zeigefinger und Mittelfinger auf die
           Tasten „Q“ und „W“.<br><br>
           Farbaufgabe = Rechte Hand:<br>
           Bitte platziere hierzu den Zeigefinger und Mittelfinger auf die
           Tasten „O“ und „P“.<br><br>
           Drücke eine beliebige Taste um fortzufahren.`,
      align: 'left',
      fontsize: 28,
      width: '1200px',
      lineheight: 1.5,
    });
    resp_mapping1 = generate_formatted_html({
      text: `Für die Buchstabenaufgabe musst du entscheiden welcher Buchstabe präsentiert ist.
             Für die Farbaufgabe musst du entscheiden welche Farbe ein Quadrat hat. Es gilt:<br><br>
             <span style="font-weight:bold";>
             Buchstabeaufgabe = Linke Hand<br>
             Farbaufgabe = Rechte Hand</span>:<br><br>
             ${get_keymapping_hand(STIM_RESP)}<br><br>
             Drücke eine beliebige Taste um fortzufahren.`,
      align: 'center',
      fontsize: 30,
      width: '1200px',
      lineheight: 1.5,
    });
    resp_mapping2 = generate_formatted_html({
      text: `Für die Buchstabenaufgabe musst du entscheiden welcher Buchstabe präsentiert ist.
             Für die Farbaufgabe musst du entscheiden welche Farbe ein Quadrat hat. Es gilt:<br><br>
             <span style="font-weight:bold";>
             Buchstabeaufgabe = Linke Hand<br>
             Farbaufgabe = Rechte Hand</span>:<br>
             ${get_keymapping_hand(STIM_RESP)}<br><br>
             Drücke eine beliebige Taste um fortzufahren.`,
      align: 'center',
      fontsize: 30,
      width: '1200px',
      lineheight: 1.5,
    });
  }
  return [task_instructions, resp_mapping1, resp_mapping2];
}

function hand_feedback() {
  let resp_mapping1;
  let resp_mapping2;
  if (STIM_RESP.hand.lt === 'colour') {
    resp_mapping1 = generate_formatted_html({
      text: `<span style="font-weight:bold";>
             Farbaufgabe = Linke Hand<br> 
             Buchstabeaufgabe = Rechte Hand
             </span><br><br>
             ${get_keymapping_hand(STIM_RESP)}`,
      align: 'center',
      fontsize: 30,
      width: '1200px',
      lineheight: 1.5,
    });
    resp_mapping2 = generate_formatted_html({
      text: `<span style="font-weight:bold";>
             Farbaufgabe = Linke Hand<br> 
             Buchstabeaufgabe = Rechte Hand
             </span><br><br>
             ${get_keymapping_hand(STIM_RESP)}`,
      align: 'center',
      fontsize: 30,
      width: '1200px',
      lineheight: 1.5,
    });
  } else if (STIM_RESP.hand.lt === 'letter') {
    resp_mapping1 = generate_formatted_html({
      text: `<span style="font-weight:bold";>
             Buchstabeaufgabe = Linke Hand<br>
             Farbaufgabe = Rechte Hand</span>:<br><br>
             ${get_keymapping_hand(STIM_RESP)}`,
      align: 'center',
      fontsize: 30,
      width: '1200px',
      lineheight: 1.5,
    });
    resp_mapping2 = generate_formatted_html({
      text: `<span style="font-weight:bold";>
             Buchstabeaufgabe = Linke Hand<br>
             Farbaufgabe = Rechte Hand</span>:<br>
             ${get_keymapping_hand(STIM_RESP)}`,
      align: 'center',
      fontsize: 30,
      width: '1200px',
      lineheight: 1.5,
    });
  }
  return [resp_mapping1, resp_mapping2];
}

function finger_instructions() {
  let task_instructions;
  let resp_mapping1;
  let resp_mapping2;
  if (STIM_RESP.finger.it === 'colour') {
    task_instructions = generate_formatted_html({
      text: `Es gibt zwei Aufgaben.<br><br>
             Jede Aufgabe wird mit <span style="font-weight:bold">den Zeige- oder Mittelfinger</span> bearbeitet.<br><br>
             Farbaufgabe = Zeigefinger:<br>
             Bitte platziere hierzu deinen linken und rechten Zeigefinger auf die Tasten „W“ und „O.<br><br>
             Buchstabeaufgabe = Mittelfinger<br>
             Bitte platziere hierzu deinen linken und rechten Mittelfinger auf die Tasten „Q“ und „P“.<br><br>
             Drücke eine beliebige Taste um fortzufahren.`,
      align: 'left',
      fontsize: 28,
      width: '1200px',
      lineheight: 1.5,
    });
    resp_mapping1 = generate_formatted_html({
      text: `Für die Buchstabenaufgabe musst du entscheiden welcher Buchstabe präsentiert ist.
             Für die Farbaufgabe musst du entscheiden welche Farbe ein Quadrat hat. Es gilt:<br><br>
             <span style="font-weight:bold";>
             Farbaufgabe = Zeigefinger<br>
             Buchstabeaufgabe = Mittelfinger</span>:<br><br>
             ${get_keymapping_finger(STIM_RESP)}<br><br>
             Drücke eine beliebige Taste um fortzufahren.`,
      align: 'center',
      fontsize: 30,
      width: '1200px',
      lineheight: 1.5,
    });
    resp_mapping2 = generate_formatted_html({
      text: `<span style="font-weight:bold";>
             Farbaufgabe = Zeigefinger<br>
             Buchstabeaufgabe = Mittelfinger</span>:<br><br>
             ${get_keymapping_finger(STIM_RESP)}<br><br>
             Drücke eine beliebige Taste um fortzufahren.`,
      align: 'center',
      fontsize: 30,
      width: '1200px',
      lineheight: 1.5,
    });
  } else if (STIM_RESP.finger.it === 'letter') {
    task_instructions = generate_formatted_html({
      text: `Es gibt zwei Aufgaben.<br><br>
             Jede Aufgabe wird mit <span style="font-weight:bold">den Zeige- oder Mittelfinger</span> bearbeitet.<br><br>
             Buchstabeaufgabe = Zeigefinger:<br>
             Bitte platziere hierzu deinen linken und rechten Zeigefinger auf die Tasten „W“ und „O.<br><br>
             Farbaufgabe = Mittelfinger<br>
             Bitte platziere hierzu deinen linken und rechten Mittelfinger auf die Tasten „Q“ und „P“.<br><br>
             Drücke eine beliebige Taste um fortzufahren.`,
      align: 'left',
      fontsize: 28,
      width: '1200px',
      lineheight: 1.5,
    });
    resp_mapping1 = generate_formatted_html({
      text: `Für die Buchstabenaufgabe musst du entscheiden welcher Buchstabe präsentiert ist.
             Für die Farbaufgabe musst du entscheiden welche Farbe ein Quadrat hat. Es gilt:<br><br>
             <span style="font-weight:bold";>
             Buchstabeaufgabe = Zeigefinger<br>
             Farbaufgabe = Mittelfinger</span>:<br><br>
             ${get_keymapping_finger(STIM_RESP)}<br><br>
             Drücke eine beliebige Taste um fortzufahren.`,
      align: 'center',
      fontsize: 30,
      width: '1200px',
      lineheight: 1.5,
    });
    resp_mapping2 = generate_formatted_html({
      text: `<span style="font-weight:bold";>
             Buchstabeaufgabe = Zeigefinger<br>
             Farbaufgabe = Mittelfinger</span>:<br><br>
             ${get_keymapping_finger(STIM_RESP)}<br><br>
             Drücke eine beliebige Taste um fortzufahren.`,
      align: 'center',
      fontsize: 30,
      width: '1200px',
      lineheight: 1.5,
    });
  }
  return [task_instructions, resp_mapping1, resp_mapping2];
}

function finger_feedback() {
  let resp_mapping1;
  let resp_mapping2;
  if (STIM_RESP.finger.it === 'colour') {
    resp_mapping1 = generate_formatted_html({
      text: `<span style="font-weight:bold";>
             Farbaufgabe = Zeigefinger<br>
             Buchstabeaufgabe = Mittelfinger</span>:<br><br>
             ${get_keymapping_finger(STIM_RESP)}`,
      align: 'center',
      fontsize: 30,
      width: '1200px',
      lineheight: 1.5,
    });
    resp_mapping2 = generate_formatted_html({
      text: `<span style="font-weight:bold";>
             Farbaufgabe = Zeigefinger<br>
             Buchstabeaufgabe = Mittelfinger</span>:<br><br>
             ${get_keymapping_finger(STIM_RESP)}`,
      align: 'center',
      fontsize: 30,
      width: '1200px',
      lineheight: 1.5,
    });
  } else if (STIM_RESP.finger.it === 'letter') {
    resp_mapping1 = generate_formatted_html({
      text: `<span style="font-weight:bold";>
             Buchstabeaufgabe = Zeigefinger<br>
             Farbaufgabe = Mittelfinger</span>:<br><br>
             ${get_keymapping_finger(STIM_RESP)}`,
      align: 'center',
      fontsize: 30,
      width: '1200px',
      lineheight: 1.5,
    });
    resp_mapping2 = generate_formatted_html({
      text: `<span style="font-weight:bold";>
             Buchstabeaufgabe = Zeigefinger<br>
             Farbaufgabe = Mittelfinger</span>:<br><br>
             ${get_keymapping_finger(STIM_RESP)}`,
      align: 'center',
      fontsize: 30,
      width: '1200px',
      lineheight: 1.5,
    });
  }
  return [resp_mapping1, resp_mapping2];
}

const [TASK_INSTRUCTIONS_HAND1, RESPMAPPING_HAND1, RESPMAPPING_HAND2] = hand_instructions();
const [TASK_INSTRUCTIONS_FINGER1, RESPMAPPING_FINGER1, RESPMAPPING_FINGER2] = finger_instructions();
const [RESPMAPPING_HAND1_TF, RESPMAPPING_HAND2_TF] = hand_feedback();
const [RESPMAPPING_FINGER1_TF, RESPMAPPING_FINGER2_TF] = finger_feedback();

const TASK_INSTRUCTIONS = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  on_start: function (trial) {
    let mapping = STIM_RESP.order[VTS_DATA.half - 1];
    trial.stimulus = mapping === 'hand' ? TASK_INSTRUCTIONS_HAND1 : TASK_INSTRUCTIONS_FINGER1;
  },
};

const TASK_INSTRUCTIONS_MAPPING = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  on_start: function (trial) {
    let mapping = STIM_RESP.order[VTS_DATA.half - 1];
    trial.stimulus = mapping === 'hand' ? RESPMAPPING_HAND1 : RESPMAPPING_FINGER1;
  },
};

const IF_ERROR_TASK_INSTRUCTIONS_MAPPING = {
  timeline: [TASK_INSTRUCTIONS_MAPPING],
  conditional_function: function () {
    return jsPsych.data.get().last(2).values()[0].error === 1;
  },
};

const TASK_INSTRUCTIONS_BLOCK_START = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  on_start: function (trial) {
    let mapping = STIM_RESP.order[VTS_DATA.half - 1];
    let respText = mapping === 'hand' ? RESPMAPPING_HAND2 : RESPMAPPING_FINGER2;
    trial.stimulus =
      generate_formatted_html({
        text: `Block ${VTS_DATA.cBlk} von ${PRMS.nBlks}<br><br>
               Entscheide selbst welche Aufgabe du bearbeiten willst, wenn beide Aufgaben verfügbar sind und bearbeite sonst die Aufgabe welche präsentiert ist. Es gilt:<br>`,
        fontsize: 30,
        align: 'left',
        width: '1200px',
        lineheight: 1.5,
      }) + respText;
    task = shuffle(task);
  },
};

const TASK_INSTRUCTIONS_HALF = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: generate_formatted_html({
    text: `***** ACHTUNG *****<br><br>
           NEUE TASTENZUORDNUNG, BITTE AUFMERKSAM LESEN<br><br>
           ***** ACHTUNG *****<br><br>
          Drücke eine beliebige Taste, um fortzufahren.`,
    fontsize: 38,
    lineheight: 1.5,
    align: 'center',
  }),
};

////////////////////////////////////////////////////////////////////////
//                      Experiment                                    //
////////////////////////////////////////////////////////////////////////
function drawStimulus(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');

  // draw surrounding rectangle
  if (args.draw_colour === 1) {
    ctx.strokeStyle = args.colour;
    ctx.lineWidth = PRMS.rectLineWidth;
    ctx.beginPath();
    ctx.rect(-PRMS.rectWidth / 2, -PRMS.rectHeight / 2, PRMS.rectWidth, PRMS.rectHeight);
    ctx.stroke();
  }

  // letter task
  ctx.font = PRMS.stimFont;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  if (args.draw_letter === 1) {
    ctx.fillText(args.letter, 0, 0);
  }
}

function draw_rsi() {
  'use strict';
}

const RSI = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  translate_origin: true,
  trial_duration: PRMS.rsi,
  response_ends_trial: false,
  stimulus: '',
  func: draw_rsi,
};

function codeTrial() {
  'use strict';

  let dat = jsPsych.data.get().last(1).values()[0];

  // Which hand/finger/task did they respond with/to?
  let mapping = STIM_RESP.order[VTS_DATA.half - 1];
  let respHand = PRMS.leftHand.includes(dat.key_press.toUpperCase()) ? 'left' : 'right';
  let respFinger = PRMS.indexFinger.includes(dat.key_press.toUpperCase()) ? 'index' : 'middle';

  let respTask;
  if (mapping === 'hand') {
    respTask = respHand === 'left' ? STIM_RESP.hand.lt : STIM_RESP.hand.rt;
  } else if (mapping === 'finger') {
    respTask = respFinger === 'index' ? STIM_RESP.finger.it : STIM_RESP.finger.mt;
  }

  // Was it a repeat or repetition of task?
  let transition = 'na';
  if (VTS_DATA.previousTask !== 'na') {
    transition = respTask === VTS_DATA.previousTask ? 'repeat' : 'switch';
  }
  VTS_DATA.repCounter = transition === 'repeat' ? VTS_DATA.repCounter + 1 : 0;

  // Was response correct?
  let correctKeys = [
    STIM_RESP.hand.slr[dat.letter],
    STIM_RESP.hand.slr[dat.colour],
    STIM_RESP.hand.srr[dat.letter],
    STIM_RESP.hand.srr[dat.colour],
    STIM_RESP.finger.sir[dat.letter],
    STIM_RESP.finger.sir[dat.colour],
    STIM_RESP.finger.smr[dat.letter],
    STIM_RESP.finger.smr[dat.colour],
  ];
  let error = correctKeys.includes(dat.key_press.toUpperCase()) ? 0 : 1;

  // console.log('##########################');
  // console.log('Resp hand: ', respHand);
  // console.log('Resp finger: ', respFinger);
  // console.log('Mapping: ', mapping);
  // console.log('Resp task: ', respTask);
  // console.log('Transition: ', transition);
  // console.log('Rep Counter: ', VTS_DATA.repCounter);
  // console.log('RT: ', dat.rt);
  // console.log('Error: ', error);

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    blockNum: VTS_DATA.cBlk,
    trialNum: VTS_DATA.cTrl,
    mapping: mapping,
    respHand: respHand,
    respFinger: respFinger,
    respTask: respTask,
    transition: transition,
    repCounter: VTS_DATA.repCounter,
    error: error,
  });

  // Update vts_data for next trial
  VTS_DATA.cTrl++;
  VTS_DATA.previousTask = respTask;
}

function blockStimuli(n) {
  return repeatArray('both', n / 2).concat(repeatArray(['letter', 'colour'], n / 4));
}

let task = blockStimuli(PRMS.nTrls);

const VTS = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  translate_origin: true,
  response_ends_trial: true,
  choices: PRMS.respKeys,
  trial_duration: PRMS.tooSlow,
  func: drawStimulus,
  stimulus_onset: 0,
  letter: null,
  colour: null,
  func_args: null,
  data: {},
  on_start: function (trial) {
    'use strict';

    // repeat vs. switch task
    let draw_colour;
    let draw_letter;
    if (task[VTS_DATA.cTrl - 1] === 'both') {
      draw_colour = 1;
      draw_letter = 1;
    } else if (task[VTS_DATA.cTrl - 1] === 'letter') {
      draw_colour = 0;
      draw_letter = 1;
    } else if (task[VTS_DATA.cTrl - 1] === 'colour') {
      draw_colour = 1;
      draw_letter = 0;
    }

    // Which letter/colour to show
    let letter;
    let colour;
    if (VTS_DATA.half === 1) {
      letter = draw_letter === 1 ? PRMS.letters1[getRandomInt(0, PRMS.letters1.length - 1)] : '#';
      colour = draw_colour === 1 ? PRMS.colours1[getRandomInt(0, PRMS.colours1.length - 1)] : 'grey';
    } else if (VTS_DATA.half === 2) {
      letter = draw_letter === 1 ? PRMS.letters2[getRandomInt(0, PRMS.letters2.length - 1)] : '#';
      colour = draw_colour === 1 ? PRMS.colours2[getRandomInt(0, PRMS.colours2.length - 1)] : 'grey';
    }

    // activate only response keys for available task?
    if (PRMS.deactivateKeys) {
      trial.choices = [];
      let mapping = STIM_RESP.order[VTS_DATA.half - 1];
      if (mapping === 'hand') {
        if ((draw_letter === 1) && (STIM_RESP.hand.lt === 'letter')) {
          trial.choices = trial.choices.concat(PRMS.leftHand);
        }
        if ((draw_letter === 1) && (STIM_RESP.hand.rt === 'letter')) {
          trial.choices = trial.choices.concat(PRMS.rightHand);
        }
        if ((draw_colour === 1) && (STIM_RESP.hand.lt === 'colour')) {
          trial.choices = trial.choices.concat(PRMS.leftHand);
        }
        if ((draw_colour === 1) && (STIM_RESP.hand.rt === 'colour')) {
          trial.choices = trial.choices.concat(PRMS.rightHand);
        }
      } else if (mapping === 'finger') {
        if ((draw_letter === 1) && (STIM_RESP.finger.it === 'letter')) {
          trial.choices = trial.choices.concat(PRMS.indexFinger);
        }
        if ((draw_letter === 1) && (STIM_RESP.finger.mt === 'letter')) {
          trial.choices = trial.choices.concat(PRMS.middleFinger);
        }
        if ((draw_colour === 1) && (STIM_RESP.finger.it === 'colour')) {
          trial.choices = trial.choices.concat(PRMS.indexFinger);
        }
        if ((draw_colour === 1) && (STIM_RESP.finger.mt === 'colour')) {
          trial.choices = trial.choices.concat(PRMS.middleFinger);
        }
      }
    }

    trial.func_args = [{ letter: letter, colour: colour, draw_colour: draw_colour, draw_letter: draw_letter }];

    trial.data = { stim: 'vtse2', letter: letter, colour: colour, task: task[VTS_DATA.cTrl - 1] };
  },
  on_finish: function () {
    codeTrial();
  },
};

const TRIAL_FEEDBACK = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  trial_duration: PRMS.fbDur[0],
  response_ends_trial: false,
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    let mapping = STIM_RESP.order[VTS_DATA.half - 1];
    let respText = mapping === 'hand' ? RESPMAPPING_HAND1_TF : RESPMAPPING_FINGER1_TF;
    if (dat.error === 1) {
      trial.stimulus =
        generate_formatted_html({
          text: PRMS.fbText[dat.error],
          align: 'center',
          fontsize: 36,
          width: '1200px',
        }) + respText;
      trial.trial_duration = PRMS.fbDur[dat.error];
    }
  },
};

const BLOCK_PERFORMANCE = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  trial_duration: 0,
  response_ends_trial: false,
  on_start: function () {
    let dat = jsPsych.data.get().filter({ blockNum: VTS_DATA.cBlk });
    let nError = dat.select('error').values.filter(function (x) {
      return x === 1;
    }).length;

    // reset vts_data for next block
    VTS_DATA.cTrl = 1;
    VTS_DATA.cBlk += 1;
    VTS_DATA.nColour = 0;
    VTS_DATA.nLetter = 0;
    VTS_DATA.previousTask = 'na';
    VTS_DATA.poorPerformance = nError > PRMS.nPoor;

    if (VTS_DATA.cBlk > PRMS.nBlks / 2) {
      VTS_DATA.half = 2;
    }
  },
};

const BLOCK_FEEDBACK = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  response_ends_trial: false,
  trial_duration: null,
  on_start: function (trial) {
    let mapping = STIM_RESP.order[VTS_DATA.half - 1];
    let respText = mapping === 'hand' ? RESPMAPPING_HAND1 : RESPMAPPING_FINGER1;
    respText = respText.replace(
      'Drücke eine beliebige Taste um fortzufahren.',
      'In 30 Sekunden geht es automatisch weiter...',
    );
    if (VTS_DATA.poorPerformance == 1 && VTS_DATA.cBlk - 1 != PRMS.nBlks / 2) {
      trial.stimulus =
        generate_formatted_html({
          text: `***** ACHTUNG! *****`,
          align: 'center',
          fontsize: 30,
          width: '1200px',
          lineheight: 1.5,
        }) +
        generate_formatted_html({
          text: `Du hast viele Fehler in diesem Block gemacht. Versuche zwar möglichst schnell, aber auch möglichst
            genau zu antworten. Bitte schaue dir nochmal die Tastenzuordnung genau an.`,
          align: 'left',
          fontsize: 30,
          width: '1200px',
          lineheight: 1.5,
        }) +
        respText;
      trial.trial_duration = PRMS.waitDur;
    } else {
      trial.stimulus = '';
      trial.trial_duration = 0;
    }
  },
};

////////////////////////////////////////////////////////////////////////
//                              VP Stunden                            //
////////////////////////////////////////////////////////////////////////
const RANDOM_STRING = generateRandomString(16, 'vtse2_');

const VP_CODE_INSTRUCTIONS2 = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  response_ends_trial: true,
  choices: [' '],
  stimulus: generate_formatted_html({
    text:
      `Super, du bist am Ende des Experiments!
       Vielen Dank für deine Teilnahme :)<br><br>
       Wenn du Versuchspersonenstunden benötigst, kopiere den folgenden
       zufällig generierten Code und sende diesen zusammen mit deiner
       Matrikelnummer per Email mit dem Betreff 'Versuchpersonenstunde'
       an:<br><br>
       hiwipibio@gmail.com <br><br>
       Code: ` +
      RANDOM_STRING +
      `Wenn du statt deiner Versuchspersonenstunde lieber Geld möchtest, dann sende den Code mit
       deinem Namen und Bankverbindung mit dem Betreff 'Versuchspersonengeld' an die obige E-
       Mailadresse.<br><br>
      Drücke die Leertaste, um fortzufahren!`,
    align: 'left',
    fontsize: 30,
    width: '1200px',
    lineheight: 1.5,
  }),
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = getDirName();
const EXP_NAME = getFileName();

function save() {
  const vpNum = getTime();
  jsPsych.data.addProperties({ vpNum: vpNum });

  const data_fn = `${DIR_NAME}data/version${VERSION}/${EXP_NAME}_${vpNum}`;
  saveData('/Common/write_data.php', data_fn, { stim: 'vtse2' });
  // saveDataLocal(data_fn, { stim: 'vtse2' });

  const code_fn = `${DIR_NAME}code/${EXP_NAME}`;
  saveRandomCode('/Common/write_code.php', code_fn, RANDOM_STRING);
}

const SAVE_DATA = {
  type: jsPsychCallFunction,
  func: save,
  post_trial_gap: 1000,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
  'use strict';

  let exp = [];

  exp.push(fullscreen(true));
  exp.push(browser_check(PRMS.screenRes));
  exp.push(resize_browser());
  exp.push(welcome_message());
  exp.push(vpInfoForm('/Common7+/vpInfoForm_de.html'));
  exp.push(mouseCursor(false));

  exp.push(WELCOME_INSTRUCTIONS);
  exp.push(VP_CODE_INSTRUCTIONS1);
  exp.push(TASK_INSTRUCTIONS);

  for (let blk = 0; blk < PRMS.nBlks; blk++) {
    // instruction warning that task->key mapping changes
    if (blk === PRMS.nBlks / 2) {
      exp.push(TASK_INSTRUCTIONS_HALF);
    }
    if (blk == 0) {
      exp.push(TASK_INSTRUCTIONS_FINAL);
    }
    exp.push(TASK_INSTRUCTIONS_BLOCK_START);
    exp.push(RSI);

    // trials within block
    for (let trl = 0; trl < PRMS.nTrls; trl++) {
      exp.push(VTS);
      exp.push(TRIAL_FEEDBACK); // duration = 0 (Correct), 2000 (Error)
      exp.push(RSI); // duration = RSI of 500
      if ((blk === 0) || (blk === PRMS.nBlks / 2)) {
        exp.push(IF_ERROR_TASK_INSTRUCTIONS_MAPPING);
      }
    }

    // between block feedback
    exp.push(BLOCK_PERFORMANCE);
    if (blk < PRMS.nBlks - 1) {
      exp.push(BLOCK_FEEDBACK);
    }
  }

  // save data
  exp.push(SAVE_DATA);

  // debrief
  exp.push(mouseCursor(true));
  exp.push(VP_CODE_INSTRUCTIONS2);
  exp.push(end_message());
  exp.push(fullscreen(false));

  return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
