"use strict"
import { generateCards, getFilm, getPlanets } from "./functions.js"

export const BASE_URL = "https://swapi.dev/api"
export const characterList = document.querySelector(".characters")
export const planetList = document.querySelector(".planets-list")
const body = document.querySelector(".body")
const notification = document.querySelector(".notification")
const characters = document.querySelector(".section-characters")
const submitButton = document.getElementById("submit-button")
const loadingAnimation = document.querySelector(".loading-animation")
const header = document.querySelector(".header")
const submitForm = document.querySelector(".subform")
const showButton = document.querySelector(".show")
const previousButton = document.querySelector(".previous")
const nextButton = document.querySelector(".next")

let id = 1
let charactersObserver = new IntersectionObserver(
  (entry) => {
    if (entry[0].isIntersecting) {
      characters.classList.add("view-characters")
      charactersObserver.unobserve(entry[0].target)
      notification.classList.add("invisible")
      notification.classList.remove("animated")
      setTimeout(() => (notification.style.display = "none"), 400)
    }
  },
  {
    threshold: 0.3,
  }
)
charactersObserver.observe(characters)

getFilm().then((film) => {
  Promise.all(film.characters.map((character) => fetch(`${character}`)))
    .then((responses) => {
      return responses
    })
    .then((responses) => Promise.all(responses.map((r) => r.json())))
    .then((characters) => generateCards(characters))
})

window.onload = () => {
  setTimeout(() => {
    notification.classList.remove("invisible")
    notification.classList.add("animated")
  }, 1000)
}

previousButton.disabled = true
nextButton.disabled = true

showButton.addEventListener("click", () => {
  nextButton.disabled = false
  getPlanets(id)
  showButton.disabled = true
})

nextButton.addEventListener("click", () => {
  previousButton.disabled = false
  id += 1
  document.querySelectorAll(".planet").forEach((planet) => planet.remove())
  getPlanets(id)
  if (id === 6) nextButton.disabled = true
})

previousButton.addEventListener("click", () => {
  id -= 1
  if (id < 6) nextButton.disabled = false
  document.querySelectorAll(".planet").forEach((planet) => planet.remove())
  getPlanets(id)
  if (id === 1) previousButton.disabled = true
})

submitButton.addEventListener("click", (e) => {
  e.preventDefault()
  header.scrollIntoView({ block: "start", behavior: "smooth" })
  setTimeout(
    () => document.querySelectorAll(".character").forEach((el) => el.remove()),
    500
  )

  body.classList.add("loading-background")
  loadingAnimation.classList.add("view-loading")
  const uniqueFilm = document.getElementById("filmid").value

  getFilm(+uniqueFilm).then((film) => {
    Promise.all(film.characters.map((character) => fetch(character)))
      .then((responses) => {
        return responses
      })
      .then((responses) => Promise.all(responses.map((r) => r.json())))
      .then((characters) => generateCards(characters))
      .finally(() => {
        body.classList.remove("loading-background")
        loadingAnimation.classList.remove("view-loading")
        submitForm.scrollIntoView({
          block: "start",
          behavior: "smooth",
        })
      })
  })
})
