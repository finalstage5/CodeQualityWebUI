// 定义粒子类
export default class Particle {
  constructor(x, y) {
    this.x = x
    this.y = y
    // x，y轴的移动速度  -0.5 -- 0.5
    this.directionX = Math.random() - 0.5
    this.directionY = Math.random() - 0.5
  }

  // 更新点的坐标
  update() {
    this.x += this.directionX
    this.y += this.directionY
  }

  // 绘制粒子
  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fillStyle = "white"
    ctx.fill()
  }
}
