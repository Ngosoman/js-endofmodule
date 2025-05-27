// DOM Elements
const generateBtn = document.getElementById("generate-btn");
const colorsContainer = document.getElementById("colors");
const saveBtn = document.getElementById("save-palette");

// Helper: Generate Related Colors
function generatePalette(baseColor, siteType) {
  // Convert hex to HSL for manipulation
  const hsl = hexToHSL(baseColor);
  const palette = [];

  // Based on siteType, adjust hue/brightness
  if (siteType === "portfolio") {
    palette.push(hslToHex(hsl.h, hsl.s, hsl.l));
    palette.push(hslToHex(hsl.h, hsl.s, hsl.l - 15));
    palette.push(hslToHex(hsl.h, hsl.s, hsl.l + 15));
  } else if (siteType === "tech") {
    palette.push(hslToHex(hsl.h, hsl.s, hsl.l));
    palette.push(hslToHex(hsl.h + 30, hsl.s, hsl.l - 10));
    palette.push(hslToHex(hsl.h - 30, hsl.s, hsl.l - 10));
  } else if (siteType === "food") {
    palette.push(hslToHex(hsl.h, hsl.s + 10, hsl.l));
    palette.push(hslToHex(hsl.h + 20, hsl.s, hsl.l - 5));
    palette.push(hslToHex(hsl.h - 20, hsl.s, hsl.l + 5));
  } else if (siteType === "ecommerce") {
    palette.push(hslToHex(hsl.h, hsl.s, hsl.l));
    palette.push(hslToHex(hsl.h, hsl.s - 10, hsl.l + 10));
    palette.push(hslToHex(hsl.h + 45, hsl.s, hsl.l - 10));
  } else {
    // default
    palette.push(baseColor);
    palette.push(hslToHex(hsl.h + 20, hsl.s, hsl.l - 10));
    palette.push(hslToHex(hsl.h - 20, hsl.s, hsl.l + 10));
  }

  return palette.slice(0, 3); // return 2–3 colors
}

// Generate on click
generateBtn.addEventListener("click", () => {
  const siteType = document.getElementById("site-type").value;
  const baseColor = document.getElementById("base-color").value;

  // Simulate loading using Promise
  showLoading().then(() => {
    const palette = generatePalette(baseColor, siteType);
    displayPalette(palette);
  });
});

// Show Loading
function showLoading() {
  colorsContainer.innerHTML = "<p>🎨 Generating palette...</p>";
  return new Promise((resolve) => {
    setTimeout(resolve, 1200); // 1.2s fake delay
  });
}

// Display color boxes
function displayPalette(colors) {
  colorsContainer.innerHTML = "";

  colors.forEach((color) => {
    const box = document.createElement("div");
    box.classList.add("color-box");
    box.style.backgroundColor = color;

    const code = document.createElement("span");
    code.innerText = color;

    // Copy on click
    box.addEventListener("click", () => {
      navigator.clipboard.writeText(color);
      code.innerText = "Copied!";
      setTimeout(() => (code.innerText = color), 1000);
    });

    box.appendChild(code);
    colorsContainer.appendChild(box);
  });

  // Store current palette for saving
  saveBtn.dataset.palette = JSON.stringify(colors);
}

// Save to localStorage
saveBtn.addEventListener("click", () => {
  const savedPalettes = JSON.parse(localStorage.getItem("palettes")) || [];
  const current = JSON.parse(saveBtn.dataset.palette || "[]");
  if (current.length > 0) {
    savedPalettes.push(current);
    localStorage.setItem("palettes", JSON.stringify(savedPalettes));
    alert("Palette saved!");
  } else {
    alert("Nothing to save yet!");
  }
});




function hexToHSL(hex) {
  let r = 0, g = 0, b = 0;
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }

  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  let m = l - c / 2;

  let r, g, b;

  if (0 <= h && h < 60) [r, g, b] = [c, x, 0];
  else if (60 <= h && h < 120) [r, g, b] = [x, c, 0];
  else if (120 <= h && h < 180) [r, g, b] = [0, c, x];
  else if (180 <= h && h < 240) [r, g, b] = [0, x, c];
  else if (240 <= h && h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  r = Math.round((r + m) * 255).toString(16).padStart(2, "0");
  g = Math.round((g + m) * 255).toString(16).padStart(2, "0");
  b = Math.round((b + m) * 255).toString(16).padStart(2, "0");

  return `#${r}${g}${b}`;
}

document.getElementById('save-palette').addEventListener('click', () => {
  const colorDivs = document.querySelectorAll('#colors div');
  const palette = Array.from(colorDivs).map(div => div.style.backgroundColor);

  if (palette.length > 0) {
    savePalette(palette);
    alert('Palette saved!');
  } else {
    alert('No colors to save!');
  }
});

function savePalette(palette) {
  const saved = JSON.parse(localStorage.getItem('savedPalettes')) || [];
  saved.push(palette);
  localStorage.setItem('savedPalettes', JSON.stringify(saved));
}
function getSavedPalettes() {
  return JSON.parse(localStorage.getItem('savedPalettes')) || [];
}

function showSavedPalettes() {
  const container = document.getElementById('savedPalettesContainer');
  container.innerHTML = ''; // Clear before showing

  const palettes = getSavedPalettes();

  if (palettes.length === 0) {
    container.innerHTML = '<p>No saved palettes yet.</p>';
    return;
  }

  palettes.forEach((palette, index) => {
    const paletteDiv = document.createElement('div');
    paletteDiv.classList.add('palette-preview');

    palette.forEach(color => {
      const colorBox = document.createElement('div');
      colorBox.classList.add('color-box');
      colorBox.style.backgroundColor = color;
      paletteDiv.appendChild(colorBox);
    });

    container.appendChild(paletteDiv);
  });
}
