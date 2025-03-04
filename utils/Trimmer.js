class Trimmer {

  constructor() {

  }

  static getAlpha(data, width, x, y) {
    return data[((y * (width * 4)) + (x * 4)) + 3];
  }

  static getLeftSpace(data, width, height, threshold = 0) {
    let x = 0;

    for (x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (this.getAlpha(data, width, x, y) > threshold) {
          return x;
        }
      }
    }

    return 0;
  }

  static getRightSpace(data, width, height, threshold = 0) {
    let x = 0;

    for (x = width - 1; x >= 0; x--) {
      for (let y = 0; y < height; y++) {
        if (this.getAlpha(data, width, x, y) > threshold) {
          return width - x - 1;
        }
      }
    }

    return 0;
  }

  static getTopSpace(data, width, height, threshold = 0) {
    let y = 0;

    for (y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (this.getAlpha(data, width, x, y) > threshold) {
          return y;
        }
      }
    }

    return 0;
  }

  static getBottomSpace(data, width, height, threshold = 0) {
    let y = 0;

    for (y = height - 1; y >= 0; y--) {
      for (let x = 0; x < width; x++) {
        if (this.getAlpha(data, width, x, y) > threshold) {
          return height - y - 1;
        }
      }
    }

    return 0;
  }

  static trim(rects, threshold = 0) {

    for (let item of rects) {

      let img = item.image;
      let data = img.bitmap.data;
      let spaces = { left: 0, right: 0, top: 0, bottom: 0 };

      spaces.left = this.getLeftSpace(data, img.width, img.height, threshold);

      let spriteWidth = img.width;
      let spriteHeight = img.height;

      if (spaces.left !== img.width) {
        spaces.right = this.getRightSpace(data, img.width, img.height, threshold);
        spaces.top = this.getTopSpace(data, img.width, img.height, threshold);
        spaces.bottom = this.getBottomSpace(data, img.width, img.height, threshold);

        if (spaces.left > 0 || spaces.right > 0 || spaces.top > 0 || spaces.bottom > 0) {
          item.trimmed = true;
          item.spriteSourceSize.x = spaces.left;
          item.spriteSourceSize.y = spaces.top;
          spriteWidth = img.width - spaces.left - spaces.right;
          spriteHeight = img.height - spaces.top - spaces.bottom;
          item.spriteSourceSize.w = spriteWidth;
          item.spriteSourceSize.h = spriteHeight;
          item.spriteSourceSize.mw = spaces.left + spaces.right;
          item.spriteSourceSize.mh = spaces.top + spaces.bottom;
        }
      }
      else {
        item.trimmed = true;
        item.spriteSourceSize.x = 0;
        item.spriteSourceSize.y = 0;
        item.spriteSourceSize.w = 1;
        item.spriteSourceSize.h = 1;
        item.spriteSourceSize.mw = 0;
        item.spriteSourceSize.mh = 0;
      }

      if (item.trimmed) {
        item.frame.w = spriteWidth;
        item.frame.h = spriteHeight;
      }
    }
  }
}

module.exports = Trimmer;
