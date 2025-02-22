class gameMenu{
    constructor(root){
    this.root = root;
    this.$menu = $(`
        <div class="my-game-menu">
        <div class="my-game-menu-field">
        <div class="my-game-menu-field-item my-game-menu-field-item-single-mode">
        Single Player
        </div>
        <br>
        <div class="my-game-menu-field-item my-game-menu-field-item-multi-mode">
        Multi Player
        </div>
         <br>
        <div class="my-game-menu-field-item my-game-menu-field-item-settings">
        Settings
        </div>
        </div>
        </div>
        `);
this.root.$my_game.append(this.$menu);
this.$single_mode = this.$menu.find('.my-game-menu-field-item-single-mode');
this.$multi_mode = this.$menu.find('.my-game-menu-field-item-multi-mode');
this.$settings = this.$menu.find('.my-game-menu-field-item-settings');

this.start();
    }

    start(){
        this.add_listening_events();
    }

    add_listening_events(){
        let outer = this;
        this.$single_mode.click(function(){
            outer.hide();
            outer.root.playground.show();
        }); 
        this.$multi_mode.click(function(){
            console.log("click multi mode");
        });
        this.$settings.click(function(){
            console.log("click settings");
        });
    }

    show(){
        this.$menu.show();
    }

    hide(){
        this.$menu.hide();
    }
}//Game Engine

let MY_GAME_OBJECT = [];
class myGameObject {
    constructor(){
        MY_GAME_OBJECT.push(this);

        this.has_called_start = false; //indicate whether or not this object has excute start() or not
        this.timedelta = 0;  //time difference between current frame and last frame, ms
    }
    strat(){ //only excute once at the first frame

    }

    update() { // excute once in every frame

    }

    on_destroy(){ // excute onece before bing destoried

    }

