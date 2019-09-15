function Scene(params) {
    var exemplo = {
        sprites: [],
        toRemove: [],
        ctx: null,
        w: 300,
        h: 300,
        t: 0,
    }
    Object.assign(this, exemplo, params);
}

Scene.prototype = new Scene();
Scene.prototype.constructor = Scene;

Scene.prototype.adicionar = function (sprite) {
    this.sprites.push(sprite);
    sprite.scene = this;
};

Scene.prototype.desenhar = function () {
    for (var i = 0; i < this.sprites.length; i++) {
        if (this.sprites[i].props.tipo != "star" && this.sprites[i].props.tipo != "pc")
            this.sprites[i].desenhar(this.ctx);
    }
};

Scene.prototype.desenharEstrelas = function () {
    for (var i = 0; i < this.sprites.length; i++) {
        if (this.sprites[i].props.tipo === "star")
            this.sprites[i].desenharEstrelas(this.ctx);
    }
};

Scene.prototype.desenharPC = function () {
    for (var i = 0; i < this.sprites.length; i++) {
        if (this.sprites[i].props.tipo === "pc")
            this.sprites[i].desenharPC(this.ctx, this.sprites[i].vy);
    }
};

Scene.prototype.mover = function (dt) {
    for (var i = 0; i < this.sprites.length; i++) {
        if (this.sprites[i].props.tipo != "star")
            this.sprites[i].mover(dt);
    }
};

Scene.prototype.moverEstrelas = function (dt) {
    for (var i = 0; i < this.sprites.length; i++) {
        if (this.sprites[i].props.tipo === "star")
            this.sprites[i].moverEstrelas(dt);
    }
};

Scene.prototype.comportar = function () {
    for (var i = 0; i < this.sprites.length; i++) {
        if (this.sprites[i].comportar) {
            this.sprites[i].comportar();
        }
    }
};

Scene.prototype.checaColisao = function () {
    for (var i = 0; i < this.sprites.length; i++) {
        for (var j = i + 1; j < this.sprites.length; j++) {
            if (this.sprites[i].colidiuCom(this.sprites[j])) {
                if (this.sprites[i].props.tipo === "pc" && this.sprites[j].props.tipo === "npc" && this.sprites[i].imune <= 0 && this.sprites[j].imune <= 0) {
                    if (this.sprites[i].escudoDuracao >= 0) {
                        if (this.sprites[j].vida == 0) {
                            this.toRemove.push(this.sprites[j]);
                            score += 10;
                        }
                        else {
                            this.sprites[j].vida--;
                            this.sprites[j].imune = 0.2;
                        }
                    }
                    else {
                        if (this.sprites[j].vida == 0) {
                            this.toRemove.push(this.sprites[j]);
                            score += 10;
                        }
                        if (this.sprites[i].vida == 0)
                            this.toRemove.push(this.sprites[i]);
                        else {
                            this.sprites[i].vida--;
                            this.sprites[j].vida--;
                            this.sprites[i].imune = 1.5;
                            this.sprites[j].imune = 1.2;
                        }
                    }
                }
                else
                    if (this.sprites[i].props.tipo === "npc" && this.sprites[j].props.tipo === "tiro") {
                        if (this.sprites[i].vida == 0) {
                            this.toRemove.push(this.sprites[i]);
                            score += 10;
                        }
                        else
                            this.sprites[i].vida--;
                        this.toRemove.push(this.sprites[j]);
                    }
            }
        }
    }
};

