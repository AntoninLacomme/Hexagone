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


class Snake {

  // constructeur de la classe
  constructor (x, y) {
    this.listHexagones = [];
    this.maxLength = 4 + Math.random() * 6;

    this.listHexagones.push(new Hexagone(x, y, 30, 0));
  }

  /*
  * fonction move, faisant créant un nouvel hexagone au bout du serpent
  * et supprimant un hexagone à sa fin s'il a atteint sa taille maximale
  * @returns boolean en fonction de si on a pus bouger le snake sur l'écran ou non (le snake est-il hors de l'acran ou pas ?)
  */
  move () {
    let point = this.listHexagones[this.listHexagones.length -1].symetriqueRandom();
    this.listHexagones.forEach((hexag) => {
        while ((point.x | 0) == (hexag.centerx | 0) && (point.y | 0) == (hexag.centery | 0)) {
          point = this.listHexagones[this.listHexagones.length -1].symetriqueRandom();
        }
    });

    this.listHexagones.push(new Hexagone(point.x, point.y, 30, 0));

    if (this.listHexagones.length > this.maxLength) {
      this.listHexagones.splice(0, 1);
    }

    let acc = 0;
    this.listHexagones.forEach((hexag) => {
      if (hexag.centerx < 0 - hexag.radius || hexag.centerx > canvas.width + hexag.radius ||
          hexag.centery < 0 - hexag.radius || hexag.centery > canvas.height + hexag.radius) {
          acc = acc+1;
      }
    });

    if (acc >= this.listHexagones.length) { return false; }
    return true;
  }

  /*
  * fonction draw, dessine le snake dans le contexte entré en paramètre
  * @params ctx le contexte de dessin
  */
  draw (ctx) {
    this.listHexagones.forEach((hexagone) => {
      hexagone.drawMyself(ctx);
    });
  }
}


window.onload = init;

document.addEventListener("mouseup", (event) => {
    for (let i=0; i< 12; i++) {
      if (listSnakes.length <= limite) {
        listSnakes.push(new Snake(event.offsetX, event.offsetY));
      }
    }
});

function init () {
  // création du canvas et de ses propriétés
  canvas = document.createElement("canvas");
  canvas.id = "canvasHexagone";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = "absolute";
  canvas.style.top = "0px";
  canvas.style.left = "0px";
  document.body.appendChild(canvas);

  // initialisation de nos principales valeurs
  waiting = 0;                      // temps d'attente avant de redessiner
  limite = 120;                     // limite de snakes présents à l'écran simultanément
  ctx = canvas.getContext("2d");    // le contexte de dessin
  listSnakes = [];                  // liste des snakes
  run ();
}

/*
* fonction run, le corps principal du programme
* redessine le canvas à chaque appel
* et bouge tous les snakes
*/
function run () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (waiting % 2 == 0) {
    for (let i = this.listSnakes.length -1; i >= 0; i--) {
      this.listSnakes[i].draw(ctx);
      if (!this.listSnakes[i].move()) {
        this.listSnakes.splice(i, 1);
      }
    }
  }
  waiting++;
  requestAnimationFrame(run);
}
