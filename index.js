const container1 = document.querySelectorAll('.js-res')[0];
const container2 = document.querySelectorAll('.js-res')[1];
const container3 = document.querySelectorAll('.js-res')[2];

const slider1 = new SliderController({
    root: container1,
    mode: 'select',
    dataType: 'number',
    range: [-10, 10],
    step: 0.3,
    handles: { // {handleId: handleInitValue}
        'a30': 0,
        'a50': 5,
        'a80': 8,
        // 'a90': 900,
    },
    neighborHandles: 'jumpover', // 'move' 'stop' 'jumpover === any, default
    isVertical: false,
    ranges: [ // [[anc1, anc2]] || [[anc1, anc2], [anc2, anc3]], 'sliderstart', 'sliderend', handleId
    ['a30', 'sliderstart'], ['a30', 'a50'], ['a50', 'a80'], ['a80', 'sliderend']
    ],
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
        'y1': 10,
        'y2': 20,
        'y3': 30,
        'y4': 40,
        'y5': 50,
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
        'q': 10,
        'qq': 50,
        'a80': 80,
    },
    neighborHandles: 'stop',
    ranges: [['q', 'qq'], ['a80', 'qq']],
    isVertical: 0,
    tagsPositions: [{'qq': 'bottom'}]
})