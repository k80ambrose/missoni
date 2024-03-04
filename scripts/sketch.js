let lines = [];
let numLines = 700; // Control the number of lines
let baseNoiseScale = 0.005; // Scale for base wave pattern
let aberrationNoiseScale = 0.08; // Scale for aberration wave pattern
let aberrationStrength = 20; // Adjusted for subtle curvature

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100); // Use HSB color mode

  // Generate a palette of 5-7 colors that are less bright and vibrant
  let paletteSize = floor(random(5, 8)); // Determine palette size (5-7 colors)
  let colorPalette = []; // Array to store the colors
  for (let i = 0; i < paletteSize; i++) {
    let hue = random(360);
    let saturation = random(50, 70); // Lower saturation for less intensity
    let brightness = random(60, 80); // Lower brightness for less vibrancy
    colorPalette.push(color(hue, saturation, brightness));
  }

  // Initialize lines with a color from the palette
  for (let i = 0; i < numLines; i++) {
    let colorIndex = floor(random(paletteSize));
    lines.push(new Line(i / numLines * height, colorPalette[colorIndex]));
  }
}

function draw() {
  background(255);
  lines.forEach(line => line.update().display());
}

class Line {
  constructor(baseY, color) {
    this.baseY = baseY; // Base y-position for each line to spread them vertically
    this.yoff = random(1000); // Perlin noise offset for each line
    this.color = color; // Assign a color from the palette
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
