const container1 = document.querySelectorAll('.js-res')[0];
const container2 = document.querySelectorAll('.js-res')[1];

const slider1 = new SliderController({
    root: container1, 
    handles: {
        'x': {pcnt: 20},
        'xx': {pcnt: 80},
    },
    isVertical: false,
    useRange: 0,
})

const slider2 = new SliderController({
    root: container2, 
    handles: {
        'y': {pcnt: 10},
        'yy': {pcnt: 50},
        'yyy': {pcnt: 90}
    },
    isVertical: 1,
    useRange: 0,
})