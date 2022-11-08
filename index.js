const container1 = document.querySelectorAll('.js-res')[0];
const container2 = document.querySelectorAll('.js-res')[1];
const container3 = document.querySelectorAll('.js-res')[2];

const slider1 = new SliderController({
    root: container1,
    mode: 'select',
    dataType: 'number',
    range: [-10, 10],
    step: 0.3,
    handles: {
        'a30': {value: 0},
        'a50': {value: 5},
        'a80': {value: 8},
        // 'a90': {value: 900},
    },
    neighborHandles: 'move', // 'move' 'stop' 'jumpover === any, default
    isVertical: false,
    // ranges: [
    //     ['a30', 'a50'], ['a50', 'a80'], ['a80', 'a90'] // 'sliderstart', 'sliderend', handleId
    // ],
    tagsPositions: 'top', // 'top', 'right' 'left', 'bottom' {id: position}
    tagsPostfix: ' ₽',
})

const slider2 = new SliderController({
    root: container2,
    mode: 'select',
    dataType: 'number',
    range: [0, 100],
    step: 1,
    handles: {
        'y1': {value: 10},
        'y2': {value: 20},
        'y3': {value: 30},
        'y4': {value: 40},
        'y5': {value: 50}
    },
    // neighborHandles: 'jumpover',
    isVertical: 1,
    ranges: [
        ['sliderstart', 'y1'], ['sliderend', 'y5']
    ],
    tagsPositions: ['left', {'y2': 'right', 'y4': 'right'}],
    tagsPrefix: '$ ',

})

const slider3 = new SliderController({
    root: container3,
    mode: 'select',
    dataType: 'number',
    range: [0, 100],
    step: 1,
    handles: {
        'q': {value: 10},
        'qq': {value: 50},
        'a80': {value: 80}
    },
    neighborHandles: 'stop',
    isVertical: 0,
    tagsPositions: [{'qq': 'bottom'}]
})