// Modal Congruency Exp1:
// Participants respond to a centrally presented letter (H or S) with randomly
//  assigned key responses (e.g., Key "Q" = H, Key "P" = S). This target stimulus
//  is combined with a distractor stimulus that is presented either in the visual
//  domain (standard flanker type trial) or in the auditory domain (spoken H or S
//  presented via speakers/headphones). Catch trials include the presentation of
//  the letter X as the target indicating that participants should respond to the
//  identity of the distractor (either visual or auditory). The proportion of
//  congruency to incongruent trials (75%/25%) is manipulated blockwise across
//  experiment half, with order of high/low congruency blocks counter-balanced
//  across participants.

const jsPsych = initJsPsych({});

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  screenRes: [960, 720],
  nBlks: 10, // number of blocks
  fixDur: 1000, // duration of fixation cross
  fixSize: 50, // size of fixation cross
  fbDur: [0, 2000, 2000, 2000], // duration of feedback for each type
  dti: 250, // distractor to target interval
  waitDur: 500, // duration following ...
  iti: 500, // duration of inter-trial-interval
  tooSlow: 2250, // response slower than x ms -> too slow!
  tooFast: 350, // response slower than x ms -> too fast!
  respKeys: ['Q', 'P'],
  respStim: shuffle(['H', 'S']),
  stimSize: 75,
  fbTxt: ['', 'Falsch', 'Zu langsam', 'Zu schnell'],
  fbTxtSizeTrial: 30,
  fbTxtSizeBlock: 30,
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
};

// 2 counter balanced versions
const version = 1; // Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: version });

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions1 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: generate_formatted_html({
    text: `Willkommen zu unserem Experiment:<br><br>
Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und genügend Zeit hast,
um das Experiment durchzuführen. Wir bitten dich die ca. nächsten 25 Minuten konzentriert zu arbeiten.<br><br>
Du erhältst den Code für Versuchspersonenstunden und weitere Anweisungen am Ende des Experiments.
Bei Fragen oder Problemen wende dich bitte an:<br><br>
XXX<br><br>
Drücke eine beliebige Taste, um fortzufahren`,
    align: 'left',
    colour: 'black',
    fontsize: 30,
    bold: true,
    lineheight: 1.5,
  }),
  post_trial_gap: prms.waitDur,
};

const task_instructions2 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: generate_formatted_html({
    text: `In diesem Experiment siehst und hörst du Buchstaben. Reagiere wie folgt:
WICHTIG! Benutze hierfür die Q-Taste mit deinem linken Zeigefinger und die P-Taste mit deinem rechten Zeigefinger.<br><br>
${prms.respStim[0]} = "Q Taste"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${prms.respStim[1]} = "P Taste"<br><br>
Bitte antworte so schnell und so korrekt wie möglich!<br><br>
Drücke eine beliebige Taste, um fortzufahren.`,
    align: 'left',
    colour: 'black',
    fontsize: 30,
    bold: true,
    lineheight: 1.5,
  }),
  post_trial_gap: prms.waitDur,
};

const task_instructions_calibration = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: generate_formatted_html({
    text: `ACHTUNG! Soundkalibierung:<br><br>
    Im Folgenden werden dir Buchstaben audativ und visuell präsentiert.
    Bitte stelle in dieser Zeit die Lautstärke deines Soundsystems so ein, dass du
    deutlich zwischen den zwei Tönen differenzieren kannst.<br><br>
    Anmerkung: Es geht immer automatisch weiter (d.h. du musst keine Taste drucken!).<br><br>
    Bereit? Drücke eine beliebige Taste, um die Töne abzuspielen!`,
    align: 'left',
    colour: 'black',
    fontsize: 30,
    bold: true,
    lineheight: 1.5,
  }),
  post_trial_gap: prms.waitDur,
};