    destory() { // destory object
     this.on_destroy();
     for(let i = 0; i < MY_GAME_OBJECT.length; i++){
        if(MY_GAME_OBJECT[i] === this) {
            MY_GAME_OBJECT.splice(i, 1);
            break;
        }
     }
    }
}
let last_timestamp;
let MY_GAME_ANIMATION = function(timestamp) {
    for(let i = 0; i < MY_GAME_OBJECT.length; i++){
        let obj = MY_GAME_OBJECT[i];
        if(!obj.has_called_start){
            obj.strat();
            obj.has_called_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(MY_GAME_ANIMATION);
}

requestAnimationFrame(MY_GAME_ANIMATION);


class GameMap extends myGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width; 
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);
    }
    start(){

    }
    update(){
        this.render();
    }

    render(){
        this.ctx.fillStyle = "rgb(209, 239, 239, 0.4)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}class Particle extends myGameObject {
    constructor(playground, x, y, radius, vx, vy, color, speed, move_length) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.friction = 0.9;
        this.eps = 1;
    }

    start(){

    }

    update(){
       if(this.move_length < this.eps || this.speed < this.eps) {
        this.destory();
        return false;
       }
       let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000)
       this.x += this.vx * moved;
       this.y += this.vy * moved;
       this.speed *= this.friction;
       this.move_length -= moved;
        this.render();

    }

    render(){
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

}class Player extends myGameObject {
    constructor(playground, x, y, radius, color, speed, is_me) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.move_length = 0;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.is_me = is_me;
        this.eps = 0.1;
        this.friction = 0.9;
        this.spent_time = 0;


        this.cur_skill = null;

        // Generate random ID ONLY ONCE during initialization
        this.pokemonId = this.generatePersistentId();
        this.sprite = new Image();
        this.sprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.pokemonId}.png`;

    }

    generatePersistentId() {
        // Store in game state for session persistence
        if (!this.pokemonId) {
            this.pokemonId = Math.floor(Math.random() * 898) + 1;
        }
        return this.pokemonId;
    }

    start() {
        if (this.is_me) {
            this.add_listening_events();
        } else { //AI control anemies
            let tx = Math.random() * this.playground.width;
            let ty = Math.random() * this.playground.height;
            this.move_to(tx, ty);
        }
    }


    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function () {
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function (e) {
            if (e.which === 3) {
                outer.move_to(e.clientX, e.clientY);
            } else if (e.which === 1) {
                if (outer.cur_skill === "fireball") {
                    outer.shoot_fireball(e.clientX, e.clientY);
                }
                outer.cur_skill = null;
            }
        });

        $(window).keydown(function (e) {
            if (e.which === 70) {  //f
                outer.cur_skill = "fireball";
                return false;
            }
        })
    }

    shoot_fireball(tx, ty) {
        let x = this.x, y = this.y;
        let radius = this.playground.height * 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "orange";
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height * 1;
        new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, this.playground.height * 0.01);
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    is_attacked(angle, damage) {
        for (let i = 0; i < 20 + Math.random() * 5; i++) {
            let x = this.x, y = this.y;
            let radius = this.radius * Math.random() * 0.1;
            let angle = Math.PI * 2 * Math.random();
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = `hsl(${Math.random() * 360}, 100%, 80%)`;
            let speed = this.speed * 4;
            let move_length = this.radius * Math.random() * 5;
            new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_length);
        }
        this.radius -= damage;
        if (this.radius < 20) {
            this.destory();
            return false;
        }
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage * 100;
        this.speed *= 1.2;
    }


    update() {
        this.spent_time += this.timedelta / 1000;
        if(!this.is_me && this.spent_time > 4 && Math.random() < 1 / 400.0){
            let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];
            let tx = player.x + player.speed * this.vx * this.timedelta / 1000 * 1;
            let ty = player.y + player.speed * this.vy * this.timedelta / 1000 * 1;
            this.shoot_fireball(tx, ty);
        }


        if (this.damage_speed > 10) {
            this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.friction;
        } else {

            if (this.move_length < this.eps) {
                this.move_length = 0;
                this.vx = this.vy = 0;
                if (!this.is_me) {
                    let tx = Math.random() * this.playground.width;
                    let ty = Math.random() * this.playground.height;
                    this.move_to(tx, ty);
                }
            } else {
                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                this.move_length -= moved;
            }
        }
        this.render2();
    }

    //use for circle player, rather than Pokemon
    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }


    render2() {
        if (this.sprite.complete) {
            // Draw Pokémon sprite centered at (x,y)
            const spriteSize = this.radius * 2;
            this.ctx.drawImage(
                this.sprite,
                this.x - spriteSize / 2,
                this.y - spriteSize / 2,
                spriteSize,
                spriteSize
            );
        } else {
            // Fallback to circle while loading
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }
    }

    on_destroy(){
        for(let i = 0; i < this.playground.players.length; i++){
            if(this.playground.players[i] === this){
                this.playground.players.splice(i, 1);
            }
        }
    }
}class FireBall extends myGameObject {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage){
    super();
    this.playground = playground;
    this.player = player;
    this.ctx = this.playground.game_map.ctx;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.color = color;
    this.speed = speed;
    this.move_length = move_length;
    this.damage = damage;
    this.eps = 0.1;
    }
    start(){

    }

    update(){
        if(this.move_length < this.eps){
            this.destory();
            return false;
        }
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;

        for(let i = 0; i < this.playground.players.length; i++){
             let player = this.playground.players[i];
             if(this.player !== player && this.is_collision(player)){
                this.attack(player);
             }
        }
     this.render();
    }

    get_dist(x1, y1, x2, y2){
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(player){
     let distance = this.get_dist(this.x, this.y, player.x, player.y);
     if(distance < this.radius + player.radius) return true;
     return false;
    }

    attack(player){
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.damage);
        this.destory();

    }

    render(){
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}class gamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div class = "my-game-playground"></div>`);
        //this.hide();
        this.root.$my_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this, this.width/2, this.height/2, this.height*0.07, "white", this.height*0.15, true));

        for(let i = 0; i < 5; i++){
            this.players.push(new Player(this, this.width/2, this.height/2, this.height*0.07, "lightpink", this.height*0.15, false));
        }

        this.start();
    }

    start() {
        for(const player of this.players){
            player.start();
        }
    }

    show() {
        this.$playground.show();
    }

    hide() {
        this.$playground.hide();
    }
}export class MyGame {
    constructor(id){
        this.id = id;
        this.$my_game = $('#' + id);
       // this.menu = new gameMenu(this);
        this.playground = new gamePlayground(this);
     
        this.start();
        
    }

    start(){

    }
}