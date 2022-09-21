// Control Retrieval Exp1
// M.Sc. Project: Paul Kelber 2022
//
// Stimuli:
// Targets + distractors: coloured circles (red, green, blue, yellow)
// Contexts: Auditory (soft/loud sounds, or silence); Visual (grey/white background, or black)
// Response keys:
// "S"/"D" and "K"/"L"
//
// Targets, distractors and context randomly divided into two sets: E.g.,
// red/green targets+distractors visual; blue/yellow targets+distractors auditory
// with the above pairs randomly assigned to key pairs ("S"/"D" vs. "K"/"L")
//
// 16 different trial types from combinations of:
// 2 context modalities, 2 targets, 2 distractors, 2 context intensities
//
// Randomisation constraint:
// S-R sets and context modalities alternated from trial to trial
// Only context intensity was allowed to repeat across trials
//
// Experiment structure:
// 1 practice block followed by 14 experimental blocks (64 trials each; 16 * 4)
//
// Trial structure:
// Central fixation cross for 200 ms
// Context stimulus for 1000 ms
// Blank screen for 50 ms
// Distractor (prime) for 150 ms
// Blank screen for 150 ms
// Target (probe) for 150 ms
// Blank screen until response (or 2000 ms)
// Visual feedback for 1000 ms following
//  incorrect ("Falsch")
//  too fast (<150 ms; "Zu schnell")
//  too slow ("Zu langsam")
// Blank ITI for 1500 ms
//
// Block feedback provided regarding previous block mean RT/ER
//
// Design:
// 2(Current congruency: congruent vs. incongruent) X
// 2(Previous congruency: congruent vs. incongruent) X
// 2(Context transition: repetition vs. alternation)
// with DVs being RT and ER

const jsPsych = initJsPsych({});

const CANVAS_COLOUR = 'rgba(0, 0, 0, 1)';
const CANVAS_SIZE = [1280, 720];
const CANVAS_BORDER = '0px solid black';

const AUDITORY_CONTEXTS = ['../tones/silence.wav', '../tones/low.wav', '../tones/high.wav'];
const VISUAL_CONTEXTS = ['rgba(0, 0, 0, 1)', 'rgba(100, 100, 100, 1)', 'rgba(200, 200, 200, 1)'];

// index positions 0,1=visual context; 1,2=auditory context
const STIMULI_COLOURS = shuffle(['Red', 'Green', 'Blue', 'Yellow']);
// console.log(STIMULI_COLOURS);

// index positions 0=visual context; 1=auditory context
const RESP_KEYS = ['S', 'D', 'K', 'L'];
const RESP_KEYS_SHUFFLED = shuffle([
  [RESP_KEYS[0], RESP_KEYS[1]],
  [RESP_KEYS[2], RESP_KEYS[3]],
]).flat();
// console.log(RESP_KEYS_SHUFFLED);

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
  screenRes: [960, 720], // minimum screen resolution requested
  nBlks: 15, // number of blocks
  nTrls: 64, // number of trials per block
  fixDur: 200, // duration of fixation cross
  fixWidth: 5, // width fixation cross
  fixSize: 20, // size of fixation
  contextDur: 1000, // duration of the context stimulus
  contextPrimeISI: 50, // duration of interval between context and prime
  primeDur: 150, // duration of prime stimulus
  primeTargetISI: 150, // duration of interval between prime and target
  targetDur: 150, // duration of target stimulus
  circleRadius: 100, // size of the prime/target circles
  tooFast: 150, // response limit min
  tooSlow: 2000, // response interval timeout
  fbDur: [0, 1000, 1000, 1000], // duration of feedback for each type (correct, error, too slow, too fast)
  fbTxt: ['', 'Falsch!', 'Zu langsam!', 'Zu schnell!'],
  fbTxtSizeTrial: 26,
  fbTxtSizeBlock: 26,
  waitBlankDur: 500, // interval between screens (e.g. instructions)
  iti: 1500, // duration of inter-trial-interval
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////

