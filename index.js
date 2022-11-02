const container1 = document.querySelectorAll('.js-res')[0];
const container2 = document.querySelectorAll('.js-res')[1];

const slider1 = new SliderController({
    root: container1, 
    handles: {
        'zzz': {value: 20},
        2: {value: 80},
    },
    isVertical: false,
    useRange: 0,
})

const slider2 = new SliderController({
    root: container2, 
    handles: {
        'y': {value: 10},
        'yy': {value: 50},
        'yyy': {value: 90}
    },
    isVertical: 1,
    useRange: 0,
})