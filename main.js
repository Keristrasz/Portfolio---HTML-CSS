const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
    //If we want to reaninamte everytime
    // else {
    //   entry.target.classList.remove("show");
    // }
  });
});

const animatedElements = document.querySelectorAll(".hidden");
animatedElements.forEach((el) => observer.observe(el));