const TASK_INSTRUCTIONS1 = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: generate_formatted_html({
    text: `Willkommen zu unserem Experiment:<br><br>
           Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
           Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest, Chrome oder Fifefox nutzt und genügend Zeit hast,
           um das Experiment durchzuführen. Wir bitten dich, in den nächsten ca. 35 Minuten konzentriert zu arbeiten.<br><br>
           Du erhältst den Code für Versuchspersonenstunden und weitere Anweisungen am Ende des Experiments.
           Bei Fragen oder Problemen wende dich bitte an:<br><br>
           hiwipibio@gmail.com <br><br>
           Drücke eine beliebige Taste, um fortzufahren`,
    align: 'left',
    color: 'white',
    fontsize: 28,
    bold: true,
    lineheight: 1.5,
  }),
};

const TASK_INSTRUCTIONS_CALIBRATION = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: generate_formatted_html({
    text: `ACHTUNG! Soundkalibierung:<br><br>
    Im Folgenden werden dir auditiv Tone präsentiert.
    Bitte stelle in dieser Zeit die Lautstärke deines Soundsystems so ein, dass du
    deutlich zwischen den zwei Tönen differenzieren kannst.<br><br>
    Anmerkung: Es geht immer automatisch weiter (d.h. du musst keine Taste drücken!).<br><br>
    Bereit? Drücke eine beliebige Taste, um die Töne abzuspielen!`,
    align: 'left',
    color: 'white',
    fontsize: 28,
    bold: true,
    lineheight: 1.5,
  }),
};

const RESP_TEXT = generate_formatted_html({
  text: `<span style="color: ${STIMULI_COLOURS[RESP_KEYS_SHUFFLED.indexOf(RESP_KEYS[0])]}">${
    RESP_KEYS[0]
  } Taste</span>&emsp;&emsp;<span style="color: ${STIMULI_COLOURS[RESP_KEYS_SHUFFLED.indexOf(RESP_KEYS[1])]}">${
    RESP_KEYS[1]
  } Taste</span>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<span style="color: ${
    STIMULI_COLOURS[RESP_KEYS_SHUFFLED.indexOf(RESP_KEYS[2])]
  }">${RESP_KEYS[2]} Taste</span>&emsp;&emsp;<span style="color: ${
    STIMULI_COLOURS[RESP_KEYS_SHUFFLED.indexOf(RESP_KEYS[3])]
  }">${RESP_KEYS[3]} Taste</span>`,
  align: 'center',
  color: 'white',
  fontsize: 28,
  bold: true,
  lineheight: 1.5,
});

const TASK_INSTRUCTIONS_RESP_MAPPING = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: RESP_TEXT,
};

////////////////////////////////////////////////////////////////////////
//               Preload Tones and Calibration Routine                //
////////////////////////////////////////////////////////////////////////
const PRELOAD = {
  type: jsPsychPreload,
  audio: AUDITORY_CONTEXTS,
};

const TRIALS_CALIBRATION = [{ audio: AUDITORY_CONTEXTS[1] }, { audio: AUDITORY_CONTEXTS[2] }];

function draw_note() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  ctx.textBaseline = 'middle';
  ctx.font = '100px monospace';
  ctx.strokeText('\u{1F3A7}', -50, 0);
}

const AUDIO_CALIBRATION = {
  type: jsPsychStaticCanvasSoundKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  sound: jsPsych.timelineVariable('audio'),
  trial_duration: PRMS.contextDur,
  func: draw_note, // some visual feedback
};

const WAIT_BLANK = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  trial_duration: PRMS.iti,
  response_ends_trial: false,
};

const TRIAL_TIMELINE_CALIBRATION = {
  timeline: [AUDIO_CALIBRATION, WAIT_BLANK],
  timeline_variables: TRIALS_CALIBRATION,
  sample: {
    type: 'fixed-repetitions',
    size: 1, // repeat each tone X times
  },
};


