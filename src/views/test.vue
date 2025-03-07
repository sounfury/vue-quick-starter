<template>
  <div>
    <!-- 物理模拟画布 -->
    <canvas ref="canvas" width="800" height="600"></canvas>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Matter from "matter-js";

// 画布引用
const canvas = ref(null);

// 声明物理引擎和渲染器
let engine, render, runner;

onMounted(() => {
  // 创建物理引擎
  engine = Matter.Engine.create();
  const world = engine.world;

  // 设置重力方向和大小
  engine.gravity.y =1; // 向下的重力，值为1表示标准重力

  // 创建渲染器
  render = Matter.Render.create({
    canvas: canvas.value, // 渲染目标为画布
    engine: engine,
    options: {
      width: 1800,
      height: 600,
      wireframes: false, // 关闭线框模式，使用填充图形
      background: "#f0f0f0", // 背景颜色
    },
  });

  // 创建地面（静态物体）
  const ground = Matter.Bodies.rectangle(400, 480, 1810, 60, {
    isStatic: true, // 静态物体
    render: { fillStyle: "#2e2e2e" },
  });
  

  // 创建一个矩形
  const box = Matter.Bodies.rectangle(400, 200, 80, 80, {
    render: { fillStyle: "#007bff" },
  });

  // 创建一个小球
  const ball = Matter.Bodies.circle(450, 100, 40, {
    restitution:1, // 增加弹性
    render: { fillStyle: "#ff5733" },
  });

  // 将物体添加到物理世界
  Matter.World.add(world, [ground, box, ball]);

  // 创建runner来持续更新引擎
  runner = Matter.Runner.create();

  // 运行引擎
  Matter.Runner.run(runner, engine);

  // 运行渲染器
  Matter.Render.run(render);
});

onUnmounted(() => {
  // 停止渲染器
  Matter.Render.stop(render);

  // 停止runner
  Matter.Runner.stop(runner);

  // 清理引擎
  Matter.Engine.clear(engine);
});
</script>