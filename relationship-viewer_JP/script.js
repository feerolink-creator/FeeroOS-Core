// SVGサイズ
const width = 800;
const height = 600;

// 軸の範囲
const minX = -10;
const maxX = 10;
const minY = -10;
const maxY = 10;

// スケール計算
function scaleX(value) {
  return ((value + 10) / 20) * (width - 100) + 50;
}
function scaleY(value) {
  return (1 - ((value + 10) / 20)) * (height - 100) + 50;
}

// ノードデータ
const nodes = [
  { name: "Me", distance: 0, burden: 0 },
  { name: "父", distance: 4, burden: -5 },
  { name: "母", distance: 3, burden: -3 },
  { name: "祖父", distance: 2, burden: 0 },
  { name: "祖母", distance: 2, burden: 2 },
  { name: "友人", distance: 7, burden: 4 },
  { name: "兄弟姉妹", distance: 6, burden: 1 },
];

// SVG作成
const svg = document.getElementById("chart");
svg.setAttribute("width", width);
svg.setAttribute("height", height);

// 四象限背景
const quadrants = [
  { x: -10, y: 0, color: "#f8d7da" }, // 左上
  { x: 0, y: 0, color: "#fff3cd" },  // 右上
  { x: -10, y: -10, color: "#d4edda" }, // 左下
  { x: 0, y: -10, color: "#d1ecf1" }, // 右下
];
quadrants.forEach(q => {
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", scaleX(q.x));
  rect.setAttribute("y", scaleY(q.y + 10));
  rect.setAttribute("width", scaleX(10) - scaleX(0));
  rect.setAttribute("height", scaleY(0) - scaleY(10));
  rect.setAttribute("fill", q.color);
  rect.setAttribute("opacity", "0.3");
  svg.appendChild(rect);
});

// 軸ラベル
const yAxisLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
yAxisLabel.setAttribute("x", 10);
yAxisLabel.setAttribute("y", 20);
yAxisLabel.setAttribute("font-size", "12");
yAxisLabel.textContent = "負荷（+/-）";
svg.appendChild(yAxisLabel);

const xAxisLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
xAxisLabel.setAttribute("x", width - 80);
xAxisLabel.setAttribute("y", height - 10);
xAxisLabel.setAttribute("font-size", "12");
xAxisLabel.textContent = "距離";
svg.appendChild(xAxisLabel);

// ゼロ軸
const vLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
vLine.setAttribute("x1", scaleX(0));
vLine.setAttribute("y1", scaleY(-10));
vLine.setAttribute("x2", scaleX(0));
vLine.setAttribute("y2", scaleY(10));
vLine.setAttribute("stroke", "#cccccc");
vLine.setAttribute("stroke-width", "2");
svg.appendChild(vLine);

const hLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
hLine.setAttribute("x1", scaleX(-10));
hLine.setAttribute("y1", scaleY(0));
hLine.setAttribute("x2", scaleX(10));
hLine.setAttribute("y2", scaleY(0));
hLine.setAttribute("stroke", "#cccccc");
hLine.setAttribute("stroke-width", "2");
svg.appendChild(hLine);

// 支援メッセージ初期化
const supportMessages = document.getElementById("support-messages");
supportMessages.innerHTML = "";

// ノード描画
nodes.forEach((node) => {
  const x = scaleX(node.distance);
  const y = scaleY(node.burden);

  // 色・線・ラベル
  let nodeColor = "#9e9e9e";
  let nodeLabel = node.name;
  let lineColor = "#9e9e9e";
  let lineWidth = 2;

  if (node.burden < -8) {
    nodeColor = "#000";
    nodeLabel = "🐟";
    lineColor = "#000";
    lineWidth = 4;
  } else if (node.burden < -2) {
    nodeColor = "#f44336";
    lineColor = "#f44336";
    lineWidth = 3;
  } else if (node.burden > 2) {
    nodeColor = "#4caf50";
    lineColor = "#4caf50";
    lineWidth = 2;
  }

  // 線
  if (node.name !== "Me") {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", scaleX(0));
    line.setAttribute("y1", scaleY(0));
    line.setAttribute("x2", x);
    line.setAttribute("y2", y);
    line.setAttribute("stroke", lineColor);
    line.setAttribute("stroke-width", lineWidth);
    svg.appendChild(line);

    // スコアラベル
    const scoreLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    const midX = (scaleX(0) + x) / 2;
    const midY = (scaleY(0) + y) / 2;
    scoreLabel.setAttribute("x", midX + 5);
    scoreLabel.setAttribute("y", midY - 5);
    scoreLabel.setAttribute("font-size", "12");
    scoreLabel.setAttribute("fill", "#555");
    scoreLabel.textContent = `距離:${node.distance} 負荷:${node.burden}`;
    svg.appendChild(scoreLabel);
  }

  // ノード
  if (node.burden < -8) {
    const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
    image.setAttributeNS("http://www.w3.org/1999/xlink", "href", "images/funa.PNG");
    image.setAttribute("x", x - 20);
    image.setAttribute("y", y - 20);
    image.setAttribute("width", "40");
    image.setAttribute("height", "40");
    svg.appendChild(image);
  } else {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", 20);
    circle.setAttribute("fill", nodeColor);
    svg.appendChild(circle);

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", x);
    label.setAttribute("y", y + 5);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "14");
    label.setAttribute("fill", "#fff");
    label.textContent = nodeLabel;
    svg.appendChild(label);
  }

  // 支援メッセージ
  if (node.burden < -2) {
    const li = document.createElement("li");
    li.textContent = `${node.name} さんは心理的に負担になっているようです。関わりを減らすための具体的な相談を支援員とすることができます。`;
    supportMessages.appendChild(li);
  }
});

// 入力追加
document.getElementById("addNodeBtn").addEventListener("click", () => {
  const name = document.getElementById("nameInput").value;
  const distance = parseFloat(document.getElementById("distanceInput").value);
  const burden = parseFloat(document.getElementById("burdenInput").value);
  const status = document.getElementById("statusInput").value;

  if (name === "" || isNaN(distance) || isNaN(burden)) {
    alert("すべて入力してね！");
    return;
  }

  let nodeColor = "#9e9e9e";
  if (status === "安心") nodeColor = "#4caf50";
  else if (status === "不安") nodeColor = "#f44336";
  else if (status === "話をきいてくれない") nodeColor = "#ff9800";

  const x = scaleX(distance);
  const y = scaleY(burden);

  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", scaleX(0));
  line.setAttribute("y1", scaleY(0));
  line.setAttribute("x2", x);
  line.setAttribute("y2", y);
  line.setAttribute("stroke", nodeColor);
  line.setAttribute("stroke-width", 2);
  svg.appendChild(line);

  if (burden < -8) {
    const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
    image.setAttributeNS("http://www.w3.org/1999/xlink", "href", "images/funa.PNG");
    image.setAttribute("x", x - 20);
    image.setAttribute("y", y - 20);
    image.setAttribute("width", "40");
    image.setAttribute("height", "40");
    svg.appendChild(image);
  } else {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", 20);
    circle.setAttribute("fill", nodeColor);
    svg.appendChild(circle);

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", x);
    label.setAttribute("y", y + 5);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "14");
    label.setAttribute("fill", "#fff");
    label.textContent = name;
    svg.appendChild(label);
  }

  if (burden < -2) {
    const li = document.createElement("li");
    li.textContent = `${name} さんは心理的に負担になっているようです。関わりを減らすための具体的な相談を支援員とすることができます。`;
    supportMessages.appendChild(li);
  }
});
