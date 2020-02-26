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
