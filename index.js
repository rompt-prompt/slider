const container1 = document.querySelectorAll('.js-res')[0];
const container2 = document.querySelectorAll('.js-res')[1];
const container3 = document.querySelectorAll('.js-res')[2];

const slider1 = new SliderController({
    root: container1,
    mode: 'select',
    dataType: 'number',
    range: [0, 10],
    step: 1.3,
    handles: {
        1: 9,
        'third': 3,
        2: 5,
    //     4: 8,
    //    5: 2,
    //     'zzz': 3,

    },
    isVertical: false,
    neighborHandles: 'move',
    // ranges: [ //TODO rename
    // ['a30', 'sliderstart'], ['a30', 'a50'], ['a50', 'a80'], ['a80', 'sliderend']
    // ],
    tagsPositions: 'top',
    tagsPostfix: ' ₽',
    tagsPrefix: '$ ',
})

const slider2 = new SliderController({
    root: container2,
    mode: 'select',
    dataType: 'number',
    range: [0, 100],
    step: 1,
    handles: {
        'y1': 10,
        'y2': 20,
        'y3': 30,
        'y4': 40,
        'y5': 50,
        6: 60,
        7: 70,
        8: 80,
        9: 90,
        10: 100,
    },
    neighborHandles: 'move',
    isVertical: 1,
    ranges: [
        ['sliderstart', 'y1'], ['sliderend', 'y3']
    ],
    tagsPositions: ['left', {'y2': 'right'}],
    tagsPrefix: '$ ',

})

const slider3 = new SliderController({
    root: container3,
    mode: 'select',
    dataType: 'number',
    range: [0, 100],
    step: 1,
    handles: {
    //    3: 10,
    '1q': 60,
        '2q': 50,
    },
    neighborHandles: 'stop',
    // ranges: [['q', 1], ['a80', 1]],
    isVertical: 0,
    tagsPositions: 'top',
})