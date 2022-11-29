const container1 = document.querySelectorAll('.js-res')[0];
const container2 = document.querySelectorAll('.js-res')[1];
const container3 = document.querySelectorAll('.js-res')[2];


const slider1 = new SliderController({
    root: container1,
    mode: 'select',
    dataType: 'number',
    range: [0, 20.9],
    step: 1,
    handles: {
        '1': 1,
        '2': 5,
    },
    neighborHandles: 'jumpover',
    tagsPositions: 'top',
})

const slider2 = new SliderController({
    root: container2,
    mode: 'select',
    dataType: 'date',
    range: [new Date('2021-01-01'), new Date('2021-12-31')],
    step: 1,
    stepMeasure: 'month', // 'day', 'month' or 'year'
    handles: {
        '1': new Date('2021-02-28'),
        '2': new Date('2021-10-31')
    },
    neighborHandles: 'move',
    isVertical: false,
    progressBars: [
        ['sliderstart', '1'], ['sliderend', '2']
    ],
    tagsPositions: ['top', {2: 'bottom'}],
    handlesTextContent: {
        1: 'first', 2: 'second'
    },
    tagsPrefix: '$',
    tagsPostfix: 'P'
})

const slider3 = new SliderController({
    root: container3,
    mode: 'select',
    dataType: 'array',
    range: ['Австралия', 'Австрия', 'Азербайджан', 'Албания', 
    'Алжир', 'Ангола', 'Андорра', 'Антигуа и Барбуда', 'Аргентина', 'Армения'],
    step: 1,
    handles: {
        '1': 3,
        '2': 8
    },
    neighborHandles: 'stop',
    tagsPositions: 'top',
})




//test

// let dates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
// let startDate = new Date(2020, 0, 1);
// let endDate = new Date(2021, 11, 30);
// let dayMS = 1000 * 60 * 60 * 24;

// while(+startDate != +endDate) {
//     slider1.options.handles.first = startDate;
//     slider1.reset();
//     let d, m, y;
//     [d, m, y] = slider1.model.cores.first.verbalValue.split('.')
//     let verbalDate = new Date(y, m - 1, d);

//     let eq = +startDate == +verbalDate;

//     eq ? 
//     console.log('ok') :
//     console.error(startDate, slider1.model.cores.first.verbalValue, verbalDate);

//     startDate = new Date(+startDate + dayMS)

// }