////////////////////////////////////////////////////////////////////////
//                         Timeline Variables                         //
////////////////////////////////////////////////////////////////////////
// prettier-ignore
const TRIALS = [
    { ctx_mod: "vis", intensity: "l", ctx_col: VISUAL_CONTEXTS[1], ctx_sound: AUDITORY_CONTEXTS[0], probe_col: STIMULI_COLOURS[0], target_col: STIMULI_COLOURS[0], compatibility: "comp",   correct_key: RESP_KEYS_SHUFFLED[STIMULI_COLOURS.indexOf(STIMULI_COLOURS[0])] },
    { ctx_mod: "vis", intensity: "l", ctx_col: VISUAL_CONTEXTS[1], ctx_sound: AUDITORY_CONTEXTS[0], probe_col: STIMULI_COLOURS[1], target_col: STIMULI_COLOURS[1], compatibility: "comp",   correct_key: RESP_KEYS_SHUFFLED[STIMULI_COLOURS.indexOf(STIMULI_COLOURS[1])] },
    { ctx_mod: "vis", intensity: "l", ctx_col: VISUAL_CONTEXTS[1], ctx_sound: AUDITORY_CONTEXTS[0], probe_col: STIMULI_COLOURS[1], target_col: STIMULI_COLOURS[0], compatibility: "incomp", correct_key: RESP_KEYS_SHUFFLED[STIMULI_COLOURS.indexOf(STIMULI_COLOURS[0])] },
    { ctx_mod: "vis", intensity: "l", ctx_col: VISUAL_CONTEXTS[1], ctx_sound: AUDITORY_CONTEXTS[0], probe_col: STIMULI_COLOURS[0], target_col: STIMULI_COLOURS[1], compatibility: "incomp", correct_key: RESP_KEYS_SHUFFLED[STIMULI_COLOURS.indexOf(STIMULI_COLOURS[1])] },
    { ctx_mod: "vis", intensity: "h", ctx_col: VISUAL_CONTEXTS[2], ctx_sound: AUDITORY_CONTEXTS[0], probe_col: STIMULI_COLOURS[0], target_col: STIMULI_COLOURS[0], compatibility: "comp",   correct_key: RESP_KEYS_SHUFFLED[STIMULI_COLOURS.indexOf(STIMULI_COLOURS[0])] },
    { ctx_mod: "vis", intensity: "h", ctx_col: VISUAL_CONTEXTS[2], ctx_sound: AUDITORY_CONTEXTS[0], probe_col: STIMULI_COLOURS[1], target_col: STIMULI_COLOURS[1], compatibility: "comp",   correct_key: RESP_KEYS_SHUFFLED[STIMULI_COLOURS.indexOf(STIMULI_COLOURS[1])] },
    { ctx_mod: "vis", intensity: "h", ctx_col: VISUAL_CONTEXTS[2], ctx_sound: AUDITORY_CONTEXTS[0], probe_col: STIMULI_COLOURS[1], target_col: STIMULI_COLOURS[0], compatibility: "incomp", correct_key: RESP_KEYS_SHUFFLED[STIMULI_COLOURS.indexOf(STIMULI_COLOURS[0])] },
    { ctx_mod: "vis", intensity: "h", ctx_col: VISUAL_CONTEXTS[2], ctx_sound: AUDITORY_CONTEXTS[0], probe_col: STIMULI_COLOURS[0], target_col: STIMULI_COLOURS[1], compatibility: "incomp", correct_key: RESP_KEYS_SHUFFLED[STIMULI_COLOURS.indexOf(STIMULI_COLOURS[1])] },
    { ctx_mod: "aud", intensity: "l", ctx_col: VISUAL_CONTEXTS[0], ctx_sound: AUDITORY_CONTEXTS[1], probe_col: STIMULI_COLOURS[2], target_col: STIMULI_COLOURS[2], compatibility: "comp",   correct_key: RESP_KEYS_SHUFFLED[STIMULI_COLOURS.indexOf(STIMULI_COLOURS[2])] },
    { ctx_mod: "aud", intensity: "l", ctx_col: VISUAL_CONTEXTS[0], ctx_sound: AUDITORY_CONTEXTS[1], probe_col: STIMULI_COLOURS[3], target_col: STIMULI_COLOURS[3], compatibility: "comp",   correct_key: RESP_KEYS_SHUFFLED[STIMULI_COLOURS.indexOf(STIMULI_COLOURS[3])] },
    { ctx_mod: "aud", intensity: "l", ctx_col: VISUAL_CONTEXTS[0], ctx_sound: AUDITORY_CONTEXTS[1], probe_col: STIMULI_COLOURS[3], target_col: STIMULI_COLOURS[2], compatibility: "incomp", correct_key: RESP_KEYS_SHUFFLED[STIMULI_COLOURS.indexOf(STIMULI_COLOURS[2])] },
    { ctx_mod: "aud", intensity: "l", ctx_col: VISUAL_CONTEXTS[0], ctx_sound: AUDITORY_CONTEXTS[1], probe_col: STIMULI_COLOURS[2], target_col: STIMULI_COLOURS[3], compatibility: "incomp", correct_key: RESP_KEYS_SHUFFLED[STIMULI_COLOURS.indexOf(STIMULI_COLOURS[3])] },
    { ctx_mod: "aud", intensity: "h", ctx_col: VISUAL_CONTEXTS[0], ctx_sound: AUDITORY_CONTEXTS[2], probe_col: STIMULI_COLOURS[2], target_col: STIMULI_COLOURS[2], compatibility: "comp",   correct_key: RESP_KEYS_SHUFFLED[STIMULI_COLOURS.indexOf(STIMULI_COLOURS[2])] },
    { ctx_mod: "aud", intensity: "h", ctx_col: VISUAL_CONTEXTS[0], ctx_sound: AUDITORY_CONTEXTS[2], probe_col: STIMULI_COLOURS[3], target_col: STIMULI_COLOURS[3], compatibility: "comp",   correct_key: RESP_KEYS_SHUFFLED[STIMULI_COLOURS.indexOf(STIMULI_COLOURS[3])] },
    { ctx_mod: "aud", intensity: "h", ctx_col: VISUAL_CONTEXTS[0], ctx_sound: AUDITORY_CONTEXTS[2], probe_col: STIMULI_COLOURS[3], target_col: STIMULI_COLOURS[2], compatibility: "incomp", correct_key: RESP_KEYS_SHUFFLED[STIMULI_COLOURS.indexOf(STIMULI_COLOURS[2])] },
    { ctx_mod: "aud", intensity: "h", ctx_col: VISUAL_CONTEXTS[0], ctx_sound: AUDITORY_CONTEXTS[2], probe_col: STIMULI_COLOURS[2], target_col: STIMULI_COLOURS[3], compatibility: "incomp", correct_key: RESP_KEYS_SHUFFLED[STIMULI_COLOURS.indexOf(STIMULI_COLOURS[3])] }
];

