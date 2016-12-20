var c = document.getElementById("miCanvas");
var ctx = c.getContext("2d");
var TECLA_ARRIBA = 38,
    TECLA_ABAJO = 40,
    TECLA_DERECHA = 39,
    TECLA_IZQUIERDA = 37,
    TECLA_F = 70,
    TECLA_C = 67;
window.addEventListener("keydown", tecladoPulsado, false);
// window.addEventListener("keypress", teclado, false);
window.addEventListener("keyup", tecladoSoltado, false);

var EMAIL_UID;
var EMAIL;
var config = {
    apiKey: "AIzaSyDTy-orojXAWKdf1qYMQr2Pp21zunAC6Tc",
    authDomain: "juego-peleas.firebaseapp.com",
    databaseURL: "https://juego-peleas.firebaseio.com",
    storageBucket: "juego-peleas.appspot.com",
    messagingSenderId: "645407332546"
};
var mainDB = firebase.initializeApp(config);
var refJugadores = firebase.database().ref().child('Jugadores');

var refMapa = firebase.database().ref().child('Mapa');
var refInterfaz = firebase.database().ref().child('Interfaz');

var ANCHO = 800;
var ALTO = 600;

function inicializar() {
}
function dibujar() {
    // fondo
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 800, 600);
    controladorEstados.dibujar();

}
function actualizar(delta) {
    controladorEstados.actualizar(delta);
}
function tecladoPulsado(e) {
    controladorEstados.tecladoPulsado(e);
}
function tecladoSoltado(e) {
    controladorEstados.tecladoSoltado(e);
}

// Controlador de Estados
class ControladorEstados {
    constructor() {
        this.MENU = 0;
        this.LEVEL1 = 1;
        this.GAMEOVER = 2;
        this.estadoActual = 0;
        this.estados = [];
        this.menu = new Menu(this);
        this.estados.push(this.menu);
    }

    destruirEstado(estado) {
        this.estados.shift();
    }

    cambiarEstado(nuevoEstado) {
        this.destruirEstado(this.estadoActual);
        this.cargarEstado(nuevoEstado);
    }

    cargarEstado(nuevoEstado) {
        if (nuevoEstado === this.MENU) {
            this.estados[0] = new Menu(this);
        }
        if (nuevoEstado === this.LEVEL1) {
            this.estados[0] = new Level1(this);
        }
        if (nuevoEstado === 2) {
            this.estados[0] = new Otro(this);
        }
    }

    actualizar(delta) {
        //this.menu.actualizar(delta);
        this.estados[this.estadoActual].actualizar(delta);
    }

    dibujar() {
        this.estados[this.estadoActual].dibujar();
        //this.menu.dibujar();
    }

    tecladoPulsado(e) {
        this.estados[this.estadoActual].tecladoPulsado(e);
    }

    tecladoSoltado(e) {
        this.estados[this.estadoActual].tecladoSoltado(e);
    }

}

class Menu {

    constructor(controladorEstado) {
        this.ce = controladorEstado;
    }

    mostrar() {

        console.log(estados)
    }

    actualizar(delta) {

    }

    dibujar() {
        ctx.fillStyle = 'Yellow';
        ctx.font = 'italic 60pt Calibri';
        ctx.fillText("Iniciar Guerra", 150, 200);
    }

    tecladoPulsado(e) {
        if (TECLA_ARRIBA === e.keyCode) {
            console.log("Tecla presionada");
        }
        if (49 == e.keyCode) {
            var provider = new firebase.auth.GoogleAuthProvider();
            var _self = this;
            firebase.auth().signInWithPopup(provider).then(function (result) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                EMAIL_UID = result.user.uid;
                EMAIL = result.user.email;
                console.log("usuario Registrado");
                console.log(EMAIL_UID);
                _self.ce.cargarEstado(1);

                // ...
            }).catch(function (error) {
                _self.ce.cargarEstado(2);
                // Handle Errors here.
                var errorCode = error.code;
                console.log("error Code :>" + errorCode);
                var errorMessage = error.message;
                console.log("error.Message:>" + errorMessage);

                // The email of the user's account used.
                var email = error.email;
                console.log("error.email:>" + email);

                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                console.log("error.Credential:>" + credential);

                // ...
            });
        }
        if (50 == e.keyCode) {
            this.ce.cargarEstado(2);
        }
    }

    tecladoSoltado(e) {
        if (TECLA_ARRIBA === e.keyCode) {
            console.log("Tecla Soltado");
        }
    }
}
class Level1 {
    constructor(controladorEstado) {
        this.ce = controladorEstado;
        this.guerrero = new Player(EMAIL);
        this.guerrero.inscribirPlayer(EMAIL_UID);
    }

