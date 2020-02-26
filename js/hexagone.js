
class Hexagone {
  // constructeur de la classe
  constructor (x, y, radius) {
    this.centerx = x;
    this.centery = y;
    this.radius = radius;
    this.angle = 0;
    this.calculListPoints();
  }

  /*
  * fonction calculListPoints, calculant les points des angles de l'hexagone
  */
  calculListPoints () {
    this.listPoints = [];
    this.listPointsInterne = [];
    let valeur = 0;
    for (let i = 0; i < 6; i++) {
        valeur = this.angle + (2*Math.PI * i) / 6;
        this.listPoints.push({x: this.centerx + (this.radius) * Math.cos(valeur),
                              y: this.centery + (this.radius) * Math.sin(valeur)});
        this.listPointsInterne.push({x: this.centerx + (this.radius - 1) * Math.cos(valeur),
                                     y: this.centery + (this.radius - 1) * Math.sin(valeur)});
    }
  }

  drawMyself (ctx) {
    Hexagone.drawHexagone(ctx, this.listPoints, this.listPointsInterne);
  }

  /*
  * fonction symetriqueRandom, retournant un point symétrique du point central de cet
  * hexagone par rapport à un de ses côtés choisi au hasard
  */
  symetriqueRandom () {
    this.pos1 = Math.random() * 6 | 0;
    this.pos2 = this.pos1 + 1;
    if (this.pos1 == 5) { this.pos2 = 0; }
    let point = {x: this.listPoints[this.pos1].x + (this.listPoints[this.pos2].x - this.listPoints[this.pos1].x) / 2,
                 y: this.listPoints[this.pos1].y + (this.listPoints[this.pos2].y - this.listPoints[this.pos1].y) / 2}

    return {x: (point.x + (point.x - this.centerx)),
            y: (point.y + (point.y - this.centery))}
  }

  /*
  * fonction drawHexagone, dessinant un hexagone dans le context entré en paramètre, centré sur le point (x, y)
  * @params ctx le contexte sur lequel dessiner
  * @params listPoints liste des points de la bordure extérieur
  * @params listPointsInterne liste des points de la bordure intérieur
  */
  static drawHexagone (ctx, listPoints, listPointsInterne) {

    // dessin de la bordure extérieure
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      if (i == 0) {
        ctx.moveTo(listPoints[i].x, listPoints[i].y);
      }
      else {
        ctx.lineTo(listPoints[i].x, listPoints[i].y);
      }
    }
    ctx.closePath();
    ctx.stroke();

    // dessin de la bordure intérieure
    ctx.strokeStyle = "skyblue";
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      if (i == 0) {
        ctx.moveTo(listPointsInterne[i].x, listPointsInterne[i].y);
      }
      else {
        ctx.lineTo(listPointsInterne[i].x, listPointsInterne[i].y);
      }
    }
    ctx.closePath();
    ctx.stroke();
  }

}