////////////////////////////////////////////////////////////////////////
//                         Trial Parts                                //
////////////////////////////////////////////////////////////////////////

function draw_fixation() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  ctx.strokeStyle = 'White';
  ctx.lineWidth = PRMS.fixWidth;
  ctx.moveTo(-PRMS.fixSize, 0);
  ctx.lineTo(PRMS.fixSize, 0);
  ctx.stroke();
  ctx.moveTo(0, -PRMS.fixSize);
  ctx.lineTo(0, PRMS.fixSize);
  ctx.stroke();
}

const FIXATION_CROSS = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  translate_origin: true,
  response_ends_trial: false,
  trial_duration: PRMS.fixDur,
  func: draw_fixation,
};

const CONTEXT = {
  type: jsPsychStaticCanvasSoundKeyboardResponse,
  canvas_colour: jsPsych.timelineVariable('ctx_col'),
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  sound: jsPsych.timelineVariable('ctx_sound'),
  trial_duration: PRMS.contextDur,
  response_ends_trial: false,
};

const CONTEXT_PRIME_ISI = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  translate_origin: true,
  trial_duration: PRMS.contextPrimeISI,
  response_ends_trial: false,
};

function draw_prime(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  ctx.fillStyle = args.colour;
  ctx.beginPath();
  ctx.arc(0, 0, PRMS.circleRadius, 0, 2 * Math.PI);
  ctx.fill();
}

const PRIME = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  translate_origin: true,
  response_ends_trial: true,
  trial_duration: PRMS.primeDur,
  func: draw_prime,
  func_args: [{ colour: jsPsych.timelineVariable('probe_col') }],
};

const PRIME_TARGET_ISI = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  translate_origin: true,
  trial_duration: PRMS.primeTargetISI,
  response_ends_trial: false,
};

function draw_target(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  ctx.fillStyle = args.colour;
  ctx.beginPath();
  ctx.arc(0, 0, PRMS.circleRadius, 0, 2 * Math.PI);
  ctx.fill();
}

function codeTrial() {
  'use strict';

  let dat = jsPsych.data.get().last(1).values()[0];
  dat.rt = dat.rt !== null ? dat.rt : PRMS.tooSlow;

  let corrCode = 0;
  let correctKey = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.correct_key);

  if (correctKey && dat.rt > PRMS.tooFast && dat.rt < PRMS.tooSlow) {
    corrCode = 1; // correct
  } else if (!correctKey && dat.rt > PRMS.tooFast && dat.rt < PRMS.tooSlow) {
    corrCode = 2; // choice error
  } else if (dat.rt >= PRMS.tooSlow) {
    corrCode = 3; // too slow
  } else if (dat.rt <= PRMS.tooFast) {
    corrCode = 4; // too fast
  }

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    blockNum: PRMS.cBlk,
    trialNum: PRMS.cTrl,
    corrCode: corrCode,
  });
}

