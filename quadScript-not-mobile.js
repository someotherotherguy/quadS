//Javascript for drawing and calculating quadratics 2017
var a, b, c, context, w = 600, h = 400, wHalf = w/2, hHalf = h/2, k = 10, kDif = 0, start = 0, full = Math.PI * 2, shouldUpdate = true, vX, vY, aM = 10, pointX = 0, pointY = 0, x1Exists = false, x2Exists = false;

var init = {
  fullReset: function() {
    canvas= document.getElementById("mycanvas");
    context = canvas.getContext("2d");
    w = 600;
    h = 400;
    k = 10;
    init.recalc();
    this.resize();
    //$(window).on("resize", this.resize());
    canvas.addEventListener("mousemove", doMouseMove, false);
    window.addEventListener("resize", this.resize);
    $("#answers").hide;
  },
  recalc: function() {
    kDif = 0;
    QF();
    resetCanvas();
  },
  resize: function() {
    canvasOffset = $("#mycanvas").offset();
    offsetX = Math.round(canvasOffset.left),
    offsetY = Math.round(canvasOffset.top);
    //console.log(canvasOffset);
  }
}


function doMouseMove(event) {
    // always know where ther mouse is located
  resetCanvas();
  mouseX = event.clientX-offsetX;
  mouseY = event.clientY-offsetY;
  pointX = (mouseX-wHalf)/k;
  pointY = evaluate(pointX);
  pointX =  pointX.toFixed(2);
  pointY =  pointY.toFixed(2);
  //console.log(mouseX,mouseY, pointX, pointY, offsetY, offsetX);
  graphDot("yellow", mouseX, (hHalf-pointY*k));
  $("#pointLocation").text("Point on the curve: ("+pointX+","+pointY+")");
}  // end doMouseMove

function graphDot(color, px, py) {
  context.strokeStyle = color;
  context.fillStyle = color;
  context.beginPath();
  context.arc(px, py, 5, 0, 2*Math.PI);
  context.fill();
}

var quadGrapher = {
  gridInitialize: function() {
    //defining position of x/y based off of height (for custom graph sizes)
    xW = h/2;
    yW = w/2;
    //x axis
    context.lineWidth=3;
    context.strokeStyle = "black";
    context.beginPath();
    context.moveTo(aM, xW);
    context.lineTo(w-aM, xW);
    context.stroke();
    //y axis
    context.beginPath();
    context.moveTo(yW, aM );//instances of 20 are essentially spacers between the edge of the canvas
    context.lineTo(yW, h-aM);
    context.stroke();
    //the actual grid
    context.lineWidth=1;
    context.strokeStyle="rgba(0,0,0,.4)";
    //horizontal
    for (i=1; i<h/(2*k); i++) {
      context.beginPath();
      context.moveTo(0, hHalf-i*k);
      context.lineTo(w, hHalf-i*k);
      context.stroke();
      context.beginPath();
      context.moveTo(0, hHalf+i*k);
      context.lineTo(w, hHalf+i*k);
      context.stroke();
    }
    //vertical
    for (i=1; i<w/(2*k); i++) {
      context.beginPath();
      context.moveTo(wHalf-i*k, 0);
      context.lineTo(wHalf-i*k, h);
      context.stroke();
      context.beginPath();
      context.moveTo(wHalf+i*k, 0);
      context.lineTo(wHalf+i*k, h);
      context.stroke();
    }
  },
  equationGrapher: function() {
    for (i = 0; i < w; i++) {
      x = (wHalf-i)/k;
      y = evaluate(x);
      nx =  (wHalf-(i+1))/k;
      ny =  evaluate(nx);
      context.beginPath();
      context.lineWidth = 2;
      context.strokeStyle = "Red";
      context.moveTo(wHalf+x*k, hHalf-y*k);
      context.lineTo(wHalf+nx*k, hHalf-ny*k);
      context.stroke();
    }
    //graphs x intercepts and vertex dots
    if (x1Exists) {graphDot("blue", x1*k+wHalf, hHalf);}
    if (x2Exists) {graphDot("orange", x2*k+wHalf, hHalf);}
    graphDot("green", vX*k+wHalf, -(vY*k)+hHalf);

    //graph vertical line of symmetry
    context.setLineDash([10, 10]);
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(vX*k+wHalf, 5);
    context.lineTo(vX*k+wHalf, h-5);
    context.stroke();
    context.setLineDash([0]);
  },
  zoom: {
    in: function() {
      k += 1;
      kDif += 1;
      resetCanvas();
    },
    out: function() {
      k -= 1;
      kDif -= 1;
      resetCanvas();
    },
    reset: function() {
      k -= kDif;
      kDif = 0;
      resetCanvas();
    }
  } 
}

function resetCanvas() {
  context.clearRect(0,0,w,h);
  quadGrapher.gridInitialize();
  quadGrapher.equationGrapher();
  $("#canvasGridSize").val(k);
}

function QF() {
  // getting values to do quadratic formula
  a = Number($("#quadA").val());
  b = Number($("#linB").val());
  c = Number($("#constant").val());
  w = Number($("#canvasWidth").val());
  h = Number($("#canvasHeight").val());
  k = Number($("#canvasGridSize").val());
  canvas.width = w;
  canvas.height = h;
  wHalf = w/2;
  hHalf = h/2;
  results();
}  // close QF

var johnLenon = {
    isKill: true
};

function solutions() {
  // qudratic formula
  // $("#answers").hide();
  // $("#answers").fadeIn(1500);
  d = Math.pow(b*1,2)-4*a*c;
  if (d<0) {
    $("#solution1").text("The solutions are imaginary (no x-intercepts).");
    x1Exists = false;
    x2Exists = false;
    }
    else{
    // the quadratic formula needs to be typed below assiging x1 and x2
    x1 = (-b + Math.sqrt(d)) / 2 * a;
    x2 = (-b - Math.sqrt(d)) / 2 * a;
    x1Exists = true;
    $("#solution1").text("x = " + x1);
    if (x1 != x2) {
        $("#solution2").text("x = " + x2);
        x2Exists = true;
    } else {
        x2Exists = false;
    }
  }

}

function results() {
  // finding vertext and displaying symline and yint results
  vX = -(b*1)/(2*a);
  vY = evaluate(vX);
  $(".vertex").text("Vertex is at (" + vX+","+vY+")");
  solutions();
  $("#vertexForm").text("Vertex Form is y = "+a+"(x-"+vX+")^2 + "+vY);
}  // close results()

function evaluate(xt) {
  return a*Math.pow(xt,2)+b*xt+c*1;
}
