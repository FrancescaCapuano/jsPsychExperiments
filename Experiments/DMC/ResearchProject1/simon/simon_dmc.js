// Modified version of a Simon Task:
// VPs respond to the colour of a centrally presented square whilst ignoring
//  laterally presented squares. The laterally presented squares 
// VPs respond to the colour of the presented stimulus using
// left and right key responses.

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const cc = "rgba(200, 200, 200, 1)";
const cs = [960, 720];
const cb = "5px solid black";

////////////////////////////////////////////////////////////////////////
//                             Experiment                             //
////////////////////////////////////////////////////////////////////////
const expName = getFileName();
const dirName = getDirName();
const vpNum   = genVpNum();

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
    nTrlsP: 32,  // number of trials in first block (practice)
    nTrlsE: 96,  // number of trials in subsequent blocks 
    nBlks: 11,   
    fixDur: 500,
    fbDur: [500, 1000, 1000, 1000],
    simonDur: 100,
    iti: 500,
    tooFast: 150,
    tooSlow: 2000,
    fbTxt: ["Richtig", "Falsch", "Zu langsam", "Zu schnell"],
    cTrl: 1,  // count trials
    cBlk: 1,  // count blocks
    respColours: ["red", "green"],
    fixWidth: 3,
    fixSize: 15,
    fbSize: "30px monospace",
    respKeys: [],
};

const versionNumber = getVersionNumber(vpNum, 2)
if (versionNumber === 1) {
    prms.respKeys = ["D", "J", 27];
    respText = "<h4 align='left'><b>BLUE</b> drücken Sie die <b>Taste D</b> (linken Zeigefinger).</h4>" +
               "<h4 align='left'><b>RED</b>  drücken Sie die <b>Taste J</b> (rechten Zeigefinger).</h4>";
} else {
    prms.respKeys = ["J", "D", 27];
    respText = "<h4 align='left'><b>RED</b>  drücken Sie die <b>Taste D</b> (linken Zeigefinger).</h4>" +
               "<h4 align='left'><b>BLUE</b> drücken Sie die <b>Taste J</b> (rechten Zeigefinger).</h4>";
}

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions1 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus: "<h2 align='center'>Willkommen bei unserem Experiment:</h2><br>" +
    "<h3 align='center'>Diese Studie wird im Rahmen einer B.Sc. Projektarbeit durchgeführt.</h3>" +
    "<h3 align='center'>Die Teilnahme ist freiwillig und Sie dürfen das Experiment jederzeit abbrechen.</h3><br>" +
    "<h2 align='center'>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>",
    on_finish: function() {
        $('body').css('cursor', 'none'); 
    },
};

const task_instructions2 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus: 
    "<h2 align='center'>Aufgabe:</h2><br>" +
    "<h4 align='left'>Dieses Experiment besteht aus insgesamt 13 Blöcken. Jeder Block besteht wiederum aus mehreren Durchgängen.</h4>" +
    "<h4 align='left'>Sie werden in jedem Durchgang des Experiments eine Reihe von 5 Buchstaben sehen (z.B. HHHHH, HHSHH).</h4>" +
    "<h4 align='left'>Bitte reagieren Sie immer auf den Buchstaben in der Mitte, die anderen Buchstaben sollen Sie möglichst ignorieren.</h4>" +
    respText +
    "<h4 align='left'>Bitte reagieren Sie so schnell und korrekt wie möglich.</h4>" +
    "<h4 align='left'>Nach jedem Tastendruck erhalten Sie die Rückmeldung, ob Ihre Antwort <b>richtig</b> oder <b>falsch</b> war.</h4>" +
    "<h4 align='left'>Am Ende jedes Blocks haben Sie die Möglichkeit eine kleine Pause zu machen.</h4><br>" +
    "<h2 align='center'>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>",
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
function drawFixation() {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.lineWidth = prms.fixWidth;
    ctx.moveTo(-prms.fixSize, 0);
    ctx.lineTo( prms.fixSize, 0);
    ctx.stroke(); 
    ctx.moveTo(0, -prms.fixSize);
    ctx.lineTo(0,  prms.fixSize);
    ctx.stroke(); 
}

const fixation_cross = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    trial_duration: prms.fixDur,
    translate_origin: true,
    response_ends_trial: false,
    func: drawFixation
};

function drawFeedback() {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');
    let dat = jsPsych.data.get().last(1).values()[0];
    ctx.font = prms.fbSize;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";
    ctx.fillText(prms.fbTxt[dat.corrCode-1], 0, 0); 
}


function drawSimon(args) {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');
    let dat = jsPsych.data.get().last(1).values()[0];

    // left
    ctx.fillStyle = args["left"];
    ctx.fillRect(-100, -25, 50, 50);
   
    // middle
    ctx.fillStyle = args["middle"];
    ctx.fillRect(-25, -25, 50, 50);
   
    // right
    ctx.fillStyle = args["right"];
    ctx.fillRect(50, -25, 50, 50);

}

const trial_feedback = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    translate_origin: true,
    response_ends_trial: false,
    func: drawFeedback,
    on_start: function(trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        trial.trial_duration = prms.fbDur[dat.corrCode - 1]; 
    }
};