const TARGET = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  translate_origin: true,
  response_ends_trial: true,
  stimulus_duration: PRMS.targetDur,
  trial_duration: PRMS.tooSlow,
  func: draw_target,
  func_args: [{ colour: jsPsych.timelineVariable('target_col') }],
  data: {
    stim: 'cr1',
    ctx_mod: jsPsych.timelineVariable('ctx_mod'),
    intensity: jsPsych.timelineVariable('intensity'),
    ctx_col: jsPsych.timelineVariable('ctx_col'),
    ctx_sound: jsPsych.timelineVariable('ctx_sound'),
    probe_col: jsPsych.timelineVariable('probe_col'),
    target_col: jsPsych.timelineVariable('target_col'),
    compatibility: jsPsych.timelineVariable('compatibility'),
    correct_key: jsPsych.timelineVariable('correct_key'),
  },
  on_finish: function () {
    codeTrial();
    PRMS.cTrl += 1;
  },
};

const TRIAL_FEEDBACK = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  trial_duration: null,
  response_ends_trial: false,
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.trial_duration = PRMS.fbDur[dat.corrCode - 1];
    trial.stimulus = generate_formatted_html({
      text: PRMS.fbTxt[dat.corrCode - 1],
      color: 'white',
      align: 'center',
      fontsize: fbTxtSizeTrial,
      width: '1200px',
      bold: true,
    });
  },
};

const ITI = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  translate_origin: true,
  trial_duration: PRMS.iti,
  response_ends_trial: false,
};

const BLOCK_FEEDBACK = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: '',
  trial_duration: null,
  response_ends_trial: true,
  on_start: function (trial) {
    let block_dvs = calculateBlockPerformance({ filter_options: { stim: 'cr1', blockNum: PRMS.cBlk } });
    let text = blockFeedbackText(PRMS.cBlk, PRMS.nBlks, block_dvs.meanRt, block_dvs.errorRate, (language = 'de'));
    trial.stimulus = `<div style="font-size:${PRMS.fbTxtSizeBlock}px; color:white;">${text}</div>`;
  },
  on_finish: function () {
    PRMS.cTrl = 1;
    PRMS.cBlk += 1;
  },
};

////////////////////////////////////////////////////////////////////////
//                         Trial Timeline                             //
////////////////////////////////////////////////////////////////////////
const TRIAL_TIMELINE = {
  timeline: [FIXATION_CROSS, CONTEXT, CONTEXT_PRIME_ISI, PRIME, PRIME_TARGET_ISI, TARGET, TRIAL_FEEDBACK, ITI],
  timeline_variables: TRIALS,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
  'use strict';

  let exp = [];

  /* exp.push(fullscreen(true)); */
  /* exp.push(browser_check(PRMS.screenRes)); */
  /* exp.push(PRELOAD); */
  /* exp.push(resize_browser()); */
  /* exp.push(welcome_message()); */
  /* exp.push(vpInfoForm'/Common7+/vpInfoForm_de.html')); */
  /* exp.push(mouseCursor(false)); */
  exp.push(TASK_INSTRUCTIONS1);
  exp.push(WAIT_BLANK);

  // audio calibration
  // exp.push(TASK_INSTRUCTIONS_CALIBRATION);
  // exp.push(WAIT_BLANK);
  // exp.push(TRIAL_TIMELINE_CALIBRATION);

  for (let blk = 0; blk < PRMS.nBlks; blk++) {
    // manipulation instructions at very start or half way

    exp.push(TASK_INSTRUCTIONS_RESP_MAPPING);
    exp.push(WAIT_BLANK); // blank before 1st trial start

    let blk_timeline = { ...TRIAL_TIMELINE };

    blk_timeline.sample = {
      type: 'fixed-repetitions',
      size: 1, // PRMS.nTrls / TRIALS.length,
    };
    // exp.push(blk_timeline);

    // between block feedback
    exp.push(BLOCK_FEEDBACK);
  }

  exp.push(TASK_INSTRUCTIONS_RESP_MAPPING);
  exp.push(TRIAL_TIMELINE);

  return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