const block_start = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  on_start: function (trial) {
    trial.stimulus = generate_formatted_html({
      text: `Block ${prms.cBlk} von ${prms.nBlks}<br><br>
            Q = links, P = rechts <br><br>
            Drücke eine beliebige Taste, um fortzufahren.<br>`,
      align: 'left',
      colour: 'black',
      fontsize: 30,
    });
  },
  post_trial_gap: prms.waitDur,
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////

const auditory_letters = ['../Sounds/H.wav', '../Sounds/S.wav', '../Sounds/silence.wav'];
const visual_letters = ['H', 'S'];

const preload = {
  type: jsPsychPreload,
  audio: auditory_letters,
};

// prettier-ignore
const trials_calibration = [
    { audio: auditory_letters[0], visual: visual_letters[0] },
    { audio: auditory_letters[1], visual: visual_letters[1] },
];

// prettier-ignore
const trials_congruent = [
    { type: "Flanker", target: prms.respStim[0], distractor: prms.respStim[0], modality: "Visual",   wav_file: auditory_letters[2], congruency: "Congruent", corrKey: prms.respKeys[0] },
    { type: "Flanker", target: prms.respStim[1], distractor: prms.respStim[1], modality: "Visual",   wav_file: auditory_letters[2], congruency: "Congruent", corrKey: prms.respKeys[1] },
    { type: "Flanker", target: prms.respStim[0], distractor: prms.respStim[0], modality: "Auditory", wav_file: auditory_letters[0], congruency: "Congruent", corrKey: prms.respKeys[0] },
    { type: "Flanker", target: prms.respStim[1], distractor: prms.respStim[1], modality: "Auditory", wav_file: auditory_letters[1], congruency: "Congruent", corrKey: prms.respKeys[1] }
];

// prettier-ignore
const trials_incongruent = [
    { type: "Flanker", target: prms.respStim[0], distractor: prms.respStim[1], modality: "Visual",   wav_file: auditory_letters[2], congruency: "Incongruent", corrKey: prms.respKeys[0] },
    { type: "Flanker", target: prms.respStim[1], distractor: prms.respStim[0], modality: "Visual",   wav_file: auditory_letters[2], congruency: "Incongruent", corrKey: prms.respKeys[1] },
    { type: "Flanker", target: prms.respStim[0], distractor: prms.respStim[1], modality: "Auditory", wav_file: auditory_letters[1], congruency: "Incongruent", corrKey: prms.respKeys[0] },
    { type: "Flanker", target: prms.respStim[1], distractor: prms.respStim[0], modality: "Auditory", wav_file: auditory_letters[0], congruency: "Incongruent", corrKey: prms.respKeys[1] }
];

// prettier-ignore
const trials_catch = [
    { type: "Catch", target: "X", distractor: prms.respStim[0], modality: "Visual",   wav_file: auditory_letters[2], congruency: "NA", corrKey: prms.respKeys[0] },
    { type: "Catch", target: "X", distractor: prms.respStim[1], modality: "Visual",   wav_file: auditory_letters[2], congruency: "NA", corrKey: prms.respKeys[1] },
    { type: "Catch", target: "X", distractor: prms.respStim[0], modality: "Auditory", wav_file: auditory_letters[0], congruency: "NA", corrKey: prms.respKeys[0] },
    { type: "Catch", target: "X", distractor: prms.respStim[1], modality: "Auditory", wav_file: auditory_letters[1], congruency: "NA", corrKey: prms.respKeys[1] },
];

// prettier-ignore
// const trials_high_pc = repeatArray(trials_congruent, 15).concat(repeatArray(trials_incongruent, 5)).concat(trials_catch);
// const trials_low_pc = repeatArray(trials_congruent, 5).concat(repeatArray(trials_incongruent, 15)).concat(trials_catch);
// console.log(trials_high_pc);
// console.log(trials_low_pc);

// prettier-ignore
const trials_high_pc = repeatArray(trials_congruent, 1).concat(repeatArray(trials_incongruent, 1)).concat(trials_catch);
const trials_low_pc = repeatArray(trials_congruent, 1).concat(repeatArray(trials_incongruent, 1)).concat(trials_catch);
// console.log(trials_high_pc);
// console.log(trials_low_pc);

