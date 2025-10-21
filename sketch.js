let objs = [];
let objsNum = 500;
let g3; // 3D graphics layer for rotating text
let g3b; // 另一個 3D layer：用於左右旋轉的文字

const palette = [
  "#FF00D8",
  "#FFB201",
  "#98FF00",
  "#00FFC4",
  "#0082FE",
  "#B733FF",
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  angleMode(DEGREES);
  frameRate(60);
  noFill();

  background(0);

  // 建立 WEBGL graphics 畫面，用來渲染 3D 文字（透明背景）
  g3 = createGraphics(windowWidth, windowHeight, WEBGL);
  g3.clear();
  g3.textAlign(CENTER, CENTER);
  g3.textSize(min(windowWidth, windowHeight) * 0.12);
  g3.noStroke();
  g3.fill(255);

  for (let i = 0; i < objsNum; i++) {
    objs.push(new Obj(i));
  }

  // 新增：另一個 WEBGL layer 用於左右旋轉的文字
  g3b = createGraphics(windowWidth, windowHeight, WEBGL);
  g3b.clear();
  g3b.textAlign(CENTER, CENTER);
  g3b.textSize(min(windowWidth, windowHeight) * 0.12);
  g3b.noStroke();
  g3b.fill(255);
}

function draw() {
  blendMode(BLEND);
  background("#111111");

  blendMode(SCREEN);

  for (let i = 0; i < objs.length; i++) {
    objs[i].move();
    objs[i].display();
  }

  // 在中間畫出會旋轉的文字
  push();
  translate(width / 2, height / 2);
  // 使用 setup() 中設定的 DEGREES
  rotate(frameCount * 0.5); // 調整旋轉速度
  noStroke();
  fill(255, 220); // 白色，稍微有透明度
  textAlign(CENTER, CENTER);
  textSize(min(width, height) * 0.12); // 依視窗大小調整文字尺寸
  text("414737113", 0, 0);
  pop();

  // 使用 g3 在中心繪製真正的 3D 旋轉文字（WEBGL）
  g3.clear(); // 保持透明
  g3.push();
  // 微微傾斜讓旋轉有深度感
  g3.rotateX(-15);
  // 繞 Y 軸旋轉（調整乘數改變速度）
  g3.rotateY(frameCount * 0.25);
  g3.noStroke();
  g3.fill(255, 220);
  g3.textAlign(CENTER, CENTER);
  g3.textSize(min(width, height) * 0.12);
  g3.text("414737113", 0, 0);
  g3.pop();

  // 在中間畫出會繞垂直軸左右旋轉的 3D 文字（用 g3b）
  g3b.clear();
  g3b.push();
  // 微微傾斜讓旋轉有深度感（可調）
  g3b.rotateX(-10);
  // 繞 Y 軸旋轉（修改乘數可改速度，數值越小越慢）
  g3b.rotateY(frameCount * 0.35);
  g3b.noStroke();
  g3b.fill(255, 220);
  g3b.textAlign(CENTER, CENTER);
  g3b.textSize(min(width, height) * 0.12);
  g3b.text("7113黃昱翔", 0, 0);
  g3b.pop();

  // 把 3D layers 畫回主畫布（對齊整個畫面）
  image(g3, 0, 0, width, height);
  image(g3b, 0, 0, width, height);
}

class Obj {
  constructor(tmpIndex) {
    this.index = tmpIndex;
    this.startX = random(width);
    this.init();
    this.goalX = this.startX + this.rangeX;
  }

  init() {
    this.rangeX = random([
      5, 5, 5, 5, 5, 5, 10, 10, 10, 20, 20, 100, 100, 100, 100, 200, 300
    ]);
    // 減慢線條移動速度：將步長調小
    this.step = map(this.rangeX, 5, 200, 2, 12); // 原本 5..30
    this.strWeight = random(3, 30);
    this.c = color(random(palette));
    if (this.rangeX < 100) {
      this.c.setAlpha(150);
    }
    this.isOut = random(100) < 10 ? true : false;
  }

  move() {
    this.startX += this.step;
    this.goalX = this.startX + this.rangeX;

    if (this.startX > width) {
      this.init();
      this.startX = -this.rangeX;
      this.goalX = this.startX + this.rangeX;
    }
  }

  display() {
    strokeWeight(this.strWeight);
    stroke(this.c);
    noFill();
    beginShape();
    for (let x = this.startX; x <= this.goalX; x++) {
      let y = map(
        noise(
          x * 0.001,
          this.isOut ? this.index * 0.025 : this.index * 0.005,
          frameCount * 0.003
        ),
        0,
        1,
        -height * 0.25,
        height * 1.25
      );
      vertex(x, y);
    }
    endShape();
  }
}

// 新增：在視窗調整時同步更新 g3 大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  g3 = createGraphics(windowWidth, windowHeight, WEBGL);
  g3.clear();
  g3.textAlign(CENTER, CENTER);
  g3.textSize(min(windowWidth, windowHeight) * 0.12);
  g3.noStroke();
  g3.fill(255);

  g3b = createGraphics(windowWidth, windowHeight, WEBGL);
  g3b.clear();
  g3b.textAlign(CENTER, CENTER);
  g3b.textSize(min(windowWidth, windowHeight) * 0.12);
  g3b.noStroke();
  g3b.fill(255);
}