const iti = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    trial_duration: prms.iti,
    response_ends_trial: false,
    func: function() {}
};

const block_feedback = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus: blockFeedbackTxt,
    response_ends_trial: true,
    data: { stim: "block_feedback" },
};

const simon_stimulus = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    trial_duration: prms.tooSlow,
    translate_origin: true,
    stimulus_onset: [0, 200],
    clear_screen: [1, 1],
    stimulus_duration: 400,
    response_ends_trial: true,
    choices: prms.respKeys,
    func: [drawSimon, drawSimon],
    func_args:[
        { 
            "left":   jsPsych.timelineVariable("left1") ,
            "middle": jsPsych.timelineVariable("middle1") ,
            "right":  jsPsych.timelineVariable("right1") ,
        },
        { 
            "left":   jsPsych.timelineVariable("left2") ,
            "middle": jsPsych.timelineVariable("middle2") ,
            "right":  jsPsych.timelineVariable("right2") ,
        },
    ],
    data: {
        stim: "simon",
        comp: jsPsych.timelineVariable('comp'), 
        order: jsPsych.timelineVariable('order'), 
        corrResp: jsPsych.timelineVariable('corrResp')
    },
    on_finish: function() { codeTrial(); }
};

const trial_timeline = {
    timeline: [
        fixation_cross,
        simon_stimulus,
        trial_feedback,
        iti,
    ],
    timeline_variables:[
        { left1: "black", middle1: cc,                  right1: cc,      left2: cc,      middle2: prms.respColours[0], right2: cc,      comp: "comp",   order: "BA", corrResp: prms.respKeys[0] },
        { left1: cc,      middle1: cc,                  right1: "black", left2: cc,      middle2: prms.respColours[0], right2: cc,      comp: "incomp", order: "BA", corrResp: prms.respKeys[0] },
        { left1: "black", middle1: cc,                  right1: cc,      left2: cc,      middle2: prms.respColours[1], right2: cc,      comp: "comp",   order: "BA", corrResp: prms.respKeys[1] },
        { left1: cc,      middle1: cc,                  right1: "black", left2: cc,      middle2: prms.respColours[1], right2: cc,      comp: "incomp", order: "BA", corrResp: prms.respKeys[1] },
        { left1: cc,      middle1: prms.respColours[0], right1: cc,      left2: "black", middle2: cc,                  right2: cc,      comp: "comp",   order: "AB", corrResp: prms.respKeys[0] },
        { left1: cc,      middle1: prms.respColours[0], right1: cc,      left2: cc,      middle2: cc,                  right2: "black", comp: "incomp", order: "AB", corrResp: prms.respKeys[0] },
        { left1: cc,      middle1: prms.respColours[1], right1: cc,      left2: "black", middle2: cc,                  right2: cc,      comp: "comp",   order: "AB", corrResp: prms.respKeys[1] },
        { left1: cc,      middle1: prms.respColours[1], right1: cc,      left2: cc,      middle2: cc,                  right2: "black", comp: "incomp", order: "AB", corrResp: prms.respKeys[1] },
    ],
    randomize_order:true,
};


const randomString = generateRandomString(16);

const alphaNum = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus: "<h1>Wenn Sie für diesen Versuch eine Versuchspersonenstunde</h1>" +
    "<h1>benötigen, kopieren Sie den folgenden zufällig generierten Code</h1>" +
    "<h1>und senden Sie diesen zusammen mit Ihrer Matrikelnummer per Email an:</h1>" +
    "<h2>XXX@XXX</h2>" +
    "<h1>Code:" + randomString + "</h1>" +
    "<h2>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>"
};

const fullscreen_on = {
    type: 'fullscreen',
    fullscreen_mode: true,
    on_finish: function() {
        $('body').css('cursor', 'none'); 
    },
}

const fullscreen_off = {
    type: 'fullscreen',
    fullscreen_mode: false,
    on_start: function() {
        $('body').css('cursor', 'default')
    }
}

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];
    exp.push(fullscreen_on);
    exp.push(welcome_de);
    // exp.push(vpInfoForm_de);
    exp.push(task_instructions1);
    exp.push(task_instructions2);

    for (let blk = 0; blk < prms.nBlks; blk += 1) {
        let blk_timeline = {...trial_timeline};
        blk_timeline.repetitions = (blk === 0) ? (prms.nTrlsP/8) : (prms.nTrlsE/8);
        exp.push(blk_timeline);    // trials within a block
        exp.push(block_feedback);  // show previous block performance 
    }
    exp.push(debrief_de);
    exp.push(alphaNum);
    exp.push(fullscreen_off);
    
    return exp;

}
const EXP = genExpSeq();
const filename = dirName + "data/" + expName + "_" + genVpNum();

jsPsych.init({
    timeline: EXP,
    fullscreen: true,
    show_progress_bar: false,
    exclusions: {
        min_width:cs[0],
        min_height:cs[1],
    },
    on_finish: function(){ 
        saveData("/Common/write_data.php", filename, rows = {stim: "simon"}); 
    }
});

