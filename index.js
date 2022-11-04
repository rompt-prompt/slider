const container1 = document.querySelectorAll('.js-res')[0];
const container2 = document.querySelectorAll('.js-res')[1];

const slider1 = new SliderController({
    root: container1,
    mode: 'select',
    dataType: 'number',
    range: [0, 1000],
    step: 10,
    handles: {
        'a30': {value: 300},
        'a50': {value: 500},
        'a80': {value: 800},
    },
    neighborHandles: 'move', // 'move' 'stop' 'jumpover // TODO add z-index
    isVertical: false,
    useRange: 0,
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
        'zzz': {value: 80}
    },
    neighborHandles: 'stop',
    isVertical: 1,
    useRange: 0,
})