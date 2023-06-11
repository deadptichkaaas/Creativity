$(document).ready(function () {
	const modalOverlay = document.querySelector('.modal__overlay');
	const modal = document.querySelector('.modal');
	if (modalOverlay) {
		if (!modalOverlay.classList.contains('_hide')) {
			modalOverlay.classList.add('_hide');
			modal.classList.add('_hide');
		}
	};

	$('.bg-slider').slick({
		dots: false,
		arrows: true,
		infinite: true,
		speed: 500,
		fade: true,
		cssEase: 'linear',
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 2000,
	});



	// ----------------------------------------------- DEVICE RECOGNITION ----------------------------------------------
	const isMobile = {
		Android: function () {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function () {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function () {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function () {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function () {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function () {
			return (
				isMobile.Android() ||
				isMobile.BlackBerry() ||
				isMobile.iOS() ||
				isMobile.Opera() ||
				isMobile.Windows());
		}
	};

	if (isMobile.any()) {
		document.body.classList.add('_touch');
	} else {
		document.body.classList.add('_pc');
	}


	function preventScroll() {
		document.body.style.overflow = "hidden";
	}

	function allowScroll() {
		document.body.style.overflow = "auto";
	}

	// ------- TOP MENU, CLICK LINK AND ADD _active ---------------------------------------------------------------------
	if (document.body.classList.contains('_pc')) {
		const menuItems = document.querySelectorAll('.menu__link');

		menuItems.forEach(function (item) {
			item.addEventListener('click', function (event) {
				menuItems.forEach(function (menuItem) {
					menuItem.classList.remove('_active');
				});
				this.classList.add('_active');
			});
		});
	}
	// ----------------------------------------------------------------------------------------------------------------------
	// MENU BURGER ============================================================================================================================

	const menuBurger = document.querySelector('.menu__icon');

	if (menuBurger) {
		const menuBody = document.querySelector('.menu__body');

		menuBurger.addEventListener('click', function (e) {
			document.body.classList.toggle('_lock');
			menuBurger.classList.toggle('_active');
			menuBody.classList.toggle('_active');
			if (menuBurger.classList.contains('_active')) {
				document.querySelector('.logo__box').style.display = 'none';
			} else {
				document.querySelector('.logo__box').style.display = 'inline-block';
			}

		})
	}
	// MENU NAVIGATION =====================================================================================================================
	const menuList = document.querySelectorAll('.menu__link[data-goto]');

	if (menuList.length > 0) {
		menuList.forEach(menuLink => {
			menuLink.addEventListener('click', onMenuLinkClick);
		});
	}

	function onMenuLinkClick(e) {
		const menuLink = e.target;
		if(menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
			const gotoBlock = document.querySelector(menuLink.dataset.goto);
			const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('.topmenu').offsetHeight;

			window.scrollTo({
				top: gotoBlockValue,
				behavior: 'smooth'
			});
			e.preventDefault();
		}
	}

	// -----------------------------------------------------------------------------------------------------------------------------------
	// SECTION ABOUT --- TEXT ADVANCEMENT ================================================================================================

	const linkText = document.querySelectorAll('.text__menu-wrap');

	// code part toggle text which needed hide/show
	if (linkText) {
		linkText.forEach(function (link) {
			const text = link.nextElementSibling;
			link.addEventListener('click', () => {
				link.classList.toggle('_show');
				text.classList.toggle('_show');

				// close other block-text
				linkText.forEach(function (otherLink) {
					const otherText = otherLink.nextElementSibling;
					if (otherLink !== link) {
						otherLink.classList.remove('_show');
						otherText.classList.remove('_show');
					}
				});
			});
		});
	}
	// MOBILE SLIDER PROFILE ======================================================================================================================================

	if (document.body.classList.contains('_touch')) {
		$('.about__profile').slick({
			dots: false,
			arrows: false,
			infinite: true,
			speed: 500,
			fade: false,
			slidesToShow: 3,
			slidesToScroll: 1,
			responsive: [
				{
					breakpoint: 650,
					settings: {
						slidesToShow: 2,
					}
				},
				{
					breakpoint: 460,
					settings: {
						slidesToShow: 1,
					}
				}
			]
		});
	}

	// PORTFOLIO SORT =========================================================================================================================================

	const filterButtons = document.querySelectorAll('.port__button');
	const photos = document.querySelectorAll('.port--rows img');

	// part chooses illustration after page reloading
	if (filterButtons[1].classList.contains('_active')) {
		for (let i = 0; i < photos.length; i++) {
			const photo = photos[i];
			const photoKinds = photo.getAttribute('data-kind').split(' ');

			if (photoKinds.includes('illustration')) {
				photo.style.display = 'inline-block';
			} else {
				photo.style.display = 'none';
			}
		}
	};

	// function hides items that are not selected ===================================================================================================================
	function handleFilterClick(event) {
		const showAll = event.target.getAttribute('data-show-all') === 'true';

		for (let i = 0; i < photos.length; i++) {
			const photo = photos[i];
			const photoKinds = photo.getAttribute('data-kind').split(' ');

			if (showAll || photoKinds.includes(event.target.getAttribute('data-kind'))) {
				photo.style.display = 'inline-block';
			} else {
				photo.style.display = 'none';
			}
		}
	}
	// function remove a class from unselected elements =======================================================================================
	for (let i = 0; i < filterButtons.length; i++) {
		filterButtons[i].addEventListener('click', function () {

			for (let j = 0; j < filterButtons.length; j++) {
				filterButtons[j].classList.remove('_active');
			}
			filterButtons[i].classList.add('_active');
			handleFilterClick(event);
		});
	}

	// function photo gallery with window =======================================================================================

	const modalImage = document.querySelector('.modal__image');
	const prevButton = document.querySelector('.modal__prev');
	const nextButton = document.querySelector('.modal__next');
	let currentImageIndex = 0;
	let filteredImages = [];


	function filterImages(kind) {
		filteredImages = Array.from(photos).filter(image => {
			const photoKinds = image.getAttribute('data-kind').split(' ');
			return photoKinds.includes(kind);
		});
	}

	photos.forEach((image) => {
		image.addEventListener('click', () => {
			const currentFilterButton = document.querySelector('.port__button._active');
			const currentFilterKind = currentFilterButton.getAttribute('data-kind');
			filterImages(currentFilterKind);

			currentImageIndex = filteredImages.indexOf(image);
			const imageSource = image.getAttribute('src');
			modalImage.setAttribute('src', imageSource);
			modalOverlay.classList.remove('_hide');
			modal.classList.remove('_hide');
			modalOverlay.style.display = 'block';
			modal.style.display = 'flex';
			if (modalOverlay.classList.contains('_hide') && modal.classList.contains('_hide')) {
				allowScroll();
			} else {
				preventScroll();
			}
		});
	});

	const closeButton = document.querySelector('.modal__close');
	closeButton.addEventListener('click', () => {
		modalOverlay.classList.add('_hide');
		modal.classList.add('_hide');
		modalOverlay.style.display = 'none';
		modal.style.display = 'none';
		if (modalOverlay.classList.contains('_hide') && modal.classList.contains('_hide')) {
			allowScroll();
		} else {
			preventScroll();
		}
	});

	function showNextImage() {
		currentImageIndex++;
		if (currentImageIndex >= filteredImages.length) {
			currentImageIndex = 0;
		}
		if (filteredImages.length > 0) {
			const imageSource = filteredImages[currentImageIndex].getAttribute('src');
			modalImage.setAttribute('src', imageSource);
		}
	}

	function showPreviousImage() {
		currentImageIndex--;
		if (currentImageIndex < 0) {
			currentImageIndex = filteredImages.length - 1;
		}
		if (filteredImages.length > 0) {
			const imageSource = filteredImages[currentImageIndex].getAttribute('src');
			modalImage.setAttribute('src', imageSource);
		}
	}

	nextButton.addEventListener('click', showNextImage);
	prevButton.addEventListener('click', showPreviousImage);


	filterButtons.forEach(button => {
		button.addEventListener('click', () => {
			const dataKind = button.getAttribute('data-kind');
			filterImages(dataKind);
			const currentImage = filteredImages[0];
			currentImageIndex = 0;
			const imageSource = currentImage.getAttribute('src');
			modalImage.setAttribute('src', imageSource);
		});
	});

	// function turn on button for gallery at mobile devices
	if (document.body.classList.contains('_touch')) {
		const lightButton = document.querySelector('.show__images-btn');
		const portfolioBox = document.querySelector('.port__box');

		if (lightButton && portfolioBox) {
			lightButton.addEventListener('click', () => {
				lightButton.classList.toggle('open');
				portfolioBox.classList.toggle('_hidden');
			});
		}
	};
	// -----------------------------------------------------------------------------------------------------------------------
	// CLIENTS SECTION SLIDER ==================================================================================================================

	$('.comments__slider').slick({
		infinite: true,
		dots: true,
		dotsClass: 'clients__dots',
		arrows: false,
		slidesToShow: 1,
		slidesToScroll: 1,
		initialSlide: 1
	});

	// COMMETS COMPANY SLIDER ADAPTIVE ===================================================================================================================

	if (window.matchMedia("(max-width: 640px)").matches) {
		$('.comments__company').slick({
			infinite: true,
			dots: false,
			arrows: false,
			slidesToShow: 1,
			slidesToScroll: 1,
			autoplay: true,
			autoplaySpeed: 1500,
		});
	};

	// TEAM SLIDER ==============================================================================================================================================

	if (window.matchMedia("(max-width: 1100px)").matches) {
		slickSlider = $('.main__team').slick({
			arrows: false,
			dots: false,
			slidesToScroll: 1,
			autoplay: true,
			autoplaySpeed: 1500,
			responsive: [
				{
					breakpoint: 1100,
					settings: {
						slidesToShow: 3
					}
				},
				{
					breakpoint: 780,
					settings: {
						slidesToShow: 2
					}
				},
				{
					breakpoint: 500,
					settings: {
						slidesToShow: 1
					}
				}
			]
		});
	}
	// PERCENT SECTION =============================================================================================================================================================

	const circle = document.querySelectorAll('.progress-ring__circle');
	const percentsAll = document.querySelectorAll('.skills__percent span');

	circle.forEach((allCircles, index) => {

		const radius = allCircles.r.baseVal.value;
		const circumference = 2 * Math.PI * radius;

		allCircles.style.strokeDasharray = ` ${circumference} ${circumference}`;
		allCircles.style.strokeDashoffset = circumference;

		function setProgress(percent) {
			const offset = circumference - percent / 100 * circumference;
			allCircles.style.strokeDashoffset = offset;
		};

		percentsAll.forEach((percents, i) => {
			if (index === i) {
				let temp = percents.textContent;
				setProgress(temp);
			}
		});
	});


	if (window.matchMedia("(max-width: 800px)").matches) {
		slickSlider = $('.skills__main').slick({
			arrows: false,
			dots: false,
			slidesToScroll: 1,
			autoplay: true,
			autoplaySpeed: 1500,
			responsive: [
				{
					breakpoint: 800,
					settings: {
						slidesToShow: 3
					}
				},
				{
					breakpoint: 600,
					settings: {
						slidesToShow: 2
					}
				},
				{
					breakpoint: 400,
					settings: {
						slidesToShow: 1
					}
				},
			]
		});
	}

	// SERVICES SECTION ADAPTIVE ========================================================================================================================

	if (window.matchMedia("(max-width: 800px)").matches) {
		slickSlider = $('.servic__grid').slick({
			arrows: false,
			dots: true,
			dotsClass: 'clients__dots',
			slidesToScroll: 2,
			responsive: [
				{
					breakpoint: 800,
					settings: {
						slidesToShow: 2
					}
				},
				{
					breakpoint: 700,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1
					}
				}
			]
		});
	}

	if (window.matchMedia("(max-width: 1100px)").matches) {
		slickSlider = $('.best__cards').slick({
			arrows: false,
			dots: true,
			dotsClass: 'best__dots',
			responsive: [
				{
					breakpoint: 1100,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 2
					}
				},
				{
					breakpoint: 900,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 2
					}
				},
				{
					breakpoint: 550,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1
					}
				}
			]
		});
	}

	// BLOG SECTION ======================================================================================================================================

	const blogArrow = document.querySelector('.blog__bottom-arrow');
	const blogItem = document.querySelectorAll('.blog__item');

	blogArrow.addEventListener('click', () => {
		blogArrow.classList.toggle('_active');

		blogItem.forEach((item) => {
			if (blogArrow.classList.contains('_active') && item.classList.contains('_hide') && !item.classList.contains('_always')) {
				item.classList.remove('_hide');
				item.classList.add('_show');
			} else if (!item.classList.contains('_always') && !blogArrow.classList.contains('_active') && !item.classList.contains('_hide')) {
				item.classList.add('_hide');
				item.classList.remove('_show');
			}
		});
	});
});
