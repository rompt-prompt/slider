const navNumBtn = document.querySelector('js-nav-btn-num');
const navDateBtn = document.querySelector('js-nav-btn-date');
const navArrayBtn = document.querySelector('js-nav-btn-array');

const nav = document.querySelector('.nav')
const pages = document.querySelectorAll('.page')

nav.onclick = event => {
    const link = event.target.dataset.link || event.target.parentElement.dataset.link;
    if(!link) return;
    pages.forEach(page => {
        page.dataset.link === link ? 
            page.classList.add('page_active') : 
            page.classList.remove('page_active');
    })
}



const container1 = document.querySelectorAll('.js-res')[0];
const container2 = document.querySelectorAll('.js-res')[1];
const container3 = document.querySelectorAll('.js-res')[2];


// const slider1 = new SliderController({
//     root: container1,
//     mode: 'select',
//     dataType: 'number',
//     range: [0, 20.9],
//     step: 1,
//     handles: {
//         '1': 1,
//         '2': 5,
//     },
//     neighborHandles: 'jumpover',
//     tagsPositions: 'top',
// })

// const slider2 = new SliderController({
//     root: container2,
//     mode: 'select',
//     dataType: 'date',
//     range: [new Date('2021-01-01'), new Date('2021-12-31')],
//     step: 1,
//     stepMeasure: 'month', // 'day', 'month' or 'year'
//     handles: {
//         '1': new Date('2021-02-28'),
//         '2': new Date('2021-10-31')
//     },
//     neighborHandles: 'move',
//     isVertical: false,
//     progressBars: [
//         ['sliderstart', '1'], ['sliderend', '2']
//     ],
//     tagsPositions: ['top', {2: 'bottom'}],
//     handlesTextContent: {
//         1: 'first', 2: 'second'
//     },
//     tagsPrefix: '$',
//     tagsPostfix: 'P'
// })

// const slider3 = new SliderController({
//     root: container3,
//     mode: 'select',
//     dataType: 'array',
//     range: ['Австралия', 'Австрия', 'Азербайджан', 'Албания', 
//     'Алжир', 'Ангола', 'Андорра', 'Антигуа и Барбуда', 'Аргентина', 'Армения'],
//     step: 1,
//     handles: {
//         '1': 3,
//         '2': 8
//     },
//     neighborHandles: 'stop',
//     tagsPositions: 'top',
// })


