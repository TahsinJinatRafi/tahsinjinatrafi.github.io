
"use strict";

/* Gallery images: keep this order synchronized with index.html */
const photos = [
  ["assets/gallery-sunset.webp", "Sunset by the river"],
  ["assets/gallery-panjabi.webp", "Traditional portrait"],
  ["assets/gallery-portrait.webp", "Portrait of Tahsin"],
  ["assets/gallery-nature.webp", "Nature portrait"]
];

let current = 0;
let lastFocusedElement = null;

const lightbox = document.getElementById("lightbox");
const largeImage = document.getElementById("large");
const count = document.getElementById("count");
const closeButton = document.querySelector(".close");
const previousButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");
const galleryButtons = document.querySelectorAll(".gallery button");
const menuButton = document.querySelector(".menu");
const navigation = document.getElementById("nav");

/* Display a gallery image */
function showPhoto(index) {
  current = (index + photos.length) % photos.length;

  const [src, alt] = photos[current];

  largeImage.src = src;
  largeImage.alt = alt;

  count.textContent = `${current + 1} / ${photos.length}`;
}

/* Open the photo viewer */
function openLightbox(index, trigger) {
  lastFocusedElement = trigger;

  showPhoto(index);

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";

  closeButton.focus();
}

/* Close the photo viewer */
function closeLightbox() {
  if (!lightbox.classList.contains("open")) return;

  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";

  largeImage.removeAttribute("src");

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

/* Gallery button events */
galleryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const index = Number(button.dataset.i);

    if (Number.isInteger(index) && index >= 0 && index < photos.length) {
      openLightbox(index, button);
    }
  });
});

/* Lightbox controls */
closeButton.addEventListener("click", closeLightbox);

previousButton.addEventListener("click", () => {
  showPhoto(current - 1);
});

nextButton.addEventListener("click", () => {
  showPhoto(current + 1);
});

/* Close when clicking the dark background */
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

/* Keyboard controls */
document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) return;

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    showPhoto(current - 1);
  }

  if (event.key === "ArrowRight") {
    showPhoto(current + 1);
  }

  /* Keep keyboard focus inside the photo viewer */
  if (event.key === "Tab") {
    const controls = [
      closeButton,
      previousButton,
      nextButton
    ];

    const first = controls[0];
    const last = controls[controls.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

/* Discourage accidental image dragging and context-menu opening */
document.querySelectorAll(".protected").forEach((img) => {
  img.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  img.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });
});

/* Mobile navigation */
menuButton.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("show");

  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );
});

/* Close mobile navigation after selecting a section */
navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("show");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
  });
});

/* Close mobile navigation with Escape */
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation.classList.contains("show")) {
    navigation.classList.remove("show");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    menuButton.focus();
  }
});

/* Automatic copyright year */
document.getElementById("year").textContent = new Date().getFullYear();

/* Render articles safely */
const articleList = document.getElementById("articles");
const emptyMessage = document.getElementById("empty");

const articleData =
  typeof ARTICLES !== "undefined" && Array.isArray(ARTICLES)
    ? ARTICLES
    : [];

if (articleData.length > 0) {
  emptyMessage.hidden = true;

  articleData.forEach((article) => {
    const element = document.createElement("article");
    element.className = "article";

    const meta = document.createElement("small");

    const metaText = [article.category, article.date]
      .filter(Boolean)
      .join(" · ");

    meta.textContent = metaText;

    const heading = document.createElement("h3");
    heading.textContent = article.title || "Untitled";

    const description = document.createElement("p");
    description.textContent = article.excerpt || article.content || "";

    if (metaText) {
      element.appendChild(meta);
    }

    element.append(heading, description);
    articleList.appendChild(element);
  });
} else {
  emptyMessage.hidden = false;
}
