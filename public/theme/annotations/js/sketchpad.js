!(function (t, i) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = i())
    : "function" == typeof define && define.amd
    ? define([], i)
    : "object" == typeof exports
    ? (exports["responsive-sketchpad"] = i())
    : (t.Sketchpad = i());
})(self, function () {
  return (() => {
    "use strict";

    var t = {};
    return (
      (() => {
        var i = t,
          pad = this,
          e = (function () {
            function t(t, i) {
              if (
                ((this.sketching = !1),
                (this._strokes = []),
                (this.undoneStrokes = []),
                (this.readOnly = !1),
                (this.aspectRatio = 1),
                (this.lineWidth = 11),
                (this.startPoint = null),
                (this.endPoint = null),
                (this.lastCPoint = null),
                (this.pathPoint = null),
                (this.isDrag = false),
                (this.timer = null),
                (this.lineColor = "#000"),
                (this.lineCap = "round"),
                (this.lineJoin = "miter"),
                (this.undoManager = new UndoManager()),
                (this.closestLineIndex = -1),
                (this.closestX = -1),
                (this.closestY = -1),
                (this.drawType = "hand"),
                (this.lineMiterLimit = 1),
                null == t)
              )
                throw new Error("Must pass in a container element");
              null != i && this.setOptions(i),
                (this.canvas = document.createElement("canvas")),
                (this.ctx = this.canvas.getContext("2d"));
              var e = (null == i ? void 0 : i.width) || t.clientWidth,
                n = (null == i ? void 0 : i.height) || e * this.aspectRatio;
              this.setCanvasSize(e, n),
                t.appendChild(this.canvas),
                this._strokes.length > 0 && this.redraw(),
                this.listen();
            }
            return (
              Object.defineProperty(t.prototype, "strokes", {
                get: function () {
                  return this._strokes.map(function (t) {
                    return t.toObj();
                  });
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "undos", {
                get: function () {
                  return this.undoneStrokes.map(function (t) {
                    return t.toObj();
                  });
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "opts", {
                get: function () {
                  return {
                    backgroundColor: this.backgroundColor,
                    readOnly: this.readOnly,
                    width: this.canvas.width,
                    height: this.canvas.height,
                    aspectRatio: this.canvas.width / this.canvas.height,
                    line: {
                      size: this.lineWidth,
                      color: this.lineColor,
                      cap: this.lineCap,
                      join: this.lineJoin,
                      miterLimit: this.lineMiterLimit,
                    },
                  };
                },
                enumerable: !1,
                configurable: !0,
              }),
              (t.prototype.toJSON = function () {
                return {
                  aspectRatio: this.canvas.width / this.canvas.height,
                  strokes: this.strokes,
                };
              }),
              (t.prototype.loadJSON = function (t) {
                var i = t.strokes || [];

                (this._strokes = i.map(function (t) {
                  return s.fromObj(t);
                })),
                  this.redraw();
              }),
              (t.prototype.toDataURL = function (t) {
                return this.canvas.toDataURL(t);
              }),
              (t.prototype.setCanvasSize = function (t, i) {
                this.canvas.setAttribute("width", t.toString()),
                  this.canvas.setAttribute("height", i.toString()),
                  (this.canvas.style.width = t + "px"),
                  (this.canvas.style.height = i + "px");
              }),
              (t.prototype.getCanvasSize = function () {
                return { width: this.canvas.width, height: this.canvas.height };
              }),
              (t.prototype.setLineWidth = function (t) {
                this.lineWidth = t;
              }),
              (t.prototype.setDrawType = function (t) {
                this.closestLineIndex = -1;

                $("#sketchpad canvas").removeClass("eraseCursorA");
                $("#sketchpad canvas").removeClass("eraseCursor");

                this.drawType = t;
                this.redraw();
              }),
              (t.prototype.setLineSize = function (t) {
                this.lineWidth = t;
              }),
              (t.prototype.setLineColor = function (t) {
                this.lineColor = t;
              }),
              (t.prototype.setReadOnly = function (t) {
                this.readOnly = t;
              }),
              (t.prototype.getReadOnly = function (t) {
                return this.readOnly;
              }),
              (t.prototype.removeStroke = function (id) {
                var i = 0,
                  index = -1;
                for (i = 0; i < this._strokes.length; i += 1) {
                  if (this._strokes[i].id === id) {
                    index = i;
                  }
                }
                if (index !== -1) {
                  this._strokes.splice(index, 1);
                }
                this.redraw();
              }),
              (t.prototype.undo = function () {
                // 0 !== this._strokes.length && (this.undoneStrokes.push(this._strokes.pop()), this.redraw());
                this.undoManager.undo();
              }),
              (t.prototype.redo = function () {
                // 0 !== this.undoneStrokes.length && (this._strokes.push(this.undoneStrokes.pop()), this.redraw());
                this.undoManager.redo();
              }),
              (t.prototype.isIntersecting = function (p1, p2, p3, p4) {
                function CCW(p1, p2, p3) {
                  return (
                    (p3.y - p1.y) * (p2.x - p1.x) >
                    (p2.y - p1.y) * (p3.x - p1.x)
                  );
                }
                return (
                  CCW(p1, p3, p4) != CCW(p2, p3, p4) &&
                  CCW(p1, p2, p3) != CCW(p1, p2, p4)
                );
              }),
              (t.prototype.clear = function () {
                // (this.undoneStrokes = this._strokes),
                (this._strokes = []), this.redraw();
              }),
              (t.prototype.drawLine = function (t, i, e) {
                this.setOptions({ line: e }),
                  (t = this.getPointRelativeToCanvas(new o(t.x, t.y))),
                  (i = this.getPointRelativeToCanvas(new o(i.x, i.y))),
                  this.pushStroke([t, i]),
                  this.redraw();
              }),
              (t.prototype.resize = function (t) {
                var i = t * this.aspectRatio;
                (this.lineWidth = this.lineWidth * (t / this.canvas.width)),
                  this.setCanvasSize(t, i),
                  this.redraw();
              }),
              (t.prototype.getPointRelativeToCanvas = function (t) {
                return {
                  x: t.x / this.canvas.width,
                  y: t.y / this.canvas.height,
                };
              }),
              (t.prototype.getLineSizeRelativeToCanvas = function (t) {
                return t / this.canvas.width;
              }),
              (t.prototype.setOptions = function (t) {
                var i, e, n, o, r, a;
                t.backgroundColor && (this.backgroundColor = t.backgroundColor),
                  (null === (i = t.line) || void 0 === i ? void 0 : i.size) &&
                    (this.lineWidth = t.line.size),
                  (null === (e = t.line) || void 0 === e ? void 0 : e.cap) &&
                    (this.lineCap = t.line.cap),
                  (null === (n = t.line) || void 0 === n ? void 0 : n.join) &&
                    (this.lineJoin = t.line.join),
                  (null === (o = t.line) || void 0 === o
                    ? void 0
                    : o.miterLimit) &&
                    (this.lineMiterLimit = t.line.miterLimit),
                  t.aspectRatio && (this.aspectRatio = t.aspectRatio),
                  t.data &&
                    (this._strokes =
                      null !==
                        (a =
                          null === (r = t.data.strokes) || void 0 === r
                            ? void 0
                            : r.map(function (t) {
                                return s.fromObj(t);
                              })) && void 0 !== a
                        ? a
                        : []),
                  t.onDrawEnd && (this.onDrawEnd = t.onDrawEnd);
              }),
              (t.prototype.getCursorRelativeToCanvas = function (t) {
                var i,
                  e = this.canvas.getBoundingClientRect();
                if (n(t)) {
                  var s = t;
                  i = new o(
                    s.touches[0].clientX - e.left,
                    s.touches[0].clientY - e.top
                  );
                } else {
                  var r = t;
                  i = new o(r.clientX - e.left, r.clientY - e.top);
                }
                return new o(i.x / this.canvas.width, i.y / this.canvas.height);
              }),
              (t.prototype.normalizePoint = function (t) {
                return new o(t.x * this.canvas.width, t.y * this.canvas.height);
              }),
              (t.prototype.getLineWidthRelativeToCanvas = function (t) {
                return t / this.canvas.width;
              }),
              (t.prototype.normalizeLineWidth = function (t) {
                return t * this.canvas.width;
              }),
              (t.prototype.clearCanvas = function () {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height),
                  this.backgroundColor &&
                    ((this.ctx.fillStyle = this.backgroundColor),
                    this.ctx.fillRect(
                      0,
                      0,
                      this.canvas.width,
                      this.canvas.height
                    ));
              }),
              (t.prototype.creeBoule = function (posX, posY) {
                var options = {
                  couleur: "#fff",
                  largeur: 8,
                  hauteur: 8,
                };

                var boule = $('<div class="hoverDisabled"></div>')
                  .css({
                    position: "fixed",
                    width: options.largeur,
                    height: options.hauteur,
                    "border-radius": "50%",
                    background: options.couleur,
                    "box-shadow":
                      "0 0 10px" +
                      options.couleur +
                      ", 0 0 10px" +
                      options.couleur +
                      ", 0 0 10px" +
                      options.couleur +
                      ", 0 0 10px" +
                      options.couleur,
                    top: posY + "px",
                    left: posX + "px",
                  })
                  .appendTo($("#sketchpad"))
                  .fadeOut("slow", function () {
                    $(this).remove();
                  });
              }),
              (t.prototype.onSegment = function (p, q, r) {
                if (
                  q.x <= Math.max(p.x, r.x) &&
                  q.x >= Math.min(p.x, r.x) &&
                  q.y <= Math.max(p.y, r.y) &&
                  q.y >= Math.min(p.y, r.y)
                )
                  return true;

                return false;
              }),
              // To find orientation of ordered triplet (p, q, r).
              // The function returns following values
              // 0 --> p, q and r are collinear
              // 1 --> Clockwise
              // 2 --> Counterclockwise
              (t.prototype.orientation = function (p, q, r) {
                // See https://www.geeksforgeeks.org/orientation-3-ordered-points/
                // for details of below formula.
                let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

                if (val == 0) return 0; // collinear

                return val > 0 ? 1 : 2; // clock or counterclock wise
              }),
              // The main function that returns true if line segment 'p1q1'
              // and 'p2q2' intersect.
              (t.prototype.doIntersect = function (p1, q1, p2, q2) {
                // Find the four orientations needed for general and
                // special cases
                let o1 = this.orientation(p1, q1, p2);
                let o2 = this.orientation(p1, q1, q2);
                let o3 = this.orientation(p2, q2, p1);
                let o4 = this.orientation(p2, q2, q1);

                // General case
                if (o1 != o2 && o3 != o4) return true;

                // Special Cases
                // p1, q1 and p2 are collinear and p2 lies on segment p1q1
                if (o1 == 0 && this.onSegment(p1, p2, q1)) return true;

                // p1, q1 and q2 are collinear and q2 lies on segment p1q1
                if (o2 == 0 && this.onSegment(p1, q2, q1)) return true;

                // p2, q2 and p1 are collinear and p1 lies on segment p2q2
                if (o3 == 0 && this.onSegment(p2, p1, q2)) return true;

                // p2, q2 and q1 are collinear and q1 lies on segment p2q2
                if (o4 == 0 && this.onSegment(p2, q1, q2)) return true;

                return false; // Doesn't fall in any of the above cases
              }),
              (t.prototype.setClosestLine = function (mx, my) {
                //
                this.closestLineIndex = -1;
                this.closestX = mx;
                this.closestY = my;
                var minDistanceSquared = 10;
                //
                // examine each line &
                // determine which line is closest to the mouse (mx,my)
                for (var i = 0; i < this._strokes.length; i++) {
                  var path = this._strokes[i];
                  var pnts = path.points;

                  /*for(var j=0;j<pnts.length;j++) {

                                            var x = pnts[j].x;
                                            var y = pnts[j].y;
                                            var dx1 = mx - x;
                                            var dy1 = my - y;
                                            var distSquared = dx1 * dx1 + dy1 * dy1;
                                            if (distSquared < minDistanceSquared && distSquared<=0.01) {
                                                console.log('distance : ', distSquared, minDistanceSquared);
                                                console.log(path.drawType);
                                                minDistanceSquared = distSquared;
                                                this.closestLineIndex = i;
                                                this.closestX = x;
                                                this.closestY = y;

                                                $('#sketchpad canvas').addClass('eraseCursorA');
                                            }

                                        }*/
                }
              }),
              (t.prototype.drawStroke = function (t, index) {
                this.ctx.lineWidth = 2;
                if (null != t.points) {
                  if (t.type == 1) {
                    this.ctx.beginPath();
                    let isInPath = false;

                    //console.log(this.ctx.isPointInStroke(t, this.pathPoint .x, this.pathPoint .y));

                    var pt = this.normalizePoint(
                      new o(this.closestX, this.closestY)
                    );
                    for (var i = 0; i < t.points.length - 1; i++) {
                      var e = this.normalizePoint(t.points[i]),
                        n = this.normalizePoint(t.points[i + 1]);
                      this.ctx.moveTo(e.x, e.y), this.ctx.lineTo(n.x, n.y);
                      if (
                        this.drawType == "delete" &&
                        this.lastCPoint != null &&
                        this.doIntersect(e, n, pt, this.lastCPoint)
                      ) {
                        this.closestLineIndex = index;
                      }
                    }
                    this.ctx.closePath();

                    if (
                      this.drawType == "delete" &&
                      (this.ctx.isPointInStroke(pt.x, pt.y) ||
                        this.ctx.isPointInPath(pt.x, pt.y))
                    ) {
                      isInPath = true;
                      this.closestLineIndex = index;
                    } else {
                    }

                    t.color && (this.ctx.strokeStyle = t.color),
                      t.width &&
                        (this.ctx.lineWidth = this.normalizeLineWidth(t.width)),
                      t.join && (this.ctx.lineJoin = t.join),
                      t.cap && (this.ctx.lineCap = t.cap),
                      t.miterLimit && (this.ctx.miterLimit = t.miterLimit),
                      this.ctx.stroke();
                  } else {
                    this.drawCircle(t, index);
                  }
                }
              }),
              (t.prototype.drawCircle = function (t, index) {
                this.ctx.lineWidth = 2;
                let isInPath = false;

                if (null != t.points) {
                  this.ctx.beginPath();
                  for (var i = 0; i < t.points.length - 1; i++) {
                    var e = this.normalizePoint(t.points[i]),
                      n = this.normalizePoint(t.points[i + 1]);
                    // this.ctx.moveTo(e.x, e.y), this.ctx.lineTo(n.x, n.y);

                    this.ctx.arc(e.x, e.y, Math.abs(n.x - e.x), 0, 2 * Math.PI);
                  }

                  var pt = this.normalizePoint(
                    new o(this.closestX, this.closestY)
                  );

                  if (
                    this.drawType == "delete" &&
                    (this.ctx.isPointInStroke(pt.x, pt.y) ||
                      this.ctx.isPointInPath(pt.x, pt.y))
                  ) {
                    isInPath = true;
                    this.closestLineIndex = index;
                  }
                  //this.ctx.closePath(),
                  t.color && (this.ctx.strokeStyle = t.color),
                    t.width &&
                      (this.ctx.lineWidth = this.normalizeLineWidth(t.width)),
                    t.join && (this.ctx.lineJoin = t.join),
                    t.cap && (this.ctx.lineCap = t.cap),
                    t.miterLimit && (this.ctx.miterLimit = t.miterLimit),
                    this.ctx.stroke();
                }
              }),
              (t.prototype.pushElement = function (
                t,
                id = "",
                type = 0,
                size,
                color
              ) {
                const uint32 = window.crypto.getRandomValues(
                  new Uint32Array(1)
                )[0];
                if (id == "") id = uint32.toString(16);
                this._strokes.push(
                  s.fromObj({
                    id: id,
                    points: t,
                    type: type,
                    size: size,
                    width: size,
                    color: color,
                    cap: this.lineCap,
                    join: this.lineJoin,
                    miterLimit: this.lineMiterLimit,
                  })
                );
                this.undoManager.add({
                  undo: function () {
                    removeStroke(id);
                  },
                  redo: function () {
                    console.log(t);
                    removeStroke(id);
                    pushElement(t, id, type, size, color);
                  },
                });
                console.log(this._strokes);
                this.redraw();
              }),
              (t.prototype.AddUndoRedo = function (
                t,
                id = "",
                type,
                size,
                color
              ) {
                this.undoManager.add({
                  undo: function () {
                    removeStroke(id);
                  },
                  redo: function () {
                    console.log(size);
                    removeStroke(id);
                    pushElement(t, id, type, size, color);
                  },
                });
              }),
              (t.prototype.pushStroke = function (t, id = "") {
                const uint32 = window.crypto.getRandomValues(
                  new Uint32Array(1)
                )[0];
                if (id == "") id = uint32.toString(16);

                this._strokes.push(
                  s.fromObj({
                    id: id,
                    points: t,
                    type: 1,
                    size: this.getLineWidthRelativeToCanvas(this.lineWidth),
                    color: this.lineColor,
                    cap: this.lineCap,
                    join: this.lineJoin,
                    miterLimit: this.lineMiterLimit,
                  })
                );
              }),
              (t.prototype.pushCircle = function (t, id = "") {
                const uint32 = window.crypto.getRandomValues(
                  new Uint32Array(1)
                )[0];
                if (id == "") id = uint32.toString(16);
                this._strokes.push(
                  s.fromObj({
                    id: id,
                    points: t,
                    type: 0,
                    size: this.getLineWidthRelativeToCanvas(this.lineWidth),
                    color: this.lineColor,
                    cap: this.lineCap,
                    join: this.lineJoin,
                    miterLimit: this.lineMiterLimit,
                  })
                );
              }),
              (t.prototype.pushPoint = function (t) {
                var i = this._strokes[this._strokes.length - 1];
                i.points && i.points.push(t);
              }),
              (t.prototype.pushCPoint = function (t) {
                var i = this._strokes[this._strokes.length - 1];
                i.points = [];
                i.points &&
                  i.points.push(this.startPoint) &&
                  i.points.push(this.endPoint);
              }),
              (t.prototype.DrawLinee = function (t) {
                var i = this._strokes[this._strokes.length - 1];
                i.points = [];
                i.points &&
                  i.points.push(this.startPoint) &&
                  i.points.push(this.endPoint);
              }),
              (t.prototype.arrow = function (
                startX,
                startY,
                endX,
                endY,
                controlPoints
              ) {
                var dx = endX - startX;
                var dy = endY - startY;
                var len = Math.sqrt(dx * dx + dy * dy);
                var sin = dy / len;
                var cos = dx / len;
                var a = [];
                var b = [];
                a.push(0, 0);
                for (var i = 0; i < controlPoints.length; i += 2) {
                  var x = controlPoints[i];
                  var y = controlPoints[i + 1];
                  a.push(x < 0 ? len + x : x, y);
                }
                a.push(len, 0);
                for (var i = controlPoints.length; i > 0; i -= 2) {
                  var x = controlPoints[i - 2];
                  var y = controlPoints[i - 1];
                  a.push(x < 0 ? len + x : x, -y);
                }
                a.push(0, 0);
                for (var i = 0; i < a.length; i += 2) {
                  var x = a[i] * cos - a[i + 1] * sin + startX;
                  var y = a[i] * sin + a[i + 1] * cos + startY;
                  if (i === 0) b.push(new o(startX, startY));
                  else b.push(new o(x, y));
                }
                return b;
              }),
              (t.prototype.DrawArrow = function (t) {
                var i = this._strokes[this._strokes.length - 1];

                i.points = [];
                var headlen = 10; // length of head in pixels
                var dx = this.endPoint.x - this.startPoint.x;
                var dy = this.endPoint.y - this.startPoint.y;
                var tox = this.endPoint.x;
                var toy = this.endPoint.y;
                var angle = Math.atan2(dy, dx);
                i.points.push(this.startPoint);
                i.points.push(this.endPoint);
                var w = 3.5; //width of arrow to one side. 7 pixels wide arrow is pretty
                angle = angle + Math.PI / 2;
                tox = tox + (w * Math.cos(angle)) / this.canvas.width;
                toy = toy + (w * Math.sin(angle)) / this.canvas.height;
                i.points.push(new o(tox, toy));

                angle = angle - 1.849096;
                tox = tox + (w * 3.5 * Math.cos(angle)) / this.canvas.width;
                toy = toy + (w * 3.5 * Math.sin(angle)) / this.canvas.height;

                i.points.push(new o(tox, toy));
                angle = angle - 2.584993;
                tox = tox + (w * 3.5 * Math.cos(angle)) / this.canvas.width;
                toy = toy + (w * 3.5 * Math.sin(angle)) / this.canvas.height;
                i.points.push(new o(tox, toy));
                angle = angle - 1.849096;
                tox = tox + (w * Math.cos(angle)) / this.canvas.width;
                toy = toy + (w * Math.sin(angle)) / this.canvas.height;
                i.points.push(new o(tox, toy));

                i.points;
              }),
              (t.prototype.drawRectangle = function (t) {
                var i = this._strokes[this._strokes.length - 1];
                i.points = [];
                var a = this.startPoint;
                var e = this.endPoint;
                var b = new o(e.x, a.y);
                var c = new o(a.x, e.y);
                i.points &&
                  i.points.push(a) &&
                  i.points.push(b) &&
                  i.points.push(e) &&
                  i.points.push(c) &&
                  i.points.push(a);
              }),
              (t.prototype.redraw = function () {
                var t = this;
                //  t.undoManager.clear();
                this.clearCanvas(),
                  this._strokes.forEach(function (i, index) {
                    return t.drawStroke(i, index);
                  });
              }),
              (t.prototype.listen = function () {
                var t = this;
                ["mousedown", "touchstart"].forEach(function (i) {
                  return t.canvas.addEventListener(i, function (i) {
                    return t.startStrokeHandler(i);
                  });
                }),
                  ["mousemove", "touchmove"].forEach(function (i) {
                    return t.canvas.addEventListener(i, function (i) {
                      return t.drawStrokeHandler(i);
                    });
                  }),
                  ["mouseup", "mouseleave", "touchend"].forEach(function (i) {
                    return t.canvas.addEventListener(i, function (i) {
                      return t.endStrokeHandler(i);
                    });
                  });
              }),
              (t.prototype.startStrokeHandler = function (t) {
                if ((t.preventDefault(), !this.readOnly)) {
                  if (this.drawType == "delete") {
                    this.isDrag = true;
                  }

                  this.sketching = !0;
                  var i = this.getCursorRelativeToCanvas(t);
                  if (this.drawType == "hand") {
                    this.pushStroke([i]), this.redraw();
                  }

                  if (
                    this.drawType == "line" ||
                    this.drawType == "rectangle" ||
                    this.drawType == "arrow"
                  ) {
                    this.startPoint = i;
                    this.pushStroke([i]);
                    //this.ctx.setLineDash([6, 6]);
                  }

                  if (this.drawType == "circle") {
                    this.startPoint = i;
                    this.pushCircle([i]), this.redraw();
                    // this.ctx.setLineDash([6, 6]);
                  }
                }
              }),
              (t.prototype.drawStrokeHandler = function (t) {
                var i = this.getCursorRelativeToCanvas(t);
                if (this.drawType == "delete") {
                  $("#sketchpad canvas").addClass("eraseCursor");

                  if (this.isDrag) {
                    if (this.closestX != -1) {
                      this.lastCPoint = this.normalizePoint(
                        new o(this.closestX, this.closestY)
                      );
                    }
                    this.pathPoint = i;
                    this.setClosestLine(i.x, i.y);
                    this.timer = setInterval(this.creeBoule(t.x, t.y), 24);
                  }
                  this.redraw();
                }

                if (
                  this.closestLineIndex >= 0 &&
                  this.drawType == "delete" &&
                  this.isDrag
                ) {
                  // this.undoneStrokes = this._strokes;

                  // this.undoneStrokes.push(this._strokes[this.closestLineIndex]);
                  var current = this._strokes[this.closestLineIndex];
                  console.log(current);
                  new Promise((res, rej) => {
                    this.undoManager.add({
                      undo: function () {
                        removeStroke(current.id);
                        pushElement(
                          current.points,
                          current.id,
                          current.type,
                          current.width,
                          current.color
                        );
                      },
                      redo: function () {
                        removeStroke(current.id);
                      },
                    });

                    res(1);
                    return res;
                  }).then((res) => {
                    this._strokes.splice(this.closestLineIndex, 1);
                    this.redraw();
                  });
                }

                if ((t.preventDefault(), this.sketching)) {
                  if (this.drawType == "hand") {
                    this.pushPoint(i), this.redraw();
                  }

                  if (this.drawType == "line") {
                    this.endPoint = i;
                    this.DrawLinee(i), this.redraw();
                  }
                  if (this.drawType == "arrow") {
                    this.endPoint = i;
                    this.DrawArrow(i), this.redraw();
                  }

                  if (this.drawType == "circle") {
                    this.endPoint = i;
                    this.pushCPoint([i]), this.redraw();
                  }
                  if (this.drawType == "rectangle") {
                    this.endPoint = i;
                    this.drawRectangle(i), this.redraw();
                  }
                }
              }),
              (t.prototype.endStrokeHandler = function (t) {
                if (
                  (t.preventDefault(),
                  this.sketching && ((this.sketching = !1), !n(t)))
                ) {
                  if (this.drawType == "delete") {
                    this.isDrag = false;
                  }
                  var i = this.getCursorRelativeToCanvas(t);

                  if (this.drawType == "hand") {
                    this.pushPoint(i),
                      this.redraw(),
                      this.onDrawEnd && this.onDrawEnd();
                  }

                  if (this.drawType == "line") {
                    this.ctx.setLineDash([]);
                    this.endPoint = i;
                    // this.pushPoint(this.startPoint);
                    this.DrawLinee(i),
                      this.redraw(),
                      this.onDrawEnd && this.onDrawEnd();
                    this.startPoint = this.endPoint;
                  }
                  if (this.drawType == "circle") {
                    this.ctx.setLineDash([]);
                    this.endPoint = i;
                    this.pushCPoint([i]),
                      this.redraw(),
                      this.onDrawEnd && this.onDrawEnd();
                  }

                  if (this.drawType == "arrow") {
                    this.ctx.setLineDash([]);
                    this.endPoint = i;
                    // this.pushPoint(this.startPoint);
                    this.DrawArrow(i),
                      this.redraw(),
                      this.onDrawEnd && this.onDrawEnd();
                    this.startPoint = this.endPoint;
                  }

                  if (this.drawType == "rectangle") {
                    this.ctx.setLineDash([]);
                    this.endPoint = i;
                    this.drawRectangle(i),
                      this.redraw(),
                      this.onDrawEnd && this.onDrawEnd();
                    this.startPoint = this.endPoint;
                  }
                  if (this.drawType != "delete") {
                    console.log(drawType, "drawType");
                    var lastS = this._strokes[this._strokes.length - 1];
                    console.log(lastS);
                    this.AddUndoRedo(
                      lastS.points,
                      lastS.id,
                      lastS.type,
                      lastS.width,
                      lastS.color
                    );
                    this.lastCPoint = null;
                    this.closestX = -1;
                    this.closestY = -1;
                    // console.log("points count: " + lastS.points.length);
                    if (
                      this.drawType != "line" &&
                      lastS.points.length < 4 &&
                      this.startPoint == this.endPoint
                    ) {
                      this._strokes.pop();
                    }
                    this.redraw();
                  }
                }
              }),
              t
            );
          })();
        function n(t) {
          return -1 !== t.type.indexOf("touch");
        }
        i.default = e;
        var o = function (t, i) {
            (this.x = t), (this.y = i);
          },
          s = (function () {
            function t() {}
            return (
              (t.fromObj = function (i) {
                var e = new t();
                return (
                  (e.id = i.id),
                  (e.points = i.points),
                  (e.type = i.type),
                  (e.width = i.size),
                  (e.color = i.color),
                  (e.cap = i.cap),
                  (e.join = i.join),
                  (e.miterLimit = i.miterLimit),
                  e
                );
              }),
              (t.prototype.toObj = function () {
                return {
                  id: this.id,
                  points: this.points,
                  type: this.type,
                  size: this.width,
                  color: this.color,
                  cap: this.cap,
                  join: this.join,
                  miterLimit: this.miterLimit,
                };
              }),
              t
            );
          })();
      })(),
      t.default
    );
  })();
});
//# sourceMappingURL=sketchpad.js.map
