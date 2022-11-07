const container1 = document.querySelectorAll('.js-res')[0];
const container2 = document.querySelectorAll('.js-res')[1];
const container3 = document.querySelectorAll('.js-res')[2];

const slider1 = new SliderController({
    root: container1,
    mode: 'select',
    dataType: 'number',
    range: [0, 1000],
    step: 10,
    handles: {
        'a30': {value: 200},
        'a50': {value: 500},
        'a80': {value: 800},
        'a90': {value: 900},
    },
    neighborHandles: 'jumpover', // 'move' 'stop' 'jumpover
    isVertical: false,
    ranges: [
        ['a30', 'a50'], ['a50', 'a80'], ['a80', 'a90'] // 'sliderstart', 'sliderend', handleId
    ],
    tagsPositions: 'top', // 'top', 'right' 'left', 'bottom' {id: position}
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
    neighborHandles: 'jumpover',
    isVertical: 1,
    ranges: [
        ['sliderstart', 'y1'], ['sliderend', 'y5']
    ],
    tagsPositions: ['left', {'y2': 'right', 'y4': 'right'}]
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
    neighborHandles: 'jumpover',
    isVertical: 0,
    tagsPositions: [{'qq': 'bottom'}]
})