////////////////////////////////////////////////////////////////////////
//                              Exp Parts                             //
////////////////////////////////////////////////////////////////////////
const fixation_cross = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div style="font-size:${prms.fixSize}px;">+</div>`,
  response_ends_trial: false,
  trial_duration: prms.fixDur,
};

const iti = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  response_ends_trial: false,
  trial_duration: prms.iti,
};

const trial_feedback = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  response_ends_trial: false,
  trial_duration: null,
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    console.log(dat.corrCode);
    trial.trial_duration = prms.fbDur[dat.corrCode - 1];
    trial.stimulus = `<div style="font-size:${prms.fbTxtSizeTrial}px;">${prms.fbTxt[dat.corrCode - 1]}</div>`;
  },
};

function codeTrial() {
  'use strict';

  let dat = jsPsych.data.get().last(1).values()[0];
  dat.rt = dat.rt !== null ? dat.rt : prms.tooSlow;

  let corrCode = 0;
  let correctKey = jsPsych.pluginAPI.compareKeys(dat.response, dat.corrKey);

  if (correctKey && (dat.rt > prms.tooFast) & (dat.rt < prms.tooSlow)) {
    corrCode = 1; // correct
  } else if (!correctKey && (dat.rt > prms.tooFast) & (dat.rt < prms.tooSlow)) {
    corrCode = 2; // choice error
  } else if (dat.rt >= prms.tooSlow) {
    corrCode = 3; // too slow
  } else if (dat.rt <= prms.tooFast) {
    corrCode = 4; // too fast
  }
  jsPsych.data.addDataToLastTrial({
    date: Date(),
    blockNum: prms.cBlk,
    trialNum: prms.cTrl,
    corrCode: corrCode,
  });
}

const audio_calibration = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: jsPsych.timelineVariable('audio'),
  prompt: '',
  choices: [],
  trial_duration: 500,
  response_ends_trial: false,
  post_trial_gap: 500,
  on_start: function (trial) {
    let v = jsPsych.timelineVariable('visual');
    trial.prompt = `<div style="font-size:${prms.stimSize}px;">${v}</div>`;
  },
};

const flanker_modality_trial = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: jsPsych.timelineVariable('wav_file'),
  prompt: '',
  prompt2: '',
  trial_duration: prms.tooSlow,
  response_ends_trial: true,
  choices: prms.respKeys,
  prompt2_onset: prms.dti,
  data: {
    stim: 'modal_flanker',
    type: jsPsych.timelineVariable('type'),
    target: jsPsych.timelineVariable('target'),
    distractor: jsPsych.timelineVariable('distractor'),
    modality: jsPsych.timelineVariable('modality'),
    wav_file: jsPsych.timelineVariable('wav_file'),
    congruency: jsPsych.timelineVariable('congruency'),
    corrKey: jsPsych.timelineVariable('corrKey'),
  },
  on_start: function (trial) {
    let distractor = trial.data.modality === 'Visual' ? jsPsych.timelineVariable('distractor') : '\xa0';
    let stimulus = distractor + '\xa0' + distractor;
    trial.prompt = `<div style="font-size:${prms.stimSize}px; font-family: monospace">${stimulus}</div>`;

    let target = jsPsych.timelineVariable('target');
    distractor = trial.data.modality === 'Visual' ? jsPsych.timelineVariable('distractor') : '\xa0';
    stimulus = distractor + target + distractor;
    trial.prompt2 = `<div style="font-size:${prms.stimSize}px; font-family: monospace">${stimulus}</div>`;
  },
  on_finish: function () {
    codeTrial();
    prms.cTrl += 1;
  },
};

const trial_timeline_calibration = {
  timeline: [audio_calibration],
  timeline_variables: trials_calibration,
  sample: {
    type: 'fixed-repetitions',
    size: 10,
  },
};

const trial_timeline_high_pc = {
  timeline: [fixation_cross, flanker_modality_trial, trial_feedback, iti],
  timeline_variables: trials_high_pc,
};

const trial_timeline_low_pc = {
  timeline: [fixation_cross, flanker_modality_trial, trial_feedback, iti],
  timeline_variables: trials_low_pc,
};

const block_feedback = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  response_ends_trial: true,
  post_trial_gap: prms.waitDur,
  on_start: function (trial) {
    let block_dvs = calculateBlockPerformance({ filter_options: { stim: 'modal_negation', blockNum: prms.cBlk } });
    let text = blockFeedbackText(prms.cBlk, prms.nBlks, block_dvs.meanRt, block_dvs.errorRate, (language = 'de'));
    trial.stimulus = `<div style="font-size:${prms.fbTxtSizeBlock}px;">${text}</div>`;
  },
  on_finish: function () {
    prms.cTrl = 1;
    prms.cBlk += 1;
  },
};

////////////////////////////////////////////////////////////////////////
//                              VP Stunden                            //
////////////////////////////////////////////////////////////////////////
const randomString = generateRandomString(16, 'mn1_');

const alphaNum = {
  type: jsPsychHtmlKeyboardResponse,
  response_ends_trial: true,
  choices: [' '],
  stimulus: generate_formatted_html({
    text:
      `Vielen Dank für Ihre Teilnahme.<br><br>
        Wenn Sie Versuchspersonenstunden benötigen, kopieren Sie den folgenden
        zufällig generierten Code und senden Sie diesen zusammen mit Ihrer
        Matrikelnummer per Email mit dem Betreff 'Versuchpersonenstunde'
        an:<br><br>
        xxx<br><br>
        Code: ` +
      randomString +
      `<br><br>Drücken Sie die Leertaste, um fortzufahren!`,
    fontsize: 28,
    lineheight: 1.0,
    bold: true,
    align: 'left',
  }),
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const dirName = getDirName();
const expName = getFileName();

function save() {
  const vpNum = getTime();
  jsPsych.data.addProperties({ vpNum: vpNum });

  const data_fn = `${dirName}data/${expName}_${vpNum}`;
  saveData('/Common/write_data.php', data_fn, { stim: 'flanker' });

  const code_fn = `${dirName}code/${expName}`;
  saveRandomCode('/Common/write_code.php', code_fn, randomString);
}

const save_data = {
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

  // exp.push(fullscreen(true));
  // exp.push(browser_check(prms.screenRes));
  // exp.push(preload);
  // exp.push(resize_browser());
  // exp.push(welcome_message());
  // exp.push(vpInfoForm('/Common7+/vpInfoForm_de.html'));
  exp.push(mouseCursor(false));
  exp.push(task_instructions1);
  exp.push(task_instructions2);

  // // audio calibration
  // exp.push(task_instructions_calibration);
  // exp.push(trial_timeline_calibration);

  // Counter-balanced task order Flanker-Simon vs. Simon-Flanker
  let blk_prortion_congruency;
  if (version === 1) {
    blk_prortion_congruency = repeatArray(['high_pc'], prms.nBlks / 2).concat(repeatArray(['low_pc'], prms.nBlks / 2));
  } else if (version === 2) {
    blk_prortion_congruency = repeatArray(['low_pc'], prms.nBlks / 2).concat(repeatArray(['high_pc'], prms.nBlks / 2));
  }

  let blk_timeline;
  for (let blk = 0; blk < prms.nBlks; blk += 1) {
    if (blk_prortion_congruency[blk] === 'high_pc') {
      blk_timeline = { ...trial_timeline_high_pc };
    } else if (blk_prortion_congruency[blk] === 'low_pc') {
      blk_timeline = { ...trial_timeline_low_pc };
    }
    blk_timeline.sample = {
      type: 'fixed-repetitions',
      size: 1,
    };
    exp.push(blk_timeline); // trials within a block
  }

  // exp.push(save_data);

  // // debrief
  // exp.push(mouseCursor(true));
  // exp.push(alphaNum);
  // exp.push(end_message());
  // exp.push(fullscreen(false));

  return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
