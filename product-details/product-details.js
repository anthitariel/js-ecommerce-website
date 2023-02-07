
// create image carousel to choose image from gallery

function imageCarousel() {

    const carouselSlideSmall = document.querySelectorAll('.carousel-slide-small');
    const carouselSlideLarge = document.querySelector('.carousel-slide-large');

    carouselSlideSmall.forEach(slide => {
        slide.addEventListener('click', (event) => {
            carouselSlideSmall.forEach(item => item.classList.remove('selected-slide'))
            // get link to selected item in the image gallery
            let src = event.target.src
            // change the link on the image carousel according to selected slide
            carouselSlideLarge.src = src
            event.target.classList.add('selected-slide')
        })
    })
}

imageCarousel()