Scene.prototype.inimigos = function () {
    if (!teclas.enter) {
        ctx.fillStyle = "white";
        ctx.font = "155px Trebuchet MS";        //PREENCHER COM INSTRUÇOES DEPOIS
        ctx.fillText("Stage 1", 180, 220, 400);
        tempo = 0;
    }
    else {
        if (tempo <= 5) {
            var tO = 1 - tempo / 5;
            ctx.globalAlpha = tO;
            ctx.fillStyle = "white";
            ctx.font = "155px Trebuchet MS";
            ctx.fillText("Stage 1", 180, 220, 400);
            ctx.globalAlpha = 1;
        }
        else if (tempo > 5 && tempo <= 65) {
            if (dtInimigos <= 0) {
                cena1.adicionar(new Sprite({
                    x: canvas.width * Math.random(),
                    y: 0,
                    h: 10,
                    w: 25,
                    vida: 1,
                    color: "lightgrey",
                    comportar: persegue2(pc),
                    props: { tipo: "npc" },
                    a: Math.PI / 2
                }));
                dtInimigos = 0.6;
            }
            if (dtInimigos2 <= 0) {
                cena1.adicionar(new Sprite({
                    x: canvas.width * Math.random(),
                    y: 0,
                    h: 10,
                    w: 35,
                    vida: 2,
                    color: "orange",
                    comportar: persegue3(pc),
                    props: { tipo: "npc" },
                    a: Math.PI / 2
                }));
                dtInimigos2 = 0.6;
            }
            if (dtInimigos3 <= 0) {
                cena1.adicionar(new Sprite({
                    x: canvas.width * Math.random(),
                    y: 31,
                    h: 15,
                    w: 30,
                    vida: 2,
                    color: "blue",
                    comportar: moveBasico(),
                    props: { tipo: "npc", remover: true },
                    a: Math.PI / 2
                }));
                dtInimigos3 = 0.6;
            }
        }

        else if (tempo > 65 && tempo <= 75) {
            var tO = 1 - tempo / 15;
            ctx.globalAlpha = tO;
            ctx.fillStyle = "white";
            ctx.font = "155px Trebuchet MS";
            ctx.fillText("Stage 2", 180, 220, 400);
            ctx.globalAlpha = 1;
        }
        else if (tempo > 75 && tempo <= 135) {
            cena1.adicionar(new Sprite({
                x: canvas.width * Math.random(),
                y: 0,
                h: 20,
                a: 3.14 / 2,
                //va: 5 * Math.random(),
                vm: 140 * Math.random(),
                color: "red",
                props: { tipo: "npc", atras: false, spawn: 2 },
                comportar: persegue_Spawn2(pc)
            }));
        }
        else if (tempo > 135 && tempo <= 145) {
            var tO = 1 - tempo / 15;
            ctx.globalAlpha = tO;
            ctx.fillStyle = "white";
            ctx.font = "155px Trebuchet MS";
            ctx.fillText("Stage 3", 180, 220, 400);
            ctx.globalAlpha = 1;
        }
        else if (tempo > 145 && tempo <= 205) {
            cena1.adicionar(new Sprite({
                x: canvas.width * Math.random(),
                y: 0,
                h: 20,
                a: 3.14 / 2,
                //va: 5 * Math.random(),
                vm: 140 * Math.random(),
                color: "red",
                props: { tipo: "npc", atras: false, spawn: 2 },
                comportar: persegue_Spawn2(pc)
            }));
        }
        else if (tempo > 205 && tempo <= 215) {
            var tO = 1 - tempo / 15;
            ctx.globalAlpha = tO;
            ctx.fillStyle = "white";
            ctx.font = "155px Trebuchet MS";
            ctx.fillText("Stage 4", 180, 220, 400);
            ctx.globalAlpha = 1;
        }
        else if (tempo > 215 && tempo <= 275) {
            cena1.adicionar(new Sprite({
                x: canvas.width * Math.random(),
                y: 0,
                h: 20,
                a: 3.14 / 2,
                //va: 5 * Math.random(),
                vm: 140 * Math.random(),
                color: "red",
                props: { tipo: "npc", atras: false, spawn: 2 },
                comportar: persegue_Spawn2(pc)
            }));
        }
        else if (tempo > 275 && tempo <= 290) {
            var tO = 1 - tempo / 15;
            ctx.globalAlpha = tO;
            ctx.fillStyle = "white";
            ctx.font = "155px Trebuchet MS";
            ctx.fillText("Boss Battle", 180, 220, 400);
            ctx.globalAlpha = 1;
        }
    }
}


Scene.prototype.removeNaBorda = function () {
    for (var i = 0; i < this.sprites.length; i++) {
        var x = this.sprites[i].x;
        var y = this.sprites[i].y;
        if (this.sprites[i].props.remover && (x >= canvas.width - 30 || x <= 30 || y >= canvas.height - 30 || y <= 30))
            this.toRemove.push(this.sprites[i]);
    }
}

Scene.prototype.removeSprites = function () {
    for (var i = 0; i < this.toRemove.length; i++) {
        var idx = this.sprites.indexOf(this.toRemove[i]);
        if (idx >= 0) {
            this.sprites.splice(idx, 1);
        }
    }
    this.toRemove = [];
};

Scene.prototype.limpar = function () {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.w, this.h);
}

Scene.prototype.passo = function (dt) {
    this.limpar();
    this.comportar();
    this.inimigos();
    this.moverEstrelas(dt);
    this.mover(dt);
    this.desenharPC();
    this.desenharEstrelas();
    this.desenhar();
    this.checaColisao();
    this.removeSprites();
    this.removeNaBorda();
}
