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
        // 'a50': {value: 500},
        'a80': {value: 800},
    },
    neighborHandles: 'jumpover', // 'move' 'stop' 'jumpover // TODO add z-index
    isVertical: false,
    ranges: [
        ['a30', 'a80']
    ],

})

const slider2 = new SliderController({
    root: container2,
    mode: 'select',
    dataType: 'number',
    range: [0, 100],
    step: 1,
    handles: {
        'y': {value: 10},
        'yy': {value: 50},
        // 'a80': {value: 80}
    },
    neighborHandles: 'jumpover',
    isVertical: 1,
    ranges: [
        ['y', 'yy']
    ],
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
})