    actualizar(delta) {

        this.guerrero.actualizar(delta);

    }

    dibujar() {
        ctx.fillStyle = 'Red';
        ctx.font = 'italic 60pt Calibri';
        ctx.fillText("Juego Iniciado", 150, 200);

        // dibujar guerrero

        this.guerrero.dibujar();
    }

    tecladoPulsado(e) {
        if (TECLA_DERECHA === e.keyCode) {
            this.guerrero.setDerecha = true;
        }
        if (TECLA_IZQUIERDA === e.keyCode) {
            this.guerrero.setIzquierda = true;
        }
        if (TECLA_ARRIBA === e.keyCode) {
            this.guerrero.setSubir = true;
        }
        if (TECLA_ABAJO === e.keyCode) {
            this.guerrero.setBajar = true;
        }
        if (TECLA_F === e.keyCode) {
            this.guerrero.disparar();
        }
    }

    tecladoSoltado(e) {
        if (TECLA_DERECHA === e.keyCode) {
            this.guerrero.setDerecha = false;
        }
        if (TECLA_IZQUIERDA === e.keyCode) {
            this.guerrero.setIzquierda = false;
        }
        if (TECLA_ARRIBA === e.keyCode) {
            this.guerrero.setSubir = false;
        }
        if (TECLA_ABAJO === e.keyCode) {
            this.guerrero.setBajar = false;
        }
    }
}
class ObjetoMapa {

    constructor(x, y, ancho, alto) {
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;

        this.derecha = false;
        this.izquierda = false;
        this.subir = false;
        this.bajar = false;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    set setDerecha(action) {
        this.derecha = action;
    }

    set setIzquierda(action) {
        this.izquierda = action;
    }

    set setSubir(action) {
        this.subir = action;
    }

    set setBajar(action) {
        this.bajar = action;
    }
}
class Player extends ObjetoMapa {

    constructor(email) {
        super(200, 500, 80, 100);
        this.balas = [];
        this.estado = 'vivo';
        this.email = email;
        this.nroBalas = 0;
    }

    disparar() {
        var bala = new Bala(this.x + this.ancho, this.y + (this.alto / 2 ),this.nroBalas);
        this.nroBalas++;
        this.balas.push(bala);
        refJugadores.child(EMAIL_UID).child('balas').child(''+bala.getId()).set(bala);

    }

    dibujar() {
        this.balas.forEach(bala => {
            bala.dibujar();
        });

        ctx.fillStyle = 'Red';
        ctx.fillRect(this.x, this.y, this.ancho, this.alto);


    }

    actualizar(delta) {
        if (this.derecha) {
            this.x++;
        }
        if (this.izquierda) {
            this.x--;
        }
        if (this.subir) {
            this.y--;
        }
        if (this.bajar) {
            this.y++;
        }
        console.log('balas.length : ' + this.balas.length);
        for (var i = 0; i < this.balas.length; i++) {
            this.balas[i].actualizar();
            if (this.balas[i].getX() > ANCHO) {
                refJugadores.child(EMAIL_UID).child('balas').child(''+this.balas[i].getId()).remove();
                this.balas.splice(i, 1);
                this.nroBalas --;

                return;
            }
        }

    }

    inscribirPlayer(email_uid) {
        refJugadores.child(email_uid).set({
            email: this.email,
            x: this.x,
            y: this.y,
            ancho: this.ancho,
            alto: this.alto,
            estado: this.estado
        });
    }


}
class Bala extends ObjetoMapa {

    constructor(x, y , id) {
        super(x, y, 20, 20);
        this.derecha = true;
        this.id = id;
    }
    getId(){
        return this.id;
    }

    actualizar(delta) {
        if (this.derecha) {
            this.x += 5;

        }
    }

    dibujar() {
        ctx.fillStyle = 'BLue';
        ctx.fillRect(this.x, this.y, this.ancho, this.alto);
    }
}
var main = function () {
    var now = Date.now();
    var delta = now - then;

    actualizar(delta / 1000);
    dibujar();

    then = now;
};
var controladorEstados = new ControladorEstados();
var then = Date.now();
setInterval(main, 30);





