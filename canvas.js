function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};



let colors;
function newColor() {
  colors = [
    ["#cacfd6ff", "#d6e5e3ff", "#9fd8cbff", "#517664ff"],
    ["#29274cff", "#7e52a0ff", "#d295bfff", "#e6bccdff"],
    ["#2de1fcff", "#2afc98ff", "#09e85eff", "#16c172ff", "#214f4bff"],
    ["#c6d4ffff", "#7a82abff", "#307473ff", "#12664fff", "#2dc2bdff"],
    ["#40f99bff", "#61707dff", "#9d69a3ff", "#f5fbefff", "#e85d75ff"],
    ["#efbc9bff", "#ee92c2ff", "#9d6a89ff", "#725d68ff", "#a8b4a5ff"],
    ["#ea526fff", "#e76b74ff", "#d7af70ff", "#937d64ff", "#585b56ff"],
    ["#65def1ff", "#a8dcd1ff", "#dce2c8ff", "#f96900ff", "#f17f29ff"],
    ["#642ca9ff", "#ff36abff", "#ff74d4ff", "#ffb8deff", "#ffdde1ff"],
  ][getRandomInt(0, 8)]
}
newColor();

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

// Event Listeners
addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
});

// Objects
class Particle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.radians = Math.random() * Math.PI * 2;
    this.velocity = getRandomInt(5, 15) / 650;
    this.distanceFromCenter = getRandomInt(55, 120);
    this.lastMousePosition = { x: x, y: y };
    this.trail = [];

    this.update = () => {
      const lastPoint = { x: this.x, y: this.y };
      // Move points over time
      this.radians += this.velocity;
      // Drag effect
      this.lastMousePosition.x += (mouse.x - this.lastMousePosition.x) * 0.05;
      this.lastMousePosition.y += (mouse.y - this.lastMousePosition.y) * 0.05;
      // Circular motion
      this.x =
        this.lastMousePosition.x + Math.cos(this.radians) * this.distanceFromCenter;
      this.y =
        this.lastMousePosition.y + Math.sin(this.radians) * this.distanceFromCenter;

      if (this.trail.length < 25) {
        this.trail.push({
          x: this.x,
          y: this.y,
          radius: this.radius,
          color: this.color,
        });
      } else {
        this.trail.pop();
        this.trail.unshift({
          x: this.x,
          y: this.y,
          radius: this.radius,
          color: this.color,
        });
      }

      this.draw(lastPoint);

      this.trail.forEach((particle, index) => {
        c.beginPath();
        c.moveTo(particle.x, particle.y);
        c.lineTo(this.x, this.y);
        c.strokeStyle = this.color;
        c.stroke();
      });
    };

    this.draw = (lastPoint) => {
      c.beginPath();
      c.moveTo(lastPoint.x, lastPoint.y);
      c.lineTo(this.x, this.y);
      c.strokeStyle = this.color;
      c.stroke();
    };
  }
}

// Implementation
let particles;
function init() {
  particles = [];

  for (let i = 0; i < 50; i++) {
    const radius = Math.random() * 10 + 2;
    particles.push(
      new Particle(canvas.width / 2, canvas.height / 2, radius, randomColor(colors))
    );
  }
}

// Animation Loop
function animate() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle) => {
    particle.update();
  });
  requestAnimationFrame(animate);
}

init();
animate();

addEventListener("mousedown", (event) => {
  newColor();
  particles.forEach((particle) => {
    particle.velocity *= 2;
    particle.color = randomColor(colors);
  });
});

addEventListener("mouseup", (event) => {
  particles.forEach((particle) => {
    particle.velocity /= 2;
  });
});

