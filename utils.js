exports.sortColors = (arr) => {
  arr.forEach(({ hex }, index) => {
    // Get the RGB values to calculate the Hue.
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    // Getting the Max and Min values for Chroma.
    const max = Math.max.apply(Math, [r, g, b]);
    const min = Math.min.apply(Math, [r, g, b]);

    // Variables for HSV value of hex color.
    const chr = max - min;
    let hue = 0;
    const val = max;
    let sat = 0;

    if (val > 0) {
      // Calculate Saturation only if Value isn't 0.
      sat = chr / val;
      if (sat > 0) {
        if (r == max) {
          hue = 60 * ((g - min - (b - min)) / chr);
          if (hue < 0) {
            hue += 360;
          }
        } else if (g == max) {
          hue = 120 + 60 * ((b - min - (r - min)) / chr);
        } else if (b == max) {
          hue = 240 + 60 * ((r - min - (g - min)) / chr);
        }
      }
    }
    // Modifies existing objects by adding HSV values.
    arr[index].hue = hue;
    arr[index].sat = sat;
    arr[index].val = val;
  });
  // Sort by Hue.
  return arr.sort((a, b) => {
    return a.hue - b.hue;
  });
};
