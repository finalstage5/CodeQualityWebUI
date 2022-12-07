<template>
  <div id="app">
    <transition name="slide-left">
      <router-view class="routerView" />
    </transition>
    <div id="background" :class="{    morning: isMorning, afteroom: isAfteroom, nigiht: isNight    }"></div>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      Hours: 0,
      Minutes: 0,
      Seconds: 0,
      timer: null,
      particlesArray: [],
      ctx: null,
      count: 0
    }
  },
  created() {
    this.getHour()
    //配置
    var config = {
      vx: 4,	//小球x轴速度,正为右 ，负为左
      vy: 4,	//小球y轴速度
      height: 2,	//小球高宽，其实为正方形，所以不宜太大
      width: 2,
      count: 100,		//点个数
      color: "255, 255, 255", 	//点颜色
      stroke: "255,255,255", 		//线条颜色
      dist: 6000, 	//点吸附距离
      e_dist: 20000, 	//鼠标吸附加速距离
      divName: 'background',
      max_conn: 10 	//点到点最大连接数
    }
    //调用
    this.$nextTick(() => {
      this.canvasInit(config);
    })
  },
  computed: {
    isMorning() {
      return this.Hours >= 6 && this.Hours < 17
    },
    isAfteroom() {
      return this.Hours >= 17 && this.Hours < 18
    },
    isNight() {
      return (this.Hours >= 18 && this.Hours < 24) || (this.Hours < 6)
    }
  },
  methods: {
    // 获取当前几点
    getHour() {
      const that = this
      that.timer = setInterval(() => {
        let Dates = new Date()
        that.Hours = Dates.getHours()
        // that.Minutes = Dates.getMinutes()
        // that.Seconds = Dates.getSeconds()
        console.log(that.Hours, that.Minutes, that.Seconds)
      }, 1000)
    },
    // 温馨提示代码
    alertTips() {
      this.timerForAlert = setInterval(() => {
        this.$alert('45分钟啦，要休息一下眼睛哦', '温馨提示', {
          confirmButtonText: '确定',
          callback: () => {
            this.alertTips()
          }
        });
        clearInterval(this.timerForAlert)
      }, 2700000)
    },
    canvasInit(canvasConfig) {
      canvasConfig = canvasConfig || {};
      // 获取特定div作为背景
      var body = document.getElementById("background");
      var canvasObj = document.createElement("canvas");

      var canvas = {
        element: canvasObj,
        points: [],
        // 默认配置
        config: {
          vx: canvasConfig.vx || 4,
          vy: canvasConfig.vy || 4,
          height: canvasConfig.height || 2,
          width: canvasConfig.width || 2,
          count: canvasConfig.count || 100,
          color: canvasConfig.color || "121, 162, 185",
          stroke: canvasConfig.stroke || "130,255,255",
          dist: canvasConfig.dist || 6000,
          e_dist: canvasConfig.e_dist || 20000,
          max_conn: 10
        }
      };

      // 获取context
      if (canvas.element.getContext("2d")) {
        canvas.context = canvas.element.getContext("2d");
      } else {
        return null;
      }

      body.style.padding = "0";
      body.style.margin = "0";
      // body.replaceChild(canvas.element, canvasDiv);
      body.appendChild(canvas.element);

      canvas.element.style = "position: fixed; top: 0; left: 0; z-index: -1;";
      this.canvasSize(canvas.element);
      window.onresize = function () {
        this.canvasSize(canvas.element);
      }
      body.onmousemove = function (e) {
        var event = e || window.event;
        canvas.mouse = {
          x: event.clientX,
          y: event.clientY
        }
      }
      document.onmouseleave = function () {
        canvas.mouse = undefined;
      }
      const that = this
      setInterval(function () {
        that.drawPoint(canvas);
      }, 40);
    },
    canvasSize(canvas) {
      // 获取窗口的宽高
      canvas.width = window.innerWeight || document.documentElement.clientWidth || document.body.clientWidth;
      canvas.height = window.innerWeight || document.documentElement.clientHeight || document.body.clientHeight;
    },
    drawPoint(canvas) {
      var context = canvas.context, point, dist;
      context.clearRect(0, 0, canvas.element.width, canvas.element.height);
      context.beginPath();
      context.fillStyle = "rgb(" + canvas.config.color + ")";
      for (var i = 0, len = canvas.config.count; i < len; i++) {
        if (canvas.points.length != canvas.config.count) {
          // 初始化所有点
          point = {
            x: Math.floor(Math.random() * canvas.element.width),
            y: Math.floor(Math.random() * canvas.element.height),
            vx: canvas.config.vx / 2 - Math.random() * canvas.config.vx,
            vy: canvas.config.vy / 2 - Math.random() * canvas.config.vy
          }
        } else {
          // 处理球的速度和位置，并且做边界处理
          point = this.borderPoint(canvas.points[i], canvas);
        }
        context.fillRect(point.x - canvas.config.width / 2, point.y - canvas.config.height / 2, canvas.config.width, canvas.config.height);

        canvas.points[i] = point;
      }
      this.drawLine(context, canvas, canvas.mouse);
      context.closePath();
    },
    borderPoint(point, canvas) {
      var p = point;
      if (point.x <= 0 || point.x >= canvas.element.width) {
        p.vx = -p.vx;
        p.x += p.vx;
      } else if (point.y <= 0 || point.y >= canvas.element.height) {
        p.vy = -p.vy;
        p.y += p.vy;
      } else {
        p = {
          x: p.x + p.vx,
          y: p.y + p.vy,
          vx: p.vx,
          vy: p.vy
        }
      }
      return p;
    },
    drawLine(context, canvas, mouse) {
      context = context || canvas.context;
      var dist = 6000
      for (var i = 0, len = canvas.config.count; i < len; i++) {
        // 初始化最大连接数
        canvas.points[i].max_conn = 0;
        // point to point
        for (var j = 0; j < len; j++) {
          if (i != j) {
            dist = Math.round(canvas.points[i].x - canvas.points[j].x) * Math.round(canvas.points[i].x - canvas.points[j].x) +
              Math.round(canvas.points[i].y - canvas.points[j].y) * Math.round(canvas.points[i].y - canvas.points[j].y);
            // 两点距离小于吸附距离，而且小于最大连接数，则画线
            if (dist <= canvas.config.dist && canvas.points[i].max_conn < canvas.config.max_conn) {
              canvas.points[i].max_conn++;
              // 距离越远，线条越细，而且越透明
              context.lineWidth = 0.5 - dist / canvas.config.dist;
              context.strokeStyle = "rgba(" + canvas.config.stroke + "," + (1 - dist / canvas.config.dist) + ")"
              context.beginPath();
              context.moveTo(canvas.points[i].x, canvas.points[i].y);
              context.lineTo(canvas.points[j].x, canvas.points[j].y);
              context.stroke();

            }
          }
        }
        // 如果鼠标进入画布
        if (mouse) {
          dist = Math.round(canvas.points[i].x - mouse.x) * Math.round(canvas.points[i].x - mouse.x) +
            Math.round(canvas.points[i].y - mouse.y) * Math.round(canvas.points[i].y - mouse.y);
          // 遇到鼠标吸附距离时加速，直接改变point的x，y值达到加速效果
          if (dist > canvas.config.dist && dist <= canvas.config.e_dist) {
            canvas.points[i].x = canvas.points[i].x + (mouse.x - canvas.points[i].x) / 20;
            canvas.points[i].y = canvas.points[i].y + (mouse.y - canvas.points[i].y) / 20;
          }
          if (dist <= canvas.config.e_dist) {
            context.lineWidth = 1;
            context.strokeStyle = "rgba(" + canvas.config.stroke + "," + (1 - dist / canvas.config.e_dist) + ")";
            context.beginPath();
            context.moveTo(canvas.points[i].x, canvas.points[i].y);
            context.lineTo(mouse.x, mouse.y);
            context.stroke();
          }
        }
      }
    }
  }
}
</script>

<style scoped>
#app {
  height: 100vh;
  position: relative;
}
.routerView {
  height: 100vh;
  overflow-y: scroll;
}
#background {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0.6;
  width: 100%;
  height: 100vh;
}

#background.morning,
#background.afteroom,
#background.nigiht {
  background-repeat: repeat;
  background-size: cover;
  transition: all 1s;
  width: 100%;
  height: 100%;
}

#background.morning {
  background-image: url("./assets/bluesky.jpg");
}

#background.afteroom {
  background-image: url("./assets/dinnertime.jpg");
}

#background.nigiht {
  background-image: url("./assets/night.jpg");
}

.slide-right-enter {
  transform: translate(-100%, 0);
}

.slide-right-leave-to {
  transform: translate(100%, 0);
}

.slide-left-enter {
  transform: translate(100%, 0);
}

.slide-left-leave-to {
  transform: translate(-100%, 0);
}

.slide-right-enter-active,
.slide-right-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 400ms;
  position: absolute;
}
</style>

<style>
.el-button {
  background-image: linear-gradient(#99bcee, #636bdb);
}

.el-button:active {
  transform: scale(0.9);
  transition: all 0.1s;
}
</style>
