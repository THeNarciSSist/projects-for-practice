"use strict"
const issues = document.querySelectorAll(".item")

let observer = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		document.body.classList.toggle(`color-${entry.target.id}`, entry.isIntersecting)
	})
}, {
	threshold: 0.35,
})

issues.forEach(elem => {
	observer.observe(elem)
})
	