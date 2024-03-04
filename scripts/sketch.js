let lines = [];
let numLines = 100; // Control the number of lines
let baseNoiseScale = 0.005; // Scale for base wave pattern
let aberrationNoiseScale = 0.08; // Scale for aberration wave pattern
let aberrationStrength = 20; // Adjusted for subtle curvature

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100); // Use HSB color mode for vibrant colors
  // Initialize lines with unique properties
  for (let i = 0; i < numLines; i++) {
    let hue = map(i, 0, numLines, 0, 360); // Color spread across spectrum
    lines.push(new Line(i / numLines * height, hue));
  }
}

function draw() {
  background(255);
  lines.forEach(line => line.update().display());
}

class Line {
  constructor(baseY, hue) {
    this.baseY = baseY; // Base y-position for each line to spread them vertically
    this.yoff = random(1000); // Perlin noise offset for each line
    this.color = color(hue, 80, 90); // Assign a unique color based on hue
    this.aberrationPhase = random(TWO_PI); // Start phase for aberrations at a random point
  }

  update() {
    this.yoff += 0.005; // Slow increment for organic movement
    this.aberrationPhase += 0.02; // Slowly change the aberration phase
    return this; // Allows for method chaining
  }

  display() {
    noFill();
    stroke(this.color);
    strokeWeight(0.5);
    beginShape();

    let aberrationFactor = (sin(this.aberrationPhase) + 1) / 2; // Oscillate between 0 and 1

    for (let x = 0; x <= width; x += 5) { // Increased resolution for smoother curves
      // Interpolate between base wave and aberrated wave
      let yNoise = noise(this.yoff + x * aberrationNoiseScale) * aberrationStrength;
      let yBase = this.baseY + sin(x * 0.09) * aberrationStrength * 0.9; // Adjusted for more wave periods
      let y = yBase + (yNoise - aberrationStrength / 2) * aberrationFactor;

      curveVertex(x, y); // Use curveVertex for smoother, curved lines
    }

    endShape();
  }
